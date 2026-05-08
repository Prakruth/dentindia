/**
 * GET /api/admin/users
 *
 * Auth:     required — super_admin only
 * Request:  none
 *
 * Response 200: { data: Array<clinic_users row + clinic_name + email> }
 * Errors:   401 | 403 | 500
 *
 * Returns all clinic_users records joined with clinic name, with
 * each user's email merged in from auth.users via the admin client.
 *
 * POST /api/admin/users
 *
 * Auth:     required — super_admin only
 * Request:  { email: string, password: string, clinic_id: string, role: 'clinic_admin' | 'clinic_staff' }
 *
 * Response 201: { data: { id, user_id, clinic_id, role, status, email } }
 * Errors:   400 | 401 | 403 | 409 | 500
 *
 * Creates an auth user and a corresponding clinic_users record with status 'approved'.
 * If any DB step fails after auth user creation, the auth user is deleted to avoid orphans.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, isSuperAdmin } from '@/lib/auth-helpers'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const VALID_ROLES = ['clinic_admin', 'clinic_staff'] as const
type ClinicRole = (typeof VALID_ROLES)[number]

function hasAdminClient() {
  return !!(process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-service-role-key-here')
}

export async function GET() {
  // 1. Verify caller is super_admin
  const { user, clinicUser, error } = await getAuthenticatedUser()

  if (error === 'Not authenticated' || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (error) {
    console.error('[admin/users GET] auth error', error)
    return NextResponse.json({ error: 'Failed to verify permissions' }, { status: 500 })
  }

  if (!isSuperAdmin(clinicUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Fetch all clinic_users + clinic names (super_admin RLS policy allows this)
  const supabaseClient = await createClient()

  const { data: clinicUsers, error: cuError } = await supabaseClient
    .from('clinic_users')
    .select(`
      id,
      user_id,
      clinic_id,
      role,
      status,
      created_at,
      updated_at,
      clinics ( name )
    `)
    .order('created_at', { ascending: false })

  if (cuError) {
    console.error('[admin/users GET] clinic_users query error', cuError)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  // 3. Fetch emails via admin client if service role key is available, else skip
  let emailMap = new Map<string, string>()
  if (hasAdminClient()) {
    const adminClient = createAdminClient()
    const { data: authData, error: authError } =
      await adminClient.auth.admin.listUsers({ perPage: 1000 })
    if (!authError && authData) {
      emailMap = new Map<string, string>(
        authData.users.map((u) => [u.id, u.email ?? ''])
      )
    }
  }

  // 4. Merge and reshape
  const data = (clinicUsers ?? []).map((cu) => {
    // Supabase returns the joined row as an array for left joins; take first element
    const clinicRow = Array.isArray(cu.clinics)
      ? (cu.clinics[0] as { name: string } | undefined) ?? null
      : (cu.clinics as unknown as { name: string } | null)
    return {
      id: cu.id,
      user_id: cu.user_id,
      clinic_id: cu.clinic_id,
      role: cu.role,
      status: cu.status,
      created_at: cu.created_at,
      updated_at: cu.updated_at,
      clinic_name: clinicRow?.name ?? null,
      email: emailMap.get(cu.user_id) ?? null,
    }
  })

  return NextResponse.json({ data }, { status: 200 })
}

export async function POST(request: NextRequest) {
  // 1. Verify caller is super_admin
  const { user, clinicUser, error } = await getAuthenticatedUser()

  if (error === 'Not authenticated' || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (error) {
    console.error('[admin/users POST] auth error', error)
    return NextResponse.json({ error: 'Failed to verify permissions' }, { status: 500 })
  }

  if (!isSuperAdmin(clinicUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Parse and validate request body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email, password, clinic_id, role } = body as Record<string, unknown>

  const validationErrors: string[] = []

  if (!email || typeof email !== 'string' || email.trim() === '') {
    validationErrors.push('email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    validationErrors.push('email must be a valid email address')
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    validationErrors.push('password is required and must be at least 8 characters')
  }

  if (!clinic_id || typeof clinic_id !== 'string' || clinic_id.trim() === '') {
    validationErrors.push('clinic_id is required')
  }

  if (!role || !VALID_ROLES.includes(role as ClinicRole)) {
    validationErrors.push(`role must be one of: ${VALID_ROLES.join(', ')}`)
  }

  if (validationErrors.length > 0) {
    return NextResponse.json({ error: validationErrors.join('; ') }, { status: 400 })
  }

  const safeEmail = (email as string).trim().toLowerCase()
  const safeClinicId = (clinic_id as string).trim()
  const safeRole = role as ClinicRole

  // 3. Create auth user
  let authUserId: string
  let authUserEmail: string

  if (hasAdminClient()) {
    // Preferred: use service role to create user directly (no email confirmation)
    const adminClient = createAdminClient()

    // Verify clinic exists
    const { data: clinic } = await adminClient
      .from('clinics').select('id').eq('id', safeClinicId).single()
    if (!clinic) {
      return NextResponse.json({ error: `Clinic '${safeClinicId}' not found` }, { status: 400 })
    }

    const { data: authData, error: createError } = await adminClient.auth.admin.createUser({
      email: safeEmail,
      password: password as string,
      email_confirm: true,
    })
    if (createError) {
      if (
        createError.message?.toLowerCase().includes('already been registered') ||
        createError.message?.toLowerCase().includes('already exists') ||
        (createError as { status?: number }).status === 422
      ) {
        return NextResponse.json({ error: 'A user with that email address already exists' }, { status: 409 })
      }
      console.error('[admin/users POST] createUser error', createError)
      return NextResponse.json({ error: 'Failed to create auth user' }, { status: 500 })
    }
    authUserId = authData.user.id
    authUserEmail = authData.user.email ?? safeEmail
  } else {
    // Fallback: use signUp (works without service role key)
    const supabase = await createClient()

    // Verify clinic exists using authenticated client
    const { data: clinic } = await supabase
      .from('clinics').select('id').eq('id', safeClinicId).single()
    if (!clinic) {
      return NextResponse.json({ error: `Clinic '${safeClinicId}' not found` }, { status: 400 })
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: safeEmail,
      password: password as string,
    })
    if (signUpError) {
      if (signUpError.message?.toLowerCase().includes('already registered') || signUpError.status === 422) {
        return NextResponse.json({ error: 'A user with that email address already exists' }, { status: 409 })
      }
      console.error('[admin/users POST] signUp error', signUpError)
      return NextResponse.json({ error: 'Failed to create auth user' }, { status: 500 })
    }
    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create auth user — check Supabase email confirmation settings' }, { status: 500 })
    }
    authUserId = authData.user.id
    authUserEmail = authData.user.email ?? safeEmail
  }

  // 4. Insert clinic_users row via SECURITY DEFINER function
  const supabase = await createClient()
  const { data: newId, error: fnError } = await supabase.rpc('admin_create_clinic_user', {
    p_user_id: authUserId,
    p_clinic_id: safeClinicId,
    p_role: safeRole,
  })

  if (fnError) {
    console.error('[admin/users POST] admin_create_clinic_user error', fnError)
    if (hasAdminClient()) {
      await createAdminClient().auth.admin.deleteUser(authUserId)
    }
    return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
  }

  return NextResponse.json(
    {
      data: {
        id: newId,
        user_id: authUserId,
        clinic_id: safeClinicId,
        role: safeRole,
        status: 'approved',
        email: authUserEmail,
      },
    },
    { status: 201 }
  )
}
