export interface ServiceReview {
  text: string
  rating: number
  author: string
  date: string
}

export interface ServiceVariant {
  id?: string
  service_id?: string
  type: string
  price?: number
  price_min?: number
  price_max?: number
  duration: string
  created_at?: string
}

export interface Service {
  id?: string
  clinic_id?: string
  name: string
  description: string
  duration: string
  price_from: number
  price_to?: number
  rating?: number
  review_count?: number
  reviews?: ServiceReview[]
  variants?: ServiceVariant[]
  created_at?: string
}

export interface Clinic {
  id: string
  name: string
  doctor: string
  qualification: string
  city: string
  area: string
  address: string
  phone: string
  email: string
  rating: number
  review_count: number
  reviewCount?: number // deprecated, use review_count
  experience: number
  tagline: string
  about: string
  languages: string[]
  timings: string
  services: Service[]
  specializations: string[]
  image: string
  created_at?: string
  updated_at?: string
}

export interface ClinicServiceMatch {
  clinic: Clinic
  service: Service
  distance: number
}

export interface Booking {
  id?: string
  clinic_id: string
  patient_name: string
  patient_email: string
  patient_phone: string
  service_name: string
  preferred_date: string
  preferred_time: string
  notes?: string
  status?: string
  created_at?: string
}
