// Hand-authored types derived from supabase/migrations/20260408000000_initial_schema.sql
// Re-generate this file (or replace with `supabase gen types typescript`) after any schema change.

export interface Database {
  public: {
    Tables: {
      Leads: {
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
        }
      }
      Leads_Metadata: {
        Row: {
          id: string
          LeadID: number | null
          utm_medium: string | null
          utm_source: string | null
          utm_campaign: string | null
          utm_term: string | null
          utm_content: string | null
          lead_form_survey_answers: Record<string, unknown> | null
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
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
