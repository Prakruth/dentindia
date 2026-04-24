"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";
import { getAllServices } from "@/lib/data";

const CITIES = ["All Cities", "Mumbai", "Bengaluru", "Chennai", "Delhi"];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allServices = getAllServices();

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return allServices;
    return allServices.filter((service) =>
      service.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allServices]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
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
    window.location.href = `/services/${encodeURIComponent(service)}?city=${selectedCity}`;
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-700 via-blue-600 to-blue-500 text-white px-4 pt-16 pb-24 sm:pt-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-blue-200 text-sm font-medium tracking-widest uppercase mb-3 animate-fade-up">
            Service-First Comparison
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-4 animate-fade-up-delay-1">
            Find & Compare <br />
            <span className="italic text-blue-100">Dental Services</span>
          </h1>
          <p className="text-blue-100 text-base sm:text-lg mb-10 animate-fade-up-delay-2">
            Search for a service, compare prices across clinics, and book with the best option for your budget.
          </p>

          {/* Search bar with dropdown */}
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
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown suggestions */}
            {showDropdown && filteredServices.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 max-h-64 overflow-y-auto">
                {filteredServices.map((service, index) => (
                  <button
                    key={service}
                    onClick={() => handleSelectService(service)}
                    className={`w-full text-left px-4 py-3 transition-colors border-b border-stone-100 last:border-b-0 ${
                      index === selectedIndex
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getServiceEmoji(service)}</span>
                      <span className="flex-1">{service}</span>
                      <span className="text-xs text-stone-400">
                        {allServices.filter((s) => s === service).length > 0 && "Search"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* City filter */}
          <div className="mt-6 flex gap-2 flex-wrap justify-center">
            {CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
                  city === selectedCity
                    ? "bg-white text-blue-600 border-white"
                    : "border-blue-300 text-blue-100 hover:border-white hover:text-white"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-2 mb-2">
            <Sparkles size={24} className="text-blue-500" />
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
                <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 text-center hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col items-center justify-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {getServiceEmoji(service)}
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                    {service}
                  </h3>
                  <p className="text-xs text-stone-500 mt-2 group-hover:text-blue-500">
                    Compare prices →
                  </p>
                </div>
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

      {/* How it works */}
      <section className="bg-stone-50 border-y border-stone-200 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-stone-900 mb-2">
            How It Works
          </h2>
          <p className="text-stone-500 text-center text-sm mb-12">Find the perfect clinic for your service in 3 steps.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Search Service", body: "Type the dental service you need — Root Canal, Whitening, etc." },
              { step: "02", title: "Compare Clinics", body: "See all clinics with pricing, ratings, and availability for that service." },
              { step: "03", title: "Book Now", body: "Choose the clinic that fits your budget and schedule your appointment." },
            ].map(({ step, title, body }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full border-2 border-blue-200 bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-display font-bold text-sm">{step}</span>
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Clinic (Link to old flow) */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-stone-600 text-sm mb-4">
            Or browse by <Link href="/clinic-directory" className="text-blue-600 font-semibold hover:underline">clinic directory →</Link>
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
  };
  return map[service] || "🦷";
}
