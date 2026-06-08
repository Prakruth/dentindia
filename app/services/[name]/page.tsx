import { getServiceComparisons } from "@/lib/data";
import ServiceComparisonClient from "@/components/ServiceComparisonClient";
import type { Metadata } from "next";

interface PageProps {
  params: { name: string };
  searchParams: Promise<{ city?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const serviceName = decodeURIComponent(params.name);
  const sp = await searchParams;
  const city = sp.city && sp.city !== "All Cities" ? sp.city : null;

  const locationStr = city ? ` in ${city}` : " across India";
  const title = `${serviceName}${locationStr} — Compare Dental Clinics & Prices`;
  const description = `Find the best dental clinics offering ${serviceName}${locationStr}. Compare prices, ratings & book your appointment online on Dentobook.`;

  return {
    title,
    description,
    keywords: [
      `${serviceName} India`,
      `${serviceName} cost India`,
      `${serviceName} price India`,
      city ? `${serviceName} ${city}` : `best ${serviceName} dentist India`,
      `dental ${serviceName}`,
      `${serviceName} clinic India`,
    ],
    alternates: {
      canonical: `https://dentobook.in/services/${encodeURIComponent(params.name)}${city ? `?city=${encodeURIComponent(city)}` : ""}`,
    },
    openGraph: {
      title,
      description,
      url: `https://dentobook.in/services/${encodeURIComponent(params.name)}`,
      type: "website",
      siteName: "Dentobook",
    },
  };
}

export default async function ServiceComparisonPage({ params, searchParams }: PageProps) {
  const serviceName = decodeURIComponent(params.name);
  const sp = await searchParams;
  const cityFilter = sp.city || "All Cities";
  const city = cityFilter === "All Cities" ? null : cityFilter;

  const comparisons = await getServiceComparisons(serviceName, city);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Dental clinics offering ${serviceName} in India`,
    description: `Compare dental clinics and prices for ${serviceName} across India`,
    url: `https://dentobook.in/services/${encodeURIComponent(params.name)}`,
    numberOfItems: comparisons.length,
    itemListElement: comparisons.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Dentist",
        name: item.clinic.name,
        url: `https://dentobook.in/clinic/${item.clinic.id}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: item.clinic.area,
          addressRegion: item.clinic.city,
          addressCountry: "IN",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: item.clinic.rating,
          reviewCount: item.clinic.review_count,
        },
        makesOffer: {
          "@type": "Offer",
          name: serviceName,
          priceCurrency: "INR",
          price: item.service.price_from,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServiceComparisonClient
        serviceName={serviceName}
        cityFilter={cityFilter}
        initialComparisons={comparisons}
      />
    </>
  );
}
