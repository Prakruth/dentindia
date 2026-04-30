"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ClinicForm from "@/components/admin/ClinicForm";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import type { Clinic } from "@/lib/types";

function AddClinicPageContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (clinic: Clinic) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/clinics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clinic),
      });

      if (response.ok) {
        router.push("/admin/clinics");
      } else {
        alert("Failed to create clinic");
      }
    } catch (error) {
      console.error("Create failed:", error);
      alert("Error creating clinic");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ClinicForm
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
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
