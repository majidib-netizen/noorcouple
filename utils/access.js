import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export const aUnCompte = async () => {
  const compte = await AsyncStorage.getItem('user_email');
  return !!compte;
};

export const essaiActif = async () => {
  const dateDebut = await AsyncStorage.getItem('essai_debut');
  if (!dateDebut) {
    await AsyncStorage.setItem('essai_debut', new Date().toISOString());
    return true;
  }
  const debut = new Date(dateDebut);
  const maintenant = new Date();
  const joursEcoules = Math.floor((maintenant - debut) / (1000 * 60 * 60 * 24));
  return joursEcoules < 5;
};

export const accesPremium = async () => {
  const compte = await aUnCompte();
  if (!compte) return false;
  const appPayee = await AsyncStorage.getItem('app_payee');
  if (appPayee === 'true') return true;
  const duoPaye = await AsyncStorage.getItem('duo_partenaire_paye');
  if (duoPaye === 'true') return true;
  return await essaiActif();
};

export const demarrerEssai = async () => {
  const dateDebut = await AsyncStorage.getItem('essai_debut');
  if (!dateDebut) {
    await AsyncStorage.setItem('essai_debut', new Date().toISOString());
  }
};

export const joursEssaiRestants = async () => {
  const dateDebut = await AsyncStorage.getItem('essai_debut');
  if (!dateDebut) return 5;
  const debut = new Date(dateDebut);
  const maintenant = new Date();
  const joursEcoules = Math.floor((maintenant - debut) / (1000 * 60 * 60 * 24));
  return Math.max(0, 5 - joursEcoules);
};

export const useAccesPremium = () => {
  const [acces, setAcces] = useState(null);
  const [joursRestants, setJoursRestants] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifier = async () => {
      const ok = await accesPremium();
      const dateDebut = await AsyncStorage.getItem('essai_debut');
      let jours = null;
      if (dateDebut) {
        const debut = new Date(dateDebut);
        const maintenant = new Date();
        const joursEcoules = Math.floor((maintenant - debut) / (1000 * 60 * 60 * 24));
        jours = Math.max(0, 5 - joursEcoules);
      }
      setAcces(ok);
      setJoursRestants(jours);
      setLoading(false);
    };
    verifier();
  }, []);

  return { acces, joursRestants, loading };
};
