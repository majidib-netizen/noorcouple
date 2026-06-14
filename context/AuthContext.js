import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) chargerProfil(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) await chargerProfil(session.user.id);
        else { setUserData(null); setLoading(false); }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const chargerProfil = async (uid) => {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .single();
      if (data) setUserData(data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ user, userData, setUserData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
