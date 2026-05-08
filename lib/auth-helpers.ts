import { createClient } from './supabase/server'

export interface ClinicUser {
  id: string
  user_id: string
  clinic_id: string
  role: string
  status: string
  created_at: string
  updated_at: string
}

export interface AuthResult {
  user: { id: string; email?: string } | null
  clinicUser: ClinicUser | null
  error: string | null
}

/**
 * Resolves the authenticated Supabase user and their clinic_users record.
 * Returns { user, clinicUser, error }.
 * Never throws — always returns a structured result.
 */
export async function getAuthenticatedUser(): Promise<AuthResult> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { user: null, clinicUser: null, error: 'Not authenticated' }
  }

  const { data: clinicUser, error: cuError } = await supabase
    .from('clinic_users')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (cuError && cuError.code !== 'PGRST116') {
    // PGRST116 = "no rows returned" — treat as no role, not a DB error
    console.error('[auth-helpers] clinic_users lookup error', cuError)
    return { user, clinicUser: null, error: 'Failed to load user profile' }
  }

  return { user, clinicUser: clinicUser ?? null, error: null }
}

/**
 * Returns true if the clinic_user record represents an active super_admin.
 */
export function isSuperAdmin(clinicUser: ClinicUser | null): boolean {
  return (
    clinicUser !== null &&
    clinicUser.role === 'super_admin' &&
    clinicUser.status === 'approved'
  )
}

/**
 * Returns true if the clinic_user record is an approved clinic_admin or clinic_staff.
 */
export function isClinicStaff(clinicUser: ClinicUser | null): boolean {
  return (
    clinicUser !== null &&
    (clinicUser.role === 'clinic_admin' || clinicUser.role === 'clinic_staff') &&
    clinicUser.status === 'approved'
  )
}
