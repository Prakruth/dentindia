"use client";

import { useState, useMemo } from "react";
import { Search, ShieldCheck, CalendarCheck, Star } from "lucide-react";
import { CLINICS } from "@/lib/data";
import ClinicCard from "@/components/ClinicCard";

const CITIES = ["All Cities", "Mumbai", "Bengaluru", "Chennai", "Delhi"];

const STATS = [
  { label: "Verified Clinics", value: "120+", icon: ShieldCheck },
  { label: "Happy Patients", value: "50,000+", icon: Star },
  { label: "Appointments Booked", value: "1 Lakh+", icon: CalendarCheck },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");

  const filteredClinics = useMemo(() => {
    return CLINICS.filter((clinic) => {
      const matchesCity = selectedCity === "All Cities" || clinic.city === selectedCity;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === "" ||
        clinic.name.toLowerCase().includes(query) ||
        clinic.doctor.toLowerCase().includes(query) ||
        clinic.city.toLowerCase().includes(query) ||
        clinic.specializations?.some((spec) =>
          spec.toLowerCase().includes(query)
        ) ||
        clinic.services?.some((service) =>
          service.name.toLowerCase().includes(query)
        );
      return matchesCity && matchesSearch;
    });
  }, [searchQuery, selectedCity]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-700 via-teal-600 to-teal-500 text-white px-4 pt-16 pb-24 sm:pt-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-teal-200 text-sm font-medium tracking-widest uppercase mb-3 animate-fade-up">
            Trusted Dental Directory · India
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-4 animate-fade-up-delay-1">
            Find the right dentist,<br />
            <span className="italic text-teal-100">right in your city.</span>
          </h1>
          <p className="text-teal-100 text-base sm:text-lg mb-10 animate-fade-up-delay-2">
            Browse verified dental clinics across India. View services, timings, and book an appointment in minutes.
          </p>

          {/* Search bar */}
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-3 shadow-xl max-w-lg mx-auto animate-fade-up-delay-3">
            <Search size={18} className="text-stone-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by city, doctor, or service…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-stone-700 text-sm outline-none placeholder-stone-400 bg-transparent"
            />
            <button type="button" className="bg-teal-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-teal-700 transition">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 mb-16">
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6 text-center">
              <Icon size={20} className="text-teal-500 mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-stone-900 font-display">{value}</p>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Clinic listing */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              Onboarded Clinics
            </h2>
            <p className="text-stone-500 text-sm mt-1">{filteredClinics.length} clinics found · Updated daily</p>
          </div>

          {/* City filter pills */}
          <div className="flex gap-2 flex-wrap">
            {CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
                  city === selectedCity
                    ? "bg-teal-600 text-white border-teal-600"
                    : "border-stone-200 text-stone-600 hover:border-teal-400 hover:text-teal-600 bg-white"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredClinics.map((clinic, i) => (
            <ClinicCard key={clinic.id} clinic={clinic} index={i} />
          ))}
        </div>

        {filteredClinics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-500 text-lg">No clinics found matching your search.</p>
          </div>
        )}
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white border-y border-stone-200 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-stone-900 mb-2">
            How DentIndia Works
          </h2>
          <p className="text-stone-500 text-center text-sm mb-12">Three steps to your next dental appointment.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Browse Clinics", body: "Filter by city or specialization. Read about the doctor, services, and timings." },
              { step: "02", title: "View Services", body: "Each clinic lists all treatments with transparent pricing in INR." },
              { step: "03", title: "Book or Call", body: "Tap the phone number or WhatsApp link to schedule your appointment directly." },
            ].map(({ step, title, body }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full border-2 border-teal-200 bg-teal-50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-teal-600 font-display font-bold text-sm">{step}</span>
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for doctors */}
      <section className="py-16 px-4 bg-gradient-to-br from-teal-700 to-teal-800 text-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 italic">
            Are you a dental professional?
          </h2>
          <p className="text-teal-100 text-sm mb-6 leading-relaxed">
            List your clinic on DentIndia and reach thousands of patients in your city. Free onboarding, no commission.
          </p>
          <a
            href="mailto:onboard@dentindia.in"
            className="inline-block px-6 py-3 bg-white text-teal-700 font-semibold rounded-full hover:bg-teal-50 transition"
          >
            Apply to Join →
          </a>
        </div>
      </section>
    </div>
  );
}
