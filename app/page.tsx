import { Suspense } from "react";
import { getAllServices } from "@/lib/data";
import HomePageClient from "@/components/HomePageClient";

const CITIES = ["All Cities", "Mumbai", "Bengaluru", "Chennai", "Delhi"];

async function ServiceSearch() {
  const allServices = await getAllServices();
  return <HomePageClient services={allServices} cities={CITIES} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ServiceSearch />
    </Suspense>
  );
}
