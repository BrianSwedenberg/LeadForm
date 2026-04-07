import type { LeadPayload } from '../types/LeadPayload'

// This is the only file in the codebase that may reference the backend.
// Phase 1: POST to n8n webhook → Google Sheet.
// Phase 2: swap the body of this function for a Supabase JS client insert.
export async function submitLead(payload: LeadPayload): Promise<void> {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL

  if (!webhookUrl) {
    throw new Error('VITE_N8N_WEBHOOK_URL is not defined')
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}`)
  }
}
