'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Home } from 'lucide-react'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try sessionStorage first (immediate redirect case), then localStorage (refresh / return)
    const raw = sessionStorage.getItem('lastBooking') || localStorage.getItem('lastBooking')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        // Only use it if it matches the id in the URL (if present)
        const urlId = searchParams.get('id')
        if (!urlId || parsed.id === urlId) {
          setBooking(parsed)
          setLoading(false)
          return
        }
      } catch {}
    }
    setLoading(false)
  }, [searchParams])

  const handlePrint = () => window.print()

  const formatDateDisplay = (d: string) => {
    if (!d) return d
    try {
      return new Date(d + 'T12:00:00').toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    } catch {
      return d
    }
  }

  const fmt12 = (time: string) => {
    if (!time) return ''
    const [h, m] = time.split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h
    return `${hour12}:${m.toString().padStart(2, '0')} ${period}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-stone-500 text-lg mb-4">Booking details not found</p>
          <Link href="/" className="inline-block px-5 py-2.5 bg-teal-600 text-white rounded-full text-sm font-medium hover:bg-teal-700 transition">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Request Submitted!</h1>
          <p className="text-stone-600">Your appointment request has been successfully sent.</p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-green-200 p-6 sm:p-8 mb-6 shadow-lg">
          <div className="text-center mb-6">
            <p className="text-stone-500 text-xs font-medium uppercase tracking-wider mb-1">Booking Reference</p>
            <p className="font-display text-2xl font-bold text-stone-900 font-mono tracking-widest">{booking.id}</p>
          </div>

          <div className="bg-stone-50 rounded-xl p-4 space-y-2.5 text-sm mb-6">
            {booking.service_name && (
              <div className="flex justify-between">
                <span className="text-stone-500">Service</span>
                <span className="font-semibold text-stone-900 text-right">{booking.service_name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-stone-500">Date</span>
              <span className="font-semibold text-stone-900">{formatDateDisplay(booking.preferred_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Time</span>
              <span className="font-semibold text-stone-900">{fmt12(booking.preferred_time)}</span>
            </div>
            <div className="border-t border-stone-200 pt-2.5 flex justify-between">
              <span className="text-stone-500">Patient</span>
              <span className="font-semibold text-stone-900">{booking.patient_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Phone</span>
              <span className="font-semibold text-stone-900">+91 {booking.patient_phone}</span>
            </div>
          </div>

          <div className="mb-2">
            <h2 className="font-semibold text-stone-900 mb-3">What happens next?</h2>
            <ol className="space-y-3">
              {[
                { label: 'Clinic will call you', detail: 'within 2 hours to confirm your slot' },
                { label: 'Review the details', detail: 'provided in the confirmation call' },
                { label: 'Arrive 10 minutes early', detail: 'on your appointment date' },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-stone-700">
                    <strong>{item.label}</strong> — {item.detail}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-stone-200 rounded-xl font-semibold text-stone-700 hover:bg-stone-50 transition"
          >
            <Download size={16} />
            Print Confirmation
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition"
          >
            <Home size={16} />
            Book Another
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50" />}>
      <ConfirmationContent />
    </Suspense>
  )
}
