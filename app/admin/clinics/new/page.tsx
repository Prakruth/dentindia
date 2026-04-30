"use client";

import { useRouter } from "next/navigation";
import { addClinic, initializeAdminClinics, CLINICS } from "@/lib/adminData";
import ClinicForm from "@/components/admin/ClinicForm";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import type { Clinic } from "@/lib/types";

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
