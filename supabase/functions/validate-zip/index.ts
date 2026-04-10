import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const json = (allowed: boolean) =>
    new Response(JSON.stringify({ allowed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  let zip: string | undefined
  try {
    const body = await req.json()
    zip = typeof body?.zip === 'string' ? body.zip.trim() : undefined
  } catch {
    return json(false)
  }

  if (!zip) return json(false)

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    )

    const { data, error } = await supabase
      .from('allowed_zip_codes')
      .select('zip_code')
      .eq('zip_code', zip)
      .maybeSingle()

    if (error) {
      console.error('DB error:', error.message)
      return json(false)
    }

    return json(data !== null)
  } catch (err) {
    console.error('Unexpected error:', err)
    return json(false)
  }
})
