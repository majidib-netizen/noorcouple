import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { translations } from '../constants/i18n';
import { scheduleNotification, scheduleNotificationsPlan } from '../utils/notifications';

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
    const [notifQ, notifP, niveau, jourStr, genre] = await Promise.all([
      AsyncStorage.getItem('notif_questions'),
      AsyncStorage.getItem('notif_plan'),
      AsyncStorage.getItem('plan_niveau'),
      AsyncStorage.getItem('plan_notif_jour'),
      AsyncStorage.getItem('genre'),
    ]);
    if (notifQ !== 'false') await scheduleNotification();
    if (notifP !== 'false' && niveau) {
      await scheduleNotificationsPlan(niveau, jourStr ? Number(jourStr) : 1, genre || 'homme');
    }
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
