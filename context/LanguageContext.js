import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { translations } from '../constants/i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [langue, setLangue] = useState('fr');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('app_language');
      if (saved) {
        setLangue(saved);
      } else {
        const locale = Localization.getLocales?.()[0]?.languageCode ?? 'fr';
        setLangue(locale.startsWith('fr') ? 'fr' : 'en');
      }
    })();
  }, []);

  const t = (key) =>
    translations[langue]?.[key] ?? translations.fr?.[key] ?? key;

  const changeLanguage = async (lang) => {
    setLangue(lang);
    await AsyncStorage.setItem('app_language', lang);
  };

  return (
    <LanguageContext.Provider value={{ t, langue, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
