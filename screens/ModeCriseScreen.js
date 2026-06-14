import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Animated,
} from 'react-native';
import { COLORS, SIZES, RADIUS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

const PHASES = [
  { key: 'inspire', color: '#1B3A5C', toValue: 1.4, duration: 4000 },
  { key: 'retiens', color: '#C9A96E', toValue: 1.4, duration: 7000 },
  { key: 'expire',  color: '#90A4AE', toValue: 0.7, duration: 8000 },
];

const CONSEILS_DATA = [
  {
    emoji: '💧',
    fr: "Fais wudu. L'eau apaise la colère — c'est la sunnah du Prophète ﷺ",
    en: "Perform wudu. Water soothes anger — it is the sunnah of the Prophet ﷺ",
  },
  {
    emoji: '🤲',
    fr: "Dis Astaghfirullah 3 fois. Reviens à Allah avant de répondre.",
    en: "Say Astaghfirullah 3 times. Return to Allah before responding.",
  },
  {
    emoji: '🚶',
    fr: "Change de pièce ou de position. Si tu es debout, assieds-toi. Si tu es assis, allonge-toi.",
    en: "Change rooms or position. If standing, sit down. If sitting, lie down.",
  },
];

const DHIKR_LIST = [
  { ar: 'سُبْحَانَ اللّٰهِ', latin: 'SubhanAllah', target: 33 },
  { ar: 'الْحَمْدُ لِلّٰهِ', latin: 'Alhamdulillah', target: 33 },
  { ar: 'اللّٰهُ أَكْبَرُ', latin: 'Allahu Akbar', target: 33 },
];

export default function ModeCriseScreen({ navigation }) {
  const { t, langue } = useLanguage();
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [showDhikr, setShowDhikr] = useState(false);
  const [dhikrCounts, setDhikrCounts] = useState([0, 0, 0]);
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const isRunning = useRef(false);

  useEffect(() => {
    return () => {
      isRunning.current = false;
      scaleAnim.stopAnimation();
    };
  }, []);

  const startBreathing = () => {
    isRunning.current = true;
    setRunning(true);
    runPhase(0);
  };

  const stopBreathing = () => {
    isRunning.current = false;
    setRunning(false);
    scaleAnim.stopAnimation();
    scaleAnim.setValue(0.7);
    setPhaseIndex(0);
  };

  const runPhase = (index) => {
    if (!isRunning.current) return;
    const phase = PHASES[index];
    setPhaseIndex(index);

    const anim = phase.key === 'retiens'
      ? Animated.delay(phase.duration)
      : Animated.timing(scaleAnim, {
          toValue: phase.toValue,
          duration: phase.duration,
          useNativeDriver: true,
        });

    anim.start(({ finished }) => {
      if (finished && isRunning.current) {
        runPhase((index + 1) % PHASES.length);
      }
    });
  };

  const incrementDhikr = (i) => {
    setDhikrCounts(prev => {
      const next = [...prev];
      if (next[i] < DHIKR_LIST[i].target) next[i] += 1;
      return next;
    });
  };

  const phase = PHASES[phaseIndex];
  const phaseLabel = {
    inspire: t('crise.inspire'),
    retiens: t('crise.retiens'),
    expire:  t('crise.expire'),
  }[phase.key];

  return (
    <SafeAreaView style={s.container}>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backTxt}>← {t('crise.retour')}</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>🆘 {t('crise.titre')}</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Message principal */}
        <Text style={s.message}>{t('crise.message')}</Text>
        <Text style={s.sousMessage}>{t('crise.sous_message')}</Text>

        {/* Exercice respiration */}
        <Text style={s.sectionTitle}>{t('crise.respiration_478')}</Text>
        <View style={s.breathWrap}>
          <Animated.View style={[
            s.breathOuter,
            { backgroundColor: phase.color + '30', transform: [{ scale: scaleAnim }] },
          ]}>
            <View style={[s.breathInner, { borderColor: phase.color, backgroundColor: phase.color + '20' }]}>
              <Text style={[s.breathLabel, { color: phase.color }]}>
                {running ? phaseLabel : '···'}
              </Text>
            </View>
          </Animated.View>
        </View>

        {!running ? (
          <TouchableOpacity style={s.commencerBtn} onPress={startBreathing} activeOpacity={0.85}>
            <Text style={s.commencerTxt}>▶ {t('crise.commencer')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={s.arreterBtn} onPress={stopBreathing} activeOpacity={0.85}>
            <Text style={s.arreterTxt}>■ {t('crise.arreter')}</Text>
          </TouchableOpacity>
        )}

        {/* Verset */}
        <View style={s.versetCard}>
          <Text style={s.versetTxt}>"{t('crise.verset')}"</Text>
          <Text style={s.versetRef}>— {t('crise.verset_ref')}</Text>
        </View>

        {/* 3 conseils */}
        <Text style={s.sectionTitle}>{t('crise.conseils_titre')}</Text>
        {CONSEILS_DATA.map((c, i) => (
          <View key={i} style={s.conseilCard}>
            <Text style={s.conseilEmoji}>{c.emoji}</Text>
            <Text style={s.conseilTxt}>{langue === 'en' ? c.en : c.fr}</Text>
          </View>
        ))}

        {/* Bouton Dhikr */}
        <TouchableOpacity
          style={s.dhikrBtn}
          onPress={() => setShowDhikr(!showDhikr)}
          activeOpacity={0.85}
        >
          <Text style={s.dhikrBtnTxt}>
            {showDhikr ? '✕  ' : '🌿  '}{t('crise.dhikr')}
          </Text>
        </TouchableOpacity>

        {showDhikr && (
          <View style={s.dhikrCard}>
            {DHIKR_LIST.map((d, i) => (
              <TouchableOpacity
                key={i}
                style={[s.dhikrRow, i < 2 && s.dhikrSep]}
                onPress={() => incrementDhikr(i)}
                activeOpacity={0.7}
              >
                <Text style={s.dhikrAr}>{d.ar}</Text>
                <Text style={s.dhikrLatin}>{d.latin}</Text>
                <View style={[s.dhikrCounter, dhikrCounts[i] >= d.target && s.dhikrCounterDone]}>
                  <Text style={[s.dhikrCountTxt, dhikrCounts[i] >= d.target && s.dhikrCountTxtDone]}>
                    {dhikrCounts[i]} / {d.target}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setDhikrCounts([0, 0, 0])}
              style={s.resetDhikrBtn}
            >
              <Text style={s.resetDhikrTxt}>↺ Réinitialiser</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bouton retour discret */}
        <TouchableOpacity style={s.retourBtn} onPress={() => navigation.goBack()}>
          <Text style={s.retourTxt}>← {t('crise.retour')}</Text>
        </TouchableOpacity>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F7F4' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#E0EDE9',
    backgroundColor: '#F9F7F4',
  },
  backBtn: { paddingVertical: 6, paddingHorizontal: 4, minWidth: 70 },
  backTxt: { fontSize: SIZES.sm, color: COLORS.primary, fontWeight: '600' },
  headerTitle: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.text },

  scroll: { padding: 24, paddingTop: 28 },

  message: {
    fontSize: 20, fontWeight: '700', color: COLORS.primary,
    textAlign: 'center', lineHeight: 30, marginBottom: 10,
  },
  sousMessage: {
    fontSize: SIZES.sm, color: COLORS.textSecondary,
    textAlign: 'center', fontStyle: 'italic', marginBottom: 32,
  },

  sectionTitle: {
    fontSize: SIZES.xs, fontWeight: '700', color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.9,
    marginBottom: 16, marginTop: 8,
  },

  // Respiration
  breathWrap: {
    alignItems: 'center', justifyContent: 'center',
    height: 220, marginBottom: 20,
  },
  breathOuter: {
    width: 150, height: 150, borderRadius: 75,
    alignItems: 'center', justifyContent: 'center',
  },
  breathInner: {
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 2.5,
    alignItems: 'center', justifyContent: 'center',
  },
  breathLabel: {
    fontSize: SIZES.base, fontWeight: '700', textAlign: 'center',
  },
  commencerBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: 14, alignItems: 'center', marginBottom: 32,
  },
  commencerTxt: { color: '#fff', fontSize: SIZES.base, fontWeight: '700' },
  arreterBtn: {
    borderWidth: 1.5, borderColor: COLORS.textLight, borderRadius: RADIUS.full,
    paddingVertical: 13, alignItems: 'center', marginBottom: 32,
  },
  arreterTxt: { color: COLORS.textSecondary, fontSize: SIZES.base, fontWeight: '600' },

  // Verset
  versetCard: {
    backgroundColor: '#FDF6E3', borderRadius: RADIUS.lg,
    padding: 20, marginBottom: 28,
    borderLeftWidth: 4, borderLeftColor: '#C9A96E',
  },
  versetTxt: {
    fontSize: SIZES.base, color: COLORS.text,
    fontStyle: 'italic', lineHeight: 26, marginBottom: 10,
  },
  versetRef: { fontSize: SIZES.xs, color: '#C9A96E', fontWeight: '700' },

  // Conseils
  conseilCard: {
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    padding: 16, flexDirection: 'row', gap: 14,
    alignItems: 'flex-start', marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  conseilEmoji: { fontSize: 26, marginTop: 1 },
  conseilTxt: {
    flex: 1, fontSize: SIZES.sm, color: COLORS.text,
    lineHeight: 22,
  },

  // Dhikr bouton
  dhikrBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: 14, alignItems: 'center',
    marginTop: 8, marginBottom: 12,
  },
  dhikrBtnTxt: { color: '#fff', fontSize: SIZES.base, fontWeight: '700' },

  // Dhikr card
  dhikrCard: {
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    paddingHorizontal: 8, paddingTop: 4, paddingBottom: 12,
    marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  dhikrRow: {
    alignItems: 'center', paddingVertical: 18, paddingHorizontal: 8,
  },
  dhikrSep: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  dhikrAr: {
    fontSize: 22, color: COLORS.primary,
    marginBottom: 4, textAlign: 'center',
  },
  dhikrLatin: {
    fontSize: SIZES.base, fontWeight: '700',
    color: COLORS.text, marginBottom: 10,
  },
  dhikrCounter: {
    paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  dhikrCounterDone: {
    borderColor: '#1B3A5C', backgroundColor: '#1B3A5C18',
  },
  dhikrCountTxt: {
    fontSize: SIZES.sm, fontWeight: '700', color: COLORS.textSecondary,
  },
  dhikrCountTxtDone: { color: '#1B3A5C' },
  resetDhikrBtn: { alignItems: 'center', paddingVertical: 10, marginTop: 4 },
  resetDhikrTxt: { fontSize: SIZES.xs, color: COLORS.textLight },

  // Retour
  retourBtn: { alignItems: 'center', paddingVertical: 12, marginTop: 4 },
  retourTxt: { fontSize: SIZES.sm, color: COLORS.textLight },
});
