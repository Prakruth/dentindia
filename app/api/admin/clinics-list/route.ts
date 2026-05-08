/**
 * GET /api/admin/clinics-list
 *
 * Auth:     required — super_admin only
 * Request:  none
 *
 * Response 200: { data: Array<{ id: string, name: string }> }
 * Errors:   401 | 403 | 500
 *
 * Returns a lightweight list of all clinics (id + name only) for
 * populating dropdowns in admin UIs such as the create-user form.
 */

import { NextResponse } from 'next/server'
import { getAuthenticatedUser, isSuperAdmin } from '@/lib/auth-helpers'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  // 1. Verify caller is super_admin
  const { user, clinicUser, error } = await getAuthenticatedUser()

  if (error === 'Not authenticated' || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (error) {
    console.error('[admin/clinics-list GET] auth error', error)
    return NextResponse.json({ error: 'Failed to verify permissions' }, { status: 500 })
  }

  if (!isSuperAdmin(clinicUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Fetch all clinics using admin client to bypass RLS
  const adminClient = createAdminClient()

  const { data: clinics, error: dbError } = await adminClient
    .from('clinics')
    .select('id, name')
    .order('name', { ascending: true })

  if (dbError) {
    console.error('[admin/clinics-list GET] clinics query error', dbError)
    return NextResponse.json({ error: 'Failed to fetch clinics' }, { status: 500 })
  }

  return NextResponse.json({ data: clinics ?? [] }, { status: 200 })
}
