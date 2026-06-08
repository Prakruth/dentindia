'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, MapPin } from 'lucide-react'
import type { ClinicServiceMatch } from '@/lib/types'
import { trackComparisonViewed, trackFilterApplied, trackClinicCardClick, trackBookingInitiated } from '@/lib/analytics'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

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

  // Track comparison page view
  useEffect(() => {
    const clinicIds = initialComparisons.map(c => c.clinic.id);
    trackComparisonViewed(clinicIds, serviceName);
  }, [initialComparisons, serviceName]);

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
      <div className="bg-gradient-to-br from-teal-700 to-teal-600 text-white px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-teal-100 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={18} />
            Back
          </Link>
          <h1 className="font-display text-3xl font-bold mb-2">{serviceName}</h1>
          <p className="text-teal-100">
            {comparisons.length} clinic{comparisons.length !== 1 ? 's' : ''} offering this service
            {cityFilter !== 'All Cities' && ` in ${cityFilter}`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6 ring-0 border border-stone-200 shadow-none">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-stone-700 mb-2 block">Sort By</label>
                <Select
                  value={sortBy}
                  onValueChange={(value) => {
                    const v = value as typeof sortBy;
                    setSortBy(v);
                    trackFilterApplied('sort', v);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                    <SelectItem value="rating">Rating (High to Low)</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-semibold text-stone-700 mb-2 block">Min Rating</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setMinRating(value);
                    trackFilterApplied('min_rating', value.toString());
                  }}
                  className="w-full accent-teal-600"
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
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setMaxPrice(value);
                    trackFilterApplied('max_price', value.toString());
                  }}
                  className="w-full accent-teal-600"
                />
                <span className="text-xs text-stone-600">₹{maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {comparisons.length > 0 ? (
          <div className="space-y-4">
            {comparisons.map((match, index) => (
              <Link
                key={`${match.clinic.id}-${match.service.id}`}
                href={`/clinic/${match.clinic.id}`}
                onClick={() => {
                  trackClinicCardClick(match.clinic.id, match.clinic.name, index + 1, 'service_comparison');
                }}
                className="block group"
              >
                <Card className="ring-0 border border-stone-200 hover:border-teal-400 hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-stone-900 group-hover:text-teal-700 transition-colors">
                          {match.clinic.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-stone-600 mt-0.5">
                          {match.clinic.doctor}
                        </CardDescription>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge variant="secondary" className="text-base font-bold px-3 py-1 h-auto bg-teal-50 text-teal-700 border border-teal-200">
                          ₹{match.service.price_from.toLocaleString()}
                        </Badge>
                        {match.service.price_to && (
                          <p className="text-xs text-stone-500 mt-1">up to ₹{match.service.price_to.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <p className="text-sm text-stone-700 mb-3">{match.service.description}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-stone-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={15} className="text-stone-400 flex-shrink-0" />
                        <span>{match.distance.toFixed(1)} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500">{match.service.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star size={15} className="fill-stone-300 text-stone-300 flex-shrink-0" />
                        <span>{match.service.review_count || 0} reviews</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="justify-end bg-transparent border-t border-stone-100">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        trackBookingInitiated(match.clinic.id, match.service.name, match.service.price_from);
                        window.location.href = `/booking?clinic=${match.clinic.id}&service=${encodeURIComponent(match.service.name)}&price=${match.service.price_from ?? 0}`;
                      }}
                    >
                      Book Now
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="ring-0 border border-stone-200 shadow-none">
            <CardContent className="py-12 text-center">
              <p className="text-stone-600 text-lg mb-4">No clinics found matching your filters</p>
              <Button render={<Link href="/" />}>
                Try Another Search
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
