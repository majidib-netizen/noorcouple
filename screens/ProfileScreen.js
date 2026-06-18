import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Switch, Alert, Platform, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, RADIUS, SHADOW } from '../constants/theme';
import { appReset } from '../utils/appState';
import { scheduleNotification, scheduleNotificationsPlan, annulerNotificationsQuestions, annulerNotificationsPlan } from '../utils/notifications';
import { useLanguage } from '../context/LanguageContext';
import { rejoindreAvecCode, regenererCodeDuo } from '../utils/duo';
import { supabase } from '../config/supabase';

// ─── TimePickerCard ────────────────────────────────────────────────────────────
const TimePickerCard = ({ label, heure, minutes, ampm, onHeureChange, onMinutesChange, onAmPmChange, couleur, langue }) => {
  const pad = (n) => String(n).padStart(2, '0');

  const handleHeurePress = () => {
    if (langue === 'en') {
      const newH = heure >= 12 ? 1 : heure + 1;
      if (heure === 12 && newH === 1) {
        onAmPmChange(ampm === 'AM' ? 'PM' : 'AM');
      }
      onHeureChange(newH);
    } else {
      onHeureChange((heure + 1) % 24);
    }
  };

  const handleMinutesPress = () => {
    onMinutesChange((minutes + 5) % 60);
  };

  const getHintText = () => {
    if (langue === 'en') return pad(heure) + ':' + pad(minutes) + ' ' + ampm;
    return heure + 'h' + pad(minutes);
  };

  return (
    <View style={[tpStyles.card, { borderColor: couleur }]}>
      <Text style={[tpStyles.label, { color: couleur }]}>{label}</Text>
      <View style={tpStyles.display}>
        <View style={tpStyles.unit}>
          <TouchableOpacity onPress={handleHeurePress} style={[tpStyles.numBtn, { backgroundColor: couleur + '18' }]}>
            <Text style={[tpStyles.num, { color: couleur }]}>{pad(heure)}</Text>
          </TouchableOpacity>
          <Text style={tpStyles.tapHint}>{langue === 'en' ? 'tap' : 'appuyer'}</Text>
        </View>
        <Text style={tpStyles.sep}>:</Text>
        <View style={tpStyles.unit}>
          <TouchableOpacity onPress={handleMinutesPress} style={[tpStyles.numBtn, { backgroundColor: couleur + '18' }]}>
            <Text style={[tpStyles.num, { color: couleur }]}>{pad(minutes)}</Text>
          </TouchableOpacity>
          <Text style={tpStyles.tapHint}>{langue === 'en' ? 'tap' : 'appuyer'}</Text>
        </View>
      </View>
      <Text style={[tpStyles.hint, { color: couleur }]}>{getHintText()}</Text>
    </View>
  );
};

const tpStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    backgroundColor: COLORS.white,
    gap: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  display: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  unit: {
    alignItems: 'center',
  },
  numBtn: {
    borderRadius: 8,
    padding: 6,
    minWidth: 44,
    alignItems: 'center',
  },
  num: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
  },
  tapHint: {
    fontSize: 9,
    color: COLORS.textLight,
    marginTop: 2,
  },
  sep: {
    fontSize: 26,
    fontWeight: '300',
    color: COLORS.textLight,
    alignSelf: 'center',
    marginHorizontal: 2,
    marginBottom: 14,
  },
  ampmBtn: {
    marginLeft: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'center',
  },
  ampmTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  hint: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
  },
});

// ─── ProfileScreen ─────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { t, langue, changeLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const [genre, setGenre] = useState('homme');
  const [prenom, setPrenom] = useState('');
  const [editPrenom, setEditPrenom] = useState(false);
  const [monCode, setMonCode] = useState('');
  const [duoConjoint, setDuoConjoint] = useState('');
  const [conjointConnecte, setConjointConnecte] = useState(false);
  const [codeDuoInput, setCodeDuoInput] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [notifPlan, setNotifPlan] = useState(true);
  const [notifQuestions, setNotifQuestions] = useState(true);
  const [notifDuo, setNotifDuo] = useState(true);
  const [heureMatin, setHeureMatin] = useState(7);
  const [minutesMatin, setMinutesMatin] = useState(30);
  const [ampmMatin, setAmpmMatin] = useState('AM');
  const [heureSoir, setHeureSoir] = useState(8);
  const [minutesSoir, setMinutesSoir] = useState(30);
  const [ampmSoir, setAmpmSoir] = useState('PM');

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (!monCode || conjointConnecte) return;
    const interval = setInterval(async () => {
      try {
        const { data } = await supabase
          .from('duos')
          .select('conjoint')
          .eq('code', monCode)
          .single();
        if (data && data.conjoint) setConjointConnecte(true);
      } catch (_) {}
    }, 5000);
    return () => clearInterval(interval);
  }, [monCode, conjointConnecte]);

  const loadData = async () => {
    const g   = await AsyncStorage.getItem('genre') || 'homme';
    const p   = await AsyncStorage.getItem('prenom') || '';
    const dc  = await AsyncStorage.getItem('duo_code');
    const dcj = await AsyncStorage.getItem('duo_code_conjoint');
    const np  = await AsyncStorage.getItem('notif_plan');
    const nq  = await AsyncStorage.getItem('notif_questions');
    const nd  = await AsyncStorage.getItem('notif_duo');
    const hm  = await AsyncStorage.getItem('notif_heure_matin');
    const hs  = await AsyncStorage.getItem('notif_heure_soir');
    setGenre(g);
    setPrenom(p);
    if (dc) {
      setMonCode(dc);
      try {
        const { data: duoData } = await supabase
          .from('duos')
          .select('conjoint')
          .eq('code', dc)
          .single();
        if (duoData && duoData.conjoint) setConjointConnecte(true);
      } catch (_) {}
    }
    if (dcj) setDuoConjoint(dcj);
    setNotifPlan(np !== 'false');
    setNotifQuestions(nq !== 'false');
    setNotifDuo(nd !== 'false');
    if (hm) {
      const [h, m] = hm.split(':').map(Number);
      if (langue === 'en') {
        setHeureMatin(h === 0 ? 12 : h > 12 ? h - 12 : h);
        setAmpmMatin(h < 12 ? 'AM' : 'PM');
      } else {
        setHeureMatin(h);
      }
      setMinutesMatin(m);
    }
    if (hs) {
      const [h, m] = hs.split(':').map(Number);
      if (langue === 'en') {
        setHeureSoir(h === 0 ? 12 : h > 12 ? h - 12 : h);
        setAmpmSoir(h < 12 ? 'AM' : 'PM');
      } else {
        setHeureSoir(h);
      }
      setMinutesSoir(m);
    }
  };

  const savePrenom = async () => {
    await AsyncStorage.setItem('prenom', prenom);
    setEditPrenom(false);
  };

  const changeGenre = async (nouveauGenre) => {
    if (nouveauGenre === genre) return;

    const planNiveau = await AsyncStorage.getItem('plan_niveau');
    const planJour = await AsyncStorage.getItem('plan_jour');
    const planActif = planNiveau && planJour && parseInt(planJour) < 40;

    if (planActif) {
      Alert.alert(
        t('profil.genre_alerte_titre'),
        t('profil.genre_alerte_desc'),
        [
          { text: t('generic.annuler'), style: 'cancel' },
          {
            text: t('profil.genre_confirmer'),
            onPress: async () => {
              await AsyncStorage.setItem('genre', nouveauGenre);
              setGenre(nouveauGenre);
            },
          },
        ]
      );
    } else {
      await AsyncStorage.setItem('genre', nouveauGenre);
      setGenre(nouveauGenre);
    }
  };

  const toggleNotifPlan = async (value) => {
    setNotifPlan(value);
    await AsyncStorage.setItem('notif_plan', String(value));
    if (Platform.OS !== 'web') {
      if (value) {
        const niveau = await AsyncStorage.getItem('plan_niveau');
        const jourStr = await AsyncStorage.getItem('plan_jour');
        const g = await AsyncStorage.getItem('genre');
        if (niveau) await scheduleNotificationsPlan(niveau, parseInt(jourStr || '0'), g || 'homme', []);
      } else {
        await annulerNotificationsPlan();
      }
    }
  };

  const toggleNotifQuestions = async (value) => {
    setNotifQuestions(value);
    await AsyncStorage.setItem('notif_questions', String(value));
    if (Platform.OS !== 'web') {
      if (value) await scheduleNotification();
      else await annulerNotificationsQuestions();
    }
  };

  const toggleNotifDuo = async (value) => {
    setNotifDuo(value);
    await AsyncStorage.setItem('notif_duo', String(value));
  };

  const sauvegarderHeures = async (hm, mm, ampm_m, hs, ms, ampm_s) => {
    let h24m = hm;
    let h24s = hs;
    if (langue === 'en') {
      h24m = ampm_m === 'AM' ? (hm === 12 ? 0 : hm) : (hm === 12 ? 12 : hm + 12);
      h24s = ampm_s === 'AM' ? (hs === 12 ? 0 : hs) : (hs === 12 ? 12 : hs + 12);
    }
    await AsyncStorage.setItem('notif_heure_matin', h24m + ':' + mm);
    await AsyncStorage.setItem('notif_heure_soir', h24s + ':' + ms);
    if (Platform.OS !== 'web') {
      const nq = await AsyncStorage.getItem('notif_questions');
      const np = await AsyncStorage.getItem('notif_plan');
      const niveau = await AsyncStorage.getItem('plan_niveau');
      const jourStr = await AsyncStorage.getItem('plan_jour');
      const g = await AsyncStorage.getItem('genre');
      if (nq !== 'false') await scheduleNotification();
      if (np !== 'false' && niveau) {
        await scheduleNotificationsPlan(niveau, parseInt(jourStr || '0'), g || 'homme', []);
      }
    }
  };

  const resetApp = () => {
    Alert.alert(
      t('profil.reinitialiser'),
      t('profil.reinit_confirm'),
      [
        { text: t('generic.annuler'), style: 'cancel' },
        {
          text: t('profil.reinitialiser'),
          style: 'destructive',
          onPress: async () => { await AsyncStorage.clear(); appReset.onReset?.(); },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.avatar, { backgroundColor: genre === 'homme' ? COLORS.homme + '20' : COLORS.femme + '20' }]}>
            <Text style={styles.avatarEmoji}>{genre === 'homme' ? '👨' : '👩'}</Text>
          </View>
          {editPrenom ? (
            <View style={styles.prenomEdit}>
              <TextInput
                style={styles.prenomInput}
                value={prenom}
                onChangeText={setPrenom}
                placeholder={t('onboarding.prenom_placeholder')}
                autoFocus
              />
              <TouchableOpacity style={styles.saveBtn} onPress={savePrenom}>
                <Text style={styles.saveBtnText}>{t('generic.sauvegarder')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditPrenom(true)}>
              <Text style={styles.prenomText}>{prenom || t('profil.ajouter_prenom')} ✏️</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.genreLabel}>
            {genre === 'homme' ? t('profil.profil_homme') : t('profil.profil_femme')}
          </Text>
        </View>

        {/* Profil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 {t('profil.titre')}</Text>
          <View style={styles.genreContainer}>
            {[
              { id: 'homme', label: t('onboarding.homme'), emoji: '👨', color: COLORS.homme },
              { id: 'femme', label: t('onboarding.femme'), emoji: '👩', color: COLORS.femme },
            ].map(g => (
              <TouchableOpacity
                key={g.id}
                style={[styles.genreBtn, genre === g.id && { backgroundColor: g.color, borderColor: g.color }]}
                onPress={() => changeGenre(g.id)}
              >
                <Text style={styles.genreBtnEmoji}>{g.emoji}</Text>
                <Text style={[styles.genreBtnLabel, genre === g.id && { color: '#fff' }]}>{g.label}</Text>
                {genre === g.id && <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mon code duo */}
        {monCode ? (
          <View style={styles.section}>
            <View style={styles.codeCard}>
              <Text style={styles.codeLabel}>{t('profil.mon_code_duo')}</Text>
              <Text style={styles.codeValue}>{monCode}</Text>
              {conjointConnecte && (
                <View style={{ backgroundColor: '#E8F5E9', padding: 8, borderRadius: 8, marginTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#2E7D32', fontSize: 14, fontWeight: '500' }}>✅ {t('duo.duo_actif')}</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => Share.share({
                  message: `Rejoins-moi sur NoorCouple 🤍\n\nCode : ${monCode}\n\nTélécharge l'app : https://play.google.com/store/apps/details?id=com.casquedev.noorcouple`
                })}
                style={styles.shareCodeBtn}
              >
                <Text style={styles.shareCodeTxt}>📤 {t('profil.repartager_code')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnRegenerer}
                onPress={() => {
                  Alert.alert(
                    t('profil.regenerer_titre') || 'Régénérer un nouveau code ?',
                    t('profil.regenerer_desc') || "L'ancien code ne sera plus valide. Si ton conjoint(e) était déjà lié(e), tu devras lui partager le nouveau code.",
                    [
                      { text: t('generic.annuler') || 'Annuler', style: 'cancel' },
                      {
                        text: t('profil.regenerer_btn') || 'Régénérer',
                        style: 'destructive',
                        onPress: async () => {
                          const result = await regenererCodeDuo();
                          if (result.succes) {
                            setMonCode(result.code);
                            Alert.alert('✅', t('profil.regenerer_succes') || 'Nouveau code généré.');
                          }
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={styles.btnRegenererTxt}>🔄 {t('profil.regenerer_code') || 'Régénérer un nouveau code'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Duo — rejoindre ou statut */}
        {!monCode && !duoConjoint ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👫 {t('profil.rejoindre_duo')}</Text>
            <View style={styles.card}>
              <Text style={styles.rowSub}>{t('profil.rejoindre_duo_desc')}</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <TextInput
                  style={[styles.prenomInput, { flex: 1 }]}
                  value={codeDuoInput}
                  onChangeText={(v) => setCodeDuoInput(v.toUpperCase())}
                  placeholder="NOOR-XXXXXX"
                  placeholderTextColor={COLORS.textLight}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={[styles.saveBtn, { opacity: codeDuoInput.replace(/-/g, '').length < 10 || joinLoading ? 0.5 : 1 }]}
                  disabled={codeDuoInput.replace(/-/g, '').length < 10 || joinLoading}
                  onPress={async () => {
                    setJoinLoading(true);
                    const resultat = await rejoindreAvecCode(codeDuoInput);
                    if (!resultat.succes) {
                      Alert.alert(t('duo.code_invalide'), resultat.message || t('duo.code_invalide_desc'));
                    } else {
                      setDuoConjoint(codeDuoInput.trim().toUpperCase());
                      setCodeDuoInput('');
                    }
                    setJoinLoading(false);
                  }}
                >
                  <Text style={styles.saveBtnText}>{joinLoading ? '...' : t('profil.rejoindre_btn')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : duoConjoint ? (
          <View style={styles.section}>
            <View style={styles.codeCard}>
              <Text style={styles.codeLabel}>{t('duo.duo_actif')}</Text>
              <Text style={styles.codeValue}>{duoConjoint}</Text>
            </View>
          </View>
        ) : null}

        {/* Langue */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 {t('profil.langue')}</Text>
          <View style={styles.genreContainer}>
            <TouchableOpacity
              style={[styles.genreBtn, langue === 'fr' && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
              onPress={() => changeLanguage('fr')}
            >
              <Text style={styles.genreBtnEmoji}>🇫🇷</Text>
              <Text style={[styles.genreBtnLabel, langue === 'fr' && { color: '#fff' }]}>Français</Text>
              {langue === 'fr' && <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genreBtn, langue === 'en' && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
              onPress={() => changeLanguage('en')}
            >
              <Text style={styles.genreBtnEmoji}>🇬🇧</Text>
              <Text style={[styles.genreBtnLabel, langue === 'en' && { color: '#fff' }]}>English</Text>
              {langue === 'en' && <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text>}
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 {t('profil.notifications')}</Text>

          {/* Switches Plan / Questions / Duo */}
          <View style={[styles.card, { marginBottom: 12 }]}>
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.rowTitle}>{t('profil.notif_plan')}</Text>
                <Text style={styles.rowSub}>{t('profil.notif_plan_desc')}</Text>
              </View>
              <Switch
                value={notifPlan}
                onValueChange={toggleNotifPlan}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={notifPlan ? '#fff' : '#f4f3f4'}
              />
            </View>
            <View style={[styles.row, { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 14, marginTop: 14 }]}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.rowTitle}>{t('profil.notif_questions')}</Text>
                <Text style={styles.rowSub}>{t('profil.notif_questions_desc')}</Text>
              </View>
              <Switch
                value={notifQuestions}
                onValueChange={toggleNotifQuestions}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={notifQuestions ? '#fff' : '#f4f3f4'}
              />
            </View>
            <View style={[styles.row, { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 14, marginTop: 14, marginBottom: 0 }]}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.rowTitle}>{t('profil.notif_duo')}</Text>
                <Text style={styles.rowSub}>{t('profil.notif_duo_desc')}</Text>
              </View>
              <Switch
                value={notifDuo}
                onValueChange={toggleNotifDuo}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={notifDuo ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Horloges côte à côte */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <TimePickerCard
              label={t('profil.heure_matin')}
              heure={heureMatin}
              minutes={minutesMatin}
              ampm={ampmMatin}
              langue={langue}
              couleur={COLORS.primary}
              onHeureChange={(h) => { setHeureMatin(h); sauvegarderHeures(h, minutesMatin, ampmMatin, heureSoir, minutesSoir, ampmSoir); }}
              onMinutesChange={(m) => { setMinutesMatin(m); sauvegarderHeures(heureMatin, m, ampmMatin, heureSoir, minutesSoir, ampmSoir); }}
              onAmPmChange={(a) => { setAmpmMatin(a); sauvegarderHeures(heureMatin, minutesMatin, a, heureSoir, minutesSoir, ampmSoir); }}
            />
            <TimePickerCard
              label={t('profil.heure_soir')}
              heure={heureSoir}
              minutes={minutesSoir}
              ampm={ampmSoir}
              langue={langue}
              couleur={COLORS.accent}
              onHeureChange={(h) => { setHeureSoir(h); sauvegarderHeures(heureMatin, minutesMatin, ampmMatin, h, minutesSoir, ampmSoir); }}
              onMinutesChange={(m) => { setMinutesSoir(m); sauvegarderHeures(heureMatin, minutesMatin, ampmMatin, heureSoir, m, ampmSoir); }}
              onAmPmChange={(a) => { setAmpmSoir(a); sauvegarderHeures(heureMatin, minutesMatin, ampmMatin, heureSoir, minutesSoir, a); }}
            />
          </View>

        </View>

        {/* À propos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ {t('profil.a_propos')}</Text>
          <View style={styles.card}>
            <Text style={styles.aboutText}>{t('profil.a_propos_texte')}</Text>
            <View style={styles.aboutLine} />
            <Text style={styles.aboutVerset}>"{t('profil.a_propos_verset')}"</Text>
            <Text style={styles.aboutRef}>— {t('profil.a_propos_ref')}</Text>
          </View>
        </View>

        {/* Version */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={[styles.rowTitle, { textAlign: 'center' }]}>{t('profil.version')}</Text>
            <Text style={[styles.rowSub, { textAlign: 'center', marginTop: 4 }]}>{t('profil.version_sub')}</Text>
          </View>
        </View>

        {/* Reset */}
        <TouchableOpacity style={styles.resetBtn} onPress={resetApp}>
          <Text style={styles.resetText}>🗑️ {t('profil.reinitialiser')}</Text>
        </TouchableOpacity>

        <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  hero: { alignItems: 'center', paddingVertical: 32 },
  avatar: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarEmoji: { fontSize: 44 },
  prenomText: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  genreLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary },
  prenomEdit: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4 },
  prenomInput: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: RADIUS.md, padding: 10, fontSize: SIZES.base, minWidth: 150 },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: 10 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: SIZES.sm },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 20, ...SHADOW.sm },
  genreContainer: { flexDirection: 'row', gap: 12 },
  genreBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, backgroundColor: COLORS.white },
  genreBtnEmoji: { fontSize: 22 },
  genreBtnLabel: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.text },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowTitle: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.text },
  rowSub: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  testBtn: { marginTop: 4, padding: 14, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.primary + '55', backgroundColor: COLORS.primary + '10', alignItems: 'center' },
  testBtnTxt: { fontSize: SIZES.sm, color: COLORS.primary, fontWeight: '600' },
  aboutText: { fontSize: SIZES.sm, color: COLORS.text, lineHeight: 22, marginBottom: 16 },
  aboutLine: { height: 1, backgroundColor: COLORS.border, marginBottom: 16 },
  aboutVerset: { fontSize: SIZES.sm, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 20, marginBottom: 6 },
  aboutRef: { fontSize: SIZES.xs, color: COLORS.accent, fontWeight: '700' },
  resetBtn: { marginHorizontal: 20, padding: 16, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: '#ffcccc', backgroundColor: '#fff5f5', alignItems: 'center' },
  resetText: { fontSize: SIZES.sm, color: '#cc0000', fontWeight: '600' },
  codeCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  codeValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 4,
  },
  shareCodeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 4,
  },
  shareCodeTxt: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  btnRegenerer: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.warning,
    alignSelf: 'center',
  },
  btnRegenererTxt: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '600',
  },
});
