-- Migration: add_page_attribution_fields
-- Adds full_domain, lead_submission_page, and root_domain to Leads_Metadata.
-- These are auto-captured from window.location at submission time — not user input.
-- Also replaces submit_lead() to accept and insert the three new parameters.

ALTER TABLE "Leads_Metadata"
  ADD COLUMN "full_domain"           TEXT,
  ADD COLUMN "lead_submission_page"  TEXT,
  ADD COLUMN "root_domain"           TEXT;

-- Replace the function with an updated signature that includes the new fields.
-- SECURITY DEFINER and GRANT are preserved from the original migration.
CREATE OR REPLACE FUNCTION submit_lead(
  p_first_name             TEXT,
  p_last_name              TEXT,
  p_zip_code               TEXT,
  p_phone                  TEXT,
  p_email                  TEXT,
  p_submitted_at           TIMESTAMPTZ,
  p_utm_source             TEXT,
  p_utm_medium             TEXT,
  p_utm_campaign           TEXT,
  p_referrer               TEXT,
  p_survey_answers         JSONB,
  p_full_domain            TEXT,
  p_lead_submission_page   TEXT,
  p_root_domain            TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lead_id INTEGER;
BEGIN
  INSERT INTO "Leads" (
    "first_name", "last_name", "zip_code", "phone", "email", "submitted_at"
  )
  VALUES (
    p_first_name, p_last_name, p_zip_code, p_phone, p_email, p_submitted_at
  )
  RETURNING "LeadID" INTO v_lead_id;

  INSERT INTO "Leads_Metadata" (
    "LeadID", "utm_source", "utm_medium", "utm_campaign",
    "referrer", "lead_form_survey_answers",
    "full_domain", "lead_submission_page", "root_domain"
  )
  VALUES (
    v_lead_id, p_utm_source, p_utm_medium, p_utm_campaign,
    p_referrer, p_survey_answers,
    p_full_domain, p_lead_submission_page, p_root_domain
  );
END;
$$;

-- Re-grant execute to anon for the updated function signature.
GRANT EXECUTE ON FUNCTION submit_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TIMESTAMPTZ,
  TEXT, TEXT, TEXT, TEXT, JSONB,
  TEXT, TEXT, TEXT
) TO anon;
