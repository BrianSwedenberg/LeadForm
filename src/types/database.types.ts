// Hand-authored types derived from supabase/migrations/20260408000000_initial_schema.sql
// and 20260408000001_add_submitted_at_and_referrer.sql
// Re-generate this file (or replace with `supabase gen types typescript`) after any schema change.

export interface Database {
  public: {
    Tables: {
      Leads: {
        Relationships: []
        Row: {
          LeadID: number
          first_name: string | null
          last_name: string | null
          zip_code: string | null
          phone: string | null
          email: string | null
          address1: string | null
          address2: string | null
          city: string | null
          state: string | null
          zip: string | null
          submitted_at: string | null
        }
        Insert: {
          LeadID?: number
          first_name?: string | null
          last_name?: string | null
          zip_code?: string | null
          phone?: string | null
          email?: string | null
          address1?: string | null
          address2?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          submitted_at?: string | null
        }
        Update: {
          LeadID?: number
          first_name?: string | null
          last_name?: string | null
          zip_code?: string | null
          phone?: string | null
          email?: string | null
          address1?: string | null
          address2?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          submitted_at?: string | null
        }
      }
      Leads_Metadata: {
        Relationships: []
        Row: {
          id: string
          LeadID: number | null
          utm_medium: string | null
          utm_source: string | null
          utm_campaign: string | null
          utm_term: string | null
          utm_content: string | null
          lead_form_survey_answers: Record<string, unknown> | null
          referrer: string | null
        }
        Insert: {
          id?: string
          LeadID?: number | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          lead_form_survey_answers?: Record<string, unknown> | null
          referrer?: string | null
        }
        Update: {
          id?: string
          LeadID?: number | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          lead_form_survey_answers?: Record<string, unknown> | null
          referrer?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
