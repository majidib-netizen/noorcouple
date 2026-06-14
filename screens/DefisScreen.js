import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from '../components/BottomNavBar';
import { COLORS, SIZES, RADIUS, SHADOW } from '../constants/theme';
import { DEFIS } from '../constants/data';
import { useLanguage } from '../context/LanguageContext';
import { accesPremium } from '../utils/access';

const DIFF_COLORS = { Facile: '#1B3A5C', Moyen: '#C9A96E', Difficile: '#A05A7A' };

export default function DefisScreen({ navigation }) {
  const { t, langue } = useLanguage();
  const insets = useSafeAreaInsets();
  const [defiActif, setDefiActif] = useState(null);
  const [progression, setProgression] = useState({});
  const [jourActuel, setJourActuel] = useState(0);
  const [hasPremium, setHasPremium] = useState(false);
  const [loadingAcces, setLoadingAcces] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [d, p, j, premium] = await Promise.all([
      AsyncStorage.getItem('defi_actif'),
      AsyncStorage.getItem('defi_progression').then(v => JSON.parse(v || '{}')),
      AsyncStorage.getItem('defi_jour').then(v => parseInt(v || '0')),
      accesPremium(),
    ]);
    if (d) setDefiActif(d);
    setProgression(p);
    setJourActuel(j);
    setHasPremium(premium);
    setLoadingAcces(false);
  };

  const demarrerDefi = async (defi, index) => {
    if (index > 0 && !hasPremium) {
      navigation.navigate('Paywall', { contexte: 'defis' });
      return;
    }
    await AsyncStorage.setItem('defi_actif', defi.id);
    await AsyncStorage.setItem('defi_jour', '0');
    setDefiActif(defi.id);
    setJourActuel(0);
  };

  const validerJour = async () => {
    const defi = DEFIS.find(d => d.id === defiActif);
    if (!defi) return;
    const newJ = jourActuel + 1;
    await AsyncStorage.setItem('defi_jour', String(newJ));
    const newProg = { ...progression, [defiActif]: newJ };
    await AsyncStorage.setItem('defi_progression', JSON.stringify(newProg));
    setJourActuel(newJ);
    setProgression(newProg);
  };

  const abandonnerDefi = async () => {
    await AsyncStorage.removeItem('defi_actif');
    setDefiActif(null);
    setJourActuel(0);
  };

  const getDiffLabel = (diff) => {
    if (diff === 'Facile') return t('defis.facile');
    if (diff === 'Moyen') return t('defis.moyen');
    if (diff === 'Difficile') return t('defis.difficile');
    return diff;
  };

  const defiEnCours = DEFIS.find(d => d.id === defiActif);

  if (loadingAcces) {
    return (
      <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.titre}>{t('defis.titre')}</Text>
          <Text style={styles.sous}>{t('defis.sous_titre')}</Text>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: insets.bottom + 16 }}>

        {/* Défi en cours */}
        {defiEnCours && (
          <View style={styles.enCoursCard}>
            <Text style={styles.enCoursTag}>{t('defis.en_cours')}</Text>
            <Text style={styles.enCoursTitre}>
              {defiEnCours.emoji} {langue === 'en' ? (defiEnCours.titreEN || defiEnCours.titre) : defiEnCours.titre}
            </Text>

            <View style={styles.progressContainer}>
              {defiEnCours.jours.map((_, i) => (
                <View key={i} style={[styles.progressDot, i < jourActuel && styles.progressDotDone]} />
              ))}
            </View>
            <Text style={styles.progressText}>
              {jourActuel}/{defiEnCours.jours.length} {t('defis.jours_label')}
            </Text>

            {jourActuel < defiEnCours.jours.length ? (
              <View style={styles.jourBox}>
                <Text style={styles.jourLabel}>📅 {t('defis.aujourd_hui')} {jourActuel + 1}</Text>
                <Text style={styles.jourTexte}>
                  {langue === 'en'
                    ? (defiEnCours.joursEN?.[jourActuel] || defiEnCours.jours[jourActuel])
                    : defiEnCours.jours[jourActuel]}
                </Text>
                <TouchableOpacity style={styles.validerBtn} onPress={validerJour}>
                  <Text style={styles.validerText}>{t('defis.valider')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.completedBox}>
                <Text style={styles.completedEmoji}>🏆</Text>
                <Text style={styles.completedText}>{t('defis.accompli')}</Text>
                <TouchableOpacity style={styles.nouveauBtn} onPress={abandonnerDefi}>
                  <Text style={styles.nouveauText}>{t('defis.nouveau')}</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity onPress={abandonnerDefi}>
              <Text style={styles.abandonText}>{t('defis.abandonner')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Liste des défis */}
        <Text style={styles.sectionTitle}>
          {defiActif ? t('defis.autres') : t('defis.choisir')}
        </Text>

        {DEFIS.filter(d => d.id !== defiActif).map((defi, index) => {
          const globalIndex = DEFIS.findIndex(d => d.id === defi.id);
          const isLocked = globalIndex > 0 && !hasPremium;
          return (
          <TouchableOpacity
            key={defi.id}
            activeOpacity={isLocked ? 0.7 : 1}
            onPress={isLocked ? () => navigation.navigate('Paywall', { contexte: 'defis' }) : undefined}
          >
          <View style={[styles.card, isLocked && styles.cardLocked]}>
            {isLocked && (
              <View style={styles.lockOverlay}>
                <Text style={styles.lockEmoji}>🔒</Text>
              </View>
            )}
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>{defi.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitre}>
                  {langue === 'en' ? (defi.titreEN || defi.titre) : defi.titre}
                </Text>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardDuree}>⏱ {defi.duree}</Text>
                  <View style={[styles.diffBadge, { backgroundColor: DIFF_COLORS[defi.difficulte] + '20' }]}>
                    <Text style={[styles.diffText, { color: DIFF_COLORS[defi.difficulte] }]}>
                      {getDiffLabel(defi.difficulte)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.cardDesc}>
              {langue === 'en' ? (defi.descriptionEN || defi.description) : defi.description}
            </Text>

            <Text style={styles.joursTitre}>{t('defis.au_programme')}</Text>
            {defi.jours.slice(0, 2).map((j, i) => {
              const joursEN = defi.joursEN;
              const jourText = langue === 'en' ? (joursEN?.[i] || j) : j;
              return (
                <Text key={i} style={styles.joursPreview}>
                  • {t('plan.jour')} {i + 1} : {jourText.substring(0, 60)}...
                </Text>
              );
            })}

            {!defiActif && (
              <TouchableOpacity style={styles.demarrerBtn} onPress={() => demarrerDefi(defi, globalIndex)}>
                <Text style={styles.demarrerText}>{isLocked ? '🔒 ' : ''}{t('defis.demarrer')}</Text>
              </TouchableOpacity>
            )}
          </View>
          </TouchableOpacity>
          );
        })}

        <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
      <BottomNavBar navigation={navigation} activeRoute="Accueil" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  titre: { fontSize: SIZES.xxl, fontWeight: '700', color: COLORS.text },
  sous: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  scroll: { flex: 1 },
  sectionTitle: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.text },

  enCoursCard: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: 20 },
  enCoursTag: { fontSize: SIZES.xs, color: 'rgba(255,255,255,0.7)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  enCoursTitre: { fontSize: SIZES.lg, fontWeight: '700', color: '#fff', marginBottom: 16 },
  progressContainer: { flexDirection: 'row', gap: 6, marginBottom: 6, flexWrap: 'wrap' },
  progressDot: { width: 24, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  progressDotDone: { backgroundColor: COLORS.accent },
  progressText: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.8)', marginBottom: 16 },
  jourBox: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: RADIUS.md, padding: 16, marginBottom: 12 },
  jourLabel: { fontSize: SIZES.xs, color: 'rgba(255,255,255,0.7)', fontWeight: '700', marginBottom: 8 },
  jourTexte: { fontSize: SIZES.base, color: '#fff', lineHeight: 22, marginBottom: 14 },
  validerBtn: { backgroundColor: COLORS.accent, borderRadius: RADIUS.full, paddingVertical: 12, alignItems: 'center' },
  validerText: { color: '#fff', fontWeight: '700', fontSize: SIZES.sm },
  completedBox: { alignItems: 'center', padding: 20 },
  completedEmoji: { fontSize: 48, marginBottom: 8 },
  completedText: { fontSize: SIZES.lg, fontWeight: '700', color: '#fff', marginBottom: 16 },
  nouveauBtn: { backgroundColor: COLORS.accent, borderRadius: RADIUS.full, paddingVertical: 12, paddingHorizontal: 24 },
  nouveauText: { color: '#fff', fontWeight: '700' },
  abandonText: { color: 'rgba(255,255,255,0.5)', fontSize: SIZES.xs, textAlign: 'center', marginTop: 8 },

  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 20, ...SHADOW.sm, overflow: 'hidden' },
  cardLocked: { opacity: 0.75 },
  lockOverlay: { position: 'absolute', top: 12, right: 12, zIndex: 1 },
  lockEmoji: { fontSize: 20 },
  cardHeader: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  cardEmoji: { fontSize: 32 },
  cardTitre: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardDuree: { fontSize: SIZES.xs, color: COLORS.textSecondary },
  diffBadge: { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3 },
  diffText: { fontSize: SIZES.xs, fontWeight: '700' },
  cardDesc: { fontSize: SIZES.sm, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 12 },
  joursTitre: { fontSize: SIZES.xs, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  joursPreview: { fontSize: SIZES.sm, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 2 },
  demarrerBtn: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.full, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  demarrerText: { color: COLORS.primary, fontWeight: '700', fontSize: SIZES.sm },
});
