import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Alert, Share, Platform, ActivityIndicator,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, RADIUS, SHADOW } from '../constants/theme';
import {
  DIAGNOSTIC_QUESTIONS, calculerNiveau, NIVEAUX,
  detecterFailles, getPlanJour
} from '../constants/planData';
import { buildQuestionsOrder } from '../constants/questions';
import { NOTIF_PLAN } from '../constants/notifMessages';
import { BONUS_MESSAGES } from '../constants/bonusMessages';
import { scheduleNotificationsPlan, reactiverNotificationsGeneriques } from '../utils/notifications';
import { useLanguage } from '../context/LanguageContext';
import { accesPremium } from '../utils/access';
import { sauvegarderDiagnosticDuo, recupererNiveauDuo } from '../utils/duo';
import { getAppStoreUrl } from '../utils/urls';

const ETAPES = {
  ACCUEIL: 'accueil',
  DIAGNOSTIC: 'diagnostic',
  RESULTAT: 'resultat',
  PLAN: 'plan',
  FIN: 'fin',
};

export default function MonPlanScreen({ navigation }) {
  const [etape, setEtape] = useState(ETAPES.ACCUEIL);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [reponses, setReponses] = useState({});
  const [score, setScore] = useState(0);
  const [niveau, setNiveau] = useState(null);
  const [failles, setFailles] = useState([]);
  const [planActif, setPlanActif] = useState(null);
  const [jourActuel, setJourActuel] = useState(0);
  const [joursValides, setJoursValides] = useState([]);
  const [genre, setGenre] = useState('homme');
  const [actionRealisee, setActionRealisee] = useState(false);
  const [planMode, setPlanMode] = useState(null);
  const [planDuoCode, setPlanDuoCode] = useState('');
  const [niveauEffectif, setNiveauEffectif] = useState(null);
  const [faillesEffectives, setFaillesEffectives] = useState([]);
  const { t, langue } = useLanguage();
  const insets = useSafeAreaInsets();
  const [acces, setAcces] = useState(null);
  const [loadingAcces, setLoadingAcces] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      let actif = true;
      const verifier = async () => {
        setLoadingAcces(true);
        const ok = await accesPremium();
        if (!actif) return;
        setAcces(ok);
        setLoadingAcces(false);
        if (!ok) navigation.navigate('Paywall', { contexte: 'plan' });
      };
      verifier();
      return () => { actif = false; };
    }, [navigation])
  );

  const getNiveauLabel = (n) => {
    if (n === 'leger') return langue === 'en' ? 'Light' : 'Léger';
    if (n === 'modere') return langue === 'en' ? 'Moderate' : 'Modéré';
    if (n === 'grave') return langue === 'en' ? 'Serious' : 'Grave';
    return n;
  };

  useEffect(() => { chargerEtat(); }, []);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('genre').then(g => {
      console.log('[DEBUG FOCUS] genre lu depuis AsyncStorage:', g);
      if (g) setGenre(g);
    });

      const verifierAjustementNiveau = async () => {
        try {
          const duoNiveau = await recupererNiveauDuo();
          if (!duoNiveau) return;
          const niveauLocal = await AsyncStorage.getItem('plan_niveau');
          const ajustementVu = await AsyncStorage.getItem('plan_ajustement_vu');
          if (niveauLocal && duoNiveau.niveau !== niveauLocal && ajustementVu !== duoNiveau.niveau) {
            Alert.alert(
              t('plan.niveau_ajuste_titre'),
              t('plan.niveau_ajuste_desc').replace('{niveau}', getNiveauLabel(duoNiveau.niveau)),
              [
                {
                  text: t('plan.garder_mon_niveau'),
                  style: 'cancel',
                  onPress: async () => {
                    await AsyncStorage.setItem('plan_ajustement_vu', duoNiveau.niveau);
                    await AsyncStorage.setItem('plan_niveau_individuel', 'true');
                  },
                },
                {
                  text: t('plan.accepter_nouveau'),
                  onPress: async () => {
                    await AsyncStorage.setItem('plan_niveau', duoNiveau.niveau);
                    await AsyncStorage.setItem('plan_failles', JSON.stringify(duoNiveau.failles));
                    await AsyncStorage.setItem('plan_ajustement_vu', duoNiveau.niveau);
                    await AsyncStorage.removeItem('plan_niveau_individuel');
                    setNiveau(duoNiveau.niveau);
                    setPlanActif(duoNiveau.niveau);
                    setFailles(duoNiveau.failles);
                  },
                },
              ]
            );
          }
        } catch (e) {
          console.log('verifierAjustementNiveau error:', e);
        }
      };
      verifierAjustementNiveau();
    }, [])
  );

  const chargerEtat = async () => {
    try {
      const [g, n, j, jv, rep] = await Promise.all([
        AsyncStorage.getItem('genre'),
        AsyncStorage.getItem('plan_niveau'),
        AsyncStorage.getItem('plan_jour'),
        AsyncStorage.getItem('plan_jours_valides'),
        AsyncStorage.getItem('plan_reponses'),
      ]);
      if (g) setGenre(g);
      if (n) {
        setPlanActif(n);
        setNiveau(n);
        const jourNum = j ? parseInt(j) : 0;
        setJourActuel(jourNum);
        setJoursValides(jv ? JSON.parse(jv) : []);
        if (rep) {
          const repObj = JSON.parse(rep);
          setReponses(repObj);
          setFailles(detecterFailles(repObj));
        }
        try {
          const duoResult = await recupererNiveauDuo();
          if (duoResult) {
            setNiveauEffectif(duoResult.niveau);
            setFaillesEffectives(duoResult.failles);
            await AsyncStorage.multiSet([
              ['niveau_commun_cache', duoResult.niveau],
              ['failles_communes_cache', JSON.stringify(duoResult.failles)],
            ]);
          } else {
            setNiveauEffectif(n);
            setFaillesEffectives(rep ? detecterFailles(JSON.parse(rep)) : []);
          }
        } catch (e) {
          const niveauCache = await AsyncStorage.getItem('niveau_commun_cache');
          const faillesCache = await AsyncStorage.getItem('failles_communes_cache');
          if (niveauCache && faillesCache) {
            setNiveauEffectif(niveauCache);
            setFaillesEffectives(JSON.parse(faillesCache));
          } else {
            setNiveauEffectif(n);
            setFaillesEffectives(rep ? detecterFailles(JSON.parse(rep)) : []);
          }
        }
        setEtape(jourNum >= 40 ? ETAPES.FIN : ETAPES.PLAN);
        // Vérifier si action déjà réalisée aujourd'hui pour ce jour précis
        const today = new Date().toDateString();
        const lastActionDate = await AsyncStorage.getItem('plan_action_date');
        const lastActionJour = await AsyncStorage.getItem('plan_action_jour');
        if (lastActionDate === today && lastActionJour === String(jourNum)) {
          setActionRealisee(true);
        } else {
          setActionRealisee(false);
        }
      }
    } catch (e) { console.log(e); }
  };

  const changerEtape = (nouvelleEtape) => {
    setEtape(nouvelleEtape);
  };

  // ─── DIAGNOSTIC ─────────────────────────────────────────────────────────────
  const repondre = async (points) => {
    const q = DIAGNOSTIC_QUESTIONS[questionIndex];
    const nouvellesReponses = { ...reponses, [q.id]: points };
    setReponses(nouvellesReponses);
    if (questionIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      const total = Object.values(nouvellesReponses).reduce((a, b) => a + b, 0);
      const niv = calculerNiveau(total);
      const f = detecterFailles(nouvellesReponses);

      let niveauFinal = niv;
      let faillesFinales = f;

      try {
        console.log('=== Diagnostic terminé - niveau individuel:', niv);
        const result = await sauvegarderDiagnosticDuo(niv, f, nouvellesReponses);
        console.log('=== Résultat sauvegarderDiagnosticDuo:', JSON.stringify(result));
        if (result) {
          niveauFinal = result.niveau;
          faillesFinales = result.failles;
        }
      } catch (e) {
        console.log('sync diagnostic duo error:', e);
      }

      setScore(total);
      setNiveau(niveauFinal);
      setFailles(faillesFinales);
      changerEtape(ETAPES.RESULTAT);
    }
  };

  // ─── GÉNÉRATION CODE DUO ────────────────────────────────────────────────────
  const genererCodeDuo = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const random = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `NOOR-${random}`;
  };

  const choisirModeDuo = async () => {
    const code = genererCodeDuo();
    await AsyncStorage.setItem('plan_duo_code', code);
    setPlanDuoCode(code);
    setPlanMode('duo');
  };

  const partagerCodePlan = async () => {
    try {
      await Share.share({
        message: `Rejoins-moi pour notre plan conjugal de 40 jours 🤍\n\nCode : ${planDuoCode}\n\nTélécharge l'app : ${getAppStoreUrl()}`,
      });
    } catch (e) { console.log('Share error:', e); }
  };

  // ─── DÉMARRER LE PLAN ────────────────────────────────────────────────────────
  const demarrerPlan = async () => {
    const demarrerEffectivement = async () => {
      try {
        await AsyncStorage.multiSet([
          ['plan_niveau', niveau],
          ['plan_jour', '0'],
          ['plan_jours_valides', '[]'],
          ['plan_reponses', JSON.stringify(reponses)],
        ]);
        setPlanActif(niveau);
        setJourActuel(0);
        setJoursValides([]);
        changerEtape(ETAPES.PLAN);

        const ordreExistant = await AsyncStorage.getItem('questions_ordre');
        if (!ordreExistant) {
          const orderedIds = buildQuestionsOrder(failles);
          await AsyncStorage.setItem('questions_ordre', JSON.stringify(orderedIds));
        }

        try {
          await scheduleNotificationsPlan(niveau, 0, genre, failles);
        } catch (e) { console.log('scheduleNotificationsPlan error (demarrer):', e); }
      } catch (e) {
        console.log('Erreur demarrerPlan:', e);
        Alert.alert('Erreur', 'Impossible de démarrer le plan.');
      }
    };

    if (Platform.OS === 'web') { await demarrerEffectivement(); return; }

    const dejaAcceptee = await AsyncStorage.getItem('notif_plan_acceptee');
    if (dejaAcceptee === 'true') { await demarrerEffectivement(); return; }

    const { status } = await Notifications.getPermissionsAsync();
    if (status === 'granted') {
      await AsyncStorage.setItem('notif_plan_acceptee', 'true');
      await demarrerEffectivement();
      return;
    }

    Alert.alert(
      t('plan.notif_titre'),
      t('plan.notif_texte'),
      [
        {
          text: t('generic.pas_maintenant'),
          style: 'cancel',
          onPress: demarrerEffectivement,
        },
        {
          text: t('generic.autoriser'),
          onPress: async () => {
            const { status: s } = await Notifications.requestPermissionsAsync();
            await AsyncStorage.setItem('notif_plan_acceptee', s === 'granted' ? 'true' : 'false');
            await demarrerEffectivement();
          },
        },
      ]
    );
  };



  // ─── MARQUER ACTION RÉALISÉE ────────────────────────────────────────────────
  const marquerActionRealisee = async () => {
    try {
      const dateKey = new Date().toDateString();
      await AsyncStorage.multiSet([
        ['plan_action_date', dateKey],
        ['plan_action_jour', String(jourActuel)],
      ]);
      setActionRealisee(true);
    } catch (e) {
      console.log('Erreur marquerActionRealisee:', e);
    }
  };

  // ─── PASSER AU JOUR SUIVANT ──────────────────────────────────────────────────
  const passerJourSuivant = async () => {
    try {
      const nouveauxJoursValides = joursValides.includes(jourActuel)
        ? joursValides
        : [...joursValides, jourActuel];
      const nouveauJour = jourActuel + 1;
      await AsyncStorage.multiSet([
        ['plan_jour', String(nouveauJour)],
        ['plan_jours_valides', JSON.stringify(nouveauxJoursValides)],
      ]);
      setJoursValides(nouveauxJoursValides);
      setJourActuel(nouveauJour);
      setActionRealisee(false);
      if (nouveauJour >= 40) {
        changerEtape(ETAPES.FIN);
        try {
          await reactiverNotificationsGeneriques();
        } catch (e) { console.log('notif error:', e); }
      } else {
        try {
          await scheduleNotificationsPlan(niveau, nouveauJour, genre, failles);
        } catch (e) { console.log('notif error:', e); }
      }
    } catch (e) {
      console.log('Erreur passerJourSuivant:', e);
    }
  };

  // ─── RÉINITIALISER ───────────────────────────────────────────────────────────
  const reinitialiser = async () => {
    Alert.alert(
      'Recommencer ?',
      'Ton plan en cours sera supprimé et tu recommences le diagnostic.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Recommencer', style: 'destructive', onPress: async () => {
            await AsyncStorage.multiRemove([
              'plan_niveau', 'plan_jour', 'plan_jours_valides',
              'plan_reponses', 'plan_notif_jour', 'plan_notif_date', 'plan_duo_code',
              'questions_ordre', 'questions_diagnostic_fait',
            ]);
            setPlanActif(null); setNiveau(null); setFailles([]);
            setReponses({}); setScore(0); setQuestionIndex(0);
            setJourActuel(0); setJoursValides([]);
            setPlanMode(null); setPlanDuoCode('');
            changerEtape(ETAPES.ACCUEIL);
            try {
              await reactiverNotificationsGeneriques();
            } catch (e) { console.log('reactiverNotificationsGeneriques error:', e); }
          }
        }
      ]
    );
  };

  // ─── CONTENU DU JOUR ─────────────────────────────────────────────────────────
  const getContenuJour = () => {
    if (!planActif) return null;
    try {
      const info = getPlanJour(jourActuel, faillesPourBonus, niveauPourBonus || planActif);
      if (!info) return null;

      // Notifications du plan: NOTIF_PLAN[niveau][genre][jour] = { matin, soir }
      const notifBase = NOTIF_PLAN?.[planActif]?.[genre];
      const niveauLabel = NIVEAUX[planActif]?.label || planActif;

      if (info.type === 'bonus') {
        const bonusData = BONUS_MESSAGES?.[info.faille?.theme]?.[genre] || [];
        const msg = bonusData[info.jourBonus] || bonusData[0] || {};
        const faille = info.faille || {};
        return {
          type: 'bonus',
          faille,
          titreAction: `${faille.emoji || '🎯'} ${faille.label || 'Journée ciblée'}`,
          action: (langue === 'en'
            ? (msg.matinEN || msg.matin || '')
            : (msg.matin || '')).replace(/^🌅\s*/u, '') || 'Action du jour',
          rappelSoir: (langue === 'en' ? (msg.soirEN || msg.soir || 'Evening reminder') : (msg.soir || 'Rappel du soir')).replace(/^🌙\s*/u, ''),
          libelleMatin: `${faille.label || 'Bonus'} — Action du jour`,
          libelleSoir: `${faille.label || 'Bonus'} — Rappel du soir`,
          verset: null,
          psycho: null,
        };
      }

      const data = info.data || {};
      console.log('[DEBUG GENRE]', {
        jourActuel,
        genre,
        planActif,
        niveauPourBonus: niveauPourBonus || planActif,
        actionH_exists: !!data?.actionH,
        actionF_exists: !!data?.actionF,
        titreH_exists: !!data?.titreH,
        titreF_exists: !!data?.titreF,
        psychoH_exists: !!data?.psychoH,
        psychoF_exists: !!data?.psychoF,
      });
      // notif structure: { matin: "...", soir: "..." }
      const notif = notifBase?.[jourActuel] || {};
      const titreAction = genre === 'homme'
        ? (langue === 'en' ? (data.titreHEN || data.titreH) : data.titreH) || 'Action du jour'
        : (langue === 'en' ? (data.titreFEN || data.titreF) : data.titreF) || 'Action du jour';
      const action = genre === 'homme'
        ? (langue === 'en' ? (data.actionHEN || data.actionH) : data.actionH) || ''
        : (langue === 'en' ? (data.actionFEN || data.actionF) : data.actionF) || '';
      const rappelSoir = (langue === 'en' ? (notif.soirEN || notif.soir || '') : (notif.soir || '')).replace(/^🌙\s*/u, '');
      const notifMatin = (notif.matin || '').replace(/^🌅\s*/u, '');

      return {
        type: 'base',
        faille: null,
        titreAction,
        action: action || notifMatin || 'Consulte ton action du jour.',
        verset: langue === 'en' ? (data.versetEN || data.verset) : data.verset,
        psycho: (niveauPourBonus || planActif) === 'grave'
          ? (langue === 'en'
              ? (genre === 'femme' ? (data.psychoFEN || data.psychoF) : (data.psychoHEN || data.psychoH))
              : (genre === 'femme' ? data.psychoF : data.psychoH))
          : (langue === 'en' ? (data.psychoEN || data.psycho) : data.psycho),
        rappelSoir: rappelSoir || 'As-tu réalisé ton action du jour ?',
        libelleMatin: `${niveauLabel} — Action du jour`,
        libelleSoir: `${niveauLabel} — Rappel du soir`,
      };
    } catch (e) {
      console.log('getContenuJour error:', e);
      return null;
    }
  };

  const getNiveauInfo = (n) => {
    const base = NIVEAUX[n];
    if (!base) return null;
    return langue === 'en' ? {
      ...base,
      label: base.labelEN || base.label,
      titre: base.titreEN || base.titre,
      description: base.descriptionEN || base.description,
      encouragement: base.encouragementEN || base.encouragement,
    } : base;
  };

  const niveauInfo = niveau ? getNiveauInfo(niveau) : null;
  const niveauPourBonus = niveauEffectif || planActif;
  const faillesPourBonus = niveauPourBonus === 'grave'
    ? []
    : (faillesEffectives.length > 0 ? faillesEffectives : failles);
  const contenuJour = (etape === ETAPES.PLAN && planActif) ? getContenuJour() : null;

  if (loadingAcces) {
    return (
      <SafeAreaView style={[s.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!acces) return null;

  return (
    <SafeAreaView style={s.container}>
      <View style={{ flex: 1 }}>
        {/* ════════════ ACCUEIL ════════════ */}
        {etape === ETAPES.ACCUEIL && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
            <View style={s.heroWrap}>
              <Text style={s.heroEmoji}>🧭</Text>
              <Text style={s.heroTitle}>{t('plan.titre')}</Text>
              <Text style={s.heroSub}>{t('plan.description')}</Text>
            </View>



            <View style={{ paddingHorizontal: 18, marginBottom: 14 }}>
              <Text style={[s.cardTitle, { marginBottom: 8, paddingHorizontal: 0 }]}>{t('plan.les_3_niveaux')}</Text>
              {Object.entries(NIVEAUX).map(([key, niv]) => (
                <View key={key} style={[s.niveauItem, { backgroundColor: niv.couleurLight }]}>
                  <Text style={{ fontSize: 22 }}>{niv.emoji}</Text>
                  <View>
                    <Text style={[s.niveauLabel, { color: niv.couleur }]}>{langue === 'en' ? (niv.labelEN || niv.label) : niv.label}</Text>
                    <Text style={s.niveauDesc}>{langue === 'en' ? (niv.titreEN || niv.titre) : niv.titre}</Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[s.btn, { backgroundColor: COLORS.primary, marginHorizontal: 18 }]}
              onPress={() => { setQuestionIndex(0); setReponses({}); changerEtape(ETAPES.DIAGNOSTIC); }}
            >
              <Text style={s.btnTxt}>{t('plan.commencer_diagnostic')} →</Text>
            </TouchableOpacity>
            <Text style={s.note}>{t('plan.confidentialite')}</Text>
            <View style={{ height: 28 }} />
          </ScrollView>
        )}

        {/* ════════════ DIAGNOSTIC ════════════ */}
        {etape === ETAPES.DIAGNOSTIC && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 80 }}>
            <View style={s.progBar}>
              <View style={[s.progFill, { width: `${(questionIndex / DIAGNOSTIC_QUESTIONS.length) * 100}%` }]} />
            </View>
            <Text style={s.progLbl}>{t('plan.question')} {questionIndex + 1} / {DIAGNOSTIC_QUESTIONS.length}</Text>

            <View style={s.qCard}>
              <Text style={s.qNum}>Q{questionIndex + 1}</Text>
              <Text style={s.qTxt}>{langue === 'en' ? (DIAGNOSTIC_QUESTIONS[questionIndex].questionEN || DIAGNOSTIC_QUESTIONS[questionIndex].question) : DIAGNOSTIC_QUESTIONS[questionIndex].question}</Text>
            </View>

            {DIAGNOSTIC_QUESTIONS[questionIndex].options.map((opt, i) => (
              <TouchableOpacity
                key={i} style={s.optBtn}
                onPress={() => repondre(opt.points)}
                activeOpacity={0.75}
              >
                <View style={[s.optDot, { backgroundColor: ['#1B3A5C18', '#E8843A18', '#C0392B18'][i] }]}>
                  <Text style={[s.optDotTxt, { color: ['#1B3A5C', '#E8843A', '#C0392B'][i] }]}>{i + 1}</Text>
                </View>
                <Text style={s.optTxt}>{langue === 'en' ? (opt.texteEN || opt.texte) : opt.texte}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={s.backLink}
              onPress={() => questionIndex > 0 ? setQuestionIndex(questionIndex - 1) : changerEtape(ETAPES.ACCUEIL)}
            >
              <Text style={s.backLinkTxt}>{t('plan.retour')}</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ════════════ RÉSULTAT ════════════ */}
        {etape === ETAPES.RESULTAT && niveauInfo && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 80 }}>
            <Text style={s.resEmoji}>{niveauInfo.emoji}</Text>
            <Text style={[s.resNiveau, { color: niveauInfo.couleur }]}>{t('plan.resultat_titre')} : {getNiveauLabel(niveau)}</Text>
            <Text style={s.resTitre}>{niveauInfo.titre}</Text>

            <View style={[s.resDescCard, { borderLeftColor: niveauInfo.couleur }]}>
              <Text style={s.resDesc}>{niveauInfo.description}</Text>
            </View>
            <View style={[s.resEncour, { backgroundColor: niveauInfo.couleurLight }]}>
              <Text style={s.resEncourTxt}>{niveauInfo.encouragement}</Text>
            </View>

            {/* Sélection du mode */}
            {!planMode && (
              <View style={s.modeSelectWrap}>
                <Text style={s.modeSelectTitle}>{t('plan.choisir_mode')}</Text>
                <View style={s.modeBtnsRow}>
                  <TouchableOpacity style={s.modeSoloBtn} onPress={() => setPlanMode('solo')} activeOpacity={0.85}>
                    <Text style={{ fontSize: 28, marginBottom: 8 }}>🧭</Text>
                    <Text style={s.modeBtnLabel}>{t('plan.mode_solo')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.modeDuoBtn} onPress={choisirModeDuo} activeOpacity={0.85}>
                    <Text style={{ fontSize: 28, marginBottom: 8 }}>👫</Text>
                    <Text style={s.modeBtnLabel}>{t('plan.mode_duo')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}


            {/* Bouton démarrer (visible après choix du mode) */}
            {planMode && (
              <>
                <TouchableOpacity
                  style={[s.btn, { backgroundColor: niveauInfo.couleur, marginHorizontal: 0 }]}
                  onPress={demarrerPlan}
                >
                  <Text style={s.btnTxt}>🚀 {t('plan.demarrer')}</Text>
                </TouchableOpacity>
                {planMode === 'duo' && (
                  <TouchableOpacity style={s.soloFallbackLink} onPress={demarrerPlan}>
                    <Text style={s.soloFallbackTxt}>{t('plan.demarrer_seul')}</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            <TouchableOpacity style={s.backLink} onPress={() => { setQuestionIndex(0); setReponses({}); setPlanMode(null); setPlanDuoCode(''); changerEtape(ETAPES.DIAGNOSTIC); }}>
              <Text style={s.backLinkTxt}>{t('plan.refaire_diagnostic')}</Text>
            </TouchableOpacity>
            <View style={{ height: 28 }} />
          </ScrollView>
        )}

        {/* ════════════ PLAN ACTIF ════════════ */}
        {etape === ETAPES.PLAN && planActif && niveauInfo && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
            {/* Header coloré */}
            <View style={[s.planHdr, { backgroundColor: niveauInfo.couleur }]}>
              <View style={s.planHdrTop}>
                <View>
                  <Text style={s.planHdrTag}>Plan {getNiveauLabel(planActif)} · {genre === 'homme' ? t('onboarding.homme') : t('onboarding.femme')}</Text>
                  <Text style={s.planHdrJour}>{t('plan.jour')} {jourActuel + 1} / 40</Text>
                </View>
                <Text style={{ fontSize: 32 }}>{niveauInfo.emoji}</Text>
              </View>
              <View style={s.planProgBg}>
                <View style={[s.planProgFill, { width: `${Math.max(2, (jourActuel / 40) * 100)}%` }]} />
              </View>
              <Text style={s.planProgTxt}>{joursValides.length}/40 {t('plan.jours_completes')}</Text>
            </View>

            <View style={{ padding: 18 }}>
              {!contenuJour ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ fontSize: 48, marginBottom: 12 }}>🧭</Text>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 8 }}>{t('plan.chargement')}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.textSecondary, textAlign: 'center' }}>{t('plan.chargement_sous')}</Text>
                </View>
              ) : (
              <>
              {/* Badge bonus */}
              {contenuJour.type === 'bonus' && (
                <View style={[s.bonusBadge, { borderLeftColor: '#1B3A5C' }]}>
                  <Text style={s.bonusBadgeTitle}>
                    {contenuJour.faille?.emoji} {contenuJour.faille?.label || contenuJour.faille?.theme || t('plan.journee_ciblee')}
                  </Text>
                  <Text style={s.bonusBadgeTxt}>{t('plan.journee_ciblee_desc')}</Text>
                </View>
              )}

              <Text style={s.secLbl}>📅 {t('plan.action_jour')}</Text>

              {/* Carte notification matin */}
              <View style={[s.actionCard, { borderLeftColor: niveauInfo.couleur }]}>
                <View style={s.notifBadge}>
                  <Text style={s.notifLbl}>{t('plan.action_jour')}</Text>
                </View>
                <Text style={[s.actionTitre, { color: niveauInfo.couleur }]}>
                  {contenuJour.titreAction}
                </Text>
                <Text style={s.actionTxt}>{contenuJour.action}</Text>

                {contenuJour.verset ? (
                  <View style={s.versetBox}>
                    <Text style={s.versetLbl}>{t('plan.verset_hadith')}</Text>
                    <Text style={s.versetTxt}>{contenuJour.verset}</Text>
                  </View>
                ) : null}

                {contenuJour.psycho ? (
                  <View style={s.psychoBox}>
                    <Text style={s.psychoLbl}>{t('plan.apport_psycho')}</Text>
                    <Text style={s.psychoTxt}>{contenuJour.psycho}</Text>
                  </View>
                ) : null}
              </View>

              {/* Carte notification soir */}
              <View style={[s.actionCard, { borderLeftColor: COLORS.accent, backgroundColor: '#FDF6EC' }]}>
                <View style={s.notifBadge}>
                  <Text style={[s.notifLbl, { color: '#8B6914' }]}>{t('plan.rappel_soir')}</Text>
                </View>
                <Text style={[s.actionTitre, { color: COLORS.accent }]}>{t('plan.rappel_soir')}</Text>
                <Text style={[s.actionTxt, { fontStyle: 'italic', color: '#0F2240' }]}>
                  {contenuJour.rappelSoir}
                </Text>
              </View>

              {!actionRealisee ? (
                <TouchableOpacity
                  style={[s.btn, { backgroundColor: niveauInfo.couleur, marginHorizontal: 0 }]}
                  onPress={marquerActionRealisee}
                >
                  <Text style={s.btnTxt}>✅ {t('plan.realise')}</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <View style={[s.actionDoneBadge]}>
                    <Text style={s.actionDoneEmoji}>✅</Text>
                    <Text style={s.actionDoneTxt}>{t('plan.action_realisee')}</Text>
                  </View>
                  <TouchableOpacity
                    style={[s.btn, { backgroundColor: '#5A7A78', marginHorizontal: 0, marginTop: 10 }]}
                    onPress={passerJourSuivant}
                  >
                    <Text style={s.btnTxt}>{t('plan.passer_jour')} {jourActuel + 2} →</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Calendrier */}
              <Text style={s.secLbl}>📊 {t('plan.progression')}</Text>
              <View style={s.calGrid}>
                {Array.from({ length: 40 }, (_, i) => {
                  const dayInfo = getPlanJour(i, faillesPourBonus, niveauPourBonus || planActif);
                  const isBonus = dayInfo ? dayInfo.type === 'bonus' : false;
                  const isDone = joursValides.includes(i);
                  const isToday = i === jourActuel;
                  return (
                    <View key={i} style={[
                      s.calDay,
                      isDone && { backgroundColor: isBonus ? '#1B3A5C' : niveauInfo.couleur, borderColor: 'transparent' },
                      isToday && !isDone && { borderColor: niveauInfo.couleur, borderWidth: 2 },
                      isBonus && !isDone && { borderStyle: 'dashed', borderColor: '#1B3A5C' },
                    ]}>
                      <Text style={[s.calDayTxt, isDone && { color: '#fff' }]}>{i + 1}</Text>
                    </View>
                  );
                })}
              </View>

              <View style={s.calLegende}>
                <View style={s.calLegRow}>
                  <View style={[s.calLegDot, { backgroundColor: niveauInfo.couleur }]} />
                  <Text style={s.calLegTxt}>{t('plan.jour_base')}</Text>
                </View>
                {failles.length > 0 && (
                  <View style={s.calLegRow}>
                    <View style={[s.calLegDot, { backgroundColor: '#1B3A5C', borderWidth: 1, borderColor: '#1B3A5C' }]} />
                    <Text style={s.calLegTxt}>{t('plan.jour_cible')}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity style={s.resetBtn} onPress={reinitialiser}>
                <Text style={s.resetTxt}>🔄 {t('plan.reinitialiser')}</Text>
              </TouchableOpacity>
              <View style={{ height: 28 }} />
              </>
              )}
            </View>
          </ScrollView>
        )}

        {/* ════════════ FIN DES 40 JOURS ════════════ */}
        {etape === ETAPES.FIN && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
            <View style={[s.finHero, { backgroundColor: COLORS.primaryDark || '#0F2240' }]}>
              <Text style={s.finTrophee}>🏆</Text>
              <Text style={s.finTitle}>{t('plan.bravo')}</Text>
              <Text style={s.finArabic}>MashaAllah · بارك الله فيكم</Text>
              <View style={s.finMsgBox}>
                <Text style={s.finMsgTxt}>{t('plan.fin_message')}</Text>
              </View>
            </View>

            <View style={{ padding: 18 }}>
              <View style={[s.actionCard, { borderLeftColor: COLORS.accent, backgroundColor: '#FDF6EC' }]}>
                <Text style={[s.actionTxt, { fontStyle: 'italic', color: COLORS.text }]}>
                  "{t('plan.fin_verset')}"
                </Text>
                <Text style={[s.versetLbl, { color: COLORS.accent, marginTop: 6 }]}>{t('plan.fin_verset_ref')}</Text>
              </View>

              <Text style={s.finContiTitle}>{t('plan.fin_continuer')}</Text>
              <Text style={s.finContiSub}>{t('plan.fin_sous')}</Text>

              <TouchableOpacity
                style={[s.vignetteCard, { backgroundColor: '#EEF4FA', borderLeftColor: COLORS.primary }]}
                onPress={() => navigation.navigate('Discutons')}
                activeOpacity={0.85}
              >
                <Text style={s.vignetteEmoji}>💬</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.vignetteTitre}>{t('plan.fin_questions')}</Text>
                  <Text style={s.vignetteDesc}>{t('plan.fin_questions_desc')}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.vignetteCard, { backgroundColor: COLORS.primaryLight, borderLeftColor: COLORS.primary }]}
                onPress={reinitialiser}
                activeOpacity={0.85}
              >
                <Text style={s.vignetteEmoji}>🔄</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.vignetteTitre}>{t('plan.fin_nouveau')}</Text>
                  <Text style={s.vignetteDesc}>{t('plan.fin_nouveau_desc')}</Text>
                </View>
              </TouchableOpacity>

              <View style={s.finDuaBox}>
                <Text style={s.finDuaLbl}>{t('plan.fin_dua')}</Text>
                <Text style={s.finDuaArabic}>رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا</Text>
                <Text style={s.finDuaFr}>
                  "Notre Seigneur, accorde-nous de nos épouses et de notre descendance la joie des yeux."
                </Text>
                <Text style={[s.versetLbl, { color: COLORS.accent, marginTop: 4 }]}>— Coran 25:74</Text>
              </View>
              <View style={{ height: 28 }} />
            </View>
          </ScrollView>
        )}

      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Accueil
  heroWrap: { padding: 28, alignItems: 'center' },
  heroEmoji: { fontSize: 58, marginBottom: 12 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 8, textAlign: 'center' },
  heroSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 18, marginHorizontal: 18, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  infoTxt: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 19 },
  niveauItem: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, padding: 12, marginBottom: 8 },
  niveauLabel: { fontSize: 14, fontWeight: '700' },
  niveauDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  btn: { borderRadius: 999, padding: 16, alignItems: 'center', marginBottom: 10 },
  btnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  note: { textAlign: 'center', fontSize: 11, color: COLORS.textLight, paddingHorizontal: 24 },

  // Diagnostic
  progBar: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginBottom: 6 },
  progFill: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3 },
  progLbl: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'right', marginBottom: 20 },
  qCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  qNum: { fontSize: 11, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  qTxt: { fontSize: 16, fontWeight: '600', color: COLORS.text, lineHeight: 24 },
  optBtn: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  optDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optDotTxt: { fontSize: 13, fontWeight: '700' },
  optTxt: { flex: 1, fontSize: 14, color: COLORS.text, lineHeight: 21 },
  backLink: { alignItems: 'center', marginTop: 16, padding: 8 },
  backLinkTxt: { fontSize: 13, color: COLORS.textLight },

  // Résultat
  resEmoji: { fontSize: 60, textAlign: 'center', marginBottom: 8 },
  resNiveau: { fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  resTitre: { fontSize: 20, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 14 },
  resDescCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 12, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  resDesc: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
  resEncour: { borderRadius: 12, padding: 14, marginBottom: 14 },
  resEncourTxt: { fontSize: 13, color: COLORS.text, lineHeight: 20, fontStyle: 'italic' },
  faillesCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  faillesTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  failleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 7 },
  failleDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  failleTxt: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 18 },
  failleNote: { backgroundColor: COLORS.background, borderRadius: 8, padding: 9, marginTop: 6 },
  failleNoteTxt: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 16 },

  // Plan actif header
  planHdr: { padding: 24, paddingBottom: 18 },
  planHdrTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  planHdrTag: { fontSize: 11, color: 'rgba(255,255,255,.7)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  planHdrJour: { fontSize: 26, fontWeight: '800', color: '#fff' },
  planProgBg: { height: 7, backgroundColor: 'rgba(255,255,255,.25)', borderRadius: 4, marginBottom: 6 },
  planProgFill: { height: 7, backgroundColor: '#fff', borderRadius: 4 },
  planProgTxt: { fontSize: 11, color: 'rgba(255,255,255,.7)' },

  // Plan contenu
  secLbl: { fontSize: 11, fontWeight: '700', color: COLORS.text, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginTop: 4 },
  bonusBadge: { borderRadius: 12, padding: 12, marginBottom: 12, borderLeftWidth: 3, backgroundColor: '#EEF4FA' },
  bonusBadgeTitle: { fontSize: 11, fontWeight: '700', color: '#2D5A3D', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  bonusBadgeTxt: { fontSize: 12, color: COLORS.text, lineHeight: 18 },
  actionCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 12, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  notifBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(28,58,92,.08)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 10 },
  notifTime: { fontSize: 11, fontWeight: '700', color: '#1C3A5C' },
  notifSep: { fontSize: 11, color: '#1C3A5C' },
  notifLbl: { fontSize: 11, fontWeight: '700', color: '#1C3A5C' },
  actionTitre: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  actionTxt: { fontSize: 14, color: COLORS.text, lineHeight: 22, marginBottom: 8 },
  versetBox: { backgroundColor: '#FDF6EC', borderRadius: 10, padding: 10, marginBottom: 8 },
  versetLbl: { fontSize: 10, fontWeight: '700', color: COLORS.accent, marginBottom: 4 },
  versetTxt: { fontSize: 12, color: COLORS.text, fontStyle: 'italic', lineHeight: 18 },
  psychoBox: { backgroundColor: '#EEF4FA', borderRadius: 10, padding: 10 },
  psychoLbl: { fontSize: 10, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  psychoTxt: { fontSize: 12, color: COLORS.text, lineHeight: 18 },

  // Calendrier
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  calDay: { width: 36, height: 36, borderRadius: 8, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  calDayTxt: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },
  calLegende: { flexDirection: 'row', gap: 16, marginBottom: 18, flexWrap: 'wrap' },
  calLegRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  calLegDot: { width: 10, height: 10, borderRadius: 5 },
  calLegTxt: { fontSize: 11, color: COLORS.textSecondary },
  resetBtn: { borderWidth: 1.5, borderColor: '#ffcccc', borderRadius: 12, padding: 14, alignItems: 'center', backgroundColor: '#fff5f5' },
  resetTxt: { fontSize: 13, color: '#cc0000', fontWeight: '600' },
  actionDoneBadge: { backgroundColor: '#EEF4FA', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionDoneEmoji: { fontSize: 22 },
  actionDoneTxt: { flex: 1, fontSize: 13, fontWeight: '700', color: COLORS.primary, lineHeight: 19 },

  // Sélection mode plan
  modeSelectWrap: { marginBottom: 16 },
  modeSelectTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 12 },
  modeBtnsRow: { flexDirection: 'row', gap: 12 },
  modeSoloBtn: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 18,
    alignItems: 'center', borderWidth: 2, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  modeDuoBtn: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 18,
    alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  modeBtnLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text },

  // Code plan duo
  planCodeCard: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 20,
    alignItems: 'center', marginBottom: 14,
    borderWidth: 1.5, borderColor: COLORS.primary + '30',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  planCodeLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
  planCodeValue: { fontSize: 28, fontWeight: '800', color: COLORS.primary, letterSpacing: 3, marginBottom: 14 },
  planShareBtn: {
    backgroundColor: COLORS.primary, borderRadius: 999,
    paddingVertical: 11, paddingHorizontal: 22,
  },
  planShareBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // Option secondaire duo
  soloFallbackLink: { alignItems: 'center', paddingVertical: 12 },
  soloFallbackTxt: { fontSize: 13, color: COLORS.textLight, fontWeight: '500' },

  // Vignettes fin de plan
  vignetteCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 16, marginBottom: 12, borderLeftWidth: 4, gap: 14 },
  vignetteEmoji: { fontSize: 28 },
  vignetteTitre: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  vignetteDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },

  // Fin 40 jours
  finHero: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 22 },
  finTrophee: { fontSize: 64, marginBottom: 10 },
  finTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 6, textAlign: 'center' },
  finArabic: { fontSize: 15, color: 'rgba(255,255,255,.75)', fontStyle: 'italic', marginBottom: 16 },
  finMsgBox: { backgroundColor: 'rgba(255,255,255,.12)', borderRadius: 12, padding: 14 },
  finMsgTxt: { fontSize: 14, color: '#fff', textAlign: 'center', lineHeight: 22 },
  finContiTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  finContiSub: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 14, lineHeight: 19 },
  ctaCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  ctaIco: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  ctaTitre: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  ctaDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  finDuaBox: { backgroundColor: '#EEF4FA', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 10 },
  finDuaLbl: { fontSize: 11, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  finDuaArabic: { fontSize: 20, color: COLORS.primary, fontStyle: 'italic', marginBottom: 8, textAlign: 'center' },
  finDuaFr: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 20, textAlign: 'center' },
});
