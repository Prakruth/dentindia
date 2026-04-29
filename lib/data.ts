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
    id: "sharma-dental-mumbai",
    name: "Sharma Dental Care",
    doctor: "Dr. Priya Sharma",
    qualification: "BDS, MDS (Orthodontics) — AIIMS Delhi",
    city: "Mumbai",
    area: "Bandra West",
    address: "14, Hill Road, Bandra West, Mumbai — 400050",
    phone: "+91 98200 11234",
    email: "contact@sharmadentalcare.in",
    rating: 4.9,
    reviewCount: 312,
    experience: 14,
    tagline: "Precision dentistry with a gentle touch.",
    about:
      "Dr. Priya Sharma brings 14 years of clinical excellence to every patient. Specialising in orthodontics and cosmetic dentistry, her clinic combines advanced equipment with a calm, patient-first environment. She's treated over 8,000 patients across Mumbai.",
    languages: ["Hindi", "English", "Marathi"],
    timings: "Mon–Sat: 10 AM – 7 PM",
    specializations: ["Orthodontics", "Cosmetic Dentistry", "Implantology"],
    image: "👩‍⚕️",
    services: [
      { name: "Consultation", description: "Comprehensive oral examination, X-ray review, and personalised treatment plan.", duration: "30 min", priceFrom: 500, rating: 4.9, reviewCount: 28 },
      { name: "Root Canal Treatment", description: "Single-sitting RCT using rotary endodontics with rubber dam isolation.", duration: "60–90 min", priceFrom: 4500, rating: 4.8, reviewCount: 45 },
      { name: "Dental Implants", description: "Titanium implants with ceramic crown. Lifetime structural guarantee.", duration: "2–3 sittings", priceFrom: 25000, rating: 4.9, reviewCount: 12 },
      {
        name: "Braces & Aligners",
        description: "Metal, ceramic, and clear aligner options with monthly follow-ups.",
        duration: "12–18 months",
        priceFrom: 18000,
        priceTo: 85000,
        rating: 4.7,
        reviewCount: 23,
        variants: [
          { type: "Metal Wired", price: 18000, duration: "12–18 months" },
          { type: "Ceramic Self-Ligating", price: 35000, duration: "12–18 months" },
          { type: "Clear Aligners", priceMin: 45000, priceMax: 85000, duration: "6–12 months" },
        ]
      },
      { name: "Teeth Whitening", description: "In-clinic laser whitening. Upto 8 shades whiter in one session.", duration: "45 min", priceFrom: 6000, rating: 4.9, reviewCount: 34 },
      { name: "Scaling & Polishing", description: "Ultrasonic scaling to remove tartar, followed by air polishing.", duration: "30 min", priceFrom: 800, rating: 4.8, reviewCount: 19 },
    ],
  },
  {
    id: "smile-studio-bangalore",
    name: "Smile Studio",
    doctor: "Dr. Arjun Nair",
    qualification: "BDS, Fellowship in Oral Implantology — Manipal",
    city: "Bengaluru",
    area: "Indiranagar",
    address: "27, 100 Feet Road, Indiranagar, Bengaluru — 560038",
    phone: "+91 98440 55678",
    email: "hello@smilestudio.in",
    rating: 4.8,
    reviewCount: 198,
    experience: 10,
    tagline: "Where smiles are engineered.",
    about:
      "Dr. Arjun Nair is a fellowship-trained implantologist with a decade of hands-on practice. Smile Studio is known for same-day implants and digital smile design, catering to Bengaluru's tech-savvy clientele who value efficiency and quality.",
    languages: ["Kannada", "English", "Hindi", "Malayalam"],
    timings: "Mon–Sat: 9 AM – 8 PM, Sun: 10 AM – 2 PM",
    specializations: ["Implantology", "Digital Smile Design", "Endodontics"],
    image: "👨‍⚕️",
    services: [
      { name: "Consultation", description: "Digital X-ray, intraoral scan, and smile simulation preview.", duration: "40 min", priceFrom: 400, rating: 4.8, reviewCount: 31 },
      {
        name: "Root Canal Treatment",
        description: "Microscope-assisted RCT for precision in complex cases.",
        duration: "60 min",
        priceFrom: 3500,
        priceTo: 5000,
        rating: 4.9,
        reviewCount: 28,
        variants: [
          { type: "Single-Sitting RCT", price: 3500, duration: "60 min" },
          { type: "Multi-Visit with Medication", price: 5000, duration: "3–4 visits" },
        ]
      },
      { name: "Dental Implants", description: "BioHorizons implants. Same-day teeth in eligible cases.", duration: "1–3 sittings", priceFrom: 28000, rating: 4.9, reviewCount: 19 },
      { name: "Digital Smile Design", description: "Mock-up preview before any cosmetic procedure. Fully reversible trial smile.", duration: "60 min", priceFrom: 1500, rating: 4.8, reviewCount: 22 },
      {
        name: "Teeth Whitening",
        description: "Philips Zoom in-office whitening. Certified shade chart documentation.",
        duration: "60 min",
        priceFrom: 5000,
        priceTo: 7500,
        rating: 4.7,
        reviewCount: 18,
        variants: [
          { type: "Basic Zoom Whitening", price: 5000, duration: "45 min" },
          { type: "Philips Zoom + Take-Home Trays", price: 7500, duration: "60 min" },
        ]
      },
      { name: "Scaling & Polishing", description: "Cavitron ultrasonic scaling + EMS Airflow polishing.", duration: "30 min", priceFrom: 1000, rating: 4.8, reviewCount: 15 },
      { name: "Tooth Extraction", description: "Simple and surgical extractions including wisdom tooth removal.", duration: "20–60 min", priceFrom: 800, rating: 4.7, reviewCount: 12 },
    ],
  },
  {
    id: "apollo-dental-chennai",
    name: "Apollo Dental Clinic",
    doctor: "Dr. Meena Subramanian",
    qualification: "MDS (Prosthodontics) — Sri Ramachandra University",
    city: "Chennai",
    area: "Anna Nagar",
    address: "5, 3rd Avenue, Anna Nagar, Chennai — 600040",
    phone: "+91 94440 99876",
    email: "meena@apollodental.in",
    rating: 4.7,
    reviewCount: 415,
    experience: 18,
    tagline: "Restoring confidence, one smile at a time.",
    about:
      "With 18 years in prosthodontics, Dr. Meena Subramanian is one of Chennai's most sought-after specialists for full-mouth rehabilitation and denture work. Her clinic sees patients from across Tamil Nadu and Sri Lanka.",
    languages: ["Tamil", "English", "Telugu"],
    timings: "Mon–Fri: 9 AM – 6 PM, Sat: 9 AM – 3 PM",
    specializations: ["Prosthodontics", "Full-Mouth Rehabilitation", "Geriatric Dentistry"],
    image: "👩‍⚕️",
    services: [
      { name: "Consultation", description: "Detailed prosthetic assessment, bite analysis, and treatment roadmap.", duration: "45 min", priceFrom: 600, rating: 4.8, reviewCount: 41 },
      { name: "Root Canal Treatment", description: "BioRaCe rotary RCT with post & core buildup included.", duration: "90 min", priceFrom: 4000, rating: 4.7, reviewCount: 35 },
      { name: "Dental Implants", description: "Straumann and Nobel Biocare implants. 5-year warranty.", duration: "2–4 sittings", priceFrom: 30000, rating: 4.8, reviewCount: 16 },
      { name: "Dentures", description: "Complete and partial dentures. BPS (Biofunctional Prosthetic System) certified.", duration: "3–5 sittings", priceFrom: 12000, rating: 4.9, reviewCount: 28 },
      { name: "Crowns & Bridges", description: "Zirconia and PFM crowns. Same-day CAD/CAM crowns available.", duration: "2 sittings", priceFrom: 5000, rating: 4.7, reviewCount: 22 },
      { name: "Scaling & Polishing", description: "Periodontal charting + ultrasonic scaling + fluoride application.", duration: "45 min", priceFrom: 900, rating: 4.8, reviewCount: 18 },
    ],
  },
  {
    id: "capital-smiles-delhi",
    name: "Capital Smiles",
    doctor: "Dr. Vikram Malhotra",
    qualification: "BDS, MDS (Periodontics) — MAIDS, New Delhi",
    city: "Delhi",
    area: "South Extension",
    address: "B-12, South Extension Part II, New Delhi — 110049",
    phone: "+91 98110 77654",
    email: "dr.vikram@capitalsmiles.in",
    rating: 4.8,
    reviewCount: 276,
    experience: 12,
    tagline: "Healthy gums. Confident smile.",
    about:
      "Dr. Vikram Malhotra is Delhi's go-to periodontist for gum disease treatment and bone regeneration procedures. Capital Smiles is equipped with a cone beam CT scanner for precise 3D diagnosis — rare for a standalone clinic.",
    languages: ["Hindi", "English", "Punjabi"],
    timings: "Mon–Sat: 11 AM – 8 PM",
    specializations: ["Periodontics", "Laser Dentistry", "Bone Regeneration"],
    image: "👨‍⚕️",
    services: [
      { name: "Consultation", description: "CBCT 3D scan + full periodontal charting + treatment plan.", duration: "45 min", priceFrom: 700, rating: 4.9, reviewCount: 38 },
      { name: "Root Canal Treatment", description: "Single visit RCT using WaveOne Gold rotary system.", duration: "75 min", priceFrom: 4800, rating: 4.7, reviewCount: 38 },
      {
        name: "Dental Implants",
        description: "MIS implants with guided bone regeneration where needed.",
        duration: "2–3 sittings",
        priceFrom: 26000,
        priceTo: 35000,
        rating: 4.8,
        reviewCount: 14,
        variants: [
          { type: "Single Implant + Crown", price: 26000, duration: "3–4 months" },
          { type: "Multiple Implants (2+)", priceMin: 50000, priceMax: 150000, duration: "4–6 months" },
          { type: "Full Mouth Implants (All-on-4)", priceMin: 200000, priceMax: 350000, duration: "6–12 months" },
        ]
      },
      { name: "Laser Gum Treatment", description: "LANAP protocol for deep cleaning without surgery. Minimal downtime.", duration: "60 min", priceFrom: 8000, rating: 4.9, reviewCount: 26 },
      { name: "Teeth Whitening", description: "Opalescence in-office whitening with custom take-home trays included.", duration: "60 min", priceFrom: 7000, rating: 4.8, reviewCount: 17 },
      { name: "Scaling & Polishing", description: "Subgingival scaling, root planing, and chlorhexidine irrigation.", duration: "45 min", priceFrom: 1200, rating: 4.9, reviewCount: 21 },
      { name: "Gum Surgery", description: "Flap surgery, gingivectomy, and crown lengthening procedures.", duration: "90 min", priceFrom: 10000, rating: 4.7, reviewCount: 9 },
    ],
  },
  {
    id: "srinagar-dental-bangalore",
    name: "Srinagar Dental Clinic",
    doctor: "Dr. [To be updated]",
    qualification: "BDS",
    city: "Bengaluru",
    area: "Srinagar",
    address: "29/1, 1st Floor, Srinagar Main Road, near Main Bus Stand, Srinagar, Bengaluru — 560050",
    phone: "+91 [To be updated]",
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
      {
        name: "Cleaning",
        description: "Ultrasonic scaling and polishing.",
        duration: "30 min",
        priceFrom: 1000,
        rating: 4.6,
        reviewCount: 52,
        variants: undefined
      },
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
    doctor: "Dr. [To be updated]",
    qualification: "BDS, MDS",
    city: "Bengaluru",
    area: "Uttarahalli",
    address: "20, Masjid Road, Uttarahalli Main Road, Subrahmanyapura Post, Bengaluru — 560061",
    phone: "+91 [To be updated]",
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
    doctor: "Dr. [To be updated]",
    qualification: "BDS, MDS",
    city: "Bengaluru",
    area: "Uttarahalli",
    address: "38, 2nd Cross Street, Opposite AGS Bhadawane Park, AGS Layout, Uttarahalli Hobli, Bengaluru — 560061",
    phone: "+91 [To be updated]",
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
