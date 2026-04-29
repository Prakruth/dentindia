import { Clinic } from './data';

// Admin data management functions
const ADMIN_CLINICS_KEY = 'adminClinics';
const ADMIN_AUTH_KEY = 'adminAuth';

export function getAdminClinics(): Clinic[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(ADMIN_CLINICS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveAdminClinics(clinics: Clinic[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_CLINICS_KEY, JSON.stringify(clinics));
}

export function addClinic(clinic: Clinic): void {
  const clinics = getAdminClinics();
  clinics.push(clinic);
  saveAdminClinics(clinics);
}

export function updateClinic(id: string, updatedClinic: Clinic): void {
  const clinics = getAdminClinics();
  const index = clinics.findIndex(c => c.id === id);
  if (index > -1) {
    clinics[index] = updatedClinic;
    saveAdminClinics(clinics);
  }
}

export function deleteClinic(id: string): void {
  const clinics = getAdminClinics();
  const filtered = clinics.filter(c => c.id !== id);
  saveAdminClinics(filtered);
}

export function getClinicById(id: string): Clinic | undefined {
  const clinics = getAdminClinics();
  return clinics.find(c => c.id === id);
}

export function initializeAdminClinics(defaultClinics: Clinic[]): void {
  const existing = getAdminClinics();
  if (existing.length === 0) {
    saveAdminClinics(defaultClinics);
  }
}

// Auth functions
export function setAdminAuth(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_AUTH_KEY, token);
}

export function getAdminAuth(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_AUTH_KEY);
}

export function clearAdminAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_AUTH_KEY);
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminAuth();
}

export function getStats() {
  const clinics = getAdminClinics();
  const cities = new Set(clinics.map(c => c.city));
  let totalServices = 0;
  clinics.forEach(c => {
    totalServices += c.services.length;
  });
  return {
    totalClinics: clinics.length,
    totalCities: cities.size,
    totalServices,
  };
}
