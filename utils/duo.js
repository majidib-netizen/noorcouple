import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';

export const genererCodeDuo = async () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  let unique = false;

  while (!unique) {
    code = 'NOOR-';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    try {
      const { data } = await supabase
        .from('duos')
        .select('code')
        .eq('code', code)
        .single();
      if (!data) unique = true;
    } catch (e) {
      unique = true;
    }
  }
  return code;
};

const sauvegarderCodeDuoSupabase = async (code) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email;

    if (!userEmail) {
      console.log('Pas connecté - duo en attente de sync');
      await AsyncStorage.setItem('duo_pending_save', code);
      return;
    }

    // Vérifie si le code existe déjà dans Supabase
    const { data: existing } = await supabase
      .from('duos')
      .select('code')
      .eq('code', code)
      .single();

    if (existing) {
      console.log('Code déjà en BDD');
      await AsyncStorage.removeItem('duo_pending_save');
      return;
    }

    // Ceinture + bretelles : le défaut Supabase pose déjà code_expire_at à
    // now()+48h, mais on le fixe aussi explicitement côté client pour ne pas
    // dépendre uniquement de la config serveur.
    const codeExpireAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('duos')
      .insert({
        code,
        initiateur: userEmail,
        statut: 'en_attente',
        created_at: new Date().toISOString(),
        code_expire_at: codeExpireAt,
      })
      .select();

    console.log('Insert duo result:', JSON.stringify({ data, error }));

    if (!error) {
      await AsyncStorage.removeItem('duo_pending_save');
    }
  } catch (e) {
    console.log('Exception save duo:', e.message);
  }
};

export { sauvegarderCodeDuoSupabase };

// Fallback silencieux : si le code stocké localement ne correspond plus à
// aucune ligne (ex: régénération du code par l'initiateur — Option B1, la
// ligne reste la même mais sa valeur `code` change), retrouve le duo actif
// de l'utilisateur par email et resynchronise l'AsyncStorage concerné.
const resyncCodeParEmail = async (userEmail) => {
  try {
    const { data: viaConjoint } = await supabase
      .from('duos')
      .select('code')
      .eq('conjoint', userEmail)
      .eq('statut', 'actif')
      .order('joined_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (viaConjoint?.code) {
      console.log('[DUO_RESYNC] duo_code_conjoint périmé, resynchronisé via email →', viaConjoint.code);
      await AsyncStorage.setItem('duo_code_conjoint', viaConjoint.code);
      return { code: viaConjoint.code, estInitiateur: false };
    }

    const { data: viaInitiateur } = await supabase
      .from('duos')
      .select('code')
      .eq('initiateur', userEmail)
      .eq('statut', 'actif')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (viaInitiateur?.code) {
      console.log('[DUO_RESYNC] duo_code périmé, resynchronisé via email →', viaInitiateur.code);
      await AsyncStorage.setItem('duo_code', viaInitiateur.code);
      return { code: viaInitiateur.code, estInitiateur: true };
    }
  } catch (e) {
    console.log('[DUO_RESYNC] Échec fallback par email:', e.message);
  }
  return null;
};

const determinerRole = async () => {
  console.log('=== determinerRole DEBUT ===');
  const monCode = await AsyncStorage.getItem('duo_code');
  const codeConjoint = await AsyncStorage.getItem('duo_code_conjoint');
  console.log('monCode:', monCode);
  console.log('codeConjoint:', codeConjoint);

  // Priorité 1 : a rejoint avec un code → il est conjoint
  if (codeConjoint) {
    try {
      const { data: existe } = await supabase
        .from('duos')
        .select('code')
        .eq('code', codeConjoint)
        .maybeSingle();

      if (existe) {
        console.log('=> Role: CONJOINT (via codeConjoint)');
        return { code: codeConjoint, estInitiateur: false };
      }

      console.log('[DUO_RESYNC] codeConjoint introuvable, tentative de fallback par email');
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const resync = await resyncCodeParEmail(user.email);
        if (resync) {
          console.log('=> Role:', resync.estInitiateur ? 'INITIATEUR' : 'CONJOINT', '(resynchronisé)');
          return resync;
        }
      }
    } catch (e) {
      console.log('[DUO_RESYNC] Erreur vérification codeConjoint:', e.message);
    }
    console.log('=> Role: CONJOINT (code périmé, aucun fallback trouvé)');
    return { code: codeConjoint, estInitiateur: false };
  }

  // Priorité 2 : vérifie dans Supabase qui est l'initiateur
  if (monCode) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('user.email:', user?.email);
      if (user?.email) {
        const { data } = await supabase
          .from('duos')
          .select('initiateur, conjoint')
          .eq('code', monCode)
          .single();
        console.log('Duo en BDD:', data);
        if (data) {
          if (data.initiateur === user.email) {
            console.log('=> Role: INITIATEUR');
            return { code: monCode, estInitiateur: true };
          }
          if (data.conjoint === user.email) {
            console.log('=> Role: CONJOINT (via email match)');
            return { code: monCode, estInitiateur: false };
          }
        } else {
          console.log('[DUO_RESYNC] duo_code introuvable, tentative de fallback par email');
          const resync = await resyncCodeParEmail(user.email);
          if (resync) {
            console.log('=> Role:', resync.estInitiateur ? 'INITIATEUR' : 'CONJOINT', '(resynchronisé)');
            return resync;
          }
        }
      }
    } catch (_) {}
    console.log('=> Role: INITIATEUR (fallback)');
    return { code: monCode, estInitiateur: true };
  }

  console.log('=> AUCUN CODE');
  return { code: null, estInitiateur: false };
};

export const determinerRoleExport = determinerRole;

export const obtenirOuCreerCode = async () => {
  const codeExistant = await AsyncStorage.getItem('duo_code');
  if (codeExistant) {
    await sauvegarderCodeDuoSupabase(codeExistant);
    return codeExistant;
  }

  const nouveauCode = await genererCodeDuo();
  await AsyncStorage.setItem('duo_code', nouveauCode);

  await sauvegarderCodeDuoSupabase(nouveauCode);

  return nouveauCode;
};

export const rejoindreAvecCode = async (code) => {
  try {
    const codeNorm = code.trim().toUpperCase();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return { succes: false, message: 'Non connecté' };
    }

    const { data, error } = await supabase
      .from('duos')
      .select('code, statut, initiateur, conjoint, code_expire_at, tentatives_rejointe')
      .eq('code', codeNorm)
      .single();

    if (error || !data) {
      return { succes: false, erreur: 'invalide', message: 'Code invalide. Vérifiez le code et réessayez.' };
    }

    // Code archivé (régénéré ou duo quitté) : invalide, même si conjoint est vide
    if (data.statut === 'archive') {
      return { succes: false, erreur: 'invalide', message: 'Code invalide. Vérifiez le code et réessayez.' };
    }

    // Cas : l'utilisateur est déjà membre de ce duo → laisser passer
    if (data.initiateur === user.email || data.conjoint === user.email) {
      if (data.conjoint === user.email) {
        await AsyncStorage.setItem('duo_code_conjoint', codeNorm);
      } else {
        // Initiateur : préserver duo_code, nettoyer un éventuel duo_code_conjoint parasite
        await AsyncStorage.setItem('duo_code', codeNorm);
        await AsyncStorage.removeItem('duo_code_conjoint');
      }
      return { succes: true, dejaMembre: true };
    }

    // Compteur de tentatives — silencieux, non bloquant, sert de base à un
    // éventuel rate limiting futur.
    try {
      await supabase
        .from('duos')
        .update({ tentatives_rejointe: (data.tentatives_rejointe || 0) + 1 })
        .eq('code', codeNorm);
    } catch (_) {}

    // Cas : duo déjà complet avec un autre conjoint
    if (data.statut === 'actif' && data.conjoint && data.conjoint !== user.email) {
      return {
        succes: false,
        dejaComplet: true,
        erreur: 'complet',
        message: 'Ce duo est déjà complet. Demande à ton conjoint(e) de générer un nouveau code.',
      };
    }

    // Cas : code non utilisé mais expiré (48h)
    if (data.code_expire_at && new Date(data.code_expire_at) < new Date()) {
      return {
        succes: false,
        expire: true,
        erreur: 'expire',
        message: 'Ce code a expiré. Demande à ton conjoint(e) de générer un nouveau code.',
      };
    }

    // Mise à jour normale — conditionnelle sur statut = 'en_attente' pour éviter
    // qu'une rejointe simultanée par deux personnes n'écrase le conjoint déjà posé
    const { data: updated, error: updateError } = await supabase
      .from('duos')
      .update({
        conjoint: user.email,
        statut: 'actif',
        joined_at: new Date().toISOString(),
      })
      .eq('code', codeNorm)
      .eq('statut', 'en_attente')
      .select();

    if (updateError) {
      return { succes: false, message: updateError.message };
    }

    if (!updated || updated.length === 0) {
      // Quelqu'un d'autre a rejoint entre le SELECT et l'UPDATE ci-dessus
      return {
        succes: false,
        dejaComplet: true,
        erreur: 'complet',
        message: 'Ce duo est déjà complet. Demande à ton conjoint(e) de générer un nouveau code.',
      };
    }

    await AsyncStorage.setItem('duo_code_conjoint', codeNorm);
    return { succes: true };
  } catch (e) {
    console.log('rejoindreAvecCode error:', e);
    return { succes: false, message: 'Erreur de connexion. Vérifiez votre internet.' };
  }
};

export const chiffrer = (texte, cle) => {
  if (!texte || !cle) return texte;
  try {
    const cleNormalisee = cle.replace('NOOR-', '').toUpperCase();
    let resultat = '';
    for (let i = 0; i < texte.length; i++) {
      const charCode = texte.charCodeAt(i) ^ cleNormalisee.charCodeAt(i % cleNormalisee.length);
      resultat += String.fromCharCode(charCode);
    }
    return btoa(unescape(encodeURIComponent(resultat)));
  } catch (e) {
    console.log('Chiffrement error:', e);
    return texte;
  }
};

export const dechiffrer = (texteChiffre, cle) => {
  if (!texteChiffre || !cle) return texteChiffre;
  try {
    const cleNormalisee = cle.replace('NOOR-', '').toUpperCase();
    const decoded = decodeURIComponent(escape(atob(texteChiffre)));
    let resultat = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ cleNormalisee.charCodeAt(i % cleNormalisee.length);
      resultat += String.fromCharCode(charCode);
    }
    return resultat;
  } catch (e) {
    console.log('Déchiffrement error:', e);
    return texteChiffre;
  }
};

export const verifierDuoActif = async () => {
  try {
    const { code } = await determinerRole();
    console.log('=== verifierDuoActif | code utilisé:', code);
    if (!code) {
      console.log('=> false: aucun code');
      return false;
    }

    let { data, error } = await supabase
      .from('duos')
      .select('initiateur, conjoint, statut')
      .eq('code', code)
      .maybeSingle();

    console.log('=> Supabase data:', JSON.stringify(data), '| error:', error?.message);

    // Filet de sécurité supplémentaire : le code renvoyé par determinerRole()
    // peut lui-même être devenu périmé entre-temps (ex: régénération pendant
    // que cet appel était en cours) → nouvelle tentative via fallback email.
    if (!data) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          const resync = await resyncCodeParEmail(user.email);
          if (resync) {
            const retry = await supabase
              .from('duos')
              .select('initiateur, conjoint, statut')
              .eq('code', resync.code)
              .maybeSingle();
            data = retry.data;
            console.log('[DUO_RESYNC] verifierDuoActif relancé avec code resynchronisé:', resync.code);
          }
        }
      } catch (e) {
        console.log('[DUO_RESYNC] Échec fallback dans verifierDuoActif:', e.message);
      }
    }

    const actif = !!(data && data.statut === 'actif' && data.initiateur && data.conjoint);
    console.log('=> résultat verifierDuoActif:', actif);
    return actif;
  } catch (e) {
    console.log('verifierDuoActif error:', e);
    return false;
  }
};

export const verifierDoubleReponse = async (jourActuel) => {
  try {
    const { code } = await determinerRole();
    if (!code) return false;

    const { data } = await supabase
      .from('duos')
      .select('reponses_initiateur, reponses_conjoint, statut')
      .eq('code', code)
      .single();

    if (!data || data.statut !== 'actif') return false;

    const repI = data.reponses_initiateur || {};
    const repC = data.reponses_conjoint || {};
    const jour = String(jourActuel);

    return !!repI[jour] && !!repC[jour];
  } catch (e) {
    console.log('verifierDoubleReponse error:', e);
    return true;
  }
};

export const sauvegarderReponseDuo = async (jourActuel, texteReponse) => {
  console.log('=== sauvegarderReponseDuo APPELEE ===', { jourActuel, texteReponse: texteReponse?.slice(0, 30) });
  try {
    const { code, estInitiateur } = await determinerRole();
    if (!code) return;

    const reponseChiffree = chiffrer(texteReponse, code);
    const champ = estInitiateur ? 'reponses_initiateur' : 'reponses_conjoint';

    console.log('Sauvegarde réponse - role:', estInitiateur ? 'initiateur' : 'conjoint', 'champ:', champ);

    const { data: duo } = await supabase
      .from('duos')
      .select(champ)
      .eq('code', code)
      .single();

    const reponsesExistantes = duo?.[champ] || {};
    reponsesExistantes[String(jourActuel)] = {
      reponse: reponseChiffree,
      date: new Date().toISOString(),
    };

    const { error, count } = await supabase
      .from('duos')
      .update({ [champ]: reponsesExistantes })
      .eq('code', code);

    console.log('[DUO] Update réponse:', error?.message || 'OK', '| rows:', count);
  } catch (e) {
    console.log('sauvegarderReponseDuo error:', e);
  }
};

export const sauvegarderDiagnosticDuo = async (niveau, failles, diagnosticReponses) => {
  console.log('=== sauvegarderDiagnosticDuo APPELEE ===', { niveau, failles });
  try {
    const { code, estInitiateur } = await determinerRole();
    if (!code) return null;

    const genre = await AsyncStorage.getItem('genre') || 'homme';
    const champDiagnostic = estInitiateur ? 'diagnostic_initiateur' : 'diagnostic_conjoint';
    const champGenre = estInitiateur ? 'genre_initiateur' : 'genre_conjoint';

    const diagnosticData = {
      niveau,
      failles,
      reponses: diagnosticReponses,
      date: new Date().toISOString(),
    };

    const { error: updateErr } = await supabase
      .from('duos')
      .update({ [champDiagnostic]: diagnosticData, [champGenre]: genre })
      .eq('code', code);
    console.log('=== Update diagnostic result:', updateErr ? updateErr.message : 'OK', '| champ:', champDiagnostic);

    const { data: duo } = await supabase
      .from('duos')
      .select('diagnostic_initiateur, diagnostic_conjoint, statut')
      .eq('code', code)
      .single();

    console.log('=== Duo statut:', duo?.statut, '| diagI:', !!duo?.diagnostic_initiateur?.niveau, '| diagC:', !!duo?.diagnostic_conjoint?.niveau);

    if (!duo) return { niveau, failles };

    const diagI = duo.diagnostic_initiateur || {};
    const diagC = duo.diagnostic_conjoint || {};

    if (diagI.niveau && diagC.niveau) {
      const ordre = { leger: 1, modere: 2, grave: 3 };
      const niveauCommun = ordre[diagI.niveau] >= ordre[diagC.niveau]
        ? diagI.niveau
        : diagC.niveau;

      const themesVus = new Set();
      const faillesCommunes = [];
      [...(diagI.failles || []), ...(diagC.failles || [])].forEach(f => {
        if (!themesVus.has(f.theme)) {
          themesVus.add(f.theme);
          faillesCommunes.push(f);
        }
      });

      await supabase
        .from('duos')
        .update({ niveau_commun: niveauCommun, failles_communes: faillesCommunes })
        .eq('code', code);

      return { niveau: niveauCommun, failles: faillesCommunes };
    }

    return { niveau, failles };
  } catch (e) {
    console.log('sauvegarderDiagnosticDuo error:', e);
    return { niveau, failles };
  }
};

export const recupererNiveauDuo = async () => {
  try {
    const { code } = await determinerRole();
    if (!code) return null;

    const { data } = await supabase
      .from('duos')
      .select('niveau_commun, failles_communes, statut, diagnostic_initiateur, diagnostic_conjoint')
      .eq('code', code)
      .single();

    if (!data || data.statut !== 'actif') return null;

    const diagI = data.diagnostic_initiateur || {};
    const diagC = data.diagnostic_conjoint || {};
    const lesDeuxOntFaitDiag = !!diagI.niveau && !!diagC.niveau;

    if (!lesDeuxOntFaitDiag || !data.niveau_commun) return null;

    return {
      niveau: data.niveau_commun,
      failles: data.failles_communes || [],
      lesDeuxOntFaitDiag: true,
    };
  } catch (e) {
    return null;
  }
};

export const getReponsesConjoint = async (jourActuel) => {
  try {
    const { code, estInitiateur } = await determinerRole();
    if (!code) return null;

    const champConjoint = estInitiateur ? 'reponses_conjoint' : 'reponses_initiateur';
    const { data } = await supabase
      .from('duos')
      .select(champConjoint)
      .eq('code', code)
      .single();

    const reponses = data?.[champConjoint] || {};
    const reponseJour = reponses[String(jourActuel)];
    if (!reponseJour) return null;

    return dechiffrer(reponseJour.reponse, code);
  } catch (e) {
    console.log('getReponsesConjoint error:', e);
    return null;
  }
};

export const regenererCodeDuo = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return { succes: false, message: 'Non connecté' };

    const ancienCode = await AsyncStorage.getItem('duo_code');
    if (!ancienCode) {
      return { succes: false, message: 'Aucun code à régénérer.' };
    }

    // Régénère le code SUR LA LIGNE EXISTANTE : le conjoint (s'il est déjà
    // lié), les diagnostics, réponses et le plan restent intacts — seul le
    // code d'invitation change. Le WHERE initiateur=user.email garantit
    // qu'on ne peut régénérer que sa propre ligne.
    const codeExpireAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    let nouveauCode = null;
    const MAX_TENTATIVES = 3;

    for (let tentative = 0; tentative < MAX_TENTATIVES && !nouveauCode; tentative++) {
      const candidat = await genererCodeDuo();

      const { data: updated, error: updateError } = await supabase
        .from('duos')
        .update({
          code: candidat,
          code_expire_at: codeExpireAt,
          tentatives_rejointe: 0,
        })
        .eq('code', ancienCode)
        .eq('initiateur', user.email)
        .select();

      if (updateError) {
        // Conflit d'unicité sur le nouveau code (très improbable) → retry
        if (updateError.code === '23505') continue;
        return { succes: false, message: updateError.message };
      }

      if (!updated || updated.length === 0) {
        return { succes: false, message: "Duo introuvable ou tu n'en es pas l'initiateur." };
      }

      nouveauCode = candidat;
    }

    if (!nouveauCode) {
      return { succes: false, message: 'Impossible de générer un code unique, réessaie.' };
    }

    await AsyncStorage.setItem('duo_code', nouveauCode);

    return { succes: true, code: nouveauCode };
  } catch (e) {
    return { succes: false, message: e.message };
  }
};

export const quitterDuo = async () => {
  try {
    const monCode = await AsyncStorage.getItem('duo_code');
    const codeConjoint = await AsyncStorage.getItem('duo_code_conjoint');
    const code = monCode || codeConjoint;

    if (code) {
      await supabase.from('duos').update({ statut: 'archive' }).eq('code', code);
    }

    await AsyncStorage.multiRemove([
      'duo_code',
      'duo_code_conjoint',
      'duo_confirmation_affichee',
      'reponses_conjoint_cache',
      'jours_reveles',
      'niveau_commun_cache',
      'failles_communes_cache',
      'duo_partenaire_paye',
    ]);

    return { succes: true };
  } catch (e) {
    return { succes: false, message: e.message };
  }
};
