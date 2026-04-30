import Link from "next/link";
import { ArrowLeft, MapPin, Star, Users } from "lucide-react";
import { getAllClinics } from "@/lib/data";

export const metadata = {
  title: "Clinic Directory | DentIndia",
  description: "Browse all dental clinics across India on DentIndia",
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

  return (
    <div className="min-h-screen bg-stone-50">
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
            Clinic Directory
          </h1>
          <p className="text-teal-100 text-lg">
            Browse all {clinics.length} dental clinics across {cities.length} cities
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {cities.map((city) => (
          <div key={city} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-teal-600" />
              {city}
              <span className="text-sm font-normal text-stone-500 ml-2">
                ({groupedByCit[city].length} clinic{groupedByCit[city].length !== 1 ? "s" : ""})
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedByCit[city].map((clinic) => (
                <Link
                  key={clinic.id}
                  href={`/clinic/${clinic.id}`}
                  className="group bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg hover:border-teal-400 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-4xl">{clinic.image}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-stone-900 text-lg group-hover:text-teal-600 transition-colors">
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
                      <Star size={14} className="text-amber-400" />
                      <span className="font-medium">{clinic.rating}</span>
                      <span className="text-stone-400">({clinic.review_count} reviews)</span>
                    </div>

                    <div className="flex items-center gap-2 text-stone-600">
                      <Users size={14} className="text-teal-600" />
                      <span>{clinic.experience} years experience</span>
                    </div>

                    <div className="text-xs text-stone-500 pt-1">
                      {clinic.services.length} services available
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {clinic.specializations.slice(0, 2).map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                    {clinic.specializations.length > 2 && (
                      <span className="px-2 py-1 text-stone-500 text-xs">
                        +{clinic.specializations.length - 2} more
                      </span>
                    )}
                  </div>

                  <button className="w-full py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition">
                    View Clinic →
                  </button>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
