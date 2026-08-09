import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert, ActivityIndicator, Image, Linking,
} from 'react-native';
import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, RADIUS, SHADOW } from '../constants/theme';
import { rejoindreAvecCode, sauvegarderCodeDuoSupabase, sauvegarderDiagnosticDuo } from '../utils/duo';
import { detecterFailles } from '../constants/planData';
import { useLanguage } from '../context/LanguageContext';

const DOMAINES_JETABLES = [
  'mailinator.com', 'yopmail.com', 'tempmail.com', '10minutemail.com',
  'guerrillamail.com', 'throwawaymail.com', 'temp-mail.org', 'sharklasers.com',
  'getnada.com', 'mailnesia.com', 'mytemp.email', 'mohmal.com', 'maildrop.cc',
  'mintemail.com', 'tempinbox.com', 'trashmail.com', 'dispostable.com',
  'spam4.me', 'emailondeck.com', 'tempmailaddress.com', 'mailcatch.com',
  'fakeinbox.com', 'mailexpire.com', 'mail-temporaire.fr', 'jetable.org',
  'moakt.com', 'mvrht.com', 'throwam.com', 'armyspy.com', 'cuvox.de',
  'dayrep.com', 'einrot.com', 'fleckens.hu', 'gustr.com', 'jourrapide.com',
  'rhyta.com', 'superrito.com', 'teleworm.us',
];

export default function InscriptionScreen({ navigation, route, onDone }) {
  const { t } = useLanguage();
  const redirect = route?.params?.redirect;
  const isMainStack = route?.params?.isMainStack;
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [mdpConfirm, setMdpConfirm] = useState('');
  const [genre, setGenre] = useState('');
  const [consentRgpd, setConsentRgpd] = useState(false);
  const [consentCgu, setConsentCgu] = useState(false);
  const [trancheAge, setTrancheAge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMdp, setShowMdp] = useState(false);

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

  const valider = async () => {
    // 1. Champs vides
    if (!prenom.trim()) {
      return Alert.alert(
        t('auth.erreur_titre') || 'Champ manquant',
        t('auth.prenom_requis') || 'Merci de renseigner ton prénom.'
      );
    }

    if (!email.trim()) {
      return Alert.alert(
        t('auth.erreur_titre') || 'Champ manquant',
        t('auth.email_requis') || 'Merci de renseigner ton adresse email.'
      );
    }

    // 2. Format email valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return Alert.alert(
        t('auth.erreur_titre') || 'Email invalide',
        t('auth.email_format_invalide') || "Format d'email invalide. Vérifie ta saisie."
      );
    }

    const domaineEmail = email.trim().split('@')[1]?.toLowerCase();
    if (domaineEmail && DOMAINES_JETABLES.includes(domaineEmail)) {
      return Alert.alert(
        t('auth.erreur_titre') || 'Email invalide',
        t('auth.email_domaine_refuse') || "Cet email n'est pas accepté. Utilise ton email principal (pas d'email jetable)."
      );
    }

    // 3. Mot de passe
    if (!mdp) {
      return Alert.alert(
        t('auth.erreur_titre') || 'Mot de passe manquant',
        t('auth.mdp_requis') || 'Merci de choisir un mot de passe.'
      );
    }

    if (mdp.length < 8) {
      return Alert.alert(
        t('auth.erreur_titre') || 'Mot de passe trop court',
        t('auth.mdp_trop_court') || 'Le mot de passe doit contenir au moins 8 caractères'
      );
    }

    if (!/[a-zA-Z]/.test(mdp)) {
      return Alert.alert(
        t('auth.erreur_titre') || 'Mot de passe invalide',
        t('auth.mdp_regle_lettre') || 'Le mot de passe doit contenir au moins 1 lettre'
      );
    }

    if (!/[0-9]/.test(mdp)) {
      return Alert.alert(
        t('auth.erreur_titre') || 'Mot de passe invalide',
        t('auth.mdp_regle_chiffre') || 'Le mot de passe doit contenir au moins 1 chiffre'
      );
    }

    if (mdp !== mdpConfirm) {
      return Alert.alert(
        t('auth.erreur_titre') || 'Erreur',
        'Les mots de passe ne correspondent pas.'
      );
    }

    // 4. Genre
    if (!genre) {
      return Alert.alert(
        t('auth.erreur_titre') || 'Profil manquant',
        t('auth.genre_requis') || 'Merci de sélectionner ton profil (homme ou femme).'
      );
    }

    // 5. Consentements
    if (!consentRgpd) {
      return Alert.alert(
        t('auth.erreur_titre') || 'Consentement requis',
        t('auth.rgpd_requis') || "Merci d'accepter la politique de confidentialité pour continuer."
      );
    }

    if (!consentCgu) {
      return Alert.alert(
        t('auth.erreur_titre') || 'Consentement requis',
        t('auth.cgu_requis') || "Merci d'accepter les conditions générales d'utilisation pour continuer."
      );
    }

    setLoading(true);
    try {
      // 1. Créer le compte Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: mdp,
        options: { data: { prenom: prenom.trim(), genre } },
      });

      console.log('SignUp result:', JSON.stringify({ user: authData?.user?.id, error: authError }));

      if (authError) {
        let messageErreur = authError.message;

        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          messageErreur = t('auth.email_existant') || 'Cette adresse email est déjà utilisée. Connecte-toi avec ton mot de passe ou utilise une autre adresse.';
        } else if (authError.message.toLowerCase().includes('password')) {
          messageErreur = t('auth.mdp_invalide_detail') || 'Ton mot de passe doit contenir au moins 8 caractères, 1 lettre et 1 chiffre';
        } else if (authError.message.includes('Email')) {
          messageErreur = t('auth.email_format') || "L'adresse email semble invalide. Vérifie-la et réessaye.";
        } else if (authError.message.includes('network') || authError.message.includes('fetch')) {
          messageErreur = t('auth.erreur_reseau') || 'Pas de connexion internet. Vérifie ta connexion et réessaye.';
        }

        Alert.alert(t('auth.erreur_titre') || "Erreur d'inscription", messageErreur);
        setLoading(false);
        return;
      }

      if (!authData?.user) {
        console.log('Pas d\'utilisateur retourné');
        Alert.alert(t('generic.erreur'), t('auth.erreur_compte'));
        setLoading(false);
        return;
      }

      // 2. Créer le profil dans la table users
      const { data: profileData, error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: email.trim().toLowerCase(),
          prenom: prenom.trim(),
          genre,
          app_payee: false,
          consent_rgpd: true,
          consent_rgpd_date: new Date().toISOString(),
          consent_cgu: true,
          consent_cgu_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          ...(trancheAge ? { tranche_age: trancheAge } : {}),
        })
        .select();

      console.log('Insert profile result:', JSON.stringify({ data: profileData, error: dbError }));

      if (dbError) {
        console.log('ERREUR INSERT users:', dbError.message);
        Alert.alert(t('generic.erreur'), 'Compte créé mais profil incomplet: ' + dbError.message);
      }

      // 3. Sync code duo en attente vers Supabase
      const codeDuoPending = await AsyncStorage.getItem('duo_pending_save')
        || await AsyncStorage.getItem('duo_code');
      if (codeDuoPending) {
        await sauvegarderCodeDuoSupabase(codeDuoPending);
      }

      // 4. Sauvegarder les données locales
      await AsyncStorage.setItem('genre', genre);
      await AsyncStorage.setItem('user_email', email.trim().toLowerCase());
      await AsyncStorage.setItem('prenom', prenom.trim());

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: mdp,
      });

      if (signInError) {
        Alert.alert(
          t('auth.compte_cree_titre'),
          t('auth.compte_cree_msg'),
          [{ text: t('generic.ok'), onPress: () => navigation.navigate('Connexion', { redirect, isMainStack }) }]
        );
        return;
      }

      // Rejoindre le duo après session active (session requise par rejoindreAvecCode)
      const codePending = await AsyncStorage.getItem('duo_code_conjoint_pending');
      if (codePending) {
        const resultDuo = await rejoindreAvecCode(codePending);
        if (resultDuo.succes) {
          await AsyncStorage.removeItem('duo_code_conjoint_pending');
          try {
            const { data: duoData } = await supabase.from('duos').select('paiement_valide, expire_at').eq('code', codePending).single();
            if (duoData?.paiement_valide) {
              await AsyncStorage.setItem('duo_partenaire_paye', 'true');
              if (duoData.expire_at) await AsyncStorage.setItem('duo_partenaire_expire_at', duoData.expire_at);
            }
          } catch (_) {}
        } else {
          const titres = {
            invalide: t('duo.code_invalide'),
            complet: t('duo.code_complet_titre'),
            expire: t('duo.code_expire_titre'),
          };
          const messages = {
            invalide: t('duo.code_invalide_desc'),
            complet: t('duo.code_complet_desc'),
            expire: t('duo.code_expire_desc'),
          };
          Alert.alert(
            titres[resultDuo.erreur] || t('duo.code_invalide'),
            (messages[resultDuo.erreur] || t('duo.code_invalide_desc')) + '\n\n' + t('duo.code_relancer')
          );
        }
      }

      // 5. Re-sync diagnostic vers Supabase (session active, genre disponible)
      const planNiveau = await AsyncStorage.getItem('plan_niveau');
      const planReponsesStr = await AsyncStorage.getItem('plan_reponses');
      if (planNiveau && planReponsesStr) {
        const planReponses = JSON.parse(planReponsesStr);
        await sauvegarderDiagnosticDuo(planNiveau, detecterFailles(planReponses), planReponses).catch(() => {});
      }

      await AsyncStorage.setItem('onboarded', 'true');
      if (typeof onDone === 'function') {
        // Cas onboarding : InscriptionScreen est rendu en JSX par OnboardingScreen
        // (pas via ce Stack Navigator), Paywall n'y est pas enregistré comme écran.
        // L'utilisateur atterrit sur HomeScreen (libre d'accès) puis se fait
        // rediriger vers Paywall automatiquement par le garde-fou de l'onglet
        // premium qu'il tente d'ouvrir (Mon Plan / Discutons / etc.).
        onDone();
      } else {
        // Comptes créés depuis l'app principale (Profil, Paywall, Connexion) :
        // redirection directe vers Paywall, sans repasser par l'écran d'inscription.
        navigation.reset({ index: 0, routes: [{ name: 'Paywall', params: { contexte: 'plan' } }] });
      }
    } catch (e) {
      Alert.alert(t('generic.erreur'), t('auth.erreur_impossible'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Image
            source={require('../assets/logo.png')}
            style={{
              width: 160,
              height: 80,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginTop: 20,
              marginBottom: 16,
            }}
          />
          <Text style={styles.titre}>{t('auth.titre_inscription')}</Text>
        </View>

        <View style={styles.form}>
          {/* Prénom */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.label_prenom')}</Text>
            <TextInput style={styles.input} value={prenom} onChangeText={setPrenom}
              placeholder={t('auth.placeholder_prenom')} placeholderTextColor={COLORS.textLight} />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.label_email')}</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail}
              placeholder="ton@email.com" placeholderTextColor={COLORS.textLight}
              keyboardType="email-address" autoCapitalize="none" />
          </View>

          {/* Genre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.label_profil')}</Text>
            <View style={styles.genreRow}>
              <TouchableOpacity
                style={[styles.genreBtn, genre === 'homme' && styles.genreActif]}
                onPress={() => setGenre('homme')}
              >
                <Text style={[styles.genreTxt, genre === 'homme' && styles.genreTxtActif]}>{t('auth.genre_homme')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genreBtn, genre === 'femme' && { ...styles.genreActif, borderColor: COLORS.femme, backgroundColor: COLORS.femme }]}
                onPress={() => setGenre('femme')}
              >
                <Text style={[styles.genreTxt, genre === 'femme' && styles.genreTxtActif]}>{t('auth.genre_femme')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mot de passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.label_mdp')}</Text>
            <View style={styles.mdpRow}>
              <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]}
                value={mdp} onChangeText={setMdp}
                placeholder={t('auth.placeholder_mdp')} placeholderTextColor={COLORS.textLight}
                secureTextEntry={!showMdp} />
              <TouchableOpacity onPress={() => setShowMdp(!showMdp)} style={{ padding: 10 }}>
                <Text>{showMdp ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.mdpRegle}>{t('auth.mdp_regle')}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.label_mdp_confirm')}</Text>
            <TextInput style={styles.input} value={mdpConfirm} onChangeText={setMdpConfirm}
              placeholder="••••••••" placeholderTextColor={COLORS.textLight}
              secureTextEntry={!showMdp} />
          </View>

          {/* Consentements RGPD */}
          <View style={styles.checkRow}>
            <TouchableOpacity onPress={() => setConsentRgpd(!consentRgpd)}>
              <View style={[styles.checkbox, consentRgpd && styles.checkboxActif]}>
                {consentRgpd && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
            <Text style={styles.checkLabel}>
              {t('auth.consent_rgpd')}{' '}
              <Text style={styles.lienLegal} onPress={ouvrirConfidentialite}>
                {t('auth.consent_rgpd_lien')}
              </Text>
            </Text>
          </View>

          <View style={styles.checkRow}>
            <TouchableOpacity onPress={() => setConsentCgu(!consentCgu)}>
              <View style={[styles.checkbox, consentCgu && styles.checkboxActif]}>
                {consentCgu && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
            <Text style={styles.checkLabel}>
              {t('auth.consent_cgu')}{' '}
              <Text style={styles.lienLegal} onPress={ouvrirCGU}>{t('auth.consent_cgu_lien')}</Text>
            </Text>
          </View>

          {/* Tranche d'âge (facultatif) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.label_tranche_age')}</Text>
            <View style={styles.trancheRow}>
              {['18-24', '25-34', '35-44', '45-54', '55+'].map((tranche) => (
                <TouchableOpacity
                  key={tranche}
                  style={[styles.trancheChip, trancheAge === tranche && styles.trancheChipActif]}
                  onPress={() => setTrancheAge(trancheAge === tranche ? null : tranche)}
                >
                  <Text style={[styles.trancheTxt, trancheAge === tranche && styles.trancheTxtActif]}>{tranche}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={valider} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{t('auth.btn_creer')}</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.connexionBtn} onPress={() => navigation.navigate(isMainStack ? 'Connexion' : 'ConnexionOnboarding')}>
            <Text style={styles.connexionText}>
              {t('auth.deja_compte')} <Text style={{ color: COLORS.primary, fontWeight: '700' }}>{t('auth.se_connecter')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  titre: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  form: {},
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: { backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: 14, fontSize: 15, color: COLORS.text, borderWidth: 1.5, borderColor: COLORS.border },
  mdpRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mdpRegle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  genreRow: { flexDirection: 'row', gap: 12 },
  genreBtn: { flex: 1, borderRadius: RADIUS.md, padding: 14, alignItems: 'center', borderWidth: 2, borderColor: COLORS.border, backgroundColor: COLORS.white },
  genreActif: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  genreTxt: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  genreTxtActif: { color: '#fff' },
  trancheRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  trancheChip: { borderRadius: RADIUS.full, paddingVertical: 10, paddingHorizontal: 16, borderWidth: 2, borderColor: COLORS.border, backgroundColor: COLORS.white },
  trancheChipActif: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  trancheTxt: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  trancheTxtActif: { color: '#fff' },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  checkboxActif: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  checkLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  lienLegal: { color: COLORS.primary, fontWeight: '700', textDecorationLine: 'underline' },
  btn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  connexionBtn: { alignItems: 'center', marginTop: 20 },
  connexionText: { fontSize: 14, color: COLORS.textSecondary },
});
