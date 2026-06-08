import Link from "next/link";
import { ArrowLeft, MapPin, Users } from "lucide-react";
import { getAllClinics } from "@/lib/data";
import type { Metadata } from "next";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dental Clinic Directory India — Browse All Clinics by City",
  description:
    "Complete directory of dental clinics across India. Find dentists in Mumbai, Delhi, Bengaluru, Chennai and more cities. Compare ratings, experience & services.",
  keywords: [
    "dental clinic directory India",
    "list of dental clinics India",
    "dentists in India",
    "dental clinics Mumbai",
    "dental clinics Delhi",
    "dental clinics Bengaluru",
    "dental clinics Chennai",
    "find dentist India",
  ],
  alternates: {
    canonical: "https://dentobook.in/clinic-directory",
  },
  openGraph: {
    title: "Dental Clinic Directory India — Browse All Clinics by City",
    description:
      "Complete directory of dental clinics across India. Compare ratings, experience & services.",
    url: "https://dentobook.in/clinic-directory",
    type: "website",
    siteName: "Dentobook",
  },
};

export default async function ClinicDirectory() {
  const clinics = await getAllClinics();

  const groupedByCit = clinics.reduce(
    (acc, clinic) => {
      if (!acc[clinic.city]) {
        acc[clinic.city] = [];
      }
      acc[clinic.city].push(clinic);
      return acc;
    },
    {} as Record<string, typeof clinics>
  );

  const cities = Object.keys(groupedByCit).sort();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Dental Clinics in India",
    description: "Complete directory of dental clinics across India",
    url: "https://dentobook.in/clinic-directory",
    numberOfItems: clinics.length,
    itemListElement: clinics.map((clinic, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Dentist",
        name: clinic.name,
        url: `https://dentobook.in/clinic/${clinic.id}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: clinic.address,
          addressLocality: clinic.area,
          addressRegion: clinic.city,
          addressCountry: "IN",
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 text-white px-4 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-teal-100 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to search
          </Link>

          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
            Dental Clinic Directory
          </h1>
          <p className="text-teal-100 text-lg">
            Browse all {clinics.length} dental clinics across {cities.length} cities in India
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {cities.map((city) => (
          <div key={city} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
              <MapPin size={20} className="text-teal-600 flex-shrink-0" />
              Dental Clinics in {city}
              <Badge variant="secondary" className="ml-1 text-stone-600 bg-stone-200 border-0">
                {groupedByCit[city].length} clinic{groupedByCit[city].length !== 1 ? "s" : ""}
              </Badge>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedByCit[city].map((clinic) => (
                <Link
                  key={clinic.id}
                  href={`/clinic/${clinic.id}`}
                  className="group"
                >
                  <Card className="h-full ring-0 border border-stone-200 hover:border-teal-400 hover:shadow-lg transition-all">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="text-4xl flex-shrink-0">{clinic.image}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-stone-900 text-lg group-hover:text-teal-600 transition-colors leading-tight">
                            {clinic.name}
                          </h3>
                          <p className="text-sm text-stone-600">{clinic.doctor}</p>
                        </div>
                      </div>

                      <p className="text-xs text-stone-500 mb-3 line-clamp-2">
                        {clinic.tagline}
                      </p>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-stone-600">
                          <Users size={14} className="text-teal-600 flex-shrink-0" />
                          <span>{clinic.experience} years experience</span>
                        </div>
                        <div className="text-xs text-stone-500">
                          {clinic.services.length} services available
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {clinic.specializations.slice(0, 2).map((spec) => (
                          <Badge
                            key={spec}
                            variant="outline"
                            className="bg-teal-50 text-teal-700 border-teal-200 text-xs"
                          >
                            {spec}
                          </Badge>
                        ))}
                        {clinic.specializations.length > 2 && (
                          <Badge variant="outline" className="text-stone-500 border-stone-200 text-xs">
                            +{clinic.specializations.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="bg-transparent border-t border-stone-100">
                      <Button className="w-full" size="sm">
                        View Clinic →
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
