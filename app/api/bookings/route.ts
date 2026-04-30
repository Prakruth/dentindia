import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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
  const supabase = await createClient()
  const body: Booking = await request.json()

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert([{
      clinic_id: body.clinic_id,
      patient_name: body.patient_name,
      patient_email: body.patient_email,
      patient_phone: body.patient_phone,
      service_name: body.service_name,
      preferred_date: body.preferred_date,
      preferred_time: body.preferred_time,
      notes: body.notes,
      status: 'pending',
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(booking, { status: 201 })
}
