import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('clinics')
      .select('id, name')
      .limit(1)

    if (error) {
      return Response.json({ error: error.message, code: error.code }, { status: 500 })
    }

    return Response.json({ success: true, data })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
