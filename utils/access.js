import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export const aUnCompte = async () => {
  const compte = await AsyncStorage.getItem('user_email');
  return !!compte;
};

export const accesPremium = async () => {
  const compte = await aUnCompte();
  if (!compte) return false;

  const appExpireAt = await AsyncStorage.getItem('app_expire_at');
  if (appExpireAt && new Date(appExpireAt) > new Date()) return true;

  const duoExpireAt = await AsyncStorage.getItem('duo_partenaire_expire_at');
  if (duoExpireAt && new Date(duoExpireAt) > new Date()) return true;

  // Rétrocompat : anciens flags posés avant l'introduction de expire_at
  if (!appExpireAt) {
    const appPayee = await AsyncStorage.getItem('app_payee');
    if (appPayee === 'true') {
      console.log('[ACCESS] flag ancien détecté (app_payee sans expire_at)');
      return true;
    }
  }
  if (!duoExpireAt) {
    const duoPaye = await AsyncStorage.getItem('duo_partenaire_paye');
    if (duoPaye === 'true') {
      console.log('[ACCESS] flag ancien détecté (duo_partenaire_paye sans expire_at)');
      return true;
    }
  }

  return false;
};

export const enregistrerPaiement = async (userEmail, expireAtISO, plan) => {
  const resultat = { appOk: false, userOk: false, duoOk: false };

  try {
    await AsyncStorage.setItem('app_payee', 'true');
    await AsyncStorage.setItem('app_expire_at', expireAtISO);
    resultat.appOk = true;
    console.log('[ACCESS] AsyncStorage app_payee/app_expire_at écrits.');
  } catch (e) {
    console.log('[ACCESS] Erreur écriture AsyncStorage app:', e?.message || e);
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      const { error } = await supabase
        .from('users')
        .update({ app_payee: true })
        .eq('id', user.id);
      if (error) {
        console.log('[ACCESS] Erreur update users.app_payee, colonne absente ou autre — ignoré:', error.message);
      } else {
        resultat.userOk = true;
        console.log('[ACCESS] users.app_payee mis à jour.');
      }
    } else {
      console.log('[ACCESS] Impossible de mettre à jour users.app_payee : utilisateur non identifié.');
    }
  } catch (e) {
    console.log('[ACCESS] Erreur update users.app_payee:', e?.message || e);
  }

  try {
    const duoCode = await AsyncStorage.getItem('duo_code') || await AsyncStorage.getItem('duo_code_conjoint');
    if (!duoCode) {
      console.log('[ACCESS] Aucun duo actif, synchro duo ignorée.');
    } else {
      const { error } = await supabase
        .from('duos')
        .update({ paiement_valide: true, payeur: userEmail, expire_at: expireAtISO, plan })
        .eq('code', duoCode);
      if (error) {
        console.log('[ACCESS] Erreur update duos:', error.message);
      } else {
        resultat.duoOk = true;
        await AsyncStorage.setItem('duo_partenaire_expire_at', expireAtISO);
        console.log('[ACCESS] duos.paiement_valide/expire_at mis à jour pour code:', duoCode);
      }
    }
  } catch (e) {
    console.log('[ACCESS] Erreur synchro duo:', e?.message || e);
  }

  return resultat;
};

export const useAccesPremium = () => {
  const [acces, setAcces] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifier = async () => {
      const ok = await accesPremium();
      setAcces(ok);
      setLoading(false);
    };
    verifier();
  }, []);

  return { acces, loading };
};
