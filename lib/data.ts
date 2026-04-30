'use server'

import { createClient } from './supabase/server'
import { Clinic, ClinicServiceMatch, Service } from './types'

export async function getClinic(id: string): Promise<Clinic | undefined> {
  const supabase = await createClient()

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

  if (error || !clinic) return undefined

  return mapClinicFromDB(clinic)
}

export async function getAllClinics(): Promise<Clinic[]> {
  const supabase = await createClient()

  const { data: clinics, error } = await supabase
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

  if (error || !clinics) return []

  return clinics.map(mapClinicFromDB)
}

export async function getAllServices(): Promise<string[]> {
  const supabase = await createClient()

  const { data: services, error } = await supabase
    .from('services')
    .select('name')
    .order('name')

  if (error || !services) return []

  const serviceNames = new Set(services.map(s => s.name))
  return Array.from(serviceNames).sort()
}

export async function getServiceComparisons(serviceName: string, city: string | null = null): Promise<ClinicServiceMatch[]> {
  const supabase = await createClient()

  let query = supabase
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

  if (city) {
    query = query.eq('city', city)
  }

  const { data: clinics, error } = await query

  if (error || !clinics) return []

  const results: ClinicServiceMatch[] = []

  clinics.forEach((clinic) => {
    const service = clinic.services?.find((s: Service) => s.name === serviceName)
    if (service) {
      const hash = clinic.id.charCodeAt(0) + clinic.id.charCodeAt(clinic.id.length - 1)
      const distance = (hash % 95) / 10 + 0.5

      results.push({
        clinic: mapClinicFromDB(clinic),
        service,
        distance,
      })
    }
  })

  return results
}

function mapClinicFromDB(dbClinic: any): Clinic {
  return {
    id: dbClinic.id,
    name: dbClinic.name,
    doctor: dbClinic.doctor,
    qualification: dbClinic.qualification,
    city: dbClinic.city,
    area: dbClinic.area,
    address: dbClinic.address,
    phone: dbClinic.phone,
    email: dbClinic.email,
    rating: dbClinic.rating,
    reviewCount: dbClinic.review_count,
    experience: dbClinic.experience,
    tagline: dbClinic.tagline,
    about: dbClinic.about,
    languages: dbClinic.languages,
    timings: dbClinic.timings,
    specializations: dbClinic.specializations,
    image: dbClinic.image,
    services: (dbClinic.services || []).map((s: any) => ({
      id: s.id,
      clinic_id: s.clinic_id,
      name: s.name,
      description: s.description,
      duration: s.duration,
      price_from: s.price_from,
      price_to: s.price_to,
      rating: s.rating,
      review_count: s.review_count,
      variants: s.service_variants,
      created_at: s.created_at,
    })),
  }
}
