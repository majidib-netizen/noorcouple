import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Image, Linking, Alert, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, RADIUS, SHADOW } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../config/supabase';
import { aUnCompte, enregistrerPaiement } from '../utils/access';
import { getOfferings, purchasePackage, getExpirationInfo } from '../utils/revenuecat';

const TITRE_KEYS = {
  plan:      'paywall.titre_plan',
  duo:       'paywall.titre_duo',
  defis:     'paywall.titre_defis',
  questions: 'paywall.titre_questions',
};

const AVANTAGES = [
  'paywall.avantage1',
  'paywall.avantage2',
  'paywall.avantage3',
  'paywall.avantage4',
  'paywall.avantage5',
];

export default function PaywallScreen({ navigation, route }) {
  const { t } = useLanguage();
  const contexte = route?.params?.contexte || 'plan';
  const redirect = route?.params?.redirect;
  const onContinuer = route?.params?.onContinuer;
  const onFermer    = route?.params?.onFermer;

  const titre = t(TITRE_KEYS[contexte] || 'paywall.titre_plan');

  const [offerings, setOfferings] = useState(null);
  const [loadingOfferings, setLoadingOfferings] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [abonnementChoisi, setAbonnementChoisi] = useState('annuel');

  useEffect(() => {
    const charger = async () => {
      setLoadingOfferings(true);
      const off = await getOfferings();
      setOfferings(off);
      setLoadingOfferings(false);
    };
    charger();
  }, []);

  const packageAnnuel = offerings?.current?.annual || null;
  const packageMensuel = offerings?.current?.monthly || null;

  const packageSelectionne = () => (
    abonnementChoisi === 'annuel' ? packageAnnuel : packageMensuel
  );

  const goInscription = () => {
    navigation.navigate('Inscription', { redirect, isMainStack: true });
  };

  const goConnexion = () => {
    navigation.navigate('Connexion', { redirect, isMainStack: true });
  };

  const fermer = () => {
    if (onFermer) { onFermer(); return; }
    navigation.navigate('Main', { screen: 'Accueil' });
  };

  const acheter = async () => {
    const pkg = packageSelectionne();
    if (!pkg) {
      Alert.alert(
        t('paywall.erreur_titre') || 'Erreur',
        t('paywall.erreur_offre_indisponible') || 'Offre indisponible pour le moment, réessaie plus tard.'
      );
      return;
    }

    setPurchasing(true);
    const resultat = await purchasePackage(pkg);
    setPurchasing(false);

    if (resultat.userCancelled) return;

    if (!resultat.success) {
      Alert.alert(
        t('paywall.erreur_titre') || 'Erreur',
        resultat.network
          ? (t('paywall.erreur_reseau') || 'Problème de connexion. Vérifie ta connexion et réessaie.')
          : (t('paywall.erreur_generique') || 'Une erreur est survenue. Réessaie plus tard.')
      );
      return;
    }

    // Achat validé côté store : on n'empêche jamais l'utilisateur de continuer,
    // même si la synchro Supabase échoue (loggée seulement).
    try {
      const { expireAt, plan } = getExpirationInfo(resultat.customerInfo);
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email && expireAt) {
        await enregistrerPaiement(user.email, expireAt, plan);
      }
    } catch (e) {
      console.log('[PAYWALL] Erreur enregistrerPaiement (achat déjà validé, on continue):', e?.message || e);
    }

    if (onContinuer) onContinuer();
    else navigation.navigate('Main', { screen: 'Accueil' });
  };

  const demarrerEssai = async () => {
    const compte = await aUnCompte();
    if (!compte) {
      if (onContinuer) { onContinuer(); return; }
      goInscription();
      return;
    }
    await acheter();
  };

  const ouvrirCGU = async () => {
    const lang = await AsyncStorage.getItem('app_language');
    Linking.openURL(lang === 'en'
      ? 'https://noorcouple-legal.vercel.app/cgu-en.html'
      : 'https://noorcouple-legal.vercel.app/cgu-fr.html');
  };

  const ouvrirConfidentialite = async () => {
    const lang = await AsyncStorage.getItem('app_language');
    Linking.openURL(lang === 'en'
      ? 'https://noorcouple-legal.vercel.app/politique-confidentialite-en.html'
      : 'https://noorcouple-legal.vercel.app/politique-confidentialite-fr.html');
  };

  const prixAnnuel = packageAnnuel?.product?.priceString || '75 €';
  const prixMensuel = packageMensuel?.product?.priceString || '6,99 €';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={fermer} style={styles.closeBtn}>
            <Text style={styles.closeTxt}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={styles.logoWrap}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Titre */}
        <Text style={styles.titre}>{titre}</Text>
        <Text style={styles.sousTitre}>{t('paywall.sous_titre')}</Text>

        {/* Avantages */}
        <View style={styles.avantagesCard}>
          {AVANTAGES.map((key, i) => (
            <View key={i} style={styles.avantageRow}>
              <Text style={styles.avantageCheck}>✓</Text>
              <Text style={styles.avantageTxt}>{t(key)}</Text>
            </View>
          ))}
        </View>

        {/* Options tarifaires */}
        {loadingOfferings ? (
          <ActivityIndicator style={{ marginVertical: 20 }} color={COLORS.primary} />
        ) : (
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionCard, abonnementChoisi === 'annuel' && styles.optionSelectionnee]}
              onPress={() => setAbonnementChoisi('annuel')}
            >
              <View style={styles.badgeBest}>
                <Text style={styles.badgeBestTxt}>{t('paywall.meilleure_offre')}</Text>
              </View>
              <View style={styles.badgeEssai}>
                <Text style={styles.badgeEssaiTxt}>{t('paywall.essai_5j') || '7 jours offerts'}</Text>
              </View>
              <Text style={styles.optionTitre}>{t('paywall.annuel')}</Text>
              <Text style={styles.optionPrix}>{prixAnnuel}</Text>
              <Text style={styles.optionPeriode}>{t('paywall.par_an')}</Text>
              <Text style={styles.optionDetail}>{t('paywall.equivalent_mensuel')}</Text>
              <Text style={styles.optionEconomie}>{t('paywall.economie')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionCard, abonnementChoisi === 'mensuel' && styles.optionSelectionnee]}
              onPress={() => setAbonnementChoisi('mensuel')}
            >
              <View style={styles.badgeEssai}>
                <Text style={styles.badgeEssaiTxt}>{t('paywall.essai_5j') || '7 jours offerts'}</Text>
              </View>
              <Text style={styles.optionTitre}>{t('paywall.mensuel')}</Text>
              <Text style={styles.optionPrix}>{prixMensuel}</Text>
              <Text style={styles.optionPeriode}>{t('paywall.par_mois')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CTA principal */}
        <TouchableOpacity
          style={[styles.btnPrincipal, purchasing && styles.btnPrincipalDisabled]}
          onPress={demarrerEssai}
          disabled={purchasing}
        >
          {purchasing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.btnPrincipalTxt}>{t('paywall.demarrer_essai_5j') || 'Démarrer mon essai gratuit de 7 jours'}</Text>
              <Text style={styles.btnPrincipalSousTxt}>
                {(t('paywall.essai_puis') || 'Puis {prix} — annulable à tout moment').replace(
                  '{prix}',
                  abonnementChoisi === 'annuel' ? `${prixAnnuel}/an` : `${prixMensuel}/mois`
                )}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* CTA secondaire */}
        <TouchableOpacity style={styles.ctaSecondary} onPress={goConnexion}>
          <Text style={styles.ctaSecondaryTxt}>{t('paywall.cta_connexion')}</Text>
        </TouchableOpacity>

        {/* Mention paiement couple */}
        <View style={styles.coupleBadge}>
          <Text style={styles.coupleBadgeTxt}>{t('paywall.duo_partage')}</Text>
        </View>

        {/* Mention légale */}
        <Text style={styles.mentionLegale}>{t('paywall.renouvellement_auto')}</Text>

        <Text style={styles.mentionLegale}>
          <Text style={styles.lienLegal} onPress={ouvrirCGU}>{t('paywall.cgu') || 'CGU'}</Text>
          {' · '}
          <Text style={styles.lienLegal} onPress={ouvrirConfidentialite}>{t('paywall.confidentialite') || 'Politique de confidentialité'}</Text>
        </Text>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 24 },

  header: { alignItems: 'flex-end', marginBottom: 8 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  closeTxt: { fontSize: 16, color: COLORS.textSecondary, fontWeight: '600' },

  logoWrap: { alignItems: 'center', marginBottom: 28 },
  logo: { width: 120, height: 60 },

  titre: { fontSize: SIZES.xl, fontWeight: '800', color: COLORS.primary, textAlign: 'center', marginBottom: 10 },
  sousTitre: { fontSize: SIZES.sm, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 28 },

  avantagesCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginBottom: 20,
    ...SHADOW.sm,
  },
  avantageRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  avantageCheck: { fontSize: 16, color: COLORS.primary, fontWeight: '800', marginTop: 1 },
  avantageTxt: { flex: 1, fontSize: SIZES.sm, color: COLORS.text, fontWeight: '600', lineHeight: 20 },

  coupleBadge: {
    backgroundColor: COLORS.accentLight,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  coupleBadgeTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 18,
  },

  ctaPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    ...SHADOW.md,
  },
  ctaPrimaryTxt: { color: '#fff', fontSize: SIZES.base, fontWeight: '700' },

  ctaSecondary: {
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  ctaSecondaryTxt: { color: COLORS.accent, fontSize: SIZES.sm, fontWeight: '700' },

  prix: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    textAlign: 'center',
  },

  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20,
  },
  optionCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    position: 'relative',
  },
  optionSelectionnee: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  badgeBest: {
    position: 'absolute',
    top: -10,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeBestTxt: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionTitre: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionPrix: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 8,
  },
  optionPeriode: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  optionDetail: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  optionEconomie: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
    marginTop: 4,
  },
  btnPrincipal: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  btnPrincipalDisabled: {
    opacity: 0.7,
  },
  btnPrincipalTxt: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  btnPrincipalSousTxt: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  mentionLegale: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 14,
    marginTop: 8,
  },
  lienLegal: { color: COLORS.primary, textDecorationLine: 'underline' },
  badgeEssai: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeEssaiTxt: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
  },
});
