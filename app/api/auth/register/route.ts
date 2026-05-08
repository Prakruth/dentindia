import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function hasAdminClient() {
  return !!(
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-service-role-key-here'
  )
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateBody(body: unknown): {
  email: string
  password: string
  clinic_name: string
  phone: string
} | { validationError: string } {
  if (typeof body !== 'object' || body === null) {
    return { validationError: 'Request body must be a JSON object' }
  }

  const { email, password, clinic_name, phone } = body as Record<string, unknown>

  if (!email || typeof email !== 'string' || !email.trim()) {
    return { validationError: 'email is required' }
  }
  if (!EMAIL_RE.test(email.trim())) {
    return { validationError: 'email format is invalid' }
  }
  if (!password || typeof password !== 'string') {
    return { validationError: 'password is required' }
  }
  if (password.length < 8) {
    return { validationError: 'password must be at least 8 characters' }
  }
  if (!clinic_name || typeof clinic_name !== 'string' || !clinic_name.trim()) {
    return { validationError: 'clinic_name is required' }
  }
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return { validationError: 'phone is required' }
  }

  return {
    email: email.trim().toLowerCase(),
    password,
    clinic_name: clinic_name.trim(),
    phone: phone.trim(),
  }
}

export async function POST(request: NextRequest) {
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

  const { email, password, clinic_name, phone } = validated

  // 1. Create auth user
  let userId: string

  if (hasAdminClient()) {
    const adminClient = createAdminClient()
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { clinic_name },
    })

    if (authError) {
      if (
        authError.message?.toLowerCase().includes('already been registered') ||
        authError.message?.toLowerCase().includes('already exists') ||
        (authError as { status?: number }).status === 422
      ) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        )
      }
      console.error('[register] admin.createUser error', authError)
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }
    userId = authData.user.id
  } else {
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { clinic_name } },
    })

    if (authError) {
      if (
        authError.message?.toLowerCase().includes('already registered') ||
        authError.message?.toLowerCase().includes('already been registered') ||
        authError.status === 422
      ) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        )
      }
      if (
        authError.message?.toLowerCase().includes('invalid') &&
        authError.message?.toLowerCase().includes('email')
      ) {
        return NextResponse.json(
          { error: 'This email address is not accepted. Please use a valid business email.' },
          { status: 400 }
        )
      }
      if (authError.status === 429 || authError.message?.toLowerCase().includes('rate limit')) {
        return NextResponse.json(
          { error: 'Too many registration attempts. Please wait a few minutes and try again.' },
          { status: 429 }
        )
      }
      console.error('[register] signUp error', authError)
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    if (!authData.user) {
      return NextResponse.json(
        { message: 'Registration submitted. Awaiting approval.' },
        { status: 201 }
      )
    }
    userId = authData.user.id
  }

  // 2. Call SECURITY DEFINER function to insert clinic + clinic_users
  const supabase = await createClient()
  const { error: fnError } = await supabase.rpc('register_clinic', {
    p_user_id: userId,
    p_clinic_name: clinic_name,
    p_phone: phone,
    p_email: email,
  })

  if (fnError) {
    if (fnError.message?.includes('user_already_registered')) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }
    console.error('[register] register_clinic rpc error', fnError)
    if (hasAdminClient()) {
      await createAdminClient().auth.admin.deleteUser(userId)
    }
    return NextResponse.json({ error: 'Failed to create clinic record' }, { status: 500 })
  }

  return NextResponse.json(
    { message: 'Registration submitted. Awaiting approval.' },
    { status: 201 }
  )
}
