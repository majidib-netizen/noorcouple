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

    const { data, error } = await supabase
      .from('duos')
      .insert({
        code,
        initiateur: userEmail,
        statut: 'en_attente',
        created_at: new Date().toISOString(),
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

const determinerRole = async () => {
  console.log('=== determinerRole DEBUT ===');
  const monCode = await AsyncStorage.getItem('duo_code');
  const codeConjoint = await AsyncStorage.getItem('duo_code_conjoint');
  console.log('monCode:', monCode);
  console.log('codeConjoint:', codeConjoint);

  // Priorité 1 : a rejoint avec un code → il est conjoint
  if (codeConjoint) {
    console.log('=> Role: CONJOINT (via codeConjoint)');
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
      .select('code, statut, initiateur, conjoint')
      .eq('code', codeNorm)
      .single();

    if (error || !data) {
      return { succes: false, message: 'Code invalide. Vérifiez le code et réessayez.' };
    }

    // Cas : l'utilisateur est déjà membre de ce duo → laisser passer
    if (data.initiateur === user.email || data.conjoint === user.email) {
      await AsyncStorage.setItem('duo_code_conjoint', codeNorm);
      return { succes: true, dejaMembre: true };
    }

    // Cas : duo déjà complet avec un autre conjoint
    if (data.statut === 'actif' && data.conjoint && data.conjoint !== user.email) {
      return {
        succes: false,
        dejaComplet: true,
        message: 'Ce duo est déjà complet. Demande à ton conjoint(e) de générer un nouveau code.',
      };
    }

    // Mise à jour normale
    const { error: updateError } = await supabase
      .from('duos')
      .update({
        conjoint: user.email,
        statut: 'actif',
        joined_at: new Date().toISOString(),
      })
      .eq('code', codeNorm);

    if (updateError) {
      return { succes: false, message: updateError.message };
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

    const { data, error } = await supabase
      .from('duos')
      .select('initiateur, conjoint, statut')
      .eq('code', code)
      .single();

    console.log('=> Supabase data:', JSON.stringify(data), '| error:', error?.message);

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

    const { error } = await supabase
      .from('duos')
      .update({ [champ]: reponsesExistantes })
      .eq('code', code);

    console.log('Update result:', error ? error.message : 'OK');
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
    const ancienCodeConjoint = await AsyncStorage.getItem('duo_code_conjoint');

    if (ancienCode) {
      await supabase.from('duos').update({ statut: 'archive' }).eq('code', ancienCode);
    }
    if (ancienCodeConjoint && ancienCodeConjoint !== ancienCode) {
      await AsyncStorage.removeItem('duo_code_conjoint');
    }

    await AsyncStorage.multiRemove([
      'duo_code',
      'duo_code_conjoint',
      'duo_confirmation_affichee',
      'reponses_conjoint_cache',
      'jours_reveles',
      'niveau_commun_cache',
      'failles_communes_cache',
    ]);

    const nouveauCode = await obtenirOuCreerCode();
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
    ]);

    return { succes: true };
  } catch (e) {
    return { succes: false, message: e.message };
  }
};
