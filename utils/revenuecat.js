import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

const REVENUECAT_API_KEY = 'test_bAAclVHsbWhEGzuFbFqJzUDwohL';
const isTestKey = REVENUECAT_API_KEY.startsWith('test_');
const isProductionBuild = Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

let isConfigured = false;

export const initRevenueCat = async () => {
  if (Platform.OS === 'web') {
    console.log('[REVENUECAT] Web détecté, init ignorée.');
    return;
  }
  if (isConfigured) {
    console.log('[REVENUECAT] Déjà initialisé, init ignorée.');
    return;
  }
  if (isTestKey && isProductionBuild) {
    console.log('[REVENUECAT] Clé test détectée en build production, init ignorée.');
    return;
  }
  try {
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    await Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);
    isConfigured = true;
    console.log('[REVENUECAT] SDK initialisé avec succès.');
  } catch (e) {
    console.log('[REVENUECAT] Erreur init:', e?.message || e);
  }
};

export const hasPremiumAccess = async () => {
  if (Platform.OS === 'web') return false;
  if (!isConfigured) {
    console.log('[REVENUECAT] hasPremiumAccess appelé sans SDK initialisé, ignoré.');
    return false;
  }
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const actif = Object.keys(customerInfo?.entitlements?.active || {}).length > 0;
    console.log('[REVENUECAT] hasPremiumAccess:', actif);
    return actif;
  } catch (e) {
    console.log('[REVENUECAT] Erreur hasPremiumAccess:', e?.message || e);
    return false;
  }
};

export const getOfferings = async () => {
  if (Platform.OS === 'web') return null;
  if (!isConfigured) {
    console.log('[REVENUECAT] getOfferings appelé sans SDK initialisé, ignoré.');
    return null;
  }
  try {
    const offerings = await Purchases.getOfferings();
    console.log('[REVENUECAT] Offerings récupérées:', offerings?.current?.identifier || 'aucune offering courante');
    return offerings;
  } catch (e) {
    console.log('[REVENUECAT] Erreur getOfferings:', e?.message || e);
    return null;
  }
};

export const purchasePackage = async (packageObj) => {
  if (Platform.OS === 'web') return null;
  if (!isConfigured) {
    console.log('[REVENUECAT] purchasePackage appelé sans SDK initialisé, ignoré.');
    return null;
  }
  if (!packageObj) {
    console.log('[REVENUECAT] purchasePackage appelé sans package.');
    return null;
  }
  try {
    const result = await Purchases.purchasePackage(packageObj);
    console.log('[REVENUECAT] Achat réussi:', packageObj.identifier);
    return result;
  } catch (e) {
    if (e?.userCancelled) {
      console.log('[REVENUECAT] Achat annulé par l\'utilisateur.');
    } else {
      console.log('[REVENUECAT] Erreur purchasePackage:', e?.message || e);
    }
    return null;
  }
};
