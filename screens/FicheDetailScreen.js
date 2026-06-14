import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SIZES, RADIUS, SHADOW } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import BottomNavBar from '../components/BottomNavBar';

export default function FicheDetailScreen({ route, navigation }) {
  const { fiche } = route.params;
  const { t, langue } = useLanguage();

  const titre = langue === 'en' && fiche.titreEN ? fiche.titreEN : fiche.titre;
  const resume = langue === 'en' && fiche.resumeEN ? fiche.resumeEN : fiche.resume;

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Hero */}
          <View style={[styles.hero, { backgroundColor: fiche.couleur + '18' }]}>
            <Text style={styles.heroEmoji}>{fiche.emoji}</Text>
            <Text style={[styles.heroCat, { color: fiche.couleur }]}>{fiche.categorie}</Text>
            <Text style={styles.heroTitre}>{titre}</Text>
            <Text style={styles.heroResume}>{resume}</Text>
          </View>

          {/* Contenu */}
          <View style={styles.content}>
            {fiche.contenu.map((section, i) => (
              <View key={i} style={styles.section}>
                <View style={[styles.sectionBadge, { backgroundColor: fiche.couleur + '18' }]}>
                  <Text style={[styles.sectionTitre, { color: fiche.couleur }]}>{section.sousTitre}</Text>
                </View>
                <Text style={styles.sectionTexte}>{langue === 'en' ? (section.texteEN || section.texte) : section.texte}</Text>
              </View>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('fiches.footer')}</Text>
          </View>

          <View style={{ height: 48 }} />
        </ScrollView>
      </SafeAreaView>
      <BottomNavBar navigation={navigation} activeRoute="Accueil" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  hero: { padding: 28, alignItems: 'center' },
  heroEmoji: { fontSize: 64, marginBottom: 12 },
  heroCat: { fontSize: SIZES.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  heroTitre: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 8 },
  heroResume: { fontSize: SIZES.base, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  content: { padding: 20, gap: 24 },
  section: {},
  sectionBadge: { borderRadius: RADIUS.sm, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 12 },
  sectionTitre: { fontSize: SIZES.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionTexte: { fontSize: SIZES.base, color: COLORS.text, lineHeight: 28 },
  footer: { margin: 20, padding: 20, backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg, alignItems: 'center' },
  footerText: { fontSize: SIZES.sm, color: COLORS.primary, fontWeight: '600' },
});
