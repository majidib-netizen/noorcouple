import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, RADIUS, SHADOW } from '../constants/theme';
import { FICHES } from '../constants/data';
import { useLanguage } from '../context/LanguageContext';
import BottomNavBar from '../components/BottomNavBar';

const FICHES_AFFICHEES = FICHES.slice(0, 13);

export default function FichesScreen({ navigation }) {
  const { t, langue } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.titre}>{t('fiches.titre')}</Text>
          <Text style={styles.sous}>{t('fiches.sous_titre')}</Text>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: insets.bottom + 16 }}>
          {FICHES_AFFICHEES.map(fiche => (
            <TouchableOpacity
              key={fiche.id}
              style={styles.card}
              onPress={() => navigation.navigate('FicheDetail', { fiche })}
            >
              <View style={[styles.emojiBox, { backgroundColor: fiche.couleur + '18' }]}>
                <Text style={styles.emoji}>{fiche.emoji}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardCat, { color: fiche.couleur }]}>{fiche.categorie}</Text>
                <Text style={styles.cardTitre}>
                  {langue === 'en' && fiche.titreEN ? fiche.titreEN : fiche.titre}
                </Text>
                <Text style={styles.cardResume}>
                  {langue === 'en' && fiche.resumeEN ? fiche.resumeEN : fiche.resume}
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
          <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
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
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 16, gap: 14, ...SHADOW.sm },
  emojiBox: { width: 56, height: 56, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  emoji: { fontSize: 28 },
  cardContent: { flex: 1 },
  cardCat: { fontSize: SIZES.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  cardTitre: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  cardResume: { fontSize: SIZES.sm, color: COLORS.textSecondary, lineHeight: 18 },
  arrow: { fontSize: 24, color: COLORS.textLight },
});
