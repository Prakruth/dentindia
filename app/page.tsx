import { Suspense } from "react";
import { getAllServices } from "@/lib/data";
import HomePageClient from "@/components/HomePageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Trusted Dental Clinics in Bangalore — Book Appointments Online",
  description:
    "Discover and book appointments with top-rated dental clinics in Bangalore. Compare dentists by service, price & rating. Teeth cleaning, braces, implants & more in Bengaluru.",
  alternates: {
    canonical: "https://dentobook.in",
  },
  openGraph: {
    title: "Find Trusted Dental Clinics in Bangalore",
    description:
      "Discover and book appointments with top-rated dental clinics in Bangalore. Compare by service, price & rating.",
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
    "Find and book appointments with trusted dental clinics in Bangalore.",
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
    "Bangalore's trusted platform for finding and booking dental clinic appointments.",
  areaServed: {
    "@type": "City",
    name: "Bangalore",
    containedIn: {
      "@type": "State",
      name: "Karnataka",
    },
  },
  serviceType: [
    "Dental Clinic Directory",
    "Dental Appointment Booking",
    "Dental Price Comparison",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    areaServed: "Bangalore",
    availableLanguage: ["English", "Kannada", "Hindi"],
  },
};

const medicalWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Dentobook — Find Trusted Dental Clinics in Bangalore",
  url: "https://dentobook.in",
  description:
    "Find and book dental appointments in Bangalore. Browse clinics and compare services.",
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
  return <HomePageClient services={allServices} />;
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
