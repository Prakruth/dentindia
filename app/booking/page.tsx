import { Suspense } from "react";
import { getClinic } from "@/lib/data";
import BookingFormClient from "@/components/BookingFormClient";

interface BookingPageProps {
  searchParams: Promise<{
    clinic?: string;
    service?: string;
    price?: string;
  }>;
}

async function BookingContent({ searchParams }: BookingPageProps) {
  const params = await searchParams;
  const clinicId = params.clinic || "";
  const serviceName = params.service || "";
  const price = params.price || "0";

  const clinic = await getClinic(clinicId);
  const service = clinic?.services.find((s) => s.name === serviceName);

  return (
    <BookingFormClient
      clinic={clinic}
      service={service}
      price={price}
      serviceName={serviceName}
    />
  );
}

export default function BookingPage({ searchParams }: BookingPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <BookingContent searchParams={searchParams} />
    </Suspense>
  );
}
