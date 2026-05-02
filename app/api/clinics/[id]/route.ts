import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const id = params.id

  const { data: clinic, error } = await supabase
    .from('clinics')
    .select(`
      id, name, doctor, qualification, city, area, address, phone, email,
      rating, review_count, experience, tagline, about, languages, timings,
      specializations, image, created_at, updated_at,
      services(
        id, clinic_id, name, description, duration, price_from, price_to,
        rating, review_count, created_at,
        service_variants(id, service_id, type, price, price_min, price_max, duration, created_at)
      )
    `)
    .eq('id', id)
    .single()

  if (error || !clinic) {
    return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
  }

  return NextResponse.json(clinic)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const id = params.id
  const body = await request.json()
  const { services, ...clinicData } = body

  // Update clinic
  const { data: clinic, error } = await supabase
    .from('clinics')
    .update({
      ...clinicData,
      review_count: clinicData.reviewCount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Handle services if provided
  if (services && Array.isArray(services)) {
    // Delete existing services
    await supabase.from('services').delete().eq('clinic_id', id)

    // Insert new services
    for (const service of services) {
      const { variants, ...serviceData } = service

      const { data: svc, error: svcError } = await supabase
        .from('services')
        .insert([{
          clinic_id: id,
          ...serviceData,
          price_from: serviceData.priceFrom,
          price_to: serviceData.priceTo,
          review_count: serviceData.reviewCount,
        }])
        .select()
        .single()

      if (svcError) continue

      if (variants && Array.isArray(variants)) {
        await supabase
          .from('service_variants')
          .insert(variants.map(v => ({
            service_id: svc.id,
            ...v,
            price_min: v.priceMin,
            price_max: v.priceMax,
          })))
      }
    }
  }

  return NextResponse.json(clinic)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const id = params.id

  const { error } = await supabase
    .from('clinics')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
