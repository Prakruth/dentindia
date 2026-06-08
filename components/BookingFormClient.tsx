'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { Clinic, Service } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
          <Link href="/" className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 mb-4">
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
        <Link href="/" className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 mb-8 transition-colors">
          <ArrowLeft size={16} />
          Back to search
        </Link>

        <Card className="ring-0 border border-stone-200 shadow-sm mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-stone-900">Book Appointment</CardTitle>
            <p className="text-stone-600 text-sm mt-1">Fill in your details to book an appointment</p>
          </CardHeader>

          <CardContent className="pb-8">
            {/* Booking summary */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-8">
              <p className="font-semibold text-stone-900">{clinic.name}</p>
              <p className="text-sm text-stone-600">{clinic.doctor}</p>
              <p className="text-sm text-stone-600 mt-2">Service: {service.name}</p>
              <p className="text-sm font-semibold text-teal-700 mt-2">₹{price}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="firstName" className="text-sm font-medium text-stone-700">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="lastName" className="text-sm font-medium text-stone-700">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-stone-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-sm font-medium text-stone-700">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="preferredDate" className="text-sm font-medium text-stone-700">
                  Preferred Date
                </label>
                <Input
                  id="preferredDate"
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="preferredTime" className="text-sm font-medium text-stone-700">
                  Preferred Time
                </label>
                <Input
                  id="preferredTime"
                  type="time"
                  required
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="notes" className="text-sm font-medium text-stone-700">
                  Additional Notes <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  placeholder="Any special requirements or questions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none resize-none h-24 text-sm bg-transparent placeholder:text-muted-foreground transition-colors"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base font-semibold"
              >
                {loading ? 'Submitting…' : 'Confirm Appointment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
