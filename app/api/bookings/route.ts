import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Booking } from '@/lib/types'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(bookings || [])
}

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  const body: Partial<Booking> = await request.json()

  // Validate required fields
  if (!body.clinic_id || !body.patient_name || !body.patient_phone || !body.preferred_date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Check for duplicate pending booking (same clinic + phone + date)
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('clinic_id', body.clinic_id)
    .eq('patient_phone', body.patient_phone)
    .eq('preferred_date', body.preferred_date)
    .eq('status', 'pending')
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Duplicate booking' }, { status: 409 })
  }

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert([{
      clinic_id: body.clinic_id,
      patient_name: body.patient_name,
      patient_phone: body.patient_phone,
      service_name: body.service_name,
      preferred_date: body.preferred_date,
      preferred_time: body.preferred_time,
      notes: body.notes || null,
      status: 'pending',
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(booking, { status: 201 })
}
