-- ============================================================================
-- Migration : tranche d'âge optionnelle à l'inscription (segmentation)
-- ============================================================================
-- À COLLER TEL QUEL dans : Supabase Dashboard > SQL Editor > New query > Run
-- Idempotent (IF NOT EXISTS) — peut être rejouée sans erreur.
--
-- Champ facultatif, sans vérification de majorité, utilisé uniquement pour
-- de la segmentation marketing/analytics. Valeurs attendues côté app :
-- '18-24' | '25-34' | '35-44' | '45-54' | '55+' | NULL.
-- ============================================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS tranche_age text;
