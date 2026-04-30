'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Phone, Mail, Calendar, Clock, User, MessageSquare } from 'lucide-react'
import type { Clinic, Service } from '@/lib/types'

interface BookingFormClientProps {
  clinic?: Clinic
  service?: Service
  price: string
  serviceName: string
}

export default function BookingFormClient({
  clinic,
  service,
  price,
  serviceName,
}: BookingFormClientProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinic_id: clinic?.id,
          patient_name: `${formData.firstName} ${formData.lastName}`,
          patient_email: formData.email,
          patient_phone: formData.phone,
          service_name: serviceName,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          notes: formData.notes,
        }),
      })

      if (response.ok) {
        const booking = await response.json()
        sessionStorage.setItem('lastBooking', JSON.stringify(booking))
        setSubmitted(true)
        setTimeout(() => {
          router.push('/booking-confirmation')
        }, 1500)
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!clinic || !service) {
    return (
      <div className="min-h-screen bg-white px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft size={16} />
            Back
          </Link>
          <p className="text-stone-600">Invalid booking details</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Booking Submitted!</h2>
          <p className="text-stone-600">Redirecting to confirmation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft size={16} />
          Back to search
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Book Appointment</h1>
          <p className="text-stone-600 mb-6">Fill in your details to book an appointment</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="font-semibold text-stone-900">{clinic.name}</p>
            <p className="text-sm text-stone-600">{clinic.doctor}</p>
            <p className="text-sm text-stone-600 mt-2">Service: {service.name}</p>
            <p className="text-sm font-semibold text-blue-600 mt-2">₹{price}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="date"
              required
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="time"
              required
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <textarea
              placeholder="Additional notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
