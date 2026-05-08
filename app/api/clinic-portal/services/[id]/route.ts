import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, isClinicStaff } from '@/lib/auth-helpers'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, clinicUser, error } = await getAuthenticatedUser()
  if (error === 'Not authenticated' || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (error || !isClinicStaff(clinicUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { name, description, duration, price_from, price_to } = body as Record<string, unknown>
  const updates: Record<string, unknown> = {}
  if (typeof name === 'string') updates.name = name.trim()
  if (typeof description === 'string') updates.description = description.trim()
  if (typeof duration === 'string') updates.duration = duration.trim()
  if (typeof price_from === 'number') updates.price_from = price_from
  if (price_to !== undefined) updates.price_to = typeof price_to === 'number' ? price_to : null

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  // Verify service belongs to this clinic
  const { data: existing } = await adminClient
    .from('services').select('clinic_id').eq('id', params.id).single()
  if (!existing || existing.clinic_id !== clinicUser!.clinic_id) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 })
  }

  const { data, error: dbError } = await adminClient
    .from('services').update(updates).eq('id', params.id).select('*').single()

  if (dbError) {
    console.error('[clinic-portal/services PATCH]', dbError)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 200 })
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const { user, clinicUser, error } = await getAuthenticatedUser()
  if (error === 'Not authenticated' || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (error || !isClinicStaff(clinicUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const adminClient = createAdminClient()

  const { data: existing } = await adminClient
    .from('services').select('clinic_id').eq('id', params.id).single()
  if (!existing || existing.clinic_id !== clinicUser!.clinic_id) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 })
  }

  const { error: dbError } = await adminClient.from('services').delete().eq('id', params.id)

  if (dbError) {
    console.error('[clinic-portal/services DELETE]', dbError)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
