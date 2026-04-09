-- Migration: submit_lead_fn
-- Creates a SECURITY DEFINER function that inserts into Leads and Leads_Metadata
-- atomically. Running as the function owner (postgres) means the RETURNING clause
-- is not subject to RLS SELECT policies, so the anon role does not need a SELECT
-- policy on either table.

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
  p_survey_answers         JSONB
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
    "referrer", "lead_form_survey_answers"
  )
  VALUES (
    v_lead_id, p_utm_source, p_utm_medium, p_utm_campaign,
    p_referrer, p_survey_answers
  );
END;
$$;

-- Allow anonymous callers to execute this function.
-- All other table-level access remains restricted by RLS.
GRANT EXECUTE ON FUNCTION submit_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TIMESTAMPTZ,
  TEXT, TEXT, TEXT, TEXT, JSONB
) TO anon;
