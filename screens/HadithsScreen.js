import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, RADIUS, SHADOW } from '../constants/theme';
import { HADITHS } from '../constants/data';

export default function HadithsScreen() {
  const [favoris, setFavoris] = useState([]);
  const [filtre, setFiltre] = useState('Tous');

  const toggleFavori = async (id) => {
    const current = [...favoris];
    const newFavs = current.includes(id) ? current.filter(f => f !== id) : [...current, id];
    setFavoris(newFavs);
    await AsyncStorage.setItem('favoris_hadiths', JSON.stringify(newFavs));
  };

  React.useEffect(() => {
    AsyncStorage.getItem('favoris_hadiths').then(v => {
      if (v) setFavoris(JSON.parse(v));
    });
  }, []);

  const displayed = filtre === 'Favoris' ? HADITHS.filter(h => favoris.includes(h.id)) : HADITHS;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.titre}>Hadiths du couple</Text>
        <Text style={styles.sous}>La sagesse prophétique pour ton mariage</Text>
      </View>

      <View style={styles.filtres}>
        {['Tous', 'Favoris'].map(f => (
          <TouchableOpacity key={f} style={[styles.filtreBtn, filtre === f && styles.filtreBtnActive]} onPress={() => setFiltre(f)}>
            <Text style={[styles.filtreText, filtre === f && styles.filtreTextActive]}>{f === 'Favoris' ? '❤️ Favoris' : f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16 }}>
        {displayed.map((h, i) => (
          <View key={h.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.numBadge}>
                <Text style={styles.numText}>{String(i + 1).padStart(2, '0')}</Text>
              </View>
              <Text style={styles.emoji}>{h.emoji}</Text>
              <TouchableOpacity onPress={() => toggleFavori(h.id)}>
                <Text style={styles.heart}>{favoris.includes(h.id) ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.texte}>"{h.texte}"</Text>
            <Text style={styles.source}>— {h.source}</Text>

            <View style={styles.expliqBox}>
              <Text style={styles.expliqLabel}>📖 Explication</Text>
              <Text style={styles.expliqTexte}>{h.explication}</Text>
            </View>
          </View>
        ))}

        {displayed.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🤍</Text>
            <Text style={styles.emptyText}>Aucun favori pour l'instant</Text>
            <Text style={styles.emptySubText}>Appuie sur 🤍 pour sauvegarder un hadith</Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  titre: { fontSize: SIZES.xxl, fontWeight: '700', color: COLORS.text },
  sous: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  filtres: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 4 },
  filtreBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  filtreBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filtreText: { fontSize: SIZES.sm, color: COLORS.textSecondary, fontWeight: '600' },
  filtreTextActive: { color: '#fff' },
  scroll: { flex: 1 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 20, ...SHADOW.md },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  numBadge: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.sm, paddingHorizontal: 10, paddingVertical: 4 },
  numText: { fontSize: SIZES.xs, fontWeight: '700', color: COLORS.primary },
  emoji: { fontSize: 28 },
  heart: { fontSize: 24 },
  texte: { fontSize: SIZES.base, color: COLORS.text, fontStyle: 'italic', lineHeight: 26, marginBottom: 8 },
  source: { fontSize: SIZES.sm, color: COLORS.accent, fontWeight: '700', marginBottom: 14 },
  expliqBox: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: 14 },
  expliqLabel: { fontSize: SIZES.xs, fontWeight: '700', color: COLORS.primary, marginBottom: 6 },
  expliqTexte: { fontSize: SIZES.sm, color: COLORS.text, lineHeight: 20 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  emptySubText: { fontSize: SIZES.sm, color: COLORS.textSecondary },
});
