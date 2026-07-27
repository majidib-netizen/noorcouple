import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

const REVENUECAT_API_KEY = Platform.OS === 'ios'
  ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
  : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

const isTestKey = !!REVENUECAT_API_KEY && REVENUECAT_API_KEY.startsWith('test_');
const isProductionBuild = Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

const PLAN_PAR_PRODUIT = {
  noorcouple_monthly: 'mensuel',
  noorcouple_annual: 'annuel',
};

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
  if (!REVENUECAT_API_KEY) {
    console.log('[REVENUECAT] Clé API manquante pour', Platform.OS, '— init ignorée.');
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
  if (Platform.OS === 'web') {
    return { success: false, userCancelled: false, network: false, message: 'web_not_supported', customerInfo: null };
  }
  if (!isConfigured) {
    console.log('[REVENUECAT] purchasePackage appelé sans SDK initialisé, ignoré.');
    return { success: false, userCancelled: false, network: false, message: 'not_configured', customerInfo: null };
  }
  if (!packageObj) {
    console.log('[REVENUECAT] purchasePackage appelé sans package.');
    return { success: false, userCancelled: false, network: false, message: 'no_package', customerInfo: null };
  }
  try {
    const result = await Purchases.purchasePackage(packageObj);
    console.log('[REVENUECAT] Achat réussi:', packageObj.identifier);
    return { success: true, userCancelled: false, network: false, message: null, customerInfo: result?.customerInfo || null };
  } catch (e) {
    if (e?.userCancelled) {
      console.log('[REVENUECAT] Achat annulé par l\'utilisateur.');
      return { success: false, userCancelled: true, network: false, message: e?.message || 'user_cancelled', customerInfo: null };
    }
    const network = e?.code === 'NETWORK_ERROR'
      || (typeof e?.underlyingErrorMessage === 'string' && e.underlyingErrorMessage.toLowerCase().includes('network'));
    console.log('[REVENUECAT] Erreur purchasePackage:', e?.message || e);
    return { success: false, userCancelled: false, network: !!network, message: e?.message || 'purchase_error', customerInfo: null };
  }
};

export const getExpirationInfo = (customerInfo) => {
  const entitlement = customerInfo?.entitlements?.active?.['premium'];
  if (!entitlement) return { expireAt: null, plan: null };
  const expireAt = entitlement.expirationDate
    || (entitlement.expirationDateMillis ? new Date(entitlement.expirationDateMillis).toISOString() : null);
  const plan = PLAN_PAR_PRODUIT[entitlement.productIdentifier] || null;
  return { expireAt, plan };
};
