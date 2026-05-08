/**
 * PATCH /api/admin/users/[id]
 *
 * Auth:     required — super_admin only
 * Params:   id = clinic_users.id (UUID)
 * Request:  { status: 'approved' | 'rejected' }
 *
 * Response 200: { data: { id: string, status: string } }
 * Errors:   400 | 401 | 403 | 404 | 500
 *
 * When approving, also sets clinics.is_active = true for the user's clinic.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, isSuperAdmin } from '@/lib/auth-helpers'
import { createAdminClient } from '@/lib/supabase/admin'

const VALID_STATUSES = ['approved', 'rejected'] as const
type AllowedStatus = (typeof VALID_STATUSES)[number]

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  // 1. Verify caller is super_admin
  const { user, clinicUser, error } = await getAuthenticatedUser()

  if (error === 'Not authenticated' || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (error) {
    console.error('[admin/users/[id] PATCH] auth error', error)
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

  const { status } = body as Record<string, unknown>

  if (!status || !VALID_STATUSES.includes(status as AllowedStatus)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    )
  }

  const newStatus = status as AllowedStatus

  // 3. Verify the clinic_users record exists
  const adminClient = createAdminClient()

  const { data: targetUser, error: fetchError } = await adminClient
    .from('clinic_users')
    .select('id, clinic_id, status')
    .eq('id', id)
    .single()

  if (fetchError || !targetUser) {
    return NextResponse.json({ error: 'User record not found' }, { status: 404 })
  }

  // 4. Update clinic_users status
  const { data: updated, error: updateError } = await adminClient
    .from('clinic_users')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, status')
    .single()

  if (updateError || !updated) {
    console.error('[admin/users/[id] PATCH] update error', updateError)
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 })
  }

  // 5. If approving, activate the associated clinic
  if (newStatus === 'approved' && targetUser.clinic_id) {
    const { error: clinicUpdateError } = await adminClient
      .from('clinics')
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq('id', targetUser.clinic_id)

    if (clinicUpdateError) {
      // Non-fatal: log but don't fail the whole request
      console.error(
        '[admin/users/[id] PATCH] clinic activation error',
        clinicUpdateError
      )
    }
  }

  return NextResponse.json({ data: { id: updated.id, status: updated.status } }, { status: 200 })
}
