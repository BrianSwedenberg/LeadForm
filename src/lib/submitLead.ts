import type { LeadPayload } from '../types/LeadPayload'

// This is the only file in the codebase that may reference the backend.
// Phase 2: Supabase JS client — inserts into Leads, then Leads_Metadata.

// ─── Phase 1 (n8n webhook) — kept for reference ───────────────────────────
// import type { LeadPayload } from '../types/LeadPayload'
//
// export async function submitLead(payload: LeadPayload): Promise<void> {
//   const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
//
//   if (!webhookUrl) {
//     throw new Error('VITE_N8N_WEBHOOK_URL is not defined')
//   }
//
//   const response = await fetch(webhookUrl, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   })
//
//   if (!response.ok) {
//     throw new Error(`Submission failed with status ${response.status}`)
//   }
// }
// ──────────────────────────────────────────────────────────────────────────

import { getSupabaseClient } from './supabase'

export async function submitLead(payload: LeadPayload): Promise<void> {
  const supabase = getSupabaseClient()

  // Step 1: insert the lead and get back the generated LeadID
  const { data: leadRow, error: leadError } = await supabase
    .from('Leads')
    .insert({
      first_name: payload.first_name,
      last_name: payload.last_name,
      zip_code: payload.zip_code,
      phone: payload.phone,
      email: payload.email,
      submitted_at: payload.submitted_at,
    })
    .select('LeadID')
    .single()

  if (leadError) {
    throw new Error(leadError.message)
  }

  // Step 2: insert metadata linked to the new lead
  const { error: metaError } = await supabase
    .from('Leads_Metadata')
    .insert({
      LeadID: leadRow.LeadID,
      utm_source: payload.utm_source,
      utm_medium: payload.utm_medium,
      utm_campaign: payload.utm_campaign,
      referrer: payload.referrer,
      lead_form_survey_answers: payload.Metadata,
    })

  if (metaError) {
    throw new Error(metaError.message)
  }
}
