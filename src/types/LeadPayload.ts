export interface LeadPayload {
  // Fields flagged "Include in MetaData Blob" in SPEC.md Section 4
  Metadata: {
    own_rent: string | null
    water_source: string | null
    taste_odor: string | null
    timeline: string | null
    financing: boolean | null
  }

  // Contact + survey fields
  zip_code: string
  first_name: string
  last_name: string
  email: string
  // ASSUMPTION: phone is treated as required — Step 3 marks it required in the spec.
  // The open TODO in SPEC.md Section 5 will be resolved when confirmed.
  phone: string

  // Attribution — auto-captured at mount, never shown to the user
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  referrer: string | null
  submitted_at: string // ISO 8601

  // Page attribution — auto-captured from window.location at submission time
  full_domain: string | null           // e.g. https://www.example.com/heloc
  lead_submission_page: string | null  // e.g. /heloc
  root_domain: string | null           // e.g. example.com
}
