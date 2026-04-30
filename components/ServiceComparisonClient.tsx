'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, MapPin, Phone, MessageCircle } from 'lucide-react'
import type { ClinicServiceMatch } from '@/lib/types'

interface ServiceComparisonClientProps {
  serviceName: string
  cityFilter: string
  initialComparisons: ClinicServiceMatch[]
}

export default function ServiceComparisonClient({
  serviceName,
  cityFilter,
  initialComparisons,
}: ServiceComparisonClientProps) {
  const [sortBy, setSortBy] = useState<'recommended' | 'price' | 'rating' | 'distance'>('recommended')
  const [minRating, setMinRating] = useState(0)
  const [maxPrice, setMaxPrice] = useState(50000)

  const comparisons = useMemo(() => {
    let results = [...initialComparisons]

    // Filter by price and rating
    results = results.filter((r) => {
      const priceMatches = r.service.price_from <= maxPrice
      const ratingMatches = (r.service.rating || 0) >= minRating
      return priceMatches && ratingMatches
    })

    // Sort
    switch (sortBy) {
      case 'price':
        results.sort((a, b) => a.service.price_from - b.service.price_from)
        break
      case 'rating':
        results.sort((a, b) => (b.service.rating || 0) - (a.service.rating || 0))
        break
      case 'distance':
        results.sort((a, b) => a.distance - b.distance)
        break
      case 'recommended':
      default:
        results.sort((a, b) => {
          const aScore = (a.service.rating || 0) * (a.service.review_count || 1) - a.service.price_from / 10000
          const bScore = (b.service.rating || 0) * (b.service.review_count || 1) - b.service.price_from / 10000
          return bScore - aScore
        })
    }

    return results
  }, [initialComparisons, sortBy, minRating, maxPrice])

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-600 text-white px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-4">
            <ArrowLeft size={18} />
            Back
          </Link>
          <h1 className="font-display text-3xl font-bold mb-2">{serviceName}</h1>
          <p className="text-blue-100">
            {comparisons.length} clinic{comparisons.length !== 1 ? 's' : ''} offering this service
            {cityFilter !== 'All Cities' && ` in ${cityFilter}`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-stone-700 mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="price">Price (Low to High)</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="distance">Distance</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-stone-700 mb-2 block">Min Rating</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-stone-600">{minRating}+ stars</span>
            </div>
            <div>
              <label className="text-sm font-semibold text-stone-700 mb-2 block">Max Price</label>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-stone-600">₹{maxPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Results */}
        {comparisons.length > 0 ? (
          <div className="space-y-4">
            {comparisons.map((match) => (
              <div
                key={`${match.clinic.id}-${match.service.id}`}
                className="block"
              >
                <Link
                  href={`/clinic/${match.clinic.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-lg hover:border-blue-400 transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-stone-900">{match.clinic.name}</h3>
                        <span className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold text-stone-700">{match.clinic.rating}</span>
                        </span>
                      </div>
                      <p className="text-sm text-stone-600">{match.clinic.doctor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">₹{match.service.price_from.toLocaleString()}</p>
                      {match.service.price_to && (
                        <p className="text-xs text-stone-600">up to ₹{match.service.price_to.toLocaleString()}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-stone-700 mb-4">{match.service.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-stone-400" />
                      <span>{match.distance.toFixed(1)} km</span>
                    </div>
                    <div>
                      <span className="text-stone-600">{match.service.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="fill-stone-300 text-stone-300" />
                      <span>{match.service.review_count || 0} reviews</span>
                    </div>
                    <div className="text-right">
                      <Link
                        href={`/booking?clinic=${match.clinic.id}&service=${encodeURIComponent(match.service.name)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
            <p className="text-stone-600 text-lg">No clinics found matching your filters</p>
            <Link href="/" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Try Another Search
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
