import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, ScrollView, Share, Alert, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, RADIUS, SHADOW } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { DIAGNOSTIC_QUESTIONS, calculerNiveau, detecterFailles } from '../constants/planData';
import { obtenirOuCreerCode, verifierDuoActif, sauvegarderDiagnosticDuo } from '../utils/duo';
import { supabase } from '../config/supabase';
import InscriptionScreen from './InscriptionScreen';
import PaywallScreen from './PaywallScreen';

const ETAPE = {
  BIENVENUE: 'bienvenue',
  INTENTION: 'intention',
  MODE_PLAN: 'mode_plan',
  DUO_QUESTIONS: 'duo_questions',
  INVITE_CODE: 'invite_code',
  REJOINDRE_CODE: 'rejoindre_code',
  DIAGNOSTIC: 'diagnostic',
  PAIEMENT: 'paiement',
  INSCRIPTION: 'inscription',
};

const STEP_NUMBER = {
  [ETAPE.INTENTION]: 1,
  [ETAPE.MODE_PLAN]: 2,
  [ETAPE.DUO_QUESTIONS]: 2,
  [ETAPE.INVITE_CODE]: 3,
  [ETAPE.REJOINDRE_CODE]: 3,
  [ETAPE.DIAGNOSTIC]: 4,
  [ETAPE.PAIEMENT]: 5,
};

export default function OnboardingScreen({ navigation, onDone }) {
  const { t, langue, changeLanguage } = useLanguage();
  const [etape, setEtape] = useState(ETAPE.BIENVENUE);
  const [intention, setIntention] = useState(null);
  const [modePlan, setModePlan] = useState(null);
  const [duoCode, setDuoCode] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [diagIndex, setDiagIndex] = useState(0);
  const [diagReponses, setDiagReponses] = useState({});
  const [loadingCode, setLoadingCode] = useState(false);
  const [prevEtape, setPrevEtape] = useState(null);

  useEffect(() => {
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale || '';
      changeLanguage(locale.startsWith('fr') || locale.startsWith('ar') ? 'fr' : 'en');
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (etape === ETAPE.INVITE_CODE) {
      obtenirOuCreerCode().then(setDuoCode);
    }
  }, [etape]);

  useEffect(() => {
    const verifierActivationDuo = async () => {
      const dejaConfirme = await AsyncStorage.getItem('duo_confirmation_affichee');
      if (dejaConfirme === 'true') return;

      const actif = await verifierDuoActif();
      if (actif) {
        const monCodeStored = await AsyncStorage.getItem('duo_code');
        const codeConjoint = await AsyncStorage.getItem('duo_code_conjoint');
        const code = monCodeStored || codeConjoint;

        const { data } = await supabase
          .from('duos')
          .select('initiateur, conjoint')
          .eq('code', code)
          .single();

        if (data) {
          Alert.alert(
            t('duo.actif_titre'),
            t('duo.actif_desc'),
            [{ text: 'OK' }]
          );
          await AsyncStorage.setItem('duo_confirmation_affichee', 'true');
        }
      }
    };
    verifierActivationDuo();
  }, []);

  const goTo = (e) => {
    setPrevEtape(etape);
    setEtape(e);
  };

  const goBack = () => {
    const backs = {
      [ETAPE.MODE_PLAN]: ETAPE.INTENTION,
      [ETAPE.DUO_QUESTIONS]: ETAPE.INTENTION,
      [ETAPE.INVITE_CODE]: intention === 'periode_delicate' ? ETAPE.MODE_PLAN : ETAPE.DUO_QUESTIONS,
      [ETAPE.REJOINDRE_CODE]: intention === 'periode_delicate' ? ETAPE.MODE_PLAN : ETAPE.DUO_QUESTIONS,
      [ETAPE.DIAGNOSTIC]: prevEtape || ETAPE.INTENTION,
      [ETAPE.PAIEMENT]: ETAPE.DIAGNOSTIC,
      [ETAPE.INSCRIPTION]: ETAPE.PAIEMENT,
    };
    setEtape(backs[etape] || ETAPE.INTENTION);
  };

  const finishOnboarding = async (target) => {
    try {
      await AsyncStorage.setItem('onboarding_intention', intention || '');
      await AsyncStorage.setItem('onboarding_format', target === 'plan' ? 'plan' : 'questions');
      await AsyncStorage.setItem('onboarded', 'true');
      if (typeof onDone === 'function') onDone(target);
    } catch (e) { console.log('Erreur finishOnboarding:', e); }
  };

  const explorerGratuitement = async () => {
    await AsyncStorage.setItem('onboarded', 'true');
    if (typeof onDone === 'function') onDone();
  };

  const stepNumber = STEP_NUMBER[etape];

  const renderProgress = () => {
    if (!stepNumber) return <View style={s.topBarSpacer} />;
    return (
      <View style={s.progressWrap}>
        {[1, 2, 3, 4, 5].map(n => (
          <View key={n} style={[s.progressSegment, n <= stepNumber && s.progressActive]} />
        ))}
      </View>
    );
  };

  const renderBack = () => {
    const noBack = [ETAPE.INTENTION];
    if (noBack.includes(etape)) return <View style={s.backPlaceholder} />;
    return (
      <TouchableOpacity onPress={goBack} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={s.backTxt}>←</Text>
      </TouchableOpacity>
    );
  };

  // ─── BIENVENUE ──────────────────────────────────────────────────────────────
  if (etape === ETAPE.BIENVENUE) {
    return (
      <SafeAreaView style={s.bienvenueContainer}>
        <View style={s.bienvenueTop}>
          <Image
            source={require('../assets/logo.png')}
            style={{
              width: 280,
              height: 140,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginBottom: 32,
              marginTop: 20,
            }}
          />
          <View style={s.langRow}>
            <TouchableOpacity
              style={langue === 'fr' ? s.langBtnActive : s.langBtnInactive}
              onPress={() => changeLanguage('fr')}
              activeOpacity={0.8}
            >
              <Text style={langue === 'fr' ? s.langBtnTxtActive : s.langBtnTxtInactive}>🇫🇷 Français</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={langue === 'en' ? s.langBtnActive : s.langBtnInactive}
              onPress={() => changeLanguage('en')}
              activeOpacity={0.8}
            >
              <Text style={langue === 'en' ? s.langBtnTxtActive : s.langBtnTxtInactive}>🇬🇧 English</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <View style={s.bienvenueFooter}>
          <TouchableOpacity
            style={s.bienvenueBtn}
            onPress={() => setEtape(ETAPE.INTENTION)}
            activeOpacity={0.85}
          >
            <Text style={s.bienvenueBtnTxt}>{t('onboarding.commencer')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.bienvenueExplorerBtn}
            onPress={explorerGratuitement}
            activeOpacity={0.7}
          >
            <Text style={s.bienvenueExplorerTxt}>{t('onboarding.decouvrir')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── INTENTION ──────────────────────────────────────────────────────────────
  if (etape === ETAPE.INTENTION) {
    const options = [
      { key: 'lien', emoji: '💚', titre: t('onboarding.intention_lien'), desc: t('onboarding.intention_lien_desc') },
      { key: 'periode_delicate', emoji: '🌧️', titre: t('onboarding.intention_periode'), desc: t('onboarding.intention_periode_desc') },
    ];
    return (
      <SafeAreaView style={s.container}>
        <View style={s.topBar}>
          {renderBack()}
          {renderProgress()}
        </View>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <Text style={s.stepTitle}>{t('onboarding.intention_titre')}</Text>
          <Text style={s.stepDesc}>{t('onboarding.intention_texte')}</Text>
          {options.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[s.selectCard, intention === opt.key && s.selectCardActive]}
              onPress={() => setIntention(opt.key)}
              activeOpacity={0.8}
            >
              <Text style={s.selectCardEmoji}>{opt.emoji}</Text>
              <View style={s.selectCardText}>
                <Text style={[s.selectCardTitle, intention === opt.key && s.selectCardTitleActive]}>{opt.titre}</Text>
                <Text style={s.selectCardDesc}>{opt.desc}</Text>
              </View>
              {intention === opt.key && <Text style={s.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={s.footer}>
          <TouchableOpacity
            style={[s.btn, !intention && s.btnDisabled]}
            disabled={!intention}
            onPress={async () => {
              if (intention === 'periode_delicate') {
                await AsyncStorage.setItem('onboarding_format', 'plan');
                goTo(ETAPE.MODE_PLAN);
              } else {
                await AsyncStorage.setItem('onboarding_format', 'questions');
                goTo(ETAPE.DUO_QUESTIONS);
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={s.btnTxt}>{t('generic.continuer')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── MODE PLAN ──────────────────────────────────────────────────────────────
  if (etape === ETAPE.MODE_PLAN) {
    const options = [
      { key: 'solo', emoji: '🧭', titre: t('onboarding.mode_solo'), desc: t('onboarding.mode_solo_desc') },
      { key: 'duo', emoji: '👫', titre: t('onboarding.mode_duo'), desc: t('onboarding.mode_duo_desc') },
    ];
    return (
      <SafeAreaView style={s.container}>
        <View style={s.topBar}>
          {renderBack()}
          {renderProgress()}
        </View>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <Text style={s.stepTitle}>{t('onboarding.mode_titre')}</Text>
          <Text style={s.stepDesc}>{t('onboarding.mode_texte')}</Text>
          {options.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[s.selectCard, modePlan === opt.key && s.selectCardActive]}
              onPress={() => setModePlan(opt.key)}
              activeOpacity={0.8}
            >
              <Text style={s.selectCardEmoji}>{opt.emoji}</Text>
              <View style={s.selectCardText}>
                <Text style={[s.selectCardTitle, modePlan === opt.key && s.selectCardTitleActive]}>{opt.titre}</Text>
                <Text style={s.selectCardDesc}>{opt.desc}</Text>
              </View>
              {modePlan === opt.key && <Text style={s.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={s.footer}>
          <TouchableOpacity
            style={[s.btn, !modePlan && s.btnDisabled]}
            disabled={!modePlan}
            onPress={() => {
              if (modePlan === 'solo') goTo(ETAPE.DIAGNOSTIC);
              else goTo(ETAPE.INVITE_CODE);
            }}
            activeOpacity={0.85}
          >
            <Text style={s.btnTxt}>{t('generic.continuer')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── DUO QUESTIONS ──────────────────────────────────────────────────────────
  if (etape === ETAPE.DUO_QUESTIONS) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.topBar}>
          {renderBack()}
          {renderProgress()}
        </View>
        <View style={s.scroll}>
          <Text style={s.stepTitle}>{t('onboarding.duo_titre')}</Text>
          <Text style={s.stepDesc}>{t('onboarding.duo_texte')}</Text>
          <TouchableOpacity
            style={[s.selectCard, s.selectCardActive]}
            onPress={() => goTo(ETAPE.INVITE_CODE)}
            activeOpacity={0.8}
          >
            <Text style={s.selectCardEmoji}>📨</Text>
            <View style={s.selectCardText}>
              <Text style={[s.selectCardTitle, s.selectCardTitleActive]}>{t('onboarding.duo_inviter')}</Text>
            </View>
            <Text style={s.arrowRight}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.selectCard}
            onPress={() => goTo(ETAPE.REJOINDRE_CODE)}
            activeOpacity={0.8}
          >
            <Text style={s.selectCardEmoji}>🔑</Text>
            <View style={s.selectCardText}>
              <Text style={s.selectCardTitle}>{t('onboarding.duo_deja_code')}</Text>
            </View>
            <Text style={s.arrowRight}>›</Text>
          </TouchableOpacity>
        </View>
        <View style={s.footer}>
          <TouchableOpacity
            style={s.secondaryBtn}
            onPress={async () => {
              await AsyncStorage.setItem('app_mode', 'solo');
              goTo(ETAPE.DIAGNOSTIC);
            }}
          >
            <Text style={s.secondaryTxt}>{t('onboarding.mode_solo')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── INVITE CODE ────────────────────────────────────────────────────────────
  if (etape === ETAPE.INVITE_CODE) {
    const shareCode = async () => {
      const msg = langue === 'fr'
        ? `Rejoins-moi sur NoorCouple avec le code : ${duoCode}`
        : `Join me on NoorCouple with the code: ${duoCode}`;
      try { await Share.share({ message: msg }); } catch (_) {}
    };
    const nextEtape = ETAPE.DIAGNOSTIC;
    return (
      <SafeAreaView style={s.container}>
        <View style={s.topBar}>
          {renderBack()}
          {renderProgress()}
        </View>
        <View style={s.inviteCenter}>
          <Text style={s.stepTitle}>{t('onboarding.invite_titre')}</Text>
          <Text style={s.stepDesc}>{t('onboarding.invite_texte')}</Text>
          <View style={s.codeBox}>
            <Text style={s.codeText}>{duoCode}</Text>
          </View>
          <View style={s.encadreInfo}>
            <Text style={s.encadreTitre}>{t('duo.comment_titre')}</Text>
            <Text style={s.encadreEtape}>{t('duo.etape_1')}</Text>
            <Text style={s.encadreEtape}>{t('duo.etape_2')}</Text>
            <Text style={s.encadreEtape}>{t('duo.etape_3')}</Text>
            <Text style={s.encadreValide}>{t('duo.etape_finale')}</Text>
          </View>
          <TouchableOpacity style={[s.btn, s.shareBtn]} onPress={shareCode} activeOpacity={0.85}>
            <Text style={s.btnTxt}>📤  {t('onboarding.partager_code')}</Text>
          </TouchableOpacity>
        </View>
        <View style={s.footer}>
          <TouchableOpacity
            style={s.btn}
            onPress={() => goTo(nextEtape)}
            activeOpacity={0.85}
          >
            <Text style={s.btnTxt}>{t('generic.continuer')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.secondaryBtn} onPress={() => goTo(ETAPE.REJOINDRE_CODE)}>
            <Text style={s.secondaryTxt}>{t('onboarding.duo_deja_code')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── REJOINDRE CODE ─────────────────────────────────────────────────────────
  if (etape === ETAPE.REJOINDRE_CODE) {
    const canJoin = codeInput.replace(/-/g, '').length >= 10;
    const nextEtape = ETAPE.DIAGNOSTIC;
    return (
      <SafeAreaView style={s.container}>
        <View style={s.topBar}>
          {renderBack()}
          {renderProgress()}
        </View>
        <View style={s.scroll}>
          <Text style={s.stepTitle}>{t('onboarding.rejoindre_titre')}</Text>
          <TextInput
            value={codeInput}
            onChangeText={(v) => setCodeInput(v.toUpperCase())}
            placeholder="NOOR-XXXXXX"
            placeholderTextColor={COLORS.textLight}
            style={s.input}
            autoCapitalize="characters"
            autoFocus
          />
        </View>
        <View style={s.footer}>
          <TouchableOpacity
            style={[s.btn, !canJoin && s.btnDisabled]}
            disabled={!canJoin}
            onPress={async () => {
              await AsyncStorage.setItem('duo_code_conjoint_pending', codeInput.trim().toUpperCase());
              goTo(nextEtape);
            }}
            activeOpacity={0.85}
          >
            <Text style={s.btnTxt}>{t('onboarding.rejoindre_btn')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── DIAGNOSTIC ─────────────────────────────────────────────────────────────
  if (etape === ETAPE.DIAGNOSTIC) {
    const q = DIAGNOSTIC_QUESTIONS[diagIndex];
    const progress = (diagIndex + 1) / DIAGNOSTIC_QUESTIONS.length;

    const repondre = async (points) => {
      const nouvellesReponses = { ...diagReponses, [q.id]: points };
      if (diagIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
        setDiagReponses(nouvellesReponses);
        setDiagIndex(diagIndex + 1);
      } else {
        try {
          const total = Object.values(nouvellesReponses).reduce((a, b) => a + b, 0);
          const niv = calculerNiveau(total);
          const f = detecterFailles(nouvellesReponses);
          await AsyncStorage.setItem('plan_reponses', JSON.stringify(nouvellesReponses));
          await AsyncStorage.setItem('plan_niveau', niv);
          await AsyncStorage.setItem('questions_diagnostic_fait', 'true');
          await sauvegarderDiagnosticDuo(niv, f, nouvellesReponses).catch(e =>
            console.log('Diag duo save error:', e)
          );
          const codePending = await AsyncStorage.getItem('duo_code_conjoint_pending');
          goTo(codePending ? ETAPE.INSCRIPTION : ETAPE.PAIEMENT);
        } catch (e) { console.log('Erreur diagnostic save:', e); }
      }
    };

    return (
      <SafeAreaView style={s.container}>
        <View style={s.topBar}>
          {renderBack()}
          {renderProgress()}
        </View>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <View style={s.diagProgBar}>
            <View style={[s.diagProgFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={s.diagProgLabel}>{diagIndex + 1} / {DIAGNOSTIC_QUESTIONS.length}</Text>

          <View style={s.diagCard}>
            <Text style={s.diagQTxt}>
              {langue === 'en' ? (q.questionEN || q.question) : q.question}
            </Text>
          </View>

          {q.options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={s.diagOpt}
              onPress={() => repondre(opt.points)}
              activeOpacity={0.8}
            >
              <View style={s.diagOptNum}>
                <Text style={s.diagOptNumTxt}>{i + 1}</Text>
              </View>
              <Text style={s.diagOptTxt}>
                {langue === 'en' ? (opt.texteEN || opt.texte) : opt.texte}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── PAIEMENT ───────────────────────────────────────────────────────────────
  if (etape === ETAPE.PAIEMENT) {
    return (
      <PaywallScreen
        navigation={navigation}
        route={{ params: {
          contexte: intention === 'periode_delicate' ? 'plan' : 'questions',
          onContinuer: () => goTo(ETAPE.INSCRIPTION),
          onFermer: () => goTo(ETAPE.DIAGNOSTIC),
        }}}
      />
    );
  }

  // ─── INSCRIPTION ────────────────────────────────────────────────────────────
  if (etape === ETAPE.INSCRIPTION) {
    return (
      <InscriptionScreen
        navigation={navigation}
        route={{ params: {} }}
        onDone={() => {
          finishOnboarding(intention === 'periode_delicate' ? 'plan' : 'questions');
        }}
      />
    );
  }

  return null;
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Top bar
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, gap: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  backTxt: { fontSize: 18, color: COLORS.text, fontWeight: '600' },
  backPlaceholder: { width: 36 },
  topBarSpacer: { flex: 1 },

  // Progress
  progressWrap: { flex: 1, flexDirection: 'row', gap: 6 },
  progressSegment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: COLORS.border },
  progressActive: { backgroundColor: COLORS.primary },

  // Scroll content
  scroll: { padding: 24, paddingTop: 16 },

  stepTitle: {
    fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text,
    marginBottom: 8, lineHeight: 32,
  },
  stepDesc: {
    fontSize: SIZES.sm, color: COLORS.textSecondary,
    marginBottom: 28, lineHeight: 22,
  },

  // Selection cards
  selectCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    borderWidth: 2, borderColor: COLORS.border,
    padding: 16, marginBottom: 12, gap: 14,
    ...SHADOW.sm,
  },
  selectCardActive: { borderColor: COLORS.primary },
  selectCardEmoji: { fontSize: 28 },
  selectCardText: { flex: 1 },
  selectCardTitle: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  selectCardTitleActive: { color: COLORS.primary },
  selectCardDesc: { fontSize: SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
  checkmark: { fontSize: SIZES.base, color: COLORS.primary, fontWeight: '700' },
  arrowRight: { fontSize: 22, color: COLORS.textLight },

  // Footer
  footer: { paddingHorizontal: 24, paddingBottom: 40, gap: 12 },

  // Buttons
  btn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: 16, alignItems: 'center',
  },
  btnDisabled: { backgroundColor: COLORS.border },
  btnTxt: { color: '#fff', fontSize: SIZES.base, fontWeight: '700' },
  secondaryBtn: { alignItems: 'center', paddingVertical: 8 },
  secondaryTxt: { fontSize: SIZES.sm, color: COLORS.textSecondary, fontWeight: '600' },

  // Bienvenue
  bienvenueContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  bienvenueTop: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 48 },
  langRow: { flexDirection: 'row', gap: 12 },
  langBtnActive: {
    backgroundColor: COLORS.primary, borderRadius: 999,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  langBtnInactive: {
    backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 999, paddingHorizontal: 20, paddingVertical: 10,
  },
  langBtnTxtActive: { color: '#fff', fontWeight: '600', fontSize: SIZES.sm },
  langBtnTxtInactive: { color: COLORS.textSecondary, fontWeight: '600', fontSize: SIZES.sm },
  bienvenueFooter: { paddingHorizontal: 24, paddingBottom: 40 },
  bienvenueBtn: { backgroundColor: COLORS.primary, borderRadius: 999, padding: 16, alignItems: 'center' },
  bienvenueBtnTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
  bienvenueExplorerBtn: { alignItems: 'center', marginTop: 16, paddingVertical: 8 },
  bienvenueExplorerTxt: { fontSize: 13, color: COLORS.textSecondary, textDecorationLine: 'underline' },

  // Invite code
  inviteCenter: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  codeBox: {
    backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg,
    paddingVertical: 28, alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.primary,
    marginVertical: 24,
  },
  codeText: { fontSize: 30, fontWeight: '700', color: COLORS.primary, letterSpacing: 3 },
  shareBtn: { marginBottom: 0 },

  // Join code input
  input: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    borderWidth: 2, borderColor: COLORS.primary,
    paddingHorizontal: 20, paddingVertical: 16,
    fontSize: SIZES.xl, color: COLORS.text, marginTop: 16,
    textAlign: 'center', letterSpacing: 3,
  },

  // Diagnostic
  diagProgBar: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginBottom: 6, overflow: 'hidden' },
  diagProgFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  diagProgLabel: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginBottom: 24, textAlign: 'right' },
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

  // Encadré info duo
  encadreInfo: { backgroundColor: COLORS.primaryLight, borderRadius: 12, padding: 16, marginVertical: 12, borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  encadreTitre: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginBottom: 10 },
  encadreEtape: { fontSize: 13, color: COLORS.text, lineHeight: 22, marginVertical: 2 },
  encadreValide: { fontSize: 13, fontWeight: '600', color: COLORS.success, marginTop: 8 },

});
