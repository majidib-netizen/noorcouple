import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, RADIUS, SHADOW } from '../constants/theme';
import { appGoMain } from '../utils/appState';
import { sauvegarderCodeDuoSupabase } from '../utils/duo';

export default function ConnexionScreen({ navigation, route, onDone }) {
  const isMainStack = route?.params?.isMainStack;
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMdp, setShowMdp] = useState(false);

  const connexion = async () => {
    if (!email.trim() || !mdp) return Alert.alert('Champs manquants', 'Merci de remplir tous les champs.');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: mdp,
      });
      console.log('Résultat connexion:', JSON.stringify({ data, error }));
      console.log('DATA:', JSON.stringify(data));
      console.log('ERROR:', JSON.stringify(error));
      console.log('USER:', data?.user?.id);
      console.log('SESSION:', data?.session?.access_token ? 'OK' : 'NULL');
      if (error) {
        console.log('Erreur Supabase:', error.message);
        Alert.alert('Erreur connexion', error.message);
        return;
      }
      if (data?.user) {
        console.log('Connexion réussie:', data.user.email);
        console.log('onDone type:', typeof onDone);
        console.log('isMainStack:', isMainStack);
        console.log('appGoMain:', JSON.stringify(appGoMain));
        await AsyncStorage.setItem('user_email', data.user.email || email.trim().toLowerCase());
        await AsyncStorage.setItem('onboarded', 'true');
        try {
          const { data: profile } = await supabase
            .from('users')
            .select('prenom, genre, app_payee')
            .eq('id', data.user.id)
            .single();
          if (profile) {
            if (profile.prenom) await AsyncStorage.setItem('prenom', profile.prenom);
            if (profile.genre) await AsyncStorage.setItem('genre', profile.genre);
            if (profile.app_payee) await AsyncStorage.setItem('app_payee', 'true');
          }
        } catch (_) {}

        // Sync code duo en attente vers Supabase
        const codeDuoPending = await AsyncStorage.getItem('duo_pending_save')
          || await AsyncStorage.getItem('duo_code');
        if (codeDuoPending) {
          await sauvegarderCodeDuoSupabase(codeDuoPending);
        }

        // Restaurer duo + diagnostic depuis Supabase (nouveau téléphone)
        try {
          const userEmail = data.user.email || email.trim().toLowerCase();
          const { data: duoData } = await supabase
            .from('duos')
            .select('code, initiateur, paiement_valide, diagnostic_initiateur, diagnostic_conjoint')
            .or(`initiateur.eq.${userEmail},conjoint.eq.${userEmail}`)
            .eq('statut', 'actif')
            .single();

          if (duoData) {
            const estInitiateur = duoData.initiateur === userEmail;
            if (estInitiateur) {
              await AsyncStorage.setItem('duo_code', duoData.code);
            } else {
              await AsyncStorage.setItem('duo_code_conjoint', duoData.code);
            }
            const diag = estInitiateur
              ? duoData.diagnostic_initiateur
              : duoData.diagnostic_conjoint;
            if (diag?.niveau) {
              await AsyncStorage.setItem('plan_niveau', diag.niveau);
            }
            if (diag?.reponses) {
              await AsyncStorage.setItem('plan_reponses', JSON.stringify(diag.reponses));
            }
            if (duoData.paiement_valide) {
              await AsyncStorage.setItem('duo_partenaire_paye', 'true');
            } else {
              await AsyncStorage.removeItem('duo_partenaire_paye');
            }
          }
        } catch (_) {}
      }
      if (isMainStack) {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else if (typeof onDone === 'function') {
        onDone();
        // onDone may call setAppState('main') which registers 'Main' in the stack
        // asynchronously. Wait one event-loop tick then reset navigation.
        setTimeout(() => {
          try { navigation.reset({ index: 0, routes: [{ name: 'Main' }] }); } catch (_) {}
        }, 0);
      } else {
        appGoMain?.onGoMain?.();
      }
    } catch (e) {
      console.log('Exception connexion:', e);
      Alert.alert('Erreur', e.message || 'Impossible de se connecter. Vérifie ta connexion.');
    } finally {
      setLoading(false);
    }
  };

  const motDePasseOublie = async () => {
    if (!email.trim()) return Alert.alert('Email requis', 'Entre ton email pour réinitialiser ton mot de passe.');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) Alert.alert('Erreur', 'Email non trouvé.');
      else Alert.alert('Email envoyé ✅', 'Vérifie ta boîte mail pour réinitialiser ton mot de passe.');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'envoyer l\'email.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>

        <View style={styles.header}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail}
              placeholder="ton@email.com" placeholderTextColor={COLORS.textLight}
              keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.mdpRow}>
              <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]}
                value={mdp} onChangeText={setMdp}
                placeholder="••••••••" placeholderTextColor={COLORS.textLight}
                secureTextEntry={!showMdp} />
              <TouchableOpacity onPress={() => setShowMdp(!showMdp)} style={styles.eyeBtn}>
                <Text>{showMdp ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={motDePasseOublie} style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={connexion} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Se connecter →</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.inscriptionBtn} onPress={() => {
            if (navigation && navigation.navigate) {
              navigation.navigate('Inscription');
            }
          }}>
            <Text style={styles.inscriptionText}>Pas encore de compte ? <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Créer un compte</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 220, height: 110, resizeMode: 'contain', alignSelf: 'center', marginBottom: 8 },
  form: { gap: 4 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: { backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: 14, fontSize: 15, color: COLORS.text, borderWidth: 1.5, borderColor: COLORS.border },
  mdpRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 10 },
  forgotBtn: { alignItems: 'flex-end', marginBottom: 8 },
  forgotText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  btn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, padding: 16, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  inscriptionBtn: { alignItems: 'center', marginTop: 20 },
  inscriptionText: { fontSize: 14, color: COLORS.textSecondary },
});
