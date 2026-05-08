/**
 * PATCH /api/clinic-portal/bookings/[id]
 *
 * Auth:     required — clinic_admin or clinic_staff, status approved
 * Params:   id = bookings.id (UUID)
 * Request:  { status: 'confirmed' | 'completed' | 'cancelled' }
 *
 * Response 200: { data: updated_booking }
 * Errors:   400 | 401 | 403 | 404 | 500
 *
 * Clinic staff can only update bookings that belong to their own clinic.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, isClinicStaff } from '@/lib/auth-helpers'
import { createAdminClient } from '@/lib/supabase/admin'

const VALID_STATUSES = ['confirmed', 'completed', 'cancelled'] as const
type BookingStatus = (typeof VALID_STATUSES)[number]

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  // 1. Verify caller is an approved clinic staff member
  const { user, clinicUser, error } = await getAuthenticatedUser()

  if (error === 'Not authenticated' || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (error) {
    console.error('[clinic-portal/bookings/[id] PATCH] auth error', error)
    return NextResponse.json({ error: 'Failed to verify permissions' }, { status: 500 })
  }

  if (!isClinicStaff(clinicUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Validate request body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { status } = body as Record<string, unknown>

  if (!status || !VALID_STATUSES.includes(status as BookingStatus)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    )
  }

  const newStatus = status as BookingStatus
  const adminClient = createAdminClient()

  // 3. Fetch the booking to verify ownership
  const { data: booking, error: fetchError } = await adminClient
    .from('bookings')
    .select('id, clinic_id, status')
    .eq('id', id)
    .single()

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // 4. Verify the booking belongs to the caller's clinic
  if (booking.clinic_id !== clinicUser!.clinic_id) {
    return NextResponse.json(
      { error: 'Forbidden: booking does not belong to your clinic' },
      { status: 403 }
    )
  }

  // 5. Update the booking status
  const { data: updated, error: updateError } = await adminClient
    .from('bookings')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()

  if (updateError || !updated) {
    console.error('[clinic-portal/bookings/[id] PATCH] update error', updateError)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }

  return NextResponse.json({ data: updated }, { status: 200 })
}
