"use client";

import { useRouter } from "next/navigation";
import { addClinic, initializeAdminClinics } from "@/lib/adminData";
import { CLINICS } from "@/lib/data";
import ClinicForm from "@/components/admin/ClinicForm";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import type { Clinic } from "@/lib/data";

function AddClinicPageContent() {
  const router = useRouter();

  const handleSubmit = (clinic: Clinic) => {
    // Ensure clinic has an ID
    const clinicToSave = {
      ...clinic,
      id: clinic.id || `clinic-${Date.now()}`,
    };

    // Add to localStorage
    addClinic(clinicToSave);

    // Redirect to clinics list
    router.push("/admin/clinics");
  };

  return (
    <ClinicForm
      onSubmit={handleSubmit}
      isLoading={false}
    />
  );
}

export default function AddClinicPage() {
  return (
    <ProtectedRoute>
      <AddClinicPageContent />
    </ProtectedRoute>
  );
}
