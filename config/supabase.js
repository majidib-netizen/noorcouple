// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
// ⚠️ Remplace ces valeurs par celles de TON projet Supabase
// Tutoriel : voir GUIDE_COMPLET_V8.md section Supabase
//
// Où trouver ces valeurs :
// → https://supabase.com → ton projet → Settings → API
//   - Project URL    → REMPLACE_PAR_TON_URL
//   - anon public    → REMPLACE_PAR_TA_CLE_ANON

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://sebdcfelxbaojgrtkhmi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlYmRjZmVseGJhb2pncnRraG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NDAwNDIsImV4cCI6MjA5MTUxNjA0Mn0.xdDnYLeuGWaNZXFkU8ALvZpbc7c1Y6p5HzQX4z-72bs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
