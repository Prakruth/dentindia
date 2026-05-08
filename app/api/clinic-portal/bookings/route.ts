/**
 * GET /api/clinic-portal/bookings
 *
 * Auth:     required — clinic_admin or clinic_staff, status approved
 * Request:  none
 *
 * Response 200: { data: Booking[] }
 * Errors:   401 | 403 | 500
 *
 * Returns all bookings for the caller's clinic, newest first.
 */

import { NextResponse } from 'next/server'
import { getAuthenticatedUser, isClinicStaff } from '@/lib/auth-helpers'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  // 1. Verify caller is an approved clinic staff member
  const { user, clinicUser, error } = await getAuthenticatedUser()

  if (error === 'Not authenticated' || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (error) {
    console.error('[clinic-portal/bookings GET] auth error', error)
    return NextResponse.json({ error: 'Failed to verify permissions' }, { status: 500 })
  }

  if (!isClinicStaff(clinicUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const clinicId = clinicUser!.clinic_id

  // 2. Fetch bookings scoped to this clinic using admin client to bypass RLS
  const adminClient = createAdminClient()

  const { data: bookings, error: bookingsError } = await adminClient
    .from('bookings')
    .select('*')
    .eq('clinic_id', clinicId)
    .order('created_at', { ascending: false })

  if (bookingsError) {
    console.error('[clinic-portal/bookings GET] query error', bookingsError)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }

  return NextResponse.json({ data: bookings ?? [] }, { status: 200 })
}
