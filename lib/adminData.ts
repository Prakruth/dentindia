import { Clinic } from './types'

// Backward compatibility layer - admin functions now delegate to API calls
// This allows gradual migration of admin pages

let adminClinics: Clinic[] = []
let adminAuth: string | null = null

// Export for backward compatibility (deprecated - use Supabase instead)
export const CLINICS: Clinic[] = []

export function getAdminClinics(): Clinic[] {
  return adminClinics
}

export function saveAdminClinics(clinics: Clinic[]): void {
  adminClinics = clinics
}

export function addClinic(clinic: Clinic): void {
  adminClinics.push(clinic)
}

export function updateClinic(id: string, updatedClinic: Clinic): void {
  const index = adminClinics.findIndex(c => c.id === id)
  if (index > -1) {
    adminClinics[index] = updatedClinic
  }
}

export function deleteClinic(id: string): void {
  adminClinics = adminClinics.filter(c => c.id !== id)
}

export function getClinicById(id: string): Clinic | undefined {
  return adminClinics.find(c => c.id === id)
}

export function initializeAdminClinics(defaultClinics: Clinic[]): void {
  if (adminClinics.length === 0) {
    adminClinics = [...defaultClinics]
  }
}

export function setAdminAuth(token: string): void {
  adminAuth = token
}

export function getAdminAuth(): string | null {
  return adminAuth
}

export function clearAdminAuth(): void {
  adminAuth = null
}

export function isAdminAuthenticated(): boolean {
  return !!adminAuth
}

export function getStats() {
  const cities = new Set(adminClinics.map(c => c.city))
  let totalServices = 0
  adminClinics.forEach(c => {
    totalServices += c.services.length
  })
  return {
    totalClinics: adminClinics.length,
    totalCities: cities.size,
    totalServices,
  }
}
