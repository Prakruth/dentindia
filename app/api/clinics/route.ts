import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Clinic } from '@/lib/types'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')
  const city = searchParams.get('city')

  let query = supabase.from('clinics').select(`
    id, name, doctor, qualification, city, area, address, phone, email,
    rating, review_count, experience, tagline, about, languages, timings,
    specializations, image, created_at, updated_at,
    services(
      id, clinic_id, name, description, duration, price_from, price_to,
      rating, review_count, created_at,
      service_variants(id, service_id, type, price, price_min, price_max, duration, created_at)
    )
  `)

  if (search) {
    query = query.or(`name.ilike.%${search}%,area.ilike.%${search}%,doctor.ilike.%${search}%`)
  }

  if (city) {
    query = query.eq('city', city)
  }

  const { data: clinics, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(clinics || [])
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { services, ...clinicData } = body

  // Insert clinic
  const { data: clinic, error: clinicError } = await supabase
    .from('clinics')
    .insert([{
      ...clinicData,
      review_count: clinicData.reviewCount || 0,
    }])
    .select()
    .single()

  if (clinicError) {
    return NextResponse.json({ error: clinicError.message }, { status: 500 })
  }

  // Insert services
  if (services && Array.isArray(services)) {
    for (const service of services) {
      const { variants, ...serviceData } = service

      const { data: svc, error: svcError } = await supabase
        .from('services')
        .insert([{
          clinic_id: clinic.id,
          ...serviceData,
          price_from: serviceData.priceFrom,
          price_to: serviceData.priceTo,
          review_count: serviceData.reviewCount,
        }])
        .select()
        .single()

      if (svcError) continue

      // Insert variants
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

  return NextResponse.json(clinic, { status: 201 })
}
