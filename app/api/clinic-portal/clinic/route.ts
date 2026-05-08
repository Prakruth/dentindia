/**
 * GET  /api/clinic-portal/clinic
 * PATCH /api/clinic-portal/clinic
 *
 * Auth:     required — clinic_admin or clinic_staff, status approved
 * Request (PATCH): { phone?, timings?, about?, tagline?, image?, is_active? }
 *                  — all fields optional; clinic_id comes from session, not body
 *
 * Response 200: { data: Clinic }
 * Errors:   400 | 401 | 403 | 404 | 500
 *
 * GET  → returns the caller's full clinic row.
 * PATCH → updates only the permitted staff-editable fields.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, isClinicStaff } from '@/lib/auth-helpers'
import { createAdminClient } from '@/lib/supabase/admin'

// Fields clinic staff are permitted to edit (is_active and rating are admin-only)
const ALLOWED_UPDATE_FIELDS = [
  'doctor', 'qualification', 'experience',
  'city', 'area', 'address',
  'phone', 'email',
  'timings', 'tagline', 'about', 'image',
  'languages', 'specializations',
] as const
type AllowedField = (typeof ALLOWED_UPDATE_FIELDS)[number]

export async function GET() {
  // 1. Verify caller
  const { user, clinicUser, error } = await getAuthenticatedUser()

  if (error === 'Not authenticated' || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (error) {
    console.error('[clinic-portal/clinic GET] auth error', error)
    return NextResponse.json({ error: 'Failed to verify permissions' }, { status: 500 })
  }

  if (!isClinicStaff(clinicUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Fetch the clinic
  const adminClient = createAdminClient()

  const { data: clinic, error: clinicError } = await adminClient
    .from('clinics')
    .select('*')
    .eq('id', clinicUser!.clinic_id)
    .single()

  if (clinicError || !clinic) {
    console.error('[clinic-portal/clinic GET] clinic query error', clinicError)
    return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
  }

  return NextResponse.json({ data: clinic }, { status: 200 })
}

export async function PATCH(request: NextRequest) {
  // 1. Verify caller
  const { user, clinicUser, error } = await getAuthenticatedUser()

  if (error === 'Not authenticated' || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (error) {
    console.error('[clinic-portal/clinic PATCH] auth error', error)
    return NextResponse.json({ error: 'Failed to verify permissions' }, { status: 500 })
  }

  if (!isClinicStaff(clinicUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Parse body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Request body must be an object' }, { status: 400 })
  }

  // 3. Strip to only permitted fields — never allow clinic_id, id, or admin fields
  const incoming = body as Record<string, unknown>
  const updates: Partial<Record<AllowedField, unknown>> = {}

  for (const field of ALLOWED_UPDATE_FIELDS) {
    if (field in incoming) {
      updates[field] = incoming[field]
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: `No valid fields provided. Allowed: ${ALLOWED_UPDATE_FIELDS.join(', ')}` },
      { status: 400 }
    )
  }

  // 4. Validate array fields
  for (const arrField of ['languages', 'specializations'] as const) {
    if (arrField in updates && !Array.isArray(updates[arrField])) {
      return NextResponse.json({ error: `${arrField} must be an array` }, { status: 400 })
    }
  }

  // 5. Apply update
  const adminClient = createAdminClient()

  const { data: clinic, error: updateError } = await adminClient
    .from('clinics')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', clinicUser!.clinic_id)
    .select('*')
    .single()

  if (updateError || !clinic) {
    console.error('[clinic-portal/clinic PATCH] update error', updateError)
    return NextResponse.json({ error: 'Failed to update clinic' }, { status: 500 })
  }

  return NextResponse.json({ data: clinic }, { status: 200 })
}
