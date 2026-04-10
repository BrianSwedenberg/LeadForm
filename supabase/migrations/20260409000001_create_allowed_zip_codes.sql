-- Migration: create_allowed_zip_codes
-- Stores zip codes where service is available, used by the lead form zip validation feature

CREATE TABLE allowed_zip_codes (
  zip_code VARCHAR(10) PRIMARY KEY
);

COMMENT ON TABLE allowed_zip_codes IS 'Stores zip codes where service is available, used by the lead form zip validation feature';

-- Enable RLS
ALTER TABLE allowed_zip_codes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads
CREATE POLICY "Allow anonymous reads"
  ON allowed_zip_codes
  FOR SELECT
  TO anon
  USING (true);

-- ------------------------------------------------------------
-- Seed data — placeholder test zip codes (update before launch)
-- ------------------------------------------------------------
INSERT INTO allowed_zip_codes (zip_code) VALUES
  ('10001'),
  ('10002'),
  ('10003'),
  ('07030'),
  ('07302');
