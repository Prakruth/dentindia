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

  const body = await request.json()
  const { services, ...clinicData } = body

  // Insert clinic
  const { data: clinic, error: clinicError } = await supabase
    .from('clinics')
    .insert([{
      id: clinicData.id,
      name: clinicData.name,
      doctor: clinicData.doctor,
      qualification: clinicData.qualification,
      city: clinicData.city,
      area: clinicData.area,
      address: clinicData.address,
      phone: clinicData.phone,
      email: clinicData.email,
      rating: clinicData.rating || 4.5,
      review_count: clinicData.review_count || 0,
      experience: clinicData.experience || 0,
      tagline: clinicData.tagline || '',
      about: clinicData.about || '',
      languages: clinicData.languages || [],
      timings: clinicData.timings || '',
      specializations: clinicData.specializations || [],
      image: clinicData.image || '🦷',
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
          name: serviceData.name,
          description: serviceData.description || '',
          duration: serviceData.duration || '',
          price_from: serviceData.price_from || 0,
          price_to: serviceData.price_to,
          rating: serviceData.rating || 4.5,
          review_count: serviceData.review_count || 0,
        }])
        .select()
        .single()

      if (svcError) {
        console.error('Service insert error:', svcError)
        continue
      }

      // Insert variants
      if (variants && Array.isArray(variants)) {
        await supabase
          .from('service_variants')
          .insert(variants.map(v => ({
            service_id: svc.id,
            type: v.type,
            price: v.price,
            price_min: v.price_min,
            price_max: v.price_max,
            duration: v.duration,
          })))
      }
    }
  }

  return NextResponse.json(clinic, { status: 201 })
}
