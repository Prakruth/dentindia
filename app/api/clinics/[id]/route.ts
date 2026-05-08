import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedUser, isSuperAdmin } from '@/lib/auth-helpers'

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
  // Only super_admin can update clinics
  const { user, clinicUser, error: authError } = await getAuthenticatedUser()

  if (authError === 'Not authenticated' || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (authError) {
    console.error('[clinics/[id] PATCH] auth error', authError)
    return NextResponse.json({ error: 'Failed to verify permissions' }, { status: 500 })
  }

  if (!isSuperAdmin(clinicUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = await createClient()

  const id = params.id
  const body = await request.json()
  const { services, ...clinicData } = body

  // Update clinic
  const { data: clinic, error } = await supabase
    .from('clinics')
    .update({
      name: clinicData.name,
      doctor: clinicData.doctor,
      qualification: clinicData.qualification,
      city: clinicData.city,
      area: clinicData.area,
      address: clinicData.address,
      phone: clinicData.phone,
      email: clinicData.email,
      rating: clinicData.rating,
      review_count: clinicData.review_count,
      experience: clinicData.experience,
      tagline: clinicData.tagline,
      about: clinicData.about,
      languages: clinicData.languages,
      timings: clinicData.timings,
      specializations: clinicData.specializations,
      image: clinicData.image,
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

  return NextResponse.json(clinic)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Only super_admin can delete clinics
  const { user, clinicUser, error: authError } = await getAuthenticatedUser()

  if (authError === 'Not authenticated' || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (authError) {
    console.error('[clinics/[id] DELETE] auth error', authError)
    return NextResponse.json({ error: 'Failed to verify permissions' }, { status: 500 })
  }

  if (!isSuperAdmin(clinicUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

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
