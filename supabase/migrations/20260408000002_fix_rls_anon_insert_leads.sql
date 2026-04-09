-- Migration: fix_rls_anon_insert_leads
-- The initial schema migration was tracked as applied before the remote tables
-- existed, so the RLS enable + policy from that migration never ran.
-- This migration re-establishes them idempotently.

-- Idempotent — safe to run even if RLS is already enabled.
ALTER TABLE "Leads" ENABLE ROW LEVEL SECURITY;

-- Drop both the original policy name and the target name before (re-)creating,
-- so this migration is safe to run regardless of prior state.
DROP POLICY IF EXISTS "anon_insert_leads" ON "Leads";
DROP POLICY IF EXISTS "Allow anonymous inserts" ON "Leads";

CREATE POLICY "Allow anonymous inserts"
  ON "Leads"
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Same treatment for Leads_Metadata — same root cause applies.
ALTER TABLE "Leads_Metadata" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_leads_metadata" ON "Leads_Metadata";
DROP POLICY IF EXISTS "Allow anonymous inserts" ON "Leads_Metadata";

CREATE POLICY "Allow anonymous inserts"
  ON "Leads_Metadata"
  FOR INSERT
  TO anon
  WITH CHECK (true);
