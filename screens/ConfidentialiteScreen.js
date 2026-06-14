import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SIZES, RADIUS } from '../constants/theme';

export default function ConfidentialiteScreen() {
  const sections = [
    {
      titre: "1. Responsable du traitement",
      contenu: `L'application NoorCouple est éditée par [TON NOM / NOM DE TA SOCIÉTÉ].

Contact : [TON EMAIL]
Adresse : [TON ADRESSE]`,
    },
    {
      titre: "2. Données collectées",
      contenu: `Lors de la création de ton compte, nous collectons :
• Ton prénom
• Ton adresse email
• Ton genre (homme/femme)
• La date et l'heure de création du compte
• Tes préférences de notifications
• Le statut de ton achat (payé/non payé)

Nous ne collectons pas : numéro de téléphone, adresse postale, données de localisation, données bancaires (gérées par Apple/Google).`,
    },
    {
      titre: "3. Finalité du traitement",
      contenu: `Tes données sont utilisées pour :
• Gérer ton compte et t'authentifier
• Personnaliser les conseils selon ton profil (homme/femme)
• T'envoyer des notifications (si tu les acceptes)
• Valider ton achat de l'application
• Améliorer l'application (statistiques anonymisées)`,
    },
    {
      titre: "4. Base légale",
      contenu: `Le traitement de tes données est basé sur :
• Ton consentement explicite (coché lors de l'inscription)
• L'exécution du contrat (achat de l'application)
• Nos obligations légales`,
    },
    {
      titre: "5. Durée de conservation",
      contenu: `Tes données sont conservées :
• Pendant toute la durée d'utilisation de l'application
• 3 ans maximum après ta dernière connexion
• Immédiatement supprimées si tu supprimes ton compte`,
    },
    {
      titre: "6. Tes droits (RGPD)",
      contenu: `Conformément au Règlement Général sur la Protection des Données (RGPD), tu as le droit de :

• Accéder à tes données personnelles
• Rectifier tes données inexactes
• Supprimer tes données ("droit à l'oubli")
• Limiter le traitement de tes données
• Portabilité de tes données
• Retirer ton consentement à tout moment

Pour exercer ces droits, contacte-nous à : [TON EMAIL]
Nous répondons sous 30 jours maximum.`,
    },
    {
      titre: "7. Hébergement & sécurité",
      contenu: `Tes données sont hébergées sur Firebase (Google Cloud), avec des serveurs en Europe.

Les mesures de sécurité incluent :
• Chiffrement des données en transit (HTTPS)
• Authentification sécurisée via Firebase Auth
• Accès limité aux données (principe du moindre privilège)`,
    },
    {
      titre: "8. Partage des données",
      contenu: `Nous ne vendons jamais tes données. Elles peuvent être partagées avec :
• Firebase/Google (hébergement technique)
• Apple ou Google (paiement in-app uniquement)

Aucun partage avec des tiers à des fins publicitaires.`,
    },
    {
      titre: "9. Cookies & traceurs",
      contenu: `L'application n'utilise pas de cookies. Les seules données locales stockées sur ton téléphone via AsyncStorage concernent tes préférences d'utilisation (pas de données personnelles identifiables).`,
    },
    {
      titre: "10. Contact & réclamation",
      contenu: `Pour toute question sur tes données :
Email : [TON EMAIL]

Tu as également le droit de déposer une réclamation auprès de la CNIL :
www.cnil.fr — 3, Place de Fontenoy, 75007 Paris`,
    },
    {
      titre: "11. Mise à jour de cette politique",
      contenu: `Cette politique peut être mise à jour. Tu seras informé(e) par notification en cas de changements importants. Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}.`,
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🔒</Text>
          <Text style={styles.titre}>Politique de confidentialité</Text>
          <Text style={styles.sous}>Conforme au RGPD · Application NoorCouple</Text>
        </View>

        <View style={styles.intro}>
          <Text style={styles.introTexte}>
            La protection de tes données personnelles est une priorité. Cette politique explique comment nous collectons, utilisons et protégeons tes informations.
          </Text>
        </View>

        {sections.map((s, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitre}>{s.titre}</Text>
            <Text style={styles.sectionTexte}>{s.contenu}</Text>
          </View>
        ))}

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, paddingHorizontal: 20 },
  header: { alignItems: 'center', paddingVertical: 28 },
  emoji: { fontSize: 48, marginBottom: 8 },
  titre: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  sous: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },
  intro: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg, padding: 16, marginBottom: 20 },
  introTexte: { fontSize: SIZES.sm, color: COLORS.primary, lineHeight: 22 },
  section: { marginBottom: 20, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 16 },
  sectionTitre: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.primary, marginBottom: 10 },
  sectionTexte: { fontSize: SIZES.sm, color: COLORS.text, lineHeight: 22 },
});
