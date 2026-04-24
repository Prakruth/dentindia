"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, Clock, Phone, MessageCircle, Filter, X, ChevronDown } from "lucide-react";
import { getServiceComparisons } from "@/lib/data";
import { useSearchParams } from "next/navigation";

interface PageProps {
  params: { name: string };
}

export default function ServiceComparisonPage({ params }: PageProps) {
  const serviceName = decodeURIComponent(params.name);
  const searchParams = useSearchParams();
  const cityFilter = searchParams.get("city") || "All Cities";

  const [sortBy, setSortBy] = useState<"recommended" | "price" | "rating" | "distance">("recommended");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const comparisons = useMemo(() => {
    const city = cityFilter === "All Cities" ? null : cityFilter;
    let results = getServiceComparisons(serviceName, city);

    // Filter by price and rating
    results = results.filter((r) => {
      const priceMatches = r.service.priceFrom <= maxPrice;
      const ratingMatches = (r.service.rating || 0) >= minRating;
      return priceMatches && ratingMatches;
    });

    // Sort
    switch (sortBy) {
      case "price":
        results.sort((a, b) => a.service.priceFrom - b.service.priceFrom);
        break;
      case "rating":
        results.sort((a, b) => (b.service.rating || 0) - (a.service.rating || 0));
        break;
      case "distance":
        results.sort((a, b) => a.distance - b.distance);
        break;
      case "recommended":
      default:
        results.sort((a, b) => {
          const aScore = (a.service.rating || 0) * (a.service.reviewCount || 1) - a.service.priceFrom / 10000;
          const bScore = (b.service.rating || 0) * (b.service.reviewCount || 1) - b.service.priceFrom / 10000;
          return bScore - aScore;
        });
    }

    return results;
  }, [serviceName, cityFilter, sortBy, minRating, maxPrice]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 text-sm mb-3 transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-stone-900">{serviceName}</h1>
              <p className="text-stone-500 text-sm">
                {comparisons.length} clinic{comparisons.length !== 1 ? "s" : ""} found
                {cityFilter !== "All Cities" ? ` in ${cityFilter}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Filters and Sort */}
      <div className="hidden sm:block bg-white border-b border-stone-200 px-4 py-4 sticky top-[80px] z-30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter size={16} className="text-stone-500" />
              <span className="text-sm font-medium text-stone-700">Sort & Filter</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white hover:border-blue-400 transition-colors"
              >
                <option value="recommended">Recommended</option>
                <option value="price">Price (Low → High)</option>
                <option value="rating">Rating (High → Low)</option>
                <option value="distance">Distance (Closest)</option>
              </select>

              {/* Min rating */}
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white hover:border-blue-400 transition-colors"
              >
                <option value={0}>All Ratings</option>
                <option value={4.5}>⭐ 4.5+ only</option>
                <option value={4}>⭐ 4.0+ only</option>
                <option value={3.5}>⭐ 3.5+ only</option>
              </select>

              {/* Max price */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-600">Max Price: ₹{maxPrice.toLocaleString()}</label>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="sm:hidden bg-white border-b border-stone-200 px-4 py-3 sticky top-[80px] z-30">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
        >
          <span className="flex items-center gap-2">
            <Filter size={14} />
            Sort & Filter
          </span>
          <ChevronDown size={14} className={`transition-transform ${showMobileFilters ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="sm:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)}>
          <div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-white pb-3 border-b">
              <h3 className="font-semibold text-stone-900">Sort & Filter</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 hover:bg-stone-100 rounded-lg transition"
              >
                <X size={18} className="text-stone-600" />
              </button>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm bg-white"
              >
                <option value="recommended">Recommended</option>
                <option value="price">Price (Low → High)</option>
                <option value="rating">Rating (High → Low)</option>
                <option value="distance">Distance (Closest)</option>
              </select>
            </div>

            {/* Min Rating */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm bg-white"
              >
                <option value={0}>All Ratings</option>
                <option value={4.5}>⭐ 4.5+ only</option>
                <option value={4}>⭐ 4.0+ only</option>
                <option value={3.5}>⭐ 3.5+ only</option>
              </select>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Max Price: <span className="text-blue-600">₹{maxPrice.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-stone-500 mt-2">
                <span>₹500</span>
                <span>₹50,000</span>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition mt-4"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {comparisons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {comparisons.map(({ clinic, service, distance }) => (
              <div
                key={clinic.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-300 transition-all"
              >
                {/* Clinic Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-3xl">{clinic.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-900 text-sm leading-tight">{clinic.name}</h3>
                    <p className="text-xs text-stone-600">{clinic.doctor}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star size={11} className="fill-amber-300 text-amber-300" />
                      <span className="text-xs font-medium text-stone-700">{clinic.rating}</span>
                      <span className="text-xs text-stone-500">({clinic.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Service Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 mb-4">
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                      {service.name}
                    </p>
                    <p className="text-2xl font-bold text-stone-900">₹{service.priceFrom.toLocaleString()}</p>
                    <p className="text-xs text-stone-600 mt-1">{service.duration}</p>
                  </div>

                  {/* Service Rating */}
                  {service.rating && (
                    <div className="border-t border-blue-200 pt-2.5">
                      <div className="flex items-center gap-2">
                        <Star size={12} className="fill-amber-300 text-amber-300" />
                        <span className="text-xs font-medium text-stone-800">
                          {service.rating}/5
                        </span>
                        <span className="text-xs text-stone-600">
                          ({service.reviewCount} verified bookings)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Location & Availability */}
                <div className="space-y-2 mb-4 text-xs text-stone-600">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-stone-400 flex-shrink-0 mt-0.5" />
                    <span>{distance.toFixed(1)} km away</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={14} className="text-stone-400 flex-shrink-0 mt-0.5" />
                    <span className="text-green-600 font-medium">Available today 3 PM</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2">
                  <Link
                    href={`/booking?clinic=${clinic.id}&service=${encodeURIComponent(service.name)}&price=${service.priceFrom}`}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    <Phone size={14} />
                    Book Now
                  </Link>
                  <Link
                    href={`/clinic/${clinic.id}`}
                    className="flex items-center justify-center gap-2 w-full bg-stone-100 text-stone-700 font-medium py-2.5 rounded-lg hover:bg-stone-200 transition text-sm"
                  >
                    View Clinic
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-stone-500 text-lg mb-2">No clinics found matching your criteria.</p>
            <p className="text-stone-400 text-sm">Try adjusting your filters or searching for another service.</p>
          </div>
        )}
      </div>
    </div>
  );
}
