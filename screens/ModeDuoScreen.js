import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Alert, Share, TextInput, ActivityIndicator, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { supabase } from '../config/supabase';
import { COLORS, SHADOW } from '../constants/theme';
import { DIAGNOSTIC_QUESTIONS, calculerNiveau, NIVEAUX, detecterFailles, calculerNiveauDuo, calculerReponsesMoyennes, getPlanJour } from '../constants/planData';
import { NOTIF_PLAN } from '../constants/notifMessages';
import { BONUS_MESSAGES } from '../constants/bonusMessages';
import { scheduleNotificationsPlan } from '../utils/notifications';
import { useLanguage } from '../context/LanguageContext';
import { aUnCompte, useAccesPremium } from '../utils/access';
import { obtenirOuCreerCode, verifierDuoActif, rejoindreAvecCode } from '../utils/duo';

const formatHeure = (h) => { const [hh, mm] = h.split(':'); return `${hh}h${mm === '00' ? '' : mm}`; };

const ETAPES = {
  ACCUEIL: 'accueil',
  ATTENTE: 'attente',         // Code généré, en attente du conjoint
  DIAGNOSTIC: 'diagnostic',   // Diagnostic individuel
  ATTENTE_CONJOINT: 'attente_conjoint', // Attente résultats conjoint
  PLAN_ACTIF: 'plan_actif',
};

export default function ModeDuoScreen({ navigation }) {
  const { t } = useLanguage();
  const { acces, joursRestants, loading: loadingAcces } = useAccesPremium();
  useEffect(() => {
    if (loadingAcces) return;
    if (!acces) navigation.navigate('Paywall', { contexte: 'duo' });
  }, [acces, loadingAcces]);
  const [etape, setEtape] = useState(ETAPES.ACCUEIL);
  const [monCode, setMonCode] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [userId, setUserId] = useState('');
  const [duoId, setDuoId] = useState('');
  const [genre, setGenre] = useState('homme');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [reponses, setReponses] = useState({});
  const [niveauCommun, setNiveauCommun] = useState(null);
  const [faillesCommunes, setFaillesCommunes] = useState([]);
  const [jourActuel, setJourActuel] = useState(0);
  const [joursValides, setJoursValides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conjointNom, setConjointNom] = useState('');
  const [heureMatin, setHeureMatin] = useState('7:30');
  const [heureSoir, setHeureSoir] = useState('20:30');

  useEffect(() => {
    chargerEtat();
  }, []);

  useEffect(() => {
    const verifierActivationDuo = async () => {
      const dejaConfirme = await AsyncStorage.getItem('duo_confirmation_affichee');
      if (dejaConfirme === 'true') return;

      const actif = await verifierDuoActif();
      if (actif) {
        const monCodeStored = await AsyncStorage.getItem('duo_code');
        const codeConjoint = await AsyncStorage.getItem('duo_code_conjoint');
        const code = monCodeStored || codeConjoint;

        const { data } = await supabase
          .from('duos')
          .select('initiateur, conjoint')
          .eq('code', code)
          .single();

        if (data) {
          Alert.alert(
            t('duo.actif_titre'),
            t('duo.actif_desc'),
            [{ text: 'OK' }]
          );
          await AsyncStorage.setItem('duo_confirmation_affichee', 'true');
        }
      }
    };
    verifierActivationDuo();
  }, []);

  const chargerEtat = async () => {
    try {
      const [uid, did, g, j, jv, nc, fc] = await Promise.all([
        AsyncStorage.getItem('duo_user_id'),
        AsyncStorage.getItem('duo_id'),
        AsyncStorage.getItem('genre'),
        AsyncStorage.getItem('duo_jour'),
        AsyncStorage.getItem('duo_jours_valides'),
        AsyncStorage.getItem('duo_niveau_commun'),
        AsyncStorage.getItem('duo_failles'),
      ]);

      const id = uid || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      if (!uid) await AsyncStorage.setItem('duo_user_id', id);
      setUserId(id);
      if (g) setGenre(g);

      if (did && nc) {
        setDuoId(did);
        setNiveauCommun(nc);
        setFaillesCommunes(fc ? JSON.parse(fc) : []);
        setJourActuel(j ? parseInt(j) : 0);
        setJoursValides(jv ? JSON.parse(jv) : []);
        setEtape(ETAPES.PLAN_ACTIF);
        await verifierPaiementDuo(did);
        ecouterDuo(did, id);
      }
      const hm = await AsyncStorage.getItem('notif_heure_matin');
      const hs = await AsyncStorage.getItem('notif_heure_soir');
      setHeureMatin(hm || '7:30');
      setHeureSoir(hs || '20:30');
    } catch (e) { console.log(e); }
  };

  // ─── VÉRIFIER PAIEMENT DUO ───────────────────────────────────────────────────
  const verifierPaiementDuo = async (code) => {
    try {
      const { data: duoData } = await supabase.from('duos').select('paiement_valide').eq('code', code).single();
      if (duoData?.paiement_valide) {
        await AsyncStorage.setItem('duo_partenaire_paye', 'true');
      }
    } catch (e) { console.log('verifierPaiementDuo error:', e); }
  };

  // ─── GÉNÉRER UN CODE ─────────────────────────────────────────────────────────
  const genererCodeDuo = async () => {
    const compte = await aUnCompte();
    if (!compte) { navigation.navigate('Paywall', { contexte: 'duo' }); return; }
    setLoading(true);
    try {
      const code = await obtenirOuCreerCode();
      setMonCode(code);
      await AsyncStorage.setItem('duo_mon_code', code);
      setEtape(ETAPES.ATTENTE);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de créer le code. Vérifie ta connexion.');
    }
    setLoading(false);
  };

  // ─── PARTAGER LE CODE ────────────────────────────────────────────────────────
  const partagerCode = async () => {
    try {
      await Share.share({
        message: `Rejoins-moi sur NoorCouple pour notre plan de couple 🤍\n\nMon code d'invitation : ${monCode}\n\n📱 Télécharge l'app gratuitement :\nhttps://play.google.com/store/apps/details?id=com.casquedev.noorcouple\n\nUne fois installée, entre mon code dans l'onglet "Duo".`,
        title: 'Invitation NoorCouple — Mode Duo',
      });
    } catch (e) { console.log(e); }
  };

  // ─── REJOINDRE AVEC UN CODE ──────────────────────────────────────────────────
  const rejoindreDuo = async () => {
    const compte = await aUnCompte();
    if (!compte) { navigation.navigate('Paywall', { contexte: 'duo' }); return; }
    const codeVal = codeInput.trim().toUpperCase();
    if (!codeVal || codeVal.length < 6) {
      Alert.alert('Code invalide', 'Entre le code complet reçu de ton conjoint(e).');
      return;
    }
    setLoading(true);
    try {
      const { data: duoData, error: fetchErr } = await supabase.from('duos').select('*').eq('code', codeVal).single();

      if (fetchErr || !duoData) {
        Alert.alert('Code introuvable', 'Ce code n\'existe pas ou a expiré.');
        setLoading(false);
        return;
      }


      if (duoData?.statut === 'complet') {
        Alert.alert('Code déjà utilisé', 'Ce code a déjà été utilisé.');
        setLoading(false);
        return;
      }

      // [DUO REJOIN] Délégation à rejoindreAvecCode
      console.log('[DUO REJOIN] Délégation à rejoindreAvecCode pour code:', codeVal);
      const resultJoin = await rejoindreAvecCode(codeVal);
      if (!resultJoin.succes) {
        Alert.alert('Impossible de rejoindre', resultJoin.message || 'Vérifie le code et ta connexion.');
        setLoading(false);
        return;
      }

      // [DUO REJOIN] Mise à jour genre_conjoint séparée
      console.log('[DUO REJOIN] Mise à jour genre_conjoint séparée');
      await supabase.from('duos').update({ genre_conjoint: genre }).eq('code', codeVal);

      setDuoId(codeVal);
      await AsyncStorage.setItem('duo_id', codeVal);
      setQuestionIndex(0);
      setReponses({});
      setEtape(ETAPES.DIAGNOSTIC);
      ecouterDuo(codeVal, userId);
      console.log('[DUO FIX] Modification 1/2 appliquée: rejoindreDuo délègue à rejoindreAvecCode');

    } catch (e) {
      Alert.alert('Erreur', 'Impossible de rejoindre. Vérifie ta connexion.');
    }
    setLoading(false);
  };

  // ─── DÉMARRER SON PROPRE DIAGNOSTIC (initiateur) ─────────────────────────────
  const demarrerMonDiagnostic = () => {
    setQuestionIndex(0);
    setReponses({});
    setEtape(ETAPES.DIAGNOSTIC);
  };

  // ─── RÉPONDRE AU DIAGNOSTIC ──────────────────────────────────────────────────
  const repondre = async (points) => {
    const q = DIAGNOSTIC_QUESTIONS[questionIndex];
    const nouvellesReponses = { ...reponses, [q.id]: points };
    setReponses(nouvellesReponses);

    if (questionIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      // Diagnostic terminé — sauvegarder sur Supabase
      const monScore = Object.values(nouvellesReponses).reduce((a, b) => a + b, 0);
      setLoading(true);
      try {
        const { data: duoData, error: fetchErr } = await supabase
          .from('duos')
          .select('*')
          .eq('code', duoId)
          .single();

        if (fetchErr || !duoData) {
          Alert.alert('Erreur', 'Impossible de récupérer les données du duo.');
          setLoading(false);
          return;
        }

        const isInitiateur = duoData.initiateur === userId;
        const updateKey = isInitiateur ? 'diagnostic_initiateur' : 'diagnostic_conjoint';

        await supabase.from('duos').update({
          [updateKey]: { reponses: nouvellesReponses, score: monScore, genre },
        }).eq('code', duoId);

        // Vérifier si les deux ont répondu
        const { data: updated } = await supabase
          .from('duos')
          .select('*')
          .eq('code', duoId)
          .single();

        if (updated?.diagnostic_initiateur && updated?.diagnostic_conjoint) {
          await fusionnerDiagnostics(updated);
        } else {
          setEtape(ETAPES.ATTENTE_CONJOINT);
        }
      } catch (e) {
        Alert.alert('Erreur', 'Impossible de sauvegarder le diagnostic.');
      }
      setLoading(false);
    }
  };

  // ─── FUSIONNER LES DIAGNOSTICS ───────────────────────────────────────────────
  const fusionnerDiagnostics = async (duoData) => {
    const repA = duoData.diagnostic_initiateur.reponses;
    const repB = duoData.diagnostic_conjoint.reponses;
    const scoreA = duoData.diagnostic_initiateur.score;
    const scoreB = duoData.diagnostic_conjoint.score;

    const niveauC = calculerNiveauDuo(scoreA, scoreB);
    const repMoyennes = calculerReponsesMoyennes(repA, repB);
    const faillesC = detecterFailles(repMoyennes);

    await verifierPaiementDuo(duoId);
    await supabase.from('duos').update({
      niveau_commun: niveauC,
      failles_communes: faillesC,
      statut: 'actif',
      started_at: new Date().toISOString(),
    }).eq('code', duoId);

    await activerPlanDuo(niveauC, faillesC);
  };

  // ─── ACTIVER LE PLAN DUO ─────────────────────────────────────────────────────
  const activerPlanDuo = async (nc, fc) => {
    const activerEffectivement = async () => {
      setNiveauCommun(nc);
      setFaillesCommunes(fc);
      setJourActuel(0);
      setJoursValides([]);
      await AsyncStorage.multiSet([
        ['duo_niveau_commun', nc],
        ['duo_failles', JSON.stringify(fc)],
        ['duo_jour', '0'],
        ['duo_jours_valides', '[]'],
      ]);
      try {
        await scheduleNotificationsPlan(nc, 0, 'homme', fc);
      } catch (e) { console.log('scheduleNotificationsPlan duo error:', e); }
      setEtape(ETAPES.PLAN_ACTIF);
    };

    if (Platform.OS === 'web') { await activerEffectivement(); return; }

    const dejaAcceptee = await AsyncStorage.getItem('notif_duo_acceptee');
    if (dejaAcceptee === 'true') { await activerEffectivement(); return; }

    const { status } = await Notifications.getPermissionsAsync();
    if (status === 'granted') {
      await AsyncStorage.setItem('notif_duo_acceptee', 'true');
      await activerEffectivement();
      return;
    }

    Alert.alert(
      t('plan.notif_titre'),
      t('plan.notif_texte'),
      [
        {
          text: t('generic.pas_maintenant'),
          style: 'cancel',
          onPress: activerEffectivement,
        },
        {
          text: t('generic.autoriser'),
          onPress: async () => {
            const { status: s } = await Notifications.requestPermissionsAsync();
            await AsyncStorage.setItem('notif_duo_acceptee', s === 'granted' ? 'true' : 'false');
            await activerEffectivement();
          },
        },
      ]
    );
  };

  // ─── ÉCOUTER LES CHANGEMENTS FIREBASE ────────────────────────────────────────
  const ecouterDuo = (code, uid) => {
    const channel = supabase
      .channel('duo-' + code)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'duos',
        filter: 'code=eq.' + code,
      }, (payload) => {
        const data = payload.new;
        if (data.statut === 'actif' && data.niveau_commun) {
          activerPlanDuo(data.niveau_commun, data.failles_communes || []);
        }
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  };

  // ─── VALIDER LE JOUR ─────────────────────────────────────────────────────────
  const validerJour = async () => {
    const nouveauxValides = [...joursValides, jourActuel];
    const prochainJour = jourActuel + 1;
    await AsyncStorage.multiSet([
      ['duo_jour', String(prochainJour)],
      ['duo_jours_valides', JSON.stringify(nouveauxValides)],
    ]);
    setJoursValides(nouveauxValides);
    setJourActuel(prochainJour);
    if (prochainJour < 40) {
        Alert.alert('✅ MashaAllah !', 'Jour validé ! Rendez-vous demain.');
    }
  };

  // ─── QUITTER LE DUO ──────────────────────────────────────────────────────────
  const quitterDuo = async () => {
    Alert.alert('Quitter le Mode Duo ?', 'Ton plan duo sera supprimé.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Quitter', style: 'destructive', onPress: async () => {
          await AsyncStorage.multiRemove([
            'duo_id', 'duo_mon_code', 'duo_niveau_commun',
            'duo_failles', 'duo_jour', 'duo_jours_valides'
          ]);
          setDuoId(''); setMonCode(''); setCodeInput('');
          setNiveauCommun(null); setFaillesCommunes([]);
          setJourActuel(0); setJoursValides([]);
          setEtape(ETAPES.ACCUEIL);
        }
      }
    ]);
  };

  const niveauInfo = niveauCommun ? NIVEAUX[niveauCommun] : null;

  if (loadingAcces) {
    return (
      <SafeAreaView style={[s.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>

      {/* ════════ ACCUEIL ════════ */}
      {etape === ETAPES.ACCUEIL && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={s.heroWrap}>
            <Text style={s.heroIco}>👫</Text>
            <Text style={s.heroTitle}>Mode Duo</Text>
            <Text style={s.heroSub}>
              Suivez le même plan ensemble.{'\n'}
              Chacun reçoit des actions personnalisées selon son profil.
            </Text>
          </View>

          <View style={s.howCard}>
            <Text style={s.howTitle}>Comment ça fonctionne ?</Text>
            {[
              ['1', 'Tu génères un code et tu l\'envoies par SMS ou WhatsApp'],
              ['2', 'Chacun fait le diagnostic séparément — le niveau le plus élevé est retenu'],
              ['3', 'Même plan, actions personnalisées selon ton profil'],
              ['4', 'Chacun voit uniquement sa propre progression'],
            ].map(([num, txt]) => (
              <View key={num} style={s.stepRow}>
                <View style={s.stepNum}><Text style={s.stepNumTxt}>{num}</Text></View>
                <Text style={s.stepTxt}>{txt}</Text>
              </View>
            ))}
          </View>

          {/* Générer un code */}
          <View style={s.codeSection}>
            <Text style={s.codeSectionTitle}>Inviter ton/ta conjoint(e)</Text>
            <View style={s.encadreInfo}>
              <Text style={s.encadreTitre}>{t('duo.comment_titre')}</Text>
              <Text style={s.encadreEtape}>{t('duo.etape_1')}</Text>
              <Text style={s.encadreEtape}>{t('duo.etape_2')}</Text>
              <Text style={s.encadreEtape}>{t('duo.etape_3')}</Text>
              <Text style={s.encadreValide}>{t('duo.etape_finale')}</Text>
            </View>
            <TouchableOpacity
              style={[s.btn, { backgroundColor: COLORS.primary }]}
              onPress={genererCodeDuo}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> :
                <Text style={s.btnTxt}>🔑 Générer un code d'invitation</Text>}
            </TouchableOpacity>
          </View>

          {/* Rejoindre avec un code */}
          <View style={s.joinCard}>
            <Text style={s.joinTitle}>Tu as reçu un code ?</Text>
            <View style={s.joinRow}>
              <TextInput
                style={s.joinInput}
                placeholder="Entre le code (ex: NOOR-7X4KAB)"
                value={codeInput}
                onChangeText={setCodeInput}
                autoCapitalize="characters"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            <TouchableOpacity
              style={[s.btn, { backgroundColor: COLORS.accent, marginHorizontal: 0 }]}
              onPress={rejoindreDuo}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> :
                <Text style={s.btnTxt}>Rejoindre →</Text>}
            </TouchableOpacity>
          </View>
          <View style={{ height: 28 }} />
        </ScrollView>
      )}

      {/* ════════ EN ATTENTE (code généré) ════════ */}
      {etape === ETAPES.ATTENTE && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24 }}>
          <Text style={s.heroIco}>📱</Text>
          <Text style={[s.heroTitle, { marginTop: 8 }]}>Code généré !</Text>

          <View style={s.codeBox}>
            <Text style={s.codeLbl}>Ton code d'invitation</Text>
            <Text style={s.codeVal}>{monCode}</Text>
            <Text style={s.codeSub}>Envoie ce code à ton/ta conjoint(e)</Text>
          </View>

          <TouchableOpacity
            style={[s.btn, { backgroundColor: COLORS.primary }]}
            onPress={partagerCode}
          >
            <Text style={s.btnTxt}>📱 Envoyer par SMS / WhatsApp</Text>
          </TouchableOpacity>

          <View style={s.attenteCard}>
            <Text style={s.attenteTitre}>{t('duo.attente_titre')}</Text>
            <Text style={s.attenteDesc}>{t('duo.attente_desc')}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <TouchableOpacity
                style={s.btnSecondaire}
                onPress={() => Share.share({
                  message: t('duo.partage_message').replace('{code}', monCode),
                })}
              >
                <Text style={s.btnSecondaireTxt}>{t('duo.renvoyer_code')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={s.waitCard}>
            <Text style={s.waitTitle}>En attendant qu'il/elle rejoigne...</Text>
            <Text style={s.waitTxt}>
              Démarre ton propre diagnostic pendant ce temps.
              Le plan commun sera lancé quand vous aurez tous les deux terminé.
            </Text>
          </View>

          <TouchableOpacity
            style={[s.btn, { backgroundColor: COLORS.accent }]}
            onPress={demarrerMonDiagnostic}
          >
            <Text style={s.btnTxt}>📋 Faire mon diagnostic</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.backLink} onPress={() => setEtape(ETAPES.ACCUEIL)}>
            <Text style={s.backLinkTxt}>← Retour</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ════════ DIAGNOSTIC ════════ */}
      {etape === ETAPES.DIAGNOSTIC && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
          <View style={s.progBar}>
            <View style={[s.progFill, { width: `${(questionIndex / DIAGNOSTIC_QUESTIONS.length) * 100}%` }]} />
          </View>
          <Text style={s.progLbl}>Question {questionIndex + 1} / {DIAGNOSTIC_QUESTIONS.length}</Text>

          <View style={s.duoBadge}>
            <Text style={s.duoBadgeTxt}>👫 Mode Duo — Diagnostic individuel</Text>
          </View>

          <View style={s.qCard}>
            <Text style={s.qNum}>Q{questionIndex + 1}</Text>
            <Text style={s.qTxt}>{DIAGNOSTIC_QUESTIONS[questionIndex].question}</Text>
          </View>

          {DIAGNOSTIC_QUESTIONS[questionIndex].options.map((opt, i) => (
            <TouchableOpacity
              key={i} style={s.optBtn}
              onPress={() => repondre(opt.points)}
              activeOpacity={0.75}
              disabled={loading}
            >
              <View style={[s.optDot, { backgroundColor: ['#1B3A5C18', '#E8843A18', '#C0392B18'][i] }]}>
                <Text style={[s.optDotTxt, { color: ['#1B3A5C', '#E8843A', '#C0392B'][i] }]}>{i + 1}</Text>
              </View>
              <Text style={s.optTxt}>{opt.texte}</Text>
            </TouchableOpacity>
          ))}
          {loading && <ActivityIndicator style={{ marginTop: 20 }} color={COLORS.primary} />}
        </ScrollView>
      )}

      {/* ════════ ATTENTE CONJOINT ════════ */}
      {etape === ETAPES.ATTENTE_CONJOINT && (
        <View style={s.waitScreen}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>⏳</Text>
          <Text style={[s.heroTitle, { textAlign: 'center' }]}>Diagnostic envoyé !</Text>
          <Text style={[s.heroSub, { textAlign: 'center' }]}>
            En attente que ton/ta conjoint(e) termine son diagnostic.
            Le plan démarrera automatiquement quand vous aurez tous les deux terminé.
          </Text>
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 24 }} />
        </View>
      )}

      {/* ════════ PLAN ACTIF DUO ════════ */}
      {etape === ETAPES.PLAN_ACTIF && niveauInfo && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[s.planHdr, { backgroundColor: niveauInfo.couleur }]}>
            <View style={s.planHdrTop}>
              <View>
                <Text style={s.planHdrTag}>👫 Duo · Plan {niveauInfo.label} · {genre === 'homme' ? 'Homme' : 'Femme'}</Text>
                <Text style={s.planHdrJour}>Jour {jourActuel + 1} / 40</Text>
              </View>
              <Text style={{ fontSize: 32 }}>{niveauInfo.emoji}</Text>
            </View>
            <View style={s.planProgBg}>
              <View style={[s.planProgFill, { width: `${Math.max(2, (jourActuel / 40) * 100)}%` }]} />
            </View>
            <Text style={s.planProgTxt}>{joursValides.length}/40 jours complétés</Text>
          </View>

          <View style={{ padding: 18 }}>
            {/* Info duo */}
            <View style={s.duoInfoCard}>
              <Text style={s.duoInfoTxt}>
                👫 Votre couple suit le même plan. Chacun voit uniquement sa propre progression.
              </Text>
            </View>

            {/* Failles communes */}
            {faillesCommunes.length > 0 && (
              <View style={s.faillesCard}>
                <Text style={s.faillesTitle}>🎯 Thèmes ciblés en Duo</Text>
                {faillesCommunes.map((f, i) => (
                  <View key={i} style={s.failleRow}>
                    <Text style={s.failleTxt}>{f.emoji} {f.label}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Action du jour */}
            {(() => {
              const info = getPlanJour(jourActuel, faillesCommunes, niveauCommun);
              let titreAction, action, rappelSoir, libelleMatin, libelleSoir, verset, psycho, isBonus = false;

              if (info.type === 'bonus') {
                isBonus = true;
                const bonusData = BONUS_MESSAGES[info.theme]?.[genre] || [];
                const msg = bonusData[info.jourBonus] || bonusData[0] || {};
                titreAction = `${info.faille?.emoji} ${info.faille?.label}`;
                action = (msg.matin || '').replace(/^🌅\s*/u, '');
                rappelSoir = (msg.soir || '').replace(/^🌙\s*/u, '');
                libelleMatin = `${info.faille?.label || 'Bonus'} — Action du jour`;
                libelleSoir = `${info.faille?.label || 'Bonus'} — Rappel du soir`;
              } else {
                const snapData = info.data || {};
                const notif = NOTIF_PLAN[niveauCommun]?.[genre]?.[jourActuel] || {};
                titreAction = genre === 'homme' ? (snapData.titreH || '') : (snapData.titreF || '');
                action = genre === 'homme' ? (snapData.actionH || '') : (snapData.actionF || '');
                verset = snapData.verset;
                psycho = snapData.psycho;
                rappelSoir = (notif.soir || '').replace(/^🌙\s*/u, '');
                libelleMatin = `${niveauInfo.label} — Action du jour`;
                libelleSoir = `${niveauInfo.label} — Rappel du soir`;
              }

              return (
                <>
                  {isBonus && (
                    <View style={[s.bonusBadge, { borderLeftColor: '#1B3A5C' }]}>
                      <Text style={s.bonusBadgeTitle}>{info.faille?.emoji} Journée ciblée — {info.faille?.label}</Text>
                      <Text style={s.bonusBadgeTxt}>Journée ciblée sur une faille détectée dans vos diagnostics.</Text>
                    </View>
                  )}
                  <Text style={s.secLbl}>📅 Action du jour</Text>
                  <View style={[s.actionCard, { borderLeftColor: niveauInfo.couleur }]}>
                    <View style={s.notifBadge}>
                      <Text style={s.notifTime}>{formatHeure(heureMatin)}</Text>
                      <Text style={s.notifSep}>·</Text>
                      <Text style={s.notifLbl}>{libelleMatin}</Text>
                    </View>
                    <Text style={[s.actionTitre, { color: niveauInfo.couleur }]}>{titreAction}</Text>
                    <Text style={s.actionTxt}>{action}</Text>
                    {verset && (
                      <View style={s.versetBox}>
                        <Text style={s.versetLbl}>📖 Verset / Hadith</Text>
                        <Text style={s.versetTxt}>{verset}</Text>
                      </View>
                    )}
                    {psycho && (
                      <View style={s.psychoBox}>
                        <Text style={s.psychoLbl}>🧠 Apport psychologique</Text>
                        <Text style={s.psychoTxt}>{psycho}</Text>
                      </View>
                    )}
                  </View>
                  <View style={[s.actionCard, { borderLeftColor: COLORS.accent, backgroundColor: '#FDF6EC' }]}>
                    <View style={s.notifBadge}>
                      <Text style={[s.notifTime, { color: '#8B6914' }]}>{formatHeure(heureSoir)}</Text>
                      <Text style={[s.notifSep, { color: '#8B6914' }]}>·</Text>
                      <Text style={[s.notifLbl, { color: '#8B6914' }]}>{libelleSoir}</Text>
                    </View>
                    <Text style={[s.actionTitre, { color: COLORS.accent }]}>Rappel du soir</Text>
                    <Text style={[s.actionTxt, { fontStyle: 'italic', color: '#0F2240' }]}>{rappelSoir}</Text>
                  </View>
                </>
              );
            })()}

            <TouchableOpacity
              style={[s.btn, { backgroundColor: niveauInfo.couleur, marginHorizontal: 0 }]}
              onPress={validerJour}
            >
              <Text style={s.btnTxt}>✅ J'ai réalisé l'action du jour !</Text>
            </TouchableOpacity>

            {/* Progression */}
            <Text style={s.secLbl}>📊 Ma progression</Text>
            <View style={s.calGrid}>
              {Array.from({ length: 40 }, (_, i) => {
                const calInfo = getPlanJour(i, faillesCommunes, niveauCommun);
                const isBonus = calInfo.type === 'bonus';
                const isDone = joursValides.includes(i);
                const isToday = i === jourActuel;
                return (
                  <View key={i} style={[
                    s.calDay,
                    isDone && { backgroundColor: isBonus ? '#1B3A5C' : niveauInfo.couleur, borderColor: 'transparent' },
                    isToday && !isDone && { borderColor: niveauInfo.couleur, borderWidth: 2 },
                    isBonus && !isDone && { borderStyle: 'dashed', borderColor: '#1B3A5C' },
                  ]}>
                    <Text style={[s.calDayTxt, isDone && { color: '#fff' }]}>{i + 1}</Text>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity style={s.resetBtn} onPress={quitterDuo}>
              <Text style={s.resetTxt}>🚪 Quitter le Mode Duo</Text>
            </TouchableOpacity>
            <View style={{ height: 28 }} />
          </View>
        </ScrollView>
      )}

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Hero
  heroWrap: { padding: 28, alignItems: 'center' },
  heroIco: { fontSize: 56, textAlign: 'center' },
  heroTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 8, marginTop: 8 },
  heroSub: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },

  // How
  howCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 18, marginHorizontal: 18, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  howTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNumTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stepTxt: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 19 },

  // Code
  codeSection: { marginHorizontal: 18, marginBottom: 14 },
  codeSectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  codeBox: { backgroundColor: '#EEF4FA', borderRadius: 14, padding: 20, alignItems: 'center', marginBottom: 14 },
  codeLbl: { fontSize: 11, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  codeVal: { fontSize: 28, fontWeight: '800', color: COLORS.text, letterSpacing: 4, marginBottom: 6 },
  codeSub: { fontSize: 12, color: COLORS.textSecondary },

  // Join
  joinCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 18, marginHorizontal: 18, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  joinTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  joinRow: { marginBottom: 10 },
  joinInput: { backgroundColor: COLORS.background, borderRadius: 12, padding: 14, fontSize: 16, color: COLORS.text, borderWidth: 1.5, borderColor: COLORS.border, letterSpacing: 2, fontWeight: '700' },

  // Wait
  waitCard: { backgroundColor: '#EEF4FA', borderRadius: 12, padding: 16, marginBottom: 14 },
  waitTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginBottom: 6 },
  waitTxt: { fontSize: 13, color: COLORS.text, lineHeight: 20 },
  waitScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },

  // Diagnostic
  progBar: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginBottom: 6 },
  progFill: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3 },
  progLbl: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'right', marginBottom: 14 },
  duoBadge: { backgroundColor: '#EEF4FA', borderRadius: 999, padding: 8, alignSelf: 'center', marginBottom: 14 },
  duoBadgeTxt: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  qCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  qNum: { fontSize: 11, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  qTxt: { fontSize: 16, fontWeight: '600', color: COLORS.text, lineHeight: 24 },
  optBtn: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  optDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optDotTxt: { fontSize: 13, fontWeight: '700' },
  optTxt: { flex: 1, fontSize: 14, color: COLORS.text, lineHeight: 21 },

  // Plan actif duo
  planHdr: { padding: 24, paddingBottom: 18 },
  planHdrTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  planHdrTag: { fontSize: 10, color: 'rgba(255,255,255,.7)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  planHdrJour: { fontSize: 26, fontWeight: '800', color: '#fff' },
  planProgBg: { height: 7, backgroundColor: 'rgba(255,255,255,.25)', borderRadius: 4, marginBottom: 6 },
  planProgFill: { height: 7, backgroundColor: '#fff', borderRadius: 4 },
  planProgTxt: { fontSize: 11, color: 'rgba(255,255,255,.7)' },
  duoInfoCard: { backgroundColor: '#EEF4FA', borderRadius: 12, padding: 12, marginBottom: 14 },
  duoInfoTxt: { fontSize: 12, color: COLORS.primary, lineHeight: 18, fontStyle: 'italic' },
  faillesCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 12, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  faillesTitle: { fontSize: 12, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  failleRow: { marginBottom: 4 },
  failleTxt: { fontSize: 13, color: COLORS.text },
  secLbl: { fontSize: 11, fontWeight: '700', color: COLORS.text, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginTop: 4 },
  bonusBadge: { borderRadius: 12, padding: 12, marginBottom: 12, borderLeftWidth: 3, backgroundColor: '#EEF4FA' },
  bonusBadgeTitle: { fontSize: 11, fontWeight: '700', color: '#2D5A3D', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  bonusBadgeTxt: { fontSize: 12, color: COLORS.text, lineHeight: 18 },
  actionCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 12, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  notifBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(28,58,92,.08)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 10 },
  notifTime: { fontSize: 11, fontWeight: '700', color: '#1C3A5C' },
  notifSep: { fontSize: 11, color: '#1C3A5C' },
  notifLbl: { fontSize: 11, fontWeight: '700', color: '#1C3A5C' },
  actionTitre: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  actionTxt: { fontSize: 14, color: COLORS.text, lineHeight: 22, marginBottom: 8 },
  versetBox: { backgroundColor: '#FDF6EC', borderRadius: 10, padding: 10, marginBottom: 8 },
  versetLbl: { fontSize: 10, fontWeight: '700', color: COLORS.accent, marginBottom: 4 },
  versetTxt: { fontSize: 12, color: COLORS.text, fontStyle: 'italic', lineHeight: 18 },
  psychoBox: { backgroundColor: '#EEF4FA', borderRadius: 10, padding: 10 },
  psychoLbl: { fontSize: 10, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  psychoTxt: { fontSize: 12, color: COLORS.text, lineHeight: 18 },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 18 },
  calDay: { width: 36, height: 36, borderRadius: 8, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  calDayTxt: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },

  // Encadré info duo
  encadreInfo: { backgroundColor: COLORS.primaryLight, borderRadius: 12, padding: 16, marginVertical: 12, borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  encadreTitre: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginBottom: 10 },
  encadreEtape: { fontSize: 13, color: COLORS.text, lineHeight: 22, marginVertical: 2 },
  encadreValide: { fontSize: 13, fontWeight: '600', color: COLORS.success, marginTop: 8 },

  // Attente conjoint
  attenteCard: { backgroundColor: COLORS.accentLight, borderRadius: 12, padding: 16, marginVertical: 12, borderLeftWidth: 3, borderLeftColor: COLORS.accent },
  attenteTitre: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  attenteDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  btnSecondaire: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: COLORS.primary },
  btnSecondaireTxt: { fontSize: 12, fontWeight: '600', color: '#fff' },

  // Shared
  btn: { borderRadius: 999, padding: 16, alignItems: 'center', marginBottom: 10 },
  btnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  backLink: { alignItems: 'center', padding: 10 },
  backLinkTxt: { fontSize: 13, color: COLORS.textLight },
  resetBtn: { borderWidth: 1.5, borderColor: '#ffcccc', borderRadius: 12, padding: 14, alignItems: 'center', backgroundColor: '#fff5f5', marginBottom: 6 },
  resetTxt: { fontSize: 13, color: '#cc0000', fontWeight: '600' },
});
