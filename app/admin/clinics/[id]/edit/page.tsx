"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getClinicById, updateClinic, initializeAdminClinics, CLINICS } from "@/lib/adminData";
import ClinicForm from "@/components/admin/ClinicForm";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import type { Clinic } from "@/lib/types";

function EditClinicPageContent() {
  const router = useRouter();
  const params = useParams();
  const clinicId = params.id as string;

  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize if needed
    initializeAdminClinics(CLINICS);

    // Load clinic
    const foundClinic = getClinicById(clinicId);
    if (foundClinic) {
      setClinic(foundClinic);
    }
    setLoading(false);
  }, [clinicId]);

  const handleSubmit = (updatedClinic: Clinic) => {
    setIsSubmitting(true);

    // Update in localStorage
    updateClinic(clinicId, updatedClinic);

    // Redirect to clinics list
    router.push("/admin/clinics");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-600 text-lg mb-6">Clinic not found</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <ClinicForm
      initialClinic={clinic}
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
    />
  );
}

export default function EditClinicPage() {
  return (
    <ProtectedRoute>
      <EditClinicPageContent />
    </ProtectedRoute>
  );
}
