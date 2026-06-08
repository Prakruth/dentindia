import { Suspense } from "react";
import { getAllServices } from "@/lib/data";
import HomePageClient from "@/components/HomePageClient";
import type { Metadata } from "next";

const CITIES = ["All Cities", "Mumbai", "Bengaluru", "Chennai", "Delhi"];

export const metadata: Metadata = {
  title: "Find Trusted Dental Clinics in India — Book Appointments Online",
  description:
    "Discover and book appointments with top-rated dental clinics across India. Compare dentists by service, price & rating in Mumbai, Delhi, Bengaluru, Chennai. Teeth cleaning, braces, implants & more.",
  alternates: {
    canonical: "https://dentobook.in",
  },
  openGraph: {
    title: "Find Trusted Dental Clinics in India",
    description:
      "Discover and book appointments with top-rated dental clinics across India. Compare by service, price & rating.",
    url: "https://dentobook.in",
    type: "website",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Dentobook",
  alternateName: "Dentobook",
  url: "https://dentobook.in",
  description:
    "Find and book appointments with trusted dental clinics across India.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://dentobook.in/services/{search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dentobook",
  url: "https://dentobook.in",
  logo: "https://dentobook.in/logo.png",
  description:
    "India's trusted platform for finding and booking dental clinic appointments.",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  serviceType: [
    "Dental Clinic Directory",
    "Dental Appointment Booking",
    "Dental Price Comparison",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
};

const medicalWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Dentobook — Find Trusted Dental Clinics in India",
  url: "https://dentobook.in",
  description:
    "Find and book dental appointments across India. Browse clinics by city and compare services.",
  medicalAudience: {
    "@type": "Patient",
  },
  about: {
    "@type": "MedicalSpecialty",
    name: "Dentistry",
  },
};

async function ServiceSearch() {
  const allServices = await getAllServices();
  return <HomePageClient services={allServices} cities={CITIES} />;
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageSchema) }}
      />
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <ServiceSearch />
      </Suspense>
    </>
  );
}
