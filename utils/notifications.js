import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const getHeures = async () => {
  const hm = await AsyncStorage.getItem('notif_heure_matin');
  const hs = await AsyncStorage.getItem('notif_heure_soir');
  const [hMatin, mMatin] = hm ? hm.split(':').map(Number) : [7, 30];
  const [hSoir, mSoir] = hs ? hs.split(':').map(Number) : [20, 30];
  return { hMatin, mMatin, hSoir, mSoir };
};

const demanderPermission = async () => {
  if (Platform.OS === 'web') return false;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

const annulerParIdentifiant = async (identifiants) => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
      if (identifiants.includes(notif.identifier)) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    }
  } catch (e) {
    console.log('annulerParIdentifiant error:', e);
  }
};

// ─── NOTIFICATIONS QUESTIONS DU JOUR ─────────────────────────────────────────
export const scheduleNotification = async () => {
  if (Platform.OS === 'web') return;
  try {
    const granted = await demanderPermission();
    if (!granted) return;

    await annulerParIdentifiant(['notif-matin', 'notif-soir']);
    const { hMatin, mMatin, hSoir, mSoir } = await getHeures();

    await Notifications.scheduleNotificationAsync({
      identifier: 'notif-matin',
      content: {
        title: 'NoorCouple',
        body: 'Votre question du jour vous attend.',
        sound: true,
      },
      trigger: {
        type: 'daily',
        hour: hMatin,
        minute: mMatin,
        repeats: true,
      },
    });

    await Notifications.scheduleNotificationAsync({
      identifier: 'notif-soir',
      content: {
        title: 'NoorCouple',
        body: 'Avez-vous répondu à votre question du jour ?',
        sound: true,
      },
      trigger: {
        type: 'daily',
        hour: hSoir,
        minute: mSoir,
        repeats: true,
      },
    });

    console.log('Notifs questions programmées:', hMatin + 'h' + mMatin, 'et', hSoir + 'h' + mSoir);
  } catch (e) {
    console.log('scheduleNotification error:', e);
  }
};

// ─── NOTIFICATIONS DU PLAN ────────────────────────────────────────────────────
export const scheduleNotificationsPlan = async (niveau, jourActuel, genre, failles = []) => {
  if (Platform.OS === 'web') return;
  try {
    const granted = await demanderPermission();
    if (!granted) return;

    await annulerParIdentifiant(['plan-matin', 'plan-soir']);
    const { hMatin, mMatin, hSoir, mSoir } = await getHeures();
    const niveauLabel = { leger: 'Léger', modere: 'Modéré', grave: 'Grave' }[niveau] || niveau;

    await Notifications.scheduleNotificationAsync({
      identifier: 'plan-matin',
      content: {
        title: 'NoorCouple — ' + niveauLabel,
        body: 'Votre action du jour est prête.',
        sound: true,
        data: { type: 'plan', jour: jourActuel },
      },
      trigger: {
        type: 'daily',
        hour: hMatin,
        minute: mMatin,
        repeats: true,
      },
    });

    await Notifications.scheduleNotificationAsync({
      identifier: 'plan-soir',
      content: {
        title: 'NoorCouple — Rappel',
        body: 'Avez-vous réalisé votre action du jour ?',
        sound: true,
        data: { type: 'plan', jour: jourActuel },
      },
      trigger: {
        type: 'daily',
        hour: hSoir,
        minute: mSoir,
        repeats: true,
      },
    });

    await AsyncStorage.setItem('plan_notif_jour', String(jourActuel));
    console.log('Notifs plan programmées:', hMatin + 'h' + mMatin, 'et', hSoir + 'h' + mSoir);
  } catch (e) {
    console.log('scheduleNotificationsPlan error:', e);
  }
};

// ─── NOTIFICATION DE TEST ─────────────────────────────────────────────────────
export const envoyerNotificationTest = async () => {
  if (Platform.OS === 'web') return false;
  try {
    const granted = await demanderPermission();
    if (!granted) return false;

    await Notifications.scheduleNotificationAsync({
      identifier: 'notif-test-' + Date.now(),
      content: {
        title: 'NoorCouple — Test ✅',
        body: 'Les notifications fonctionnent correctement !',
        sound: true,
      },
      trigger: {
        type: 'timeInterval',
        seconds: 3,
        repeats: false,
      },
    });

    console.log('Notification test dans 3 secondes');
    return true;
  } catch (e) {
    console.log('envoyerNotificationTest error:', e);
    return false;
  }
};

// ─── ANNULATIONS CIBLÉES ──────────────────────────────────────────────────────
export const annulerNotificationsQuestions = async () => {
  await annulerParIdentifiant(['notif-matin', 'notif-soir']);
};

export const annulerNotificationsPlan = async () => {
  await annulerParIdentifiant(['plan-matin', 'plan-soir']);
};

export const reactiverNotificationsGeneriques = async () => {
  await scheduleNotification();
};
