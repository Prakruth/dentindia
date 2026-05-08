/**
 * GET /api/auth/me
 *
 * Auth:    required (reads session from cookie)
 * Request: none
 *
 * Response 200: { user_id: string, email: string, role: string, clinic_id: string, status: string }
 * Response 401: { error: string }  — not authenticated
 * Response 403: { error: string }  — authenticated but no role assigned
 * Response 500: { error: string }  — DB error
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  // 1. Verify the session — getUser() re-validates the JWT with Supabase Auth server
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // 2. Fetch the user's role and associated clinic from clinic_users
  const { data: clinicUser, error: cuError } = await supabase
    .from('clinic_users')
    .select('role, clinic_id, status')
    .eq('user_id', user.id)
    .single()

  if (cuError) {
    console.error('[me] clinic_users lookup error', cuError)
    return NextResponse.json({ error: 'Failed to load user profile' }, { status: 500 })
  }

  if (!clinicUser) {
    return NextResponse.json({ error: 'No role assigned' }, { status: 403 })
  }

  return NextResponse.json(
    {
      user_id: user.id,
      email: user.email,
      role: clinicUser.role,
      clinic_id: clinicUser.clinic_id,
      status: clinicUser.status,
    },
    { status: 200 }
  )
}
