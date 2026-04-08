// Lazy-initialized Supabase client — Phase 2.
// Only call getSupabaseClient() at insert time, never at module load,
// so the client is not initialized during the embed bundle evaluation.
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

let client: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient(): ReturnType<typeof createClient<Database>> {
  if (!client) {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!url || !key) {
      throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined')
    }

    client = createClient<Database>(url, key)
  }

  return client
}
