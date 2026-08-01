-- ============================================================================
-- Migration : sécurité codes duo (expiration 48h + compteur tentatives)
-- ============================================================================
-- À COLLER TEL QUEL dans : Supabase Dashboard > SQL Editor > New query > Run
-- Un seul coup à jouer, idempotent (peut être rejouée sans erreur grâce aux
-- IF NOT EXISTS) donc pas de risque à la relancer par erreur.
--
-- Ne touche à aucune policy RLS, ni aux colonnes de paiement RevenueCat
-- (paiement_valide, expire_at, payeur, plan).
-- ============================================================================

-- 1. Nouvelle colonne : date d'expiration du code d'invitation (48h par défaut)
ALTER TABLE duos
  ADD COLUMN IF NOT EXISTS code_expire_at timestamptz NOT NULL DEFAULT (now() + interval '48 hours');

-- 2. Nouvelle colonne : compteur de tentatives de rejointe.
--    Non bloquant pour l'instant (juste incrémenté), servira de base à un
--    éventuel rate limiting plus tard.
ALTER TABLE duos
  ADD COLUMN IF NOT EXISTS tentatives_rejointe integer NOT NULL DEFAULT 0;

-- 3. Backfill des duos déjà en attente créés avant cette migration :
--    on recalcule l'expiration à partir de leur created_at réel plutôt que
--    de garder la valeur par défaut ci-dessus (qui vaudrait "maintenant + 48h"
--    au moment de la migration), pour éviter de prolonger artificiellement
--    des codes déjà anciens qui n'ont jamais été rejoints.
UPDATE duos
SET code_expire_at = created_at + interval '48 hours'
WHERE statut = 'en_attente';
