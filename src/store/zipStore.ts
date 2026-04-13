import { create } from 'zustand'
import { getSupabaseClient } from '../lib/supabase'

interface ZipStore {
  allowedZips: Set<string>
  status: 'idle' | 'loading' | 'ready' | 'error'
  fetchAllowedZips: () => Promise<void>
  isZipAllowed: (zip: string) => boolean
}

export const useZipStore = create<ZipStore>((set, get) => ({
  allowedZips: new Set(),
  status: 'idle',

  fetchAllowedZips: async () => {
    set({ status: 'loading' })
    try {
      const supabase = getSupabaseClient()
      // allowed_zip_codes is not yet in database.types.ts — cast is consistent
      // with how supabase.rpc is handled in submitLead.ts until types are regenerated.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('allowed_zip_codes')
        .select('zip_code')

      if (error) throw error

      set({
        allowedZips: new Set((data as { zip_code: string }[]).map((row) => row.zip_code)),
        status: 'ready',
      })
    } catch (err) {
      console.error('Failed to fetch allowed zip codes:', err)
      set({ status: 'error' })
    }
  },

  isZipAllowed: (zip: string) => {
    const { status, allowedZips } = get()
    if (status !== 'ready') return false
    return allowedZips.has(zip.trim())
  },
}))
