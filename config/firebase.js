// ⚠️ IMPORTANT : Remplace ces valeurs par celles de TON projet Firebase
// Tutoriel pour obtenir ces valeurs : voir GUIDE_INSTALLATION.md section Firebase

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "REMPLACE_PAR_TA_CLE_API",
  authDomain: "REMPLACE_PAR_TON_AUTH_DOMAIN",
  projectId: "REMPLACE_PAR_TON_PROJECT_ID",
  storageBucket: "REMPLACE_PAR_TON_STORAGE_BUCKET",
  messagingSenderId: "REMPLACE_PAR_TON_SENDER_ID",
  appId: "REMPLACE_PAR_TON_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
