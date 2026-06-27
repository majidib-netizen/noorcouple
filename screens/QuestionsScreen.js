import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, Share, Alert, ActivityIndicator,
  AppState, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { COLORS, SIZES, RADIUS, SHADOW } from '../constants/theme';
import { QUESTIONS, getQuestionByJour, buildQuestionsOrder } from '../constants/questions';
import { DIAGNOSTIC_QUESTIONS, detecterFailles } from '../constants/planData';
import { scheduleNotification } from '../utils/notifications';
import { useLanguage } from '../context/LanguageContext';
import { useAccesPremium } from '../utils/access';
import { obtenirOuCreerCode, verifierDuoActif, verifierDoubleReponse, sauvegarderReponseDuo, getReponsesConjoint, determinerRoleExport, dechiffrer } from '../utils/duo';
import { supabase } from '../config/supabase';

// ─── Thème badges ─────────────────────────────────────────────────────────────
const THEME_COLORS = {
  communication: '#1B3A5C',
  spiritualite:  '#C9A96E',
  gratitude:     '#27AE60',
  famille:       '#E8843A',
  intimite:      '#A05A7A',
  projets:       '#3498DB',
  croissance:    '#8E44AD',
};


const THEME_EMOJI = {
  communication: '💬',
  spiritualite:  '🤲',
  projets:       '🌟',
  gratitude:     '💛',
  famille:       '👨‍👩‍👧',
  intimite:      '🌸',
  croissance:    '🌱',
};

// Faille → question themes (for "ciblée" detection)
const FAILLE_THEME_MAP = {
  communication:  ['communication'],
  ambiance:       ['communication', 'intimite'],
  intimite:       ['intimite'],
  spiritualite:   ['spiritualite'],
  reconstruction: ['famille', 'gratitude'],
};

// ─── States de l'écran ────────────────────────────────────────────────────────
const STATE = {
  LOADING:     'loading',
  DIAGNOSTIC:  'diagnostic',
  CONFIRMING:  'confirming',
  QUESTIONS:   'questions',
};

export default function QuestionsScreen({ navigation }) {
  const { t, langue } = useLanguage();
  const insets = useSafeAreaInsets();
  const { acces, joursRestants, loading: loadingAcces } = useAccesPremium();
  useEffect(() => {
    if (loadingAcces) return;
    if (!acces) navigation.navigate('Paywall', { contexte: 'questions' });
  }, [acces, loadingAcces]);

  // Écran global
  const [screenState, setScreenState] = useState(STATE.LOADING);

  // Diagnostic
  const [diagIndex, setDiagIndex]     = useState(0);
  const [diagReponses, setDiagReponses] = useState({});

  // Questions
  const [jour, setJour]               = useState(1);
  const [question, setQuestion]       = useState(null);
  const [failles, setFailles]         = useState([]);
  const [reponse, setReponse]         = useState('');
  const [sauvegarde, setSauvegarde]   = useState(false);
  const [historique, setHistorique]   = useState([]);
  const [duoActif, setDuoActif]       = useState(false);
  const [duoCode, setDuoCode]         = useState('');
  const [codeGenere, setCodeGenere]   = useState(false);
  const [revele, setRevele]           = useState(false);
  const [reponseConjoint, setReponseConjoint]     = useState(null);
  const [doubleReponduAujourdhui, setDoubleReponduAujourdhui] = useState(false);
  const [joursReveles, setJoursReveles]           = useState({});
  const [reponsesConjointHistorique, setReponsesConjointHistorique] = useState({});
  const [genre, setGenre]             = useState('');
  const [historiqueComplet, setHistoriqueComplet] = useState(false);
  const [jourEditEnCours, setJourEditEnCours]     = useState(null);
  const [reponseRattrapage, setReponseRattrapage] = useState('');
  const [orderedIdsRef, setOrderedIdsRef]         = useState([]);
  const [doubleReponduParJour, setDoubleReponduParJour] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const spinLoopRef = useRef(null);

  const getThemeLabel = (theme) => {
    const map = {
      communication:        t('questions.theme_communication'),
      spiritualite:         t('questions.theme_spiritualite'),
      gratitude:            t('questions.theme_gratitude'),
      famille:              t('questions.theme_famille'),
      intimite:             t('questions.theme_intimite'),
      intimite_emotionnelle: t('questions.theme_intimite'),
      projets:              t('questions.theme_projets'),
      croissance:           t('questions.theme_croissance'),
      connaissance:         t('questions.theme_croissance'),
      epreuves:             t('questions.theme_epreuves'),
    };
    return map[theme] || theme;
  };

  useEffect(() => { loadAll(); }, []);

  // ─── Refs pour les closures de la subscription realtime ──────────────────────
  const jourRef = useRef(jour);
  const joursReveleRef = useRef(joursReveles);
  useEffect(() => { jourRef.current = jour; }, [jour]);
  useEffect(() => { joursReveleRef.current = joursReveles; }, [joursReveles]);

  // ─── Subscription Supabase realtime + fallback polling ───────────────────────
  useEffect(() => {
    if (!duoActif || !duoCode) return;

    let pollingInterval = null;
    let isSubscribed = false;

    const rafraichir = async () => {
      console.log('[DUO REALTIME] Update détecté, rafraîchissement');
      const jourCourant = jourRef.current;
      const reveles = joursReveleRef.current;
      const deuxRepondu = await verifierDoubleReponse(jourCourant);
      setDoubleReponduAujourdhui(deuxRepondu);
      if (reveles[jourCourant]) {
        const rep = await getReponsesConjoint(jourCourant);
        if (rep) setReponseConjoint(rep);
      }
    };

    const channel = supabase
      .channel('questions-duo-' + duoCode)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'duos',
        filter: 'code=eq.' + duoCode,
      }, () => { rafraichir(); })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          isSubscribed = true;
          console.log('[DUO REALTIME] Subscription activée pour code:', duoCode);
        }
      });

    const fallbackTimeout = setTimeout(() => {
      if (!isSubscribed) {
        console.log('[DUO REALTIME] Fallback polling activé (subscription échouée)');
        pollingInterval = setInterval(rafraichir, 30000);
      }
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearTimeout(fallbackTimeout);
      if (pollingInterval) clearInterval(pollingInterval);
      console.log('[DUO REALTIME] Subscription fermée');
    };
  }, [duoActif, duoCode]);

  // ─── Polling de secours : attend la réponse du conjoint après ma propre réponse ─
  useEffect(() => {
    if (!duoActif) return;
    if (!sauvegarde) return;
    if (doubleReponduAujourdhui) return;

    console.log('[DUO POLLING] Activation - polling de secours toutes les 15s');

    let pollCount = 0;
    const MAX_POLLS = 20; // 5 minutes max (20 × 15s)

    const pollInterval = setInterval(async () => {
      pollCount++;
      if (pollCount >= MAX_POLLS) {
        console.log('[DUO POLLING] Timeout atteint, arrêt');
        clearInterval(pollInterval);
        return;
      }
      const deuxRepondu = await verifierDoubleReponse(jour);
      if (deuxRepondu) {
        console.log('[DUO POLLING] Conjoint a répondu, affichage bouton');
        setDoubleReponduAujourdhui(true);
        clearInterval(pollInterval);
      }
    }, 15000);

    return () => clearInterval(pollInterval);
  }, [duoActif, doubleReponduAujourdhui, sauvegarde, jour]);

  useFocusEffect(
    React.useCallback(() => {
      const check = async () => {
        if (!duoActif) {
          const nowActif = await verifierDuoActif();
          if (nowActif) {
            console.log('[SYNC] duo devient actif → synchronisation des réponses locales');
            const stored = await AsyncStorage.getItem('reponses_questions');
            const all = stored ? JSON.parse(stored) : {};
            const jours = Object.keys(all);
            console.log('[SYNC] réponses locales trouvées:', jours.length, 'jour(s)');
            for (const j of jours) {
              if (all[j]) {
                console.log('[SYNC] push jour', j, '→ Supabase');
                await sauvegarderReponseDuo(Number(j), all[j]);
              }
            }
            console.log('[SYNC] synchronisation terminée');
            setDuoActif(true);
          }
          return;
        }
        const deuxRepondu = await verifierDoubleReponse(jour);
        setDoubleReponduAujourdhui(deuxRepondu);
        if (joursReveles[jour]) {
          const rep = await getReponsesConjoint(jour);
          if (rep) setReponseConjoint(rep);
        }
        await chargerHistoriqueConjoint();
      };
      check();
    }, [duoActif, jour])
  );

  // ─── Chargement initial ─────────────────────────────────────────────────────
  const loadAll = async () => {
    const repStored = await AsyncStorage.getItem('plan_reponses');
    if (!repStored) {
      setScreenState(STATE.DIAGNOSTIC);
      return;
    }
    const rep = JSON.parse(repStored);
    await loadQuestionsView(rep);
  };

  // Ref toujours à jour pour AppState (évite les closures figées)
  const loadAllRef = useRef(loadAll);
  useEffect(() => { loadAllRef.current = loadAll; });

  // ─── Auto-refresh au retour au premier plan ──────────────────────────────────
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        console.log('[AppState] App revenue au premier plan → loadAll');
        loadAllRef.current?.();
      }
    });
    return () => sub.remove();
  }, []);

  // ─── Bouton refresh ──────────────────────────────────────────────────────────
  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    spinAnim.setValue(0);
    spinLoopRef.current = Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 700, useNativeDriver: true })
    );
    spinLoopRef.current.start();
    await loadAll();
    spinLoopRef.current?.stop();
    spinAnim.setValue(0);
    setRefreshing(false);
  };

  // ─── Charger la vue questions après diagnostic ──────────────────────────────
  const loadQuestionsView = async (repObj) => {
    const f = detecterFailles(repObj);
    setFailles(f);

    // Vérifier / calculer l'ordre des questions
    let orderedIds;
    const ordreStored = await AsyncStorage.getItem('questions_ordre');
    if (ordreStored) {
      orderedIds = JSON.parse(ordreStored);
    } else {
      orderedIds = buildQuestionsOrder(f);
      await AsyncStorage.setItem('questions_ordre', JSON.stringify(orderedIds));
    }
    setOrderedIdsRef(orderedIds);

    // Date de démarrage
    let startDate = await AsyncStorage.getItem('questions_start_date');
    if (!startDate) {
      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);
      startDate = aujourdhui.toISOString();
      await AsyncStorage.setItem('questions_start_date', startDate);
    }

    // Jour actuel — transition à minuit heure locale
    const debut = new Date(startDate);
    debut.setHours(0, 0, 0, 0);
    const maintenant = new Date();
    maintenant.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((maintenant.getTime() - debut.getTime()) / 86400000);
    const currentJour = Math.min(Math.max(diffDays, 0), QUESTIONS.length - 1);
    setJour(currentJour + 1);

    const questionId = orderedIds[currentJour];
    const q = QUESTIONS.find(x => x.id === questionId) || QUESTIONS[currentJour];
    setQuestion(q);

    // Genre
    const g = await AsyncStorage.getItem('genre');
    setGenre(g || '');

    // Duo — obtenir le code correct via determinerRole (gère initiateur ET conjoint)
    const { code: roleCode } = await determinerRoleExport();
    const storedCode = await AsyncStorage.getItem('duo_code');
    const code = roleCode || storedCode || await obtenirOuCreerCode();
    setDuoCode(code);
    setCodeGenere(true);

    // Vérifier si le duo est vraiment actif (les deux conjoints connectés)
    const actif = await verifierDuoActif();
    setDuoActif(actif);

    // Charger les jours révélés depuis AsyncStorage
    const revelesStored = await AsyncStorage.getItem('jours_reveles');
    const reveles = revelesStored ? JSON.parse(revelesStored) : {};
    setJoursReveles(reveles);

    // Vérifier si les deux ont déjà répondu aujourd'hui
    if (actif) {
      const deuxRepondu = await verifierDoubleReponse(currentJour + 1);
      setDoubleReponduAujourdhui(deuxRepondu);

      // Auto-charger la réponse conjoint si ce jour a déjà été révélé
      if (reveles[currentJour + 1]) {
        const rep = await getReponsesConjoint(currentJour + 1);
        setReponseConjoint(rep);
      }

      await chargerHistoriqueConjoint();
    }

    // Réponse du jour
    const stored = await AsyncStorage.getItem('reponses_questions');
    const all = stored ? JSON.parse(stored) : {};
    setReponse(all[currentJour + 1] || '');
    setSauvegarde(!!(all[currentJour + 1]));

    // Historique complet : tous les jours passés (1 → currentJour), y compris sans réponse
    const entries = [];
    for (let j = 1; j <= currentJour; j++) {
      const hId = orderedIds[j - 1];
      const q = QUESTIONS.find(x => x.id === hId) || QUESTIONS[j - 1] || null;
      entries.push({ jour: j, reponse: all[j] || null, question: q });
    }
    entries.reverse();
    setHistorique(entries);

    // Vérifier doubleRepondu pour chaque jour passé (en duo)
    if (actif && currentJour > 0) {
      const map = {};
      for (let j = 1; j <= currentJour; j++) {
        map[j] = await verifierDoubleReponse(j);
      }
      setDoubleReponduParJour(map);
    }

    setScreenState(STATE.QUESTIONS);
  };

  // ─── DIAGNOSTIC : répondre ──────────────────────────────────────────────────
  const repondreDiag = async (points) => {
    const q = DIAGNOSTIC_QUESTIONS[diagIndex];
    const nouvellesReponses = { ...diagReponses, [q.id]: points };
    setDiagReponses(nouvellesReponses);

    if (diagIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setDiagIndex(diagIndex + 1);
    } else {
      // Toutes les questions répondues → sauvegarder
      await AsyncStorage.setItem('plan_reponses', JSON.stringify(nouvellesReponses));
      await AsyncStorage.setItem('questions_diagnostic_fait', 'true');

      // Calculer et sauvegarder l'ordre
      const f = detecterFailles(nouvellesReponses);
      const orderedIds = buildQuestionsOrder(f);
      await AsyncStorage.setItem('questions_ordre', JSON.stringify(orderedIds));

      // Date de démarrage si pas déjà définie
      const existing = await AsyncStorage.getItem('questions_start_date');
      if (!existing) {
        const aujourdhui = new Date();
        aujourdhui.setHours(0, 0, 0, 0);
        await AsyncStorage.setItem('questions_start_date', aujourdhui.toISOString());
      }

      setScreenState(STATE.CONFIRMING);
      // Transition automatique vers questions après 1.5s
      setTimeout(async () => {
        await loadQuestionsView(nouvellesReponses);
      }, 1500);
    }
  };

  // ─── DUO ────────────────────────────────────────────────────────────────────
  const inviterConjoint = async () => {
    const code = await obtenirOuCreerCode();
    setDuoCode(code);
    setCodeGenere(true);
  };

  const partagerCode = async () => {
    try {
      await Share.share({
        message: `Rejoins-moi sur NoorCouple pour nos questions du jour en couple 🤍\n\nCode : ${duoCode}\n\nTélécharge l'app : https://play.google.com/store/apps/details?id=com.casquedev.noorcouple`,
      });
    } catch (e) { console.log('Share error:', e); }
  };

  // ─── Sauvegarder la réponse ──────────────────────────────────────────────────
  const envoyerReponse = async () => {
    console.log('[ENVOI] Début envoyerReponse');
    console.log('[ENVOI] duoActif:', duoActif, '| sauvegarde:', sauvegarde);
    console.log('[ENVOI] reponse:', reponse?.substring(0, 20), '| jour:', jour);
    if (!reponse.trim()) return;
    const stored = await AsyncStorage.getItem('reponses_questions');
    const all = stored ? JSON.parse(stored) : {};
    all[jour] = reponse.trim();
    await AsyncStorage.setItem('reponses_questions', JSON.stringify(all));
    setSauvegarde(true);

    // Sauvegarde chiffrée dans Supabase si duo actif
    if (duoActif) {
      console.log('[ENVOI] Appel sauvegarderReponseDuo...');
      const result = await sauvegarderReponseDuo(jour, reponse.trim());
      console.log('[ENVOI] Résultat sauvegarde:', result);
      const repConjoint = await getReponsesConjoint(jour);
      setReponseConjoint(repConjoint);
      const deuxRepondu = await verifierDoubleReponse(jour);
      console.log('[ENVOI] doubleRepondu après save:', deuxRepondu);
      setDoubleReponduAujourdhui(deuxRepondu);
    } else {
      console.log('[ENVOI] duoActif=false, sauvegarde locale uniquement');
    }

    const ids = orderedIdsRef.length > 0 ? orderedIdsRef : QUESTIONS.map(q => q.id);
    const entries = [];
    for (let j = 1; j < jour; j++) {
      const hId = ids[j - 1];
      const q = QUESTIONS.find(x => x.id === hId) || QUESTIONS[j - 1] || null;
      entries.push({ jour: j, reponse: all[j] || null, question: q });
    }
    entries.reverse();
    setHistorique(entries);

    // Demande permission notifications à la première réponse
    if (Platform.OS !== 'web' && Object.keys(all).length === 1) {
      const dejaAcceptee = await AsyncStorage.getItem('notif_questions_acceptee');
      if (!dejaAcceptee) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status === 'granted') {
          await AsyncStorage.setItem('notif_questions_acceptee', 'true');
          await scheduleNotification();
        } else {
          Alert.alert(
            t('plan.notif_titre'),
            t('plan.notif_texte'),
            [
              { text: t('generic.pas_maintenant'), style: 'cancel',
                onPress: () => AsyncStorage.setItem('notif_questions_acceptee', 'false') },
              {
                text: t('generic.autoriser'),
                onPress: async () => {
                  const { status: s } = await Notifications.requestPermissionsAsync();
                  await AsyncStorage.setItem('notif_questions_acceptee', s === 'granted' ? 'true' : 'false');
                  if (s === 'granted') await scheduleNotification();
                },
              },
            ]
          );
        }
      }
    }
  };

  // ─── Historique des réponses conjoint ───────────────────────────────────────
  const chargerHistoriqueConjoint = async () => {
    // 1. Charge le cache local en premier (affichage immédiat + fallback offline)
    const cache = await AsyncStorage.getItem('reponses_conjoint_cache');
    if (cache) {
      try {
        setReponsesConjointHistorique(JSON.parse(cache));
      } catch (e) { console.log('Cache parse error:', e); }
    }

    // 2. Tente la requête Supabase pour rafraîchir
    try {
      const { code, estInitiateur } = await determinerRoleExport();
      if (!code) return;

      const champ = estInitiateur ? 'reponses_conjoint' : 'reponses_initiateur';
      const { data } = await supabase
        .from('duos')
        .select(champ)
        .eq('code', code)
        .single();

      const reponsesChiffrees = data?.[champ] || {};
      const reponsesDechiffrees = {};

      for (const jourKey in reponsesChiffrees) {
        const rep = reponsesChiffrees[jourKey];
        if (rep?.reponse) {
          reponsesDechiffrees[jourKey] = {
            texte: dechiffrer(rep.reponse, code),
            date: rep.date,
          };
        }
      }

      await AsyncStorage.setItem('reponses_conjoint_cache', JSON.stringify(reponsesDechiffrees));
      setReponsesConjointHistorique(reponsesDechiffrees);
    } catch (e) {
      console.log('Supabase indisponible, utilisation du cache:', e);
    }
  };

  // ─── Révéler les réponses du conjoint ────────────────────────────────────────
  const handleRevelerReponses = async () => {
    const conjoint = await getReponsesConjoint(jour);
    setReponseConjoint(conjoint);

    const revelesStored = await AsyncStorage.getItem('jours_reveles');
    const reveles = revelesStored ? JSON.parse(revelesStored) : {};
    reveles[jour] = true;
    await AsyncStorage.setItem('jours_reveles', JSON.stringify(reveles));
    setJoursReveles(reveles);
  };

  // ─── Rattrapage d'un jour passé ─────────────────────────────────────────────
  const envoyerRattrapage = async () => {
    if (!reponseRattrapage.trim() || jourEditEnCours === null) return;
    const stored = await AsyncStorage.getItem('reponses_questions');
    const all = stored ? JSON.parse(stored) : {};
    all[jourEditEnCours] = reponseRattrapage.trim();
    await AsyncStorage.setItem('reponses_questions', JSON.stringify(all));

    if (duoActif) {
      await sauvegarderReponseDuo(jourEditEnCours, reponseRattrapage.trim());
      const doubleRep = await verifierDoubleReponse(jourEditEnCours);
      setDoubleReponduParJour(prev => ({ ...prev, [jourEditEnCours]: doubleRep }));
      if (doubleRep) await chargerHistoriqueConjoint();
    }

    const ids = orderedIdsRef.length > 0 ? orderedIdsRef : QUESTIONS.map(q => q.id);
    const entries = [];
    for (let j = 1; j < jour; j++) {
      const hId = ids[j - 1];
      const q = QUESTIONS.find(x => x.id === hId) || QUESTIONS[j - 1] || null;
      entries.push({ jour: j, reponse: all[j] || null, question: q });
    }
    entries.reverse();
    setHistorique(entries);

    setJourEditEnCours(null);
    setReponseRattrapage('');
  };

  // ─── Révéler pour un jour de l'historique ───────────────────────────────────
  const handleRevelerHistorique = async (jourH) => {
    const revelesStored = await AsyncStorage.getItem('jours_reveles');
    const reveles = revelesStored ? JSON.parse(revelesStored) : {};
    reveles[jourH] = true;
    await AsyncStorage.setItem('jours_reveles', JSON.stringify(reveles));
    setJoursReveles(reveles);
    await chargerHistoriqueConjoint();
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const isCiblee = question
    ? failles.some(f => (FAILLE_THEME_MAP[f.theme] || []).includes(question.theme))
    : false;

  const texteQuestion = question
    ? (langue === 'en' ? question.texteEN : question.texte)
    : '';

  const themeColor  = question ? (THEME_COLORS[question.theme] || COLORS.primary) : COLORS.primary;
  const themeLabel  = question ? getThemeLabel(question.theme) : '';
  const themeEmoji  = question ? (THEME_EMOJI[question.theme] || '💬') : '💬';
  const diagQuestion = DIAGNOSTIC_QUESTIONS[diagIndex];
  const diagProgress = (diagIndex + 1) / DIAGNOSTIC_QUESTIONS.length;

  // ─── RENDER : Access check ───────────────────────────────────────────────────
  if (loadingAcces) {
    return (
      <SafeAreaView style={[s.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  // ─── RENDER : Loading ────────────────────────────────────────────────────────
  if (screenState === STATE.LOADING) {
    return <SafeAreaView style={s.safe}><View style={s.loadingWrap}><Text style={s.loadingTxt}>...</Text></View></SafeAreaView>;
  }

  // ─── RENDER : Confirmation post-diagnostic ───────────────────────────────────
  if (screenState === STATE.CONFIRMING) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.confirmWrap}>
          <Text style={s.confirmEmoji}>✨</Text>
          <Text style={s.confirmTitre}>{t('questions.profil_sauvegarde')}</Text>
          <Text style={s.confirmSub}>{t('questions.profil_sauvegarde_desc')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── RENDER : Diagnostic ─────────────────────────────────────────────────────
  if (screenState === STATE.DIAGNOSTIC) {
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={[s.diagScroll, { paddingBottom: insets.bottom + 80 }]} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={s.diagHeader}>
            <Text style={s.diagTitre}>{t('questions.avant_commencer')}</Text>
            <Text style={s.diagSub}>{t('questions.avant_commencer_desc')}</Text>
          </View>

          {/* Barre de progression */}
          <View style={s.progBar}>
            <View style={[s.progFill, { width: `${diagProgress * 100}%` }]} />
          </View>
          <Text style={s.progLabel}>
            {diagIndex + 1} / {DIAGNOSTIC_QUESTIONS.length}
          </Text>

          {/* Carte question */}
          <View style={s.diagCard}>
            <Text style={s.diagQTxt}>{langue === 'en' ? (diagQuestion.questionEN || diagQuestion.question) : diagQuestion.question}</Text>
          </View>

          {/* Options */}
          {diagQuestion.options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={s.diagOpt}
              onPress={() => repondreDiag(opt.points)}
              activeOpacity={0.8}
            >
              <View style={s.diagOptNum}>
                <Text style={s.diagOptNumTxt}>{i + 1}</Text>
              </View>
              <Text style={s.diagOptTxt}>{langue === 'en' ? (opt.texteEN || opt.texte) : opt.texte}</Text>
            </TouchableOpacity>
          ))}

        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── RENDER : Questions ──────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={s.scroll}
          contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Trial banner */}
          {acces && joursRestants !== null && joursRestants > 0 && (
            <View style={s.trialBanner}>
              <Text style={s.trialBannerTxt}>{t('paywall.essai_restant')}{joursRestants}</Text>
            </View>
          )}

          {/* Header */}
          <View style={s.header}>
            <Text style={s.titre}>{t('questions.titre')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={s.jourBadge}>
                <Text style={s.jourTxt}>{t('plan.jour')} {jour}</Text>
              </View>
              <TouchableOpacity onPress={handleRefresh} disabled={refreshing} style={s.refreshBtn} activeOpacity={0.7}>
                <Animated.Text style={[s.refreshIcon, { transform: [{ rotate: spin }] }]}>↻</Animated.Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Code de duo */}
          {!duoActif && codeGenere && (
            <View style={s.codeCard}>
              <Text style={s.codeLabel}>{t('questions.code_duo')}</Text>
              <Text style={s.codeValue}>{duoCode}</Text>
              <TouchableOpacity style={s.shareBtn} onPress={partagerCode} activeOpacity={0.85}>
                <Text style={s.shareBtnTxt}>🔗 {t('plan.partager_code')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Encadré attente conjoint */}
          {!duoActif && codeGenere && (
            <View style={s.duoAttenteCard}>
              <Text style={s.duoAttenteTitre}>{t('duo.attente_titre')}</Text>
              <Text style={s.duoAttenteDesc}>{t('duo.attente_desc')}</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <TouchableOpacity
                  style={s.btnSecondaire}
                  onPress={() => Share.share({
                    message: t('duo.partage_message').replace('{code}', duoCode),
                  })}
                >
                  <Text style={s.btnSecondaireTxt}>{t('duo.renvoyer_code')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Questions du jour */}
          {question && (
            <>
              {/* Mention confidentialité duo */}
              {duoActif && (
                <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 12, fontStyle: 'italic', paddingHorizontal: 16 }}>
                  {t('questions.confidentialite')}
                </Text>
              )}

              {/* Carte question */}
              <View style={[s.questionCard, { borderLeftColor: themeColor }]}>
                <View style={s.questionTop}>
                  <Text style={s.questionEmoji}>{themeEmoji}</Text>
                  <View style={[s.themeBadge, { backgroundColor: themeColor + '20' }]}>
                    <Text style={[s.themeBadgeTxt, { color: themeColor }]}>{themeLabel}</Text>
                  </View>
                </View>
                <Text style={s.questionTexte}>{texteQuestion}</Text>
                {isCiblee && (
                  <Text style={s.cibleeTxt}>{t('questions.ciblee')}</Text>
                )}
              </View>

              {/* Réponse */}
              {!revele && !sauvegarde ? (
                <View style={s.duoCache}>
                  <Text style={s.duoCacheTxt}>{t('questions.reflexion')}</Text>
                  <TouchableOpacity
                    style={s.revelerBtn}
                    onPress={() => setRevele(true)}
                    activeOpacity={0.85}
                  >
                    <Text style={s.revelerBtnTxt}>{t('questions.ecrire_reponse')}</Text>
                  </TouchableOpacity>
                </View>
              ) : sauvegarde && duoActif ? (
                doubleReponduAujourdhui ? (
                  joursReveles[jour] ? (
                    <View style={s.doubleReponseSection}>
                      {/* Ma réponse */}
                      <View style={s.maReponseCard}>
                        <View style={[s.genreBadge, { backgroundColor: genre === 'homme' ? '#1B3A5C18' : '#A05A7A18' }]}>
                          <Text style={[s.genreBadgeTxt, { color: genre === 'homme' ? '#1B3A5C' : '#A05A7A' }]}>
                            {genre === 'homme' ? '👨 ' : '👩 '}{t('questions.ma_reponse')}
                          </Text>
                        </View>
                        <Text style={s.reponseTexte}>{reponse}</Text>
                      </View>
                      {/* Réponse conjoint */}
                      {reponseConjoint && (
                        <View style={s.conjointReponseCard}>
                          <View style={[s.genreBadge, { backgroundColor: genre === 'homme' ? '#A05A7A18' : '#1B3A5C18' }]}>
                            <Text style={[s.genreBadgeTxt, { color: genre === 'homme' ? '#A05A7A' : '#1B3A5C' }]}>
                              {genre === 'homme' ? '👩 ' : '👨 '}{t('questions.reponse_conjoint')}
                            </Text>
                          </View>
                          <Text style={s.reponseTexte}>{reponseConjoint}</Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={s.revelerReponseBtn}
                      onPress={handleRevelerReponses}
                      activeOpacity={0.85}
                    >
                      <Text style={s.revelerReponseBtnTxt}>🔓 {t('questions.reveler')}</Text>
                    </TouchableOpacity>
                  )
                ) : (
                  <View style={s.attenteCard}>
                    <Text style={s.attenteEmoji}>⏳</Text>
                    <Text style={s.attenteTitle}>{t('questions.conjoint_pas_repondu')}</Text>
                    <Text style={s.attenteDesc}>{t('questions.attente_desc')}</Text>
                  </View>
                )
              ) : (
                <View style={s.reponseSection}>
                  <TextInput
                    style={s.input}
                    value={reponse}
                    onChangeText={(v) => { setReponse(v); setSauvegarde(false); }}
                    placeholder={t('questions.repondre')}
                    placeholderTextColor={COLORS.textLight}
                    maxLength={500}
                    multiline
                    textAlignVertical="top"
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 }}>
                    <Text style={{ fontSize: 11, color: reponse.length > 450 ? COLORS.warning : COLORS.textLight }}>
                      {reponse.length} / 500
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[s.btnSave, (!reponse.trim() || sauvegarde) && s.btnDisabled]}
                    onPress={envoyerReponse}
                    disabled={!reponse.trim() || sauvegarde}
                    activeOpacity={0.85}
                  >
                    <Text style={s.btnSaveTxt}>
                      {sauvegarde ? `✓ ${t('questions.reponse_envoyee')}` : t('questions.envoyer')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Historique */}
              {historique.length > 0 && (
                <View style={s.historiqueSection}>
                  <Text style={s.historiqueTitre}>{t('questions.historique')}</Text>
                  {(historiqueComplet ? historique : historique.slice(0, 30)).map((entry) => {
                    const hColor = entry.question ? (THEME_COLORS[entry.question.theme] || COLORS.primary) : COLORS.primary;
                    const aRepondu = !!entry.reponse;
                    const deuxOntRepondu = !!doubleReponduParJour[entry.jour];
                    const dejRevele = !!joursReveles[entry.jour];

                    return (
                      <View key={entry.jour} style={aRepondu ? s.historiqueCard : s.historiqueCardManque}>
                        <View style={s.historiqueTop}>
                          <Text style={s.historiqueJour}>{t('plan.jour')} {entry.jour}</Text>
                          <Text style={s.historiqueTheme}>
                            {entry.question ? (THEME_EMOJI[entry.question.theme] || '💬') : '💬'}
                          </Text>
                        </View>
                        <Text style={s.historiqueQuestion} numberOfLines={2}>
                          {entry.question
                            ? (langue === 'en' ? entry.question.texteEN : entry.question.texte)
                            : ''}
                        </Text>

                        {aRepondu ? (
                          <>
                            <Text style={[s.historiqueReponse, { borderLeftColor: hColor + '80' }]}>
                              {entry.reponse}
                            </Text>
                            {/* Réponse conjoint déjà révélée */}
                            {dejRevele && reponsesConjointHistorique[String(entry.jour)] ? (
                              <View style={s.histoireConjoint}>
                                <Text style={s.histoireLabel}>💞 {t('questions.reponse_conjoint')}</Text>
                                <Text style={[s.historiqueReponse, { borderLeftColor: '#A05A7A80' }]}>
                                  {reponsesConjointHistorique[String(entry.jour)].texte}
                                </Text>
                              </View>
                            ) : duoActif && deuxOntRepondu && !dejRevele ? (
                              <TouchableOpacity
                                style={s.btnRevelerHistorique}
                                onPress={() => handleRevelerHistorique(entry.jour)}
                                activeOpacity={0.85}
                              >
                                <Text style={s.btnRevelerHistoriqueTxt}>🔓 {t('questions.reveler')}</Text>
                              </TouchableOpacity>
                            ) : null}
                          </>
                        ) : (
                          <View style={s.encadreManque}>
                            <Text style={s.encadreManqueTitre}>{t('questions.pas_repondu')}</Text>
                            <TouchableOpacity
                              style={s.btnRepondreMaintenant}
                              onPress={() => { setJourEditEnCours(entry.jour); setReponseRattrapage(''); }}
                              activeOpacity={0.85}
                            >
                              <Text style={s.btnRepondreMaintenantTxt}>{t('questions.repondre_maintenant')}</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    );
                  })}
                  {!historiqueComplet && historique.length > 30 && (
                    <TouchableOpacity
                      onPress={() => setHistoriqueComplet(true)}
                      style={s.historiqueBtn}
                    >
                      <Text style={s.historiqueBtnTxt}>
                        📖 {t('questions.voir_historique')} ({historique.length - 30} {t('questions.reponses_cachees')})
                      </Text>
                    </TouchableOpacity>
                  )}
                  {historiqueComplet && (
                    <TouchableOpacity
                      onPress={() => setHistoriqueComplet(false)}
                      style={s.historiqueBtn}
                    >
                      <Text style={s.historiqueBtnTxt}>▲ {t('questions.masquer_historique')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Modal rattrapage */}
              {jourEditEnCours !== null && (
                <View style={s.modalOverlay}>
                  <View style={s.modalBox}>
                    <Text style={s.modalJour}>{t('plan.jour')} {jourEditEnCours}</Text>
                    <Text style={s.modalQuestion} numberOfLines={3}>
                      {(() => {
                        const ids = orderedIdsRef.length > 0 ? orderedIdsRef : QUESTIONS.map(q => q.id);
                        const hId = ids[jourEditEnCours - 1];
                        const q = QUESTIONS.find(x => x.id === hId) || QUESTIONS[jourEditEnCours - 1];
                        return q ? (langue === 'en' ? q.texteEN : q.texte) : '';
                      })()}
                    </Text>
                    <TextInput
                      style={s.modalInput}
                      value={reponseRattrapage}
                      onChangeText={setReponseRattrapage}
                      placeholder={t('questions.tape_reponse')}
                      placeholderTextColor={COLORS.textLight}
                      multiline
                      maxLength={500}
                      textAlignVertical="top"
                      autoFocus
                    />
                    <Text style={s.modalCompteur}>{reponseRattrapage.length} / 500</Text>
                    <View style={s.modalBtns}>
                      <TouchableOpacity
                        style={s.modalBtnAnnuler}
                        onPress={() => setJourEditEnCours(null)}
                        activeOpacity={0.85}
                      >
                        <Text style={s.modalBtnAnnulerTxt}>{t('generic.annuler')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[s.modalBtnEnvoyer, !reponseRattrapage.trim() && s.btnDisabled]}
                        onPress={envoyerRattrapage}
                        disabled={!reponseRattrapage.trim()}
                        activeOpacity={0.85}
                      >
                        <Text style={s.modalBtnEnvoyerTxt}>{t('questions.envoyer')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </>
          )}

          <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },

  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingTxt: { fontSize: SIZES.xl, color: COLORS.textLight },
  trialBanner: { backgroundColor: COLORS.accentLight, borderLeftWidth: 4, borderLeftColor: COLORS.accent, borderRadius: RADIUS.sm, padding: 12, marginBottom: 12 },
  trialBannerTxt: { fontSize: 13, color: COLORS.accent, fontWeight: '600' },

  // Confirmation
  confirmWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  confirmEmoji: { fontSize: 56, marginBottom: 16 },
  confirmTitre: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.primary, marginBottom: 8, textAlign: 'center' },
  confirmSub: { fontSize: SIZES.base, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },

  // Diagnostic
  diagScroll: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 40 },
  diagHeader: { marginBottom: 24 },
  diagTitre: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  diagSub: { fontSize: SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
  progBar: {
    height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginBottom: 6, overflow: 'hidden',
  },
  progFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  progLabel: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginBottom: 24, textAlign: 'right' },
  diagCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 20,
    marginBottom: 20, ...SHADOW.sm,
    borderLeftWidth: 4, borderLeftColor: COLORS.primary,
  },
  diagQTxt: { fontSize: SIZES.base, fontWeight: '600', color: COLORS.text, lineHeight: 26 },
  diagOpt: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: 16, marginBottom: 10, ...SHADOW.sm,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  diagOptNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primary + '18', borderWidth: 1.5, borderColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  diagOptNumTxt: { fontSize: SIZES.xs, fontWeight: '700', color: COLORS.primary },
  diagOptTxt: { flex: 1, fontSize: SIZES.sm, color: COLORS.text, lineHeight: 20 },

  // Header questions
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  titre: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text },
  jourBadge: {
    backgroundColor: COLORS.primary + '18', borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1.5, borderColor: COLORS.primary + '40',
  },
  jourTxt: { fontSize: SIZES.xs, fontWeight: '700', color: COLORS.primary },
  refreshBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.primary + '30',
  },
  refreshIcon: { fontSize: 20, color: COLORS.primary, fontWeight: '700', lineHeight: 22 },

  // Invitation duo
  inviteCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: 28, alignItems: 'center', marginBottom: 20, ...SHADOW.md,
  },
  inviteEmoji: { fontSize: 48, marginBottom: 12 },
  inviteTitre: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  inviteMsg: {
    fontSize: SIZES.sm, color: COLORS.textSecondary,
    textAlign: 'center', lineHeight: 22, marginBottom: 20,
  },
  inviteBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: 14, paddingHorizontal: 28,
  },
  inviteBtnTxt: { color: '#fff', fontWeight: '700', fontSize: SIZES.sm },

  // Code duo
  codeCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: 20, alignItems: 'center', marginBottom: 20,
    borderWidth: 1.5, borderColor: COLORS.primary + '30', ...SHADOW.sm,
  },
  codeLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginBottom: 8 },
  codeValue: {
    fontSize: 32, fontWeight: '800', color: COLORS.primary,
    letterSpacing: 3, marginBottom: 16,
  },
  shareBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: 12, paddingHorizontal: 24,
  },
  shareBtnTxt: { color: '#fff', fontWeight: '700', fontSize: SIZES.sm },

  // Carte question
  questionCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: 20, marginBottom: 20,
    borderLeftWidth: 4, ...SHADOW.md,
  },
  questionTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  questionEmoji: { fontSize: 24 },
  themeBadge: {
    borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4,
  },
  themeBadgeTxt: { fontSize: SIZES.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  questionTexte: {
    fontSize: SIZES.base, color: COLORS.text, lineHeight: 28, fontWeight: '500',
  },
  cibleeTxt: {
    marginTop: 12, fontSize: 11, color: COLORS.textLight,
    fontStyle: 'italic',
  },

  // Zone réponse
  reponseSection: { marginBottom: 24 },
  input: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.border,
    padding: 16, fontSize: SIZES.base, color: COLORS.text,
    minHeight: 130, lineHeight: 24, ...SHADOW.sm,
  },
  btnSave: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: 14, alignItems: 'center', marginTop: 12,
  },
  btnDisabled: { backgroundColor: COLORS.primaryLight },
  btnSaveTxt: { color: '#fff', fontWeight: '700', fontSize: SIZES.sm },

  // Champ caché
  duoCache: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: 24, alignItems: 'center', marginBottom: 24,
    borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  duoCacheTxt: {
    fontSize: SIZES.sm, color: COLORS.textSecondary,
    textAlign: 'center', marginBottom: 16, lineHeight: 22,
  },
  revelerBtn: {
    backgroundColor: COLORS.accent, borderRadius: RADIUS.full,
    paddingVertical: 13, paddingHorizontal: 28,
  },
  revelerBtnTxt: { color: '#fff', fontWeight: '700', fontSize: SIZES.sm },

  // Attente conjoint
  attenteCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: 28, alignItems: 'center', marginBottom: 24,
    borderWidth: 1.5, borderColor: COLORS.primary + '30', ...SHADOW.sm,
  },
  attenteEmoji: { fontSize: 40, marginBottom: 12 },
  attenteTitle: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.text, marginBottom: 8, textAlign: 'center' },
  attenteDesc: { fontSize: SIZES.sm, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },

  // Double réponses révélées
  doubleReponseSection: { marginBottom: 24, gap: 12 },
  maReponseCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: 16, ...SHADOW.sm, borderWidth: 1, borderColor: '#1B3A5C20',
  },
  conjointReponseCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: 16, ...SHADOW.sm, borderWidth: 1, borderColor: '#A05A7A20',
  },
  genreBadge: {
    borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4,
    alignSelf: 'flex-start', marginBottom: 10,
  },
  genreBadgeTxt: { fontSize: SIZES.xs, fontWeight: '700' },
  reponseTexte: { fontSize: SIZES.sm, color: COLORS.text, lineHeight: 22 },
  revelerReponseBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: 14, alignItems: 'center', marginBottom: 24,
  },
  revelerReponseBtnTxt: { color: '#fff', fontWeight: '700', fontSize: SIZES.sm },

  // Historique
  historiqueSection: { marginTop: 4 },
  historiqueTitre: {
    fontSize: SIZES.xs, fontWeight: '700', color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.9, marginBottom: 12,
  },
  historiqueCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: 16, marginBottom: 10, ...SHADOW.sm,
  },
  historiqueTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  historiqueJour: { fontSize: SIZES.xs, fontWeight: '700', color: COLORS.primary },
  historiqueTheme: { fontSize: SIZES.base },
  historiqueQuestion: {
    fontSize: SIZES.xs, color: COLORS.textSecondary,
    fontStyle: 'italic', lineHeight: 18, marginBottom: 8,
  },
  historiqueReponse: {
    fontSize: SIZES.sm, color: COLORS.text, lineHeight: 22,
    borderLeftWidth: 3, paddingLeft: 10,
  },
  historiqueBtn: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  historiqueBtnTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  // Attente conjoint (encadré code duo)
  duoAttenteCard: { backgroundColor: COLORS.accentLight, borderRadius: 12, padding: 16, marginVertical: 12, borderLeftWidth: 3, borderLeftColor: COLORS.accent },
  duoAttenteTitre: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  duoAttenteDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  btnSecondaire: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: COLORS.primary },
  btnSecondaireTxt: { fontSize: 12, fontWeight: '600', color: '#fff' },

  histoireConjoint: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  histoireLabel: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    color: '#A05A7A',
    marginBottom: 6,
  },

  // Carte historique jour manqué
  historiqueCardManque: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: 16, marginBottom: 10, ...SHADOW.sm,
    borderLeftWidth: 3, borderLeftColor: '#C9A96E',
  },
  encadreManque: {
    backgroundColor: '#FFF8EC', borderRadius: RADIUS.sm,
    padding: 12, marginTop: 10,
  },
  encadreManqueTitre: {
    fontSize: SIZES.xs, color: '#8B6914', fontWeight: '600', marginBottom: 8,
  },
  btnRepondreMaintenant: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: 8, paddingHorizontal: 16, alignSelf: 'flex-start',
  },
  btnRepondreMaintenantTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },

  // Bouton révéler dans l'historique
  btnRevelerHistorique: {
    backgroundColor: COLORS.primary + '18', borderRadius: RADIUS.full,
    paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'flex-start',
    marginTop: 10, borderWidth: 1, borderColor: COLORS.primary + '40',
  },
  btnRevelerHistoriqueTxt: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },

  // Modal rattrapage
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center',
    paddingHorizontal: 20, zIndex: 100,
  },
  modalBox: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 20, ...SHADOW.md,
  },
  modalJour: {
    fontSize: SIZES.xs, fontWeight: '700', color: COLORS.primary,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6,
  },
  modalQuestion: {
    fontSize: SIZES.sm, fontWeight: '600', color: COLORS.text,
    lineHeight: 22, marginBottom: 14,
  },
  modalInput: {
    backgroundColor: COLORS.background, borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.border,
    padding: 14, fontSize: SIZES.base, color: COLORS.text,
    minHeight: 110, lineHeight: 22,
  },
  modalCompteur: {
    fontSize: 11, color: COLORS.textLight, textAlign: 'right', marginTop: 4, marginBottom: 14,
  },
  modalBtns: { flexDirection: 'row', gap: 10 },
  modalBtnAnnuler: {
    flex: 1, borderRadius: RADIUS.full, paddingVertical: 13,
    alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border,
  },
  modalBtnAnnulerTxt: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textSecondary },
  modalBtnEnvoyer: {
    flex: 2, backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: 13, alignItems: 'center',
  },
  modalBtnEnvoyerTxt: { color: '#fff', fontWeight: '700', fontSize: SIZES.sm },
});
