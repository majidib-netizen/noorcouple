import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, RADIUS, SHADOW } from '../constants/theme';
import { CONSEILS, HADITHS, DEFIS } from '../constants/data';
import { useLanguage } from '../context/LanguageContext';
import { joursEssaiRestants } from '../utils/access';
import { verifierDuoActif } from '../utils/duo';

const ProgressCard = ({ emoji, titre, sousTitre, pourcentage, badge, badgeColor, onPress, actionFaite, t }) => (
  <TouchableOpacity onPress={onPress} style={progStyles.card}>
    <View style={progStyles.top}>
      <Text style={progStyles.emoji}>{emoji}</Text>
      <View style={progStyles.info}>
        <View style={progStyles.titleRow}>
          <Text style={progStyles.titre}>{titre}</Text>
          <View style={[progStyles.badge, { backgroundColor: badgeColor + '20' }]}>
            <Text style={[progStyles.badgeTxt, { color: badgeColor }]}>{badge}</Text>
          </View>
        </View>
        <Text style={progStyles.sousTitre}>{sousTitre}</Text>
      </View>
      <Text style={progStyles.cta}>›</Text>
    </View>
    <View style={progStyles.barreContainer}>
      <View style={[progStyles.barre, { width: pourcentage + '%', backgroundColor: badgeColor }]} />
    </View>
    <View style={progStyles.bottom}>
      <Text style={progStyles.pourcentage}>{pourcentage}%</Text>
      {actionFaite !== undefined && (
        <Text style={{ fontSize: 11, color: actionFaite ? '#2E7D32' : COLORS.textLight }}>
          {actionFaite ? '✅ ' + t('accueil.action_faite') : '⭕ ' + t('accueil.action_a_faire')}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);

const progStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emoji: { fontSize: 26 },
  info: { flex: 1, gap: 2 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titre: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeTxt: {
    fontSize: 10,
    fontWeight: '700',
  },
  sousTitre: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  cta: {
    fontSize: 22,
    color: COLORS.textLight,
  },
  barreContainer: {
    height: 5,
    backgroundColor: COLORS.border,
    borderRadius: 999,
    overflow: 'hidden',
  },
  barre: {
    height: 5,
    borderRadius: 999,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pourcentage: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
});

export default function HomeScreen({ navigation }) {
  const { t, langue } = useLanguage();
  const insets = useSafeAreaInsets();
  const [genre, setGenre] = useState('homme');
  const [prenom, setPrenom] = useState('');
  const [conseils, setConseils] = useState([]);
  const [hadith, setHadith] = useState(null);
  const [joursRestants, setJoursRestants] = useState(null);
  const [planProgression, setPlanProgression] = useState(null);
  const [questionsProgression, setQuestionsProgression] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      chargerDonnees();
      chargerProgression();
    }, [])
  );

  const chargerDonnees = async () => {
    const g = await AsyncStorage.getItem('genre') || 'homme';
    const p = await AsyncStorage.getItem('prenom') || '';
    const jours = await joursEssaiRestants();
    const essaiDebut = await AsyncStorage.getItem('essai_debut');
    setGenre(g);
    setPrenom(p);
    if (essaiDebut) setJoursRestants(jours);

    const dayOfMonth = new Date().getDate();
    const list = CONSEILS[g] || CONSEILS.homme;
    setConseils([list[(dayOfMonth - 1) % list.length]]);
    setHadith(HADITHS[(dayOfMonth - 1) % HADITHS.length]);
  };

  const chargerProgression = async () => {
    const planNiveau = await AsyncStorage.getItem('plan_niveau');
    const planJour = await AsyncStorage.getItem('plan_jour');
    const planJoursValides = await AsyncStorage.getItem('plan_jours_valides');
    const actionDate = await AsyncStorage.getItem('plan_action_date');
    const actionJour = await AsyncStorage.getItem('plan_action_jour');
    const questionsStartDate = await AsyncStorage.getItem('questions_start_date');

    if (planNiveau && planJour) {
      const jour = parseInt(planJour) || 0;
      const valides = planJoursValides ? JSON.parse(planJoursValides) : [];
      const today = new Date().toDateString();
      const actionFaiteAujourdhui = actionDate === today && actionJour === planJour;
      setPlanProgression({
        niveau: planNiveau,
        jour: jour,
        joursValides: valides.length,
        actionFaiteAujourdhui,
        pourcentage: Math.round((valides.length / 40) * 100),
      });
    }

    if (questionsStartDate) {
      const debut = new Date(questionsStartDate);
      const maintenant = new Date();
      const jourActuel = Math.floor((maintenant - debut) / (1000 * 60 * 60 * 24)) + 1;

      const duoActif = await verifierDuoActif();

      setQuestionsProgression({
        jourActuel: Math.min(jourActuel, 360),
        pourcentage: Math.round((Math.min(jourActuel, 360) / 360) * 100),
        mode: duoActif ? 'duo' : 'solo',
      });
    }
  };

  const getGreeting = () => t('accueil.bonjour_matin');

  const conseil = conseils[0];
  const defi = DEFIS[0];
  const defaultName = genre === 'homme' ? t('accueil.frere') : t('accueil.soeur');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>{prenom || defaultName}</Text>
        </View>

        {/* Trial banner */}
        {joursRestants !== null && joursRestants <= 3 && (
          <TouchableOpacity
            style={styles.trialBanner}
            onPress={() => navigation.navigate('Paywall', { contexte: 'plan' })}
            activeOpacity={0.85}
          >
            <Text style={styles.trialBannerTxt}>
              {joursRestants === 0
                ? t('paywall.essai_fin')
                : `${t('paywall.essai_restant')}${joursRestants}`}
            </Text>
            <Text style={styles.trialBannerLink}>{t('paywall.en_savoir_plus')} →</Text>
          </TouchableOpacity>
        )}

        {/* Ma progression */}
        {(planProgression || questionsProgression) && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionLabel}>{t('accueil.ma_progression')}</Text>
            <View style={{ gap: 10 }}>
              {planProgression && (
                <ProgressCard
                  t={t}
                  emoji="🧭"
                  titre={t('accueil.mon_plan')}
                  sousTitre={langue === 'en'
                    ? 'Day ' + (planProgression.jour + 1) + ' of 40'
                    : 'Jour ' + (planProgression.jour + 1) + ' sur 40'}
                  pourcentage={planProgression.pourcentage}
                  badge={planProgression.niveau === 'leger'
                    ? (langue === 'en' ? 'Light' : 'Léger')
                    : planProgression.niveau === 'modere'
                    ? (langue === 'en' ? 'Moderate' : 'Modéré')
                    : (langue === 'en' ? 'Serious' : 'Grave')}
                  badgeColor={planProgression.niveau === 'leger'
                    ? COLORS.accent
                    : planProgression.niveau === 'modere'
                    ? '#C47B5A' : '#A03040'}
                  actionFaite={planProgression.actionFaiteAujourdhui}
                  onPress={() => navigation.navigate('Mon Plan')}
                />
              )}
              {questionsProgression && (
                <ProgressCard
                  t={t}
                  emoji="💬"
                  titre={t('accueil.question_jour')}
                  sousTitre={langue === 'en'
                    ? 'Day ' + questionsProgression.jourActuel + ' of 360'
                    : 'Jour ' + questionsProgression.jourActuel + ' sur 360'}
                  pourcentage={questionsProgression.pourcentage}
                  badge={questionsProgression.mode === 'duo' ? 'Duo' : 'Solo'}
                  badgeColor={COLORS.primary}
                  onPress={() => navigation.navigate('Discutons')}
                />
              )}
            </View>
          </View>
        )}

        {/* Vignettes Défi et Fiches côte à côte */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: COLORS.white,
              borderRadius: 14,
              padding: 14,
              borderWidth: 0.5,
              borderColor: COLORS.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 2,
              minHeight: 110,
            }}
            onPress={() => navigation.navigate('Défis')}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 24 }}>⭐</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text, marginTop: 8, marginBottom: 4 }}>
              {t('accueil.defi_semaine')}
            </Text>
            <Text style={{ fontSize: 11, color: COLORS.textSecondary }} numberOfLines={1}>
              {defi ? (langue === 'en' ? (defi.titreEN || defi.titre) : defi.titre) : ''}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: COLORS.white,
              borderRadius: 14,
              padding: 14,
              borderWidth: 0.5,
              borderColor: COLORS.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 2,
              minHeight: 110,
            }}
            onPress={() => navigation.navigate('Fiches')}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 24 }}>📚</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text, marginTop: 8, marginBottom: 4 }}>
              {t('accueil.fiches_conjugales')}
            </Text>
            <Text style={{ fontSize: 11, color: COLORS.textSecondary }} numberOfLines={1}>
              {t('accueil.fiches_desc')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hadith du jour */}
        {hadith && (
          <View style={[styles.card, styles.hadithCard]}>
            <Text style={styles.hadithTag}>📖 {t('accueil.hadith_jour')}</Text>
            <Text style={styles.hadithEmoji}>{hadith.emoji}</Text>
            <Text style={styles.hadithTexte}>
              "{langue === 'en' ? (hadith.texteEN || hadith.texte) : hadith.texte}"
            </Text>
            <Text style={styles.hadithSource}>— {hadith.source}</Text>
            <View style={styles.expliqBox}>
              <Text style={styles.expliqTexte}>
                {langue === 'en' ? (hadith.explicacionEN || hadith.explication) : hadith.explication}
              </Text>
            </View>
          </View>
        )}

        {/* Conseil du jour */}
        {conseil && (
          <View style={[styles.card, styles.conseilCard]}>
            <View style={styles.conseilHeader}>
              <Text style={styles.conseilEmoji}>{conseil.icone}</Text>
              <View>
                <Text style={styles.conseilTag}>{t('accueil.conseil_jour')}</Text>
                <Text style={styles.conseilSource}>{conseil.source}</Text>
              </View>
            </View>
            <Text style={styles.conseilTexte}>
              {langue === 'en' ? (conseil.texteEN || conseil.texte) : conseil.texte}
            </Text>

            <View style={styles.psychoBox}>
              <Text style={styles.psychoLabel}>{t('accueil.psychologie')}</Text>
              <Text style={styles.psychoTexte}>
                {langue === 'en' ? (conseil.psychoEN || conseil.psycho) : conseil.psycho}
              </Text>
            </View>

          </View>
        )}

        {/* Vignette Mode Crise */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ModeCrise')}
          activeOpacity={0.85}
          style={styles.criseCard}
        >
          <View style={styles.criseIconWrap}>
            <Text style={{ fontSize: 22 }}>🆘</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.criseTitre}>{t('accueil.mode_crise')}</Text>
            <Text style={styles.criseDesc}>{t('accueil.mode_crise_desc')}</Text>
          </View>
          <Text style={styles.criseCta}>›</Text>
        </TouchableOpacity>

        {/* Citation */}
        <View style={styles.quoteBox}>
          <Text style={styles.quoteArabic}>وَعَاشِرُوهُنَّ بِالْمَعْرُوفِ</Text>
          <Text style={styles.quoteFr}>"{t('accueil.citation_verset')}"</Text>
          <Text style={styles.quoteRef}>{t('accueil.citation_ref')}</Text>
        </View>

        <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, paddingHorizontal: 20 },
  header: { paddingTop: 24, paddingBottom: 20 },
  trialBanner: { backgroundColor: COLORS.accentLight, borderLeftWidth: 4, borderLeftColor: COLORS.accent, borderRadius: RADIUS.sm, padding: 12, marginBottom: 16 },
  trialBannerTxt: { fontSize: 13, color: COLORS.accent, fontWeight: '600' },
  trialBannerLink: { fontSize: 12, color: COLORS.accent, marginTop: 4 },
  greeting: { fontSize: SIZES.sm, color: COLORS.textSecondary },
  name: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text, marginTop: 2 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },

  card: { borderRadius: 14, marginBottom: 10, padding: 14, ...SHADOW.md },

  defiCard: { backgroundColor: COLORS.white, borderWidth: 0.5, borderColor: COLORS.border },
  defiTitre: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  defiNom: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  defiDuree: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginBottom: 6 },
  defiDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 20 },

  fichesCard: { backgroundColor: COLORS.white, borderWidth: 0.5, borderColor: COLORS.border },
  fichesTitre: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  fichesCount: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  fichesSub: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 20 },

  conseilCard: { backgroundColor: COLORS.white, borderWidth: 0.5, borderColor: COLORS.border },
  conseilHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  conseilEmoji: { fontSize: 26 },
  conseilTag: { fontSize: SIZES.xs, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1 },
  conseilSource: { fontSize: SIZES.xs, color: COLORS.textLight },
  conseilTexte: { fontSize: 14, color: COLORS.text, lineHeight: 22, marginBottom: 16 },
  psychoBox: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: 14 },
  psychoLabel: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  psychoTexte: { fontSize: 12, color: COLORS.text, lineHeight: 20 },

  hadithCard: { backgroundColor: COLORS.white, borderWidth: 0.5, borderColor: COLORS.border },
  hadithTag: { fontSize: SIZES.xs, fontWeight: '700', color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  hadithEmoji: { fontSize: 26, marginBottom: 10 },
  hadithTexte: { fontSize: 14, color: COLORS.text, fontStyle: 'italic', lineHeight: 24, marginBottom: 8 },
  hadithSource: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginBottom: 12 },
  expliqBox: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: 12 },
  expliqTexte: { fontSize: 12, color: COLORS.text, lineHeight: 20 },

  criseCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  criseIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  criseTitre: { fontSize: 14, fontWeight: '700', color: '#A03040', marginBottom: 3 },
  criseDesc: { fontSize: 12, color: '#7A3040', lineHeight: 17 },
  criseCta: { fontSize: 20, color: '#C06070' },

  quoteBox: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 24, alignItems: 'center', ...SHADOW.sm },
  quoteArabic: { fontSize: SIZES.lg, color: COLORS.primary, marginBottom: 8, fontStyle: 'italic' },
  quoteFr: { fontSize: SIZES.sm, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 4 },
  quoteRef: { fontSize: SIZES.xs, color: COLORS.accent, fontWeight: '700' },
});
