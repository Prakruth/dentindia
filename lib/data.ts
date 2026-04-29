export interface ServiceReview {
  text: string
  rating: number
  author: string
  date: string
}

export interface ServiceVariant {
  type: string
  price?: number
  priceMin?: number
  priceMax?: number
  duration: string
}

export interface Service {
  name: string
  description: string
  duration: string
  priceFrom: number
  priceTo?: number
  rating?: number
  reviewCount?: number
  reviews?: ServiceReview[]
  variants?: ServiceVariant[]
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
  reviewCount: number
  experience: number
  tagline: string
  about: string
  languages: string[]
  timings: string
  services: Service[]
  specializations: string[]
  image: string // emoji stand-in for avatar
}

export const CLINICS: Clinic[] = [
  {
    id: "srinagar-dental-bangalore",
    name: "Srinagar Dental Clinic",
    doctor: "Dr. Srinagar Clinic",
    qualification: "BDS",
    city: "Bengaluru",
    area: "Srinagar",
    address: "29/1, 1st Floor, Srinagar Main Road, near Main Bus Stand, Srinagar, Bengaluru — 560050",
    phone: "+91 XXXXX XXXXX",
    email: "contact@srinagardental.in",
    rating: 4.6,
    reviewCount: 120,
    experience: 8,
    tagline: "Affordable quality dental care.",
    about: "Srinagar Dental Clinic offers comprehensive dental services with a focus on affordability and patient comfort. Specializing in orthodontics and implantology with modern equipment.",
    languages: ["Kannada", "English", "Hindi"],
    timings: "Mon–Sat: 9 AM – 7 PM",
    specializations: ["Orthodontics", "Implantology", "General Dentistry"],
    image: "🦷",
    services: [
      { name: "Consultation", description: "Comprehensive examination and treatment planning.", duration: "30 min", priceFrom: 300, rating: 4.6, reviewCount: 45 },
      { name: "Root Canal Treatment", description: "Single-sitting RCT with rotary instruments.", duration: "60–90 min", priceFrom: 2000, rating: 4.5, reviewCount: 32 },
      { name: "Extraction", description: "Simple and surgical extractions.", duration: "20–45 min", priceFrom: 500, rating: 4.6, reviewCount: 28 },
      { name: "Dental Implants", description: "Titanium implants with crown restoration.", duration: "3–4 sittings", priceFrom: 30000, rating: 4.7, reviewCount: 18 },
      { name: "Cleaning", description: "Ultrasonic scaling and polishing.", duration: "30 min", priceFrom: 1000, rating: 4.6, reviewCount: 52 },
      {
        name: "Braces & Aligners",
        description: "Metal wired, ceramic self-ligating, and clear aligner options.",
        duration: "12–18 months",
        priceFrom: 25000,
        priceTo: 55000,
        rating: 4.7,
        reviewCount: 38,
        variants: [
          { type: "Metal Wired", price: 25000, duration: "12–18 months" },
          { type: "Self-Ligating Ceramic", price: 55000, duration: "12–18 months" },
          { type: "Clear Aligners", priceMin: 42000, priceMax: 65000, duration: "8–12 months" },
        ]
      },
    ],
  },
  {
    id: "carewell-dental-bangalore",
    name: "Carewell Dental Clinic",
    doctor: "Dr. Carewell Clinic",
    qualification: "BDS, MDS",
    city: "Bengaluru",
    area: "Uttarahalli",
    address: "20, Masjid Road, Uttarahalli Main Road, Subrahmanyapura Post, Bengaluru — 560061",
    phone: "+91 XXXXX XXXXX",
    email: "contact@carewelldental.in",
    rating: 4.7,
    reviewCount: 156,
    experience: 10,
    tagline: "Comprehensive dental solutions for all ages.",
    about: "Carewell Dental Clinic provides end-to-end dental care with experienced practitioners. Known for affordable pricing and patient-centric approach with modern diagnostic equipment.",
    languages: ["Kannada", "English", "Hindi", "Tamil"],
    timings: "Mon–Sat: 10 AM – 8 PM, Sun: 10 AM – 2 PM",
    specializations: ["General Dentistry", "Orthodontics", "Restorative Dentistry"],
    image: "👨‍⚕️",
    services: [
      { name: "Consultation", description: "Detailed examination with treatment recommendations.", duration: "30 min", priceFrom: 300, rating: 4.7, reviewCount: 61 },
      {
        name: "Root Canal Treatment",
        description: "Advanced RCT techniques for complex cases.",
        duration: "60–90 min",
        priceFrom: 3500,
        priceTo: 4500,
        rating: 4.7,
        reviewCount: 49,
        variants: [
          { type: "Standard RCT", price: 3500, duration: "60 min" },
          { type: "Complex RCT", price: 4500, duration: "90 min" },
        ]
      },
      {
        name: "Extraction",
        description: "Simple and surgical tooth extractions.",
        duration: "20–60 min",
        priceFrom: 300,
        priceTo: 5000,
        rating: 4.6,
        reviewCount: 38,
        variants: [
          { type: "Simple Extraction", price: 300, duration: "15–20 min" },
          { type: "Surgical Extraction", priceMin: 2000, priceMax: 5000, duration: "45–60 min" },
        ]
      },
      {
        name: "Dental Implants",
        description: "Premium implants with ceramic crowns.",
        duration: "2–3 sittings",
        priceFrom: 23000,
        priceTo: 40000,
        rating: 4.8,
        reviewCount: 32,
        variants: [
          { type: "Single Implant", price: 23000, duration: "2–3 months" },
          { type: "Multiple Implants", priceMin: 30000, priceMax: 40000, duration: "3–4 months" },
        ]
      },
      {
        name: "Braces",
        description: "Fixed braces and clear aligner therapy.",
        duration: "18–24 months",
        priceFrom: 35000,
        priceTo: 55000,
        rating: 4.7,
        reviewCount: 42,
        variants: [
          { type: "Metal Braces", priceMin: 35000, priceMax: 45000, duration: "18–24 months" },
          { type: "Clear Aligners", priceMin: 45000, priceMax: 55000, duration: "12–18 months" },
        ]
      },
      {
        name: "Cleaning",
        description: "Professional scaling and polishing.",
        duration: "30–45 min",
        priceFrom: 800,
        priceTo: 1700,
        rating: 4.7,
        reviewCount: 68,
        variants: [
          { type: "Basic Cleaning", price: 800, duration: "30 min" },
          { type: "Deep Cleaning", price: 1700, duration: "45 min" },
        ]
      },
    ],
  },
  {
    id: "deep-dental-bangalore",
    name: "Deep Dental Clinic",
    doctor: "Dr. Deep Clinic",
    qualification: "BDS, MDS",
    city: "Bengaluru",
    area: "Uttarahalli",
    address: "38, 2nd Cross Street, Opposite AGS Bhadawane Park, AGS Layout, Uttarahalli Hobli, Bengaluru — 560061",
    phone: "+91 XXXXX XXXXX",
    email: "contact@deepdental.in",
    rating: 4.6,
    reviewCount: 98,
    experience: 7,
    tagline: "Excellence in dental care.",
    about: "Deep Dental Clinic is committed to providing quality dental services with a focus on patient comfort and modern treatment techniques. Equipped with state-of-the-art dental equipment.",
    languages: ["Kannada", "English", "Hindi"],
    timings: "Mon–Sat: 9 AM – 7 PM",
    specializations: ["General Dentistry", "Orthodontics", "Implantology"],
    image: "👩‍⚕️",
    services: [
      { name: "Consultation", description: "Comprehensive dental examination.", duration: "30 min", priceFrom: 300, rating: 4.6, reviewCount: 35 },
      { name: "Root Canal Treatment", description: "Precision RCT using modern techniques.", duration: "60–90 min", priceFrom: 4000, rating: 4.6, reviewCount: 28 },
      {
        name: "Extraction",
        description: "Safe tooth extraction with minimal trauma.",
        duration: "20–60 min",
        priceFrom: 1000,
        priceTo: 6000,
        rating: 4.5,
        reviewCount: 22,
        variants: [
          { type: "Simple Extraction", price: 1000, duration: "20 min" },
          { type: "Surgical Extraction", priceMin: 3000, priceMax: 6000, duration: "45–60 min" },
        ]
      },
      { name: "Dental Implants", description: "Complete implant restoration.", duration: "3–4 sittings", priceFrom: 25000, rating: 4.7, reviewCount: 21 },
      {
        name: "Braces & Aligners",
        description: "Multiple orthodontic options available.",
        duration: "18–24 months",
        priceFrom: 40000,
        priceTo: 85000,
        rating: 4.6,
        reviewCount: 35,
        variants: [
          { type: "Metal Wired Braces", price: 40000, duration: "18–24 months" },
          { type: "Self-Ligating Braces", price: 60000, duration: "18–24 months" },
          { type: "Clear Aligners", priceMin: 45000, priceMax: 85000, duration: "12–18 months" },
        ]
      },
      {
        name: "Cleaning",
        description: "Professional tooth cleaning and polishing.",
        duration: "30–45 min",
        priceFrom: 1000,
        priceTo: 2000,
        rating: 4.6,
        reviewCount: 42,
        variants: [
          { type: "Basic Cleaning", price: 1000, duration: "30 min" },
          { type: "Advanced Cleaning", price: 2000, duration: "45 min" },
        ]
      },
    ],
  },
]

export function getClinic(id: string): Clinic | undefined {
  return CLINICS.find((c) => c.id === id)
}

export function getAllServices(): string[] {
  const services = new Set<string>()
  CLINICS.forEach((clinic) => {
    clinic.services.forEach((service) => {
      services.add(service.name)
    })
  })
  return Array.from(services).sort()
}

export interface ClinicServiceMatch {
  clinic: Clinic
  service: Service
  distance: number
}

export function getServiceComparisons(serviceName: string, city: string | null = null): ClinicServiceMatch[] {
  const results: ClinicServiceMatch[] = []

  CLINICS.forEach((clinic) => {
    if (city && clinic.city !== city) return

    const service = clinic.services.find((s) => s.name === serviceName)
    if (service) {
      // Deterministic distance based on clinic ID (consistent across server/client)
      const hash = clinic.id.charCodeAt(0) + clinic.id.charCodeAt(clinic.id.length - 1)
      const distance = (hash % 95) / 10 + 0.5 // Results in 0.5-10.0 km

      results.push({
        clinic,
        service,
        distance,
      })
    }
  })

  return results
}
