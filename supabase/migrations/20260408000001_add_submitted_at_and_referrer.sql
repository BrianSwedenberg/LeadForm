-- Migration: add_submitted_at_and_referrer
-- Adds submitted_at timestamp to Leads and referrer text to Leads_Metadata.
-- These fields are captured by the form at submission time but had no schema column.

ALTER TABLE "Leads"
  ADD COLUMN "submitted_at" TIMESTAMPTZ;

ALTER TABLE "Leads_Metadata"
  ADD COLUMN "referrer" TEXT;
