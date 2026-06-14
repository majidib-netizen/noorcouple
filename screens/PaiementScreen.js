import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, Alert, ActivityIndicator, Linking
} from 'react-native';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, RADIUS, SHADOW } from '../constants/theme';

// ─── NOTE DÉVELOPPEUR ────────────────────────────────────────────────────────
// Pour les paiements réels sur mobile, tu as deux options :
// 1. In-App Purchase (Apple/Google) → via expo-in-app-purchases
// 2. Stripe → via un backend (Stripe nécessite un serveur)
//
// Pour commencer simplement, ce code simule le paiement.
// En production, remplace la fonction "simulerPaiement" par l'intégration réelle.
// ─────────────────────────────────────────────────────────────────────────────

export default function PaiementScreen() {
  const { user, userData, setUserData } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const avantages = [
    { emoji: '🌅', texte: 'Conseils du jour personnalisés (matin & soir)' },
    { emoji: '📖', texte: '8 fiches pratiques complètes' },
    { emoji: '💬', texte: '10 hadiths du couple avec explications' },
    { emoji: '⭐', texte: 'Défis hebdomadaires pour renforcer votre lien' },
    { emoji: '🔔', texte: 'Notifications push quotidiennes' },
    { emoji: '❤️', texte: 'Système de favoris' },
    { emoji: '🔄', texte: 'Mises à jour de contenu incluses' },
    { emoji: '🔒', texte: 'Données sécurisées & conformes RGPD' },
  ];

  // ⚠️ REMPLACE CETTE FONCTION par l'intégration In-App Purchase en production
  const simulerPaiement = async () => {
    setLoading(true);
    try {
      // Simule un délai de paiement
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Met à jour Firestore : l'utilisateur a payé
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      await supabase.from('users').update({
        appPayee: true,
        datePaiement: new Date().toISOString(),
        montantPaye: 3.99,
        devise: 'EUR',
      });

      setUserData({ ...userData, appPayee: true });
      Alert.alert('🎉 Paiement réussi !', 'Bienvenue sur NoorCouple ! Que Allah bénisse votre mariage.');
    } catch (e) {
      Alert.alert('Erreur', 'Le paiement a échoué. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  const ouvrirPolitiqueConfidentialite = () => {
    navigation.navigate('Confidentialite');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>NOORCOUPLE</Text>
          <Text style={styles.heroTitre}>NoorCouple</Text>
          <Text style={styles.heroSous}>نور — La sérénité dans ton foyer</Text>
        </View>

        {/* Prix */}
        <View style={styles.prixCard}>
          <Text style={styles.prixLabel}>Accès complet à vie</Text>
          <View style={styles.prixRow}>
            <Text style={styles.prix}>3,99€</Text>
            <Text style={styles.prixDetail}>paiement unique</Text>
          </View>
          <Text style={styles.prixNote}>Aucun abonnement · Aucune surprise</Text>
        </View>

        {/* Ce qui est inclus */}
        <Text style={styles.sectionTitle}>Ce qui est inclus :</Text>
        <View style={styles.avantagesCard}>
          {avantages.map((a, i) => (
            <View key={i} style={[styles.avantageRow, i > 0 && styles.avantageBorder]}>
              <Text style={styles.avantageEmoji}>{a.emoji}</Text>
              <Text style={styles.avantageTexte}>{a.texte}</Text>
            </View>
          ))}
        </View>

        {/* Bouton paiement */}
        <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={simulerPaiement} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>💳  Acheter pour 3,99€</Text>}
        </TouchableOpacity>

        {/* Garantie */}
        <View style={styles.garantieBox}>
          <Text style={styles.garantieEmoji}>🛡️</Text>
          <Text style={styles.garantieTexte}>Paiement sécurisé. Satisfait ou remboursé sous 7 jours.</Text>
        </View>

        {/* Mentions légales */}
        <Text style={styles.legal}>
          En achetant, tu confirms avoir lu et accepté nos{' '}
          <Text style={styles.legalLink}>CGU</Text> et notre{' '}
          <Text style={styles.legalLink}>politique de confidentialité</Text>.
          Ton email ({user?.email}) sera associé à cet achat.
        </Text>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 24 },
  hero: { alignItems: 'center', marginBottom: 28 },
  heroEmoji: { fontSize: 56, marginBottom: 8 },
  heroTitre: { fontSize: SIZES.xxxl, fontWeight: '700', color: COLORS.text },
  heroSous: { fontSize: SIZES.sm, color: COLORS.accent, fontStyle: 'italic', marginTop: 4 },

  prixCard: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: 24, alignItems: 'center', marginBottom: 24, ...SHADOW.md },
  prixLabel: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  prixRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  prix: { fontSize: 48, fontWeight: '800', color: '#fff' },
  prixDetail: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.7)' },
  prixNote: { fontSize: SIZES.xs, color: 'rgba(255,255,255,0.6)', marginTop: 8 },

  sectionTitle: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  avantagesCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 4, marginBottom: 24, ...SHADOW.sm },
  avantageRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  avantageBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
  avantageEmoji: { fontSize: 22 },
  avantageTexte: { flex: 1, fontSize: SIZES.sm, color: COLORS.text, lineHeight: 20 },

  btn: { backgroundColor: COLORS.accent, borderRadius: RADIUS.full, paddingVertical: 18, alignItems: 'center', marginBottom: 16, ...SHADOW.md },
  btnDisabled: { backgroundColor: COLORS.textLight },
  btnText: { color: '#fff', fontSize: SIZES.lg, fontWeight: '800' },

  garantieBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: 14, marginBottom: 20 },
  garantieEmoji: { fontSize: 22 },
  garantieTexte: { flex: 1, fontSize: SIZES.sm, color: COLORS.primary, lineHeight: 18 },

  legal: { fontSize: SIZES.xs, color: COLORS.textLight, textAlign: 'center', lineHeight: 18 },
  legalLink: { color: COLORS.primary, textDecorationLine: 'underline' },
});
