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

  // Calls the submit_lead() SECURITY DEFINER function, which inserts into
  // Leads and Leads_Metadata atomically. Running as the function owner avoids
  // the need for a SELECT policy on either table for the anon role.
  // The cast to `any` is needed because database.types.ts doesn't enumerate
  // RPCs — supabase-js otherwise types the args as `undefined`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.rpc as any)('submit_lead', {
    p_first_name:     payload.first_name,
    p_last_name:      payload.last_name,
    p_zip_code:       payload.zip_code,
    p_phone:          payload.phone,
    p_email:          payload.email,
    p_submitted_at:   payload.submitted_at,
    p_utm_source:     payload.utm_source,
    p_utm_medium:     payload.utm_medium,
    p_utm_campaign:   payload.utm_campaign,
    p_referrer:       payload.referrer,
    p_survey_answers: payload.Metadata,
  })

  if (error) {
    throw new Error(error.message)
  }
}
