'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle, Calendar, Download } from 'lucide-react'

function ConfirmationContent() {
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const lastBooking = sessionStorage.getItem('lastBooking')
    if (lastBooking) {
      setBooking(JSON.parse(lastBooking))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-stone-500 text-lg mb-4">No booking found</p>
          <Link href="/" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition">
            Back Home
          </Link>
        </div>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Booking Confirmed!</h1>
          <p className="text-stone-600">Your appointment request has been successfully submitted.</p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-green-200 p-8 mb-6 shadow-lg">
          <div className="text-center mb-8">
            <p className="text-stone-600 text-sm mb-1">BOOKING REFERENCE</p>
            <p className="font-display text-2xl font-bold text-stone-900 font-mono">{booking.id}</p>
          </div>

          <div className="mb-8 pb-8 border-b border-stone-200">
            <h2 className="font-semibold text-stone-900 mb-4">Appointment Details</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-stone-600">Service:</span> <span className="font-semibold">{booking.service_name}</span></div>
              <div><span className="text-stone-600">Date:</span> <span className="font-semibold">{booking.preferred_date}</span></div>
              <div><span className="text-stone-600">Time:</span> <span className="font-semibold">{booking.preferred_time}</span></div>
              <div><span className="text-stone-600">Patient:</span> <span className="font-semibold">{booking.patient_name}</span></div>
              <div><span className="text-stone-600">Email:</span> <span className="font-semibold">{booking.patient_email}</span></div>
              <div><span className="text-stone-600">Phone:</span> <span className="font-semibold">{booking.patient_phone}</span></div>
            </div>
          </div>

          <div className="mb-8 pb-8 border-b border-stone-200">
            <h2 className="font-semibold text-stone-900 mb-4">What's Next?</h2>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">1</span>
                <span className="text-sm text-stone-700"><strong>Clinic will call you</strong> within 2 hours to confirm</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">2</span>
                <span className="text-sm text-stone-700"><strong>Review the details</strong> provided in the confirmation call</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">3</span>
                <span className="text-sm text-stone-700"><strong>Arrive 10 minutes early</strong> on the appointment date</span>
              </li>
            </ol>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-stone-200 rounded-lg font-semibold text-stone-700 hover:bg-stone-50 transition">
            <Download size={16} />
            Print Confirmation
          </button>
          <Link href="/" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
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
