/**
 * POST /api/auth/login
 *
 * Auth:    none (public endpoint — sets session cookie on success)
 * Request: { email: string, password: string }
 *
 * Response 200: { role: string, clinic_id: string, redirect: string }
 * Response 400: { error: string }  — validation failure
 * Response 401: { error: string }  — wrong credentials
 * Response 403: { error: string }  — account not found / pending / rejected
 * Response 500: { error: string }  — server / DB error
 *
 * The Supabase server client writes the session cookie automatically via
 * the cookies() integration — no manual Set-Cookie header required.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ── Validation ────────────────────────────────────────────────────────────

function validateBody(body: unknown): {
  email: string
  password: string
} | { validationError: string } {
  if (typeof body !== 'object' || body === null) {
    return { validationError: 'Request body must be a JSON object' }
  }

  const { email, password } = body as Record<string, unknown>

  if (!email || typeof email !== 'string' || !email.trim()) {
    return { validationError: 'email is required' }
  }
  if (!password || typeof password !== 'string' || !password) {
    return { validationError: 'password is required' }
  }

  return { email: email.trim().toLowerCase(), password }
}

// ── Handler ────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Parse & validate body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const validated = validateBody(body)
  if ('validationError' in validated) {
    return NextResponse.json({ error: validated.validationError }, { status: 400 })
  }

  const { email, password } = validated

  const supabase = await createClient()

  // 2. Sign in with Supabase Auth — session cookie set by the server client
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError || !signInData.session) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const userId = signInData.session.user.id

  // 3. Look up the clinic_users record for this auth user
  const { data: clinicUser, error: cuError } = await supabase
    .from('clinic_users')
    .select('role, clinic_id, status')
    .eq('user_id', userId)
    .single()

  if (cuError || !clinicUser) {
    // Sign the user back out so they don't hold an orphaned session
    await supabase.auth.signOut()
    return NextResponse.json({ error: 'Account not found' }, { status: 403 })
  }

  // 4. Check approval status
  if (clinicUser.status === 'pending') {
    await supabase.auth.signOut()
    return NextResponse.json(
      { error: 'Your account is pending approval' },
      { status: 403 }
    )
  }

  if (clinicUser.status === 'rejected') {
    await supabase.auth.signOut()
    return NextResponse.json(
      { error: 'Your account has been rejected' },
      { status: 403 }
    )
  }

  // 5. Successful login — return role info and redirect target
  const redirect =
    clinicUser.role === 'super_admin' ? '/admin/clinics' : '/clinic-portal'

  return NextResponse.json(
    {
      role: clinicUser.role,
      clinic_id: clinicUser.clinic_id,
      redirect,
    },
    { status: 200 }
  )
}
