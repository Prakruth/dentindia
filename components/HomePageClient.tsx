"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { trackSearchInitiated, trackSearchResults, trackFilterApplied } from "@/lib/analytics";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HomePageClientProps {
  services: string[];
  cities: string[];
}

export default function HomePageClient({ services: allServices, cities: CITIES }: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return allServices;
    const filtered = allServices.filter((service) =>
      service.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Track search results
    if (searchQuery.trim()) {
      trackSearchResults(searchQuery, filtered.length);
    }

    return filtered;
  }, [searchQuery, allServices]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setShowDropdown(true);
        setSelectedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredServices.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectService(filteredServices[selectedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectService = (service: string) => {
    // Track search initiated
    trackSearchInitiated(service, selectedCity !== "All Cities" ? selectedCity : undefined);
    window.location.href = `/services/${encodeURIComponent(service)}?city=${selectedCity}`;
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-700 via-teal-600 to-teal-500 text-white px-4 pt-16 pb-24 sm:pt-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-teal-200 text-sm font-medium tracking-widest uppercase mb-3 animate-fade-up">
            Service-First Comparison
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-4 animate-fade-up-delay-1">
            Find & Compare <br />
            <span className="italic text-teal-100">Dental Services</span>
          </h1>
          <p className="text-teal-100 text-base sm:text-lg mb-10 animate-fade-up-delay-2">
            Search for a service, compare prices across clinics, and book with the best option for your budget.
          </p>

          {/* Search box */}
          <div className="max-w-lg mx-auto mb-6 animate-fade-up-delay-3 relative" ref={dropdownRef}>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-3 shadow-xl">
              <Search size={18} className="text-stone-400 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Root Canal, Whitening, Consultation…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                  setSelectedIndex(-1);
                }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                className="flex-1 text-stone-700 text-sm outline-none placeholder-stone-400 bg-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowDropdown(false);
                    searchInputRef.current?.focus();
                  }}
                  className="text-stone-400 hover:text-stone-600 transition"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {showDropdown && filteredServices.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 max-h-64 overflow-y-auto">
                {filteredServices.map((service, index) => (
                  <button
                    key={service}
                    onClick={() => handleSelectService(service)}
                    className={`w-full text-left px-4 py-3 transition-colors border-b border-stone-100 last:border-b-0 ${
                      index === selectedIndex
                        ? "bg-teal-50 text-teal-600 font-medium"
                        : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getServiceEmoji(service)}</span>
                      <span className="flex-1">{service}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* City filter pills using shadcn Badge */}
          <div className="mt-6 flex gap-2 flex-wrap justify-center">
            {CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setSelectedCity(city);
                  trackFilterApplied('city', city);
                }}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-full"
              >
                <Badge
                  variant={city === selectedCity ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1 text-sm h-auto transition-all ${
                    city === selectedCity
                      ? "bg-white text-teal-700 border-white hover:bg-white/90"
                      : "border-teal-300 text-teal-100 hover:border-white hover:text-white bg-transparent"
                  }`}
                >
                  {city}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-2 mb-2">
            <Sparkles size={24} className="text-teal-500" />
            {searchQuery.trim() ? "Search Results" : "Popular Services"}
          </h2>
          <p className="text-stone-500 text-sm">
            {filteredServices.length} service{filteredServices.length !== 1 ? "s" : ""} available
            {selectedCity !== "All Cities" ? ` in ${selectedCity}` : ""}
          </p>
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredServices.map((service) => (
              <Link
                key={service}
                href={`/services/${encodeURIComponent(service)}?city=${selectedCity}`}
                className="group"
              >
                <Card className="border-2 border-stone-200 hover:border-teal-400 hover:shadow-lg transition-all cursor-pointer h-full ring-0">
                  <CardContent className="flex flex-col items-center justify-center text-center py-6">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {getServiceEmoji(service)}
                    </div>
                    <h3 className="font-semibold text-stone-900 text-sm group-hover:text-teal-600 transition-colors line-clamp-2">
                      {service}
                    </h3>
                    <p className="text-xs text-stone-500 mt-2 group-hover:text-teal-500">
                      Compare prices →
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-stone-500 text-lg">No services found matching "{searchQuery}"</p>
            <p className="text-stone-400 text-sm mt-2">Try searching for "Root Canal", "Whitening", or "Consultation"</p>
          </div>
        )}
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-stone-50 border-y border-stone-200 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-stone-900 mb-2">
            How It Works
          </h2>
          <p className="text-stone-500 text-center text-sm mb-12">Find the perfect clinic for your service in 3 steps.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Search Service", body: "Type the dental service you need — Root Canal, Whitening, etc." },
              { step: "02", title: "Compare Clinics", body: "See all clinics with pricing, ratings, and availability for that service." },
              { step: "03", title: "Book Now", body: "Choose the clinic that fits your budget and schedule your appointment." },
            ].map(({ step, title, body }) => (
              <Card key={step} className="text-center ring-0 border border-stone-200 shadow-none">
                <CardContent className="pt-8 pb-6 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-teal-200 bg-teal-50 flex items-center justify-center mb-4">
                    <span className="text-teal-600 font-display font-bold text-sm">{step}</span>
                  </div>
                  <h3 className="font-semibold text-stone-800 mb-2">{title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-stone-600 text-sm mb-4">
            Or browse by <Link href="/clinic-directory" className="text-teal-600 font-semibold hover:underline">clinic directory →</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function getServiceEmoji(service: string): string {
  const map: Record<string, string> = {
    "Consultation": "💬",
    "Root Canal Treatment": "🦷",
    "Dental Implants": "👁️",
    "Braces & Aligners": "📌",
    "Teeth Whitening": "✨",
    "Scaling & Polishing": "🪥",
    "Tooth Extraction": "🔧",
    "Digital Smile Design": "🎨",
    "Dentures": "👄",
    "Crowns & Bridges": "👑",
    "Laser Gum Treatment": "💚",
    "Gum Surgery": "⚕️",
    "Braces": "📌",
    "Extraction": "🔧",
    "Cleaning": "🪥",
  };
  return map[service] || "🦷";
}
