import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, isClinicStaff } from '@/lib/auth-helpers'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const { user, clinicUser, error } = await getAuthenticatedUser()
  if (error === 'Not authenticated' || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (error || !isClinicStaff(clinicUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error: dbError } = await createAdminClient()
    .from('services')
    .select('*')
    .eq('clinic_id', clinicUser!.clinic_id)
    .order('created_at', { ascending: true })

  if (dbError) {
    console.error('[clinic-portal/services GET]', dbError)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [] }, { status: 200 })
}

export async function POST(request: NextRequest) {
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

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }
  if (!price_from || typeof price_from !== 'number') {
    return NextResponse.json({ error: 'price_from must be a number' }, { status: 400 })
  }

  const { data, error: dbError } = await createAdminClient()
    .from('services')
    .insert({
      clinic_id: clinicUser!.clinic_id,
      name: (name as string).trim(),
      description: typeof description === 'string' ? description.trim() : '',
      duration: typeof duration === 'string' ? duration.trim() : '',
      price_from: price_from as number,
      price_to: typeof price_to === 'number' ? price_to : null,
    })
    .select('*')
    .single()

  if (dbError) {
    console.error('[clinic-portal/services POST]', dbError)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
