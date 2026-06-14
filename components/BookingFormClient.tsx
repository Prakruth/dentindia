'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Check, User, MessageSquare,
} from 'lucide-react'
import type { Clinic, Service } from '@/lib/types'
import { trackBookingStepCompleted, trackBookingSubmitted, trackError } from '@/lib/analytics'

// ─── Timings utils ────────────────────────────────────────────────────────────

function getClosedDays(timings: string): Set<number> {
  if (/mon[^a-z]*sun|every\s*day|daily/i.test(timings)) return new Set()
  if (/mon[^a-z]*fri/i.test(timings)) return new Set([0, 6])
  if (/mon[^a-z]*sat/i.test(timings)) return new Set([0])
  return new Set([0]) // default: Sunday closed
}

function parseOpenHours(timings: string): { start: number; end: number } {
  const m = timings.match(/(\d{1,2})(?::\d{2})?\s*(am|pm)\s*[-–—]\s*(\d{1,2})(?::\d{2})?\s*(am|pm)/i)
  if (!m) return { start: 9, end: 18 }
  const toHour = (h: string, pm: boolean) => {
    const n = parseInt(h)
    if (pm && n !== 12) return n + 12
    if (!pm && n === 12) return 0
    return n
  }
  return { start: toHour(m[1], /pm/i.test(m[2])), end: toHour(m[3], /pm/i.test(m[4])) }
}

function generateSlots(start: number, end: number): string[] {
  const slots: string[] = []
  for (let h = start; h < end; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`)
    slots.push(`${h.toString().padStart(2, '0')}:30`)
  }
  return slots
}

function fmt12(time: string): string {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`
}

function validatePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return 'Phone number is required'
  if (digits.length !== 10) return 'Enter a 10-digit mobile number'
  if (!/^[6-9]/.test(digits)) return 'Enter a valid Indian mobile number'
  return ''
}

// ─── CalendarPicker ───────────────────────────────────────────────────────────

function CalendarPicker({
  selected,
  onChange,
  closedDays,
}: {
  selected: string
  onChange: (date: string) => void
  closedDays: Set<number>
}) {
  // Compute dates lazily so SSR and client always agree (no new Date() at module eval)
  const { today, tomorrow, maxDate } = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    const tmr = new Date(t)
    tmr.setDate(t.getDate() + 1)
    const mx = new Date(t)
    mx.setDate(t.getDate() + 90)
    return { today: t, tomorrow: tmr, maxDate: mx }
  }, [])

  const [viewYear, setViewYear] = useState(() => tomorrow.getFullYear())
  const [viewMonth, setViewMonth] = useState(() => tomorrow.getMonth())

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const startDow = new Date(viewYear, viewMonth, 1).getDay()

  const canGoPrev = () => {
    const prev = new Date(viewYear, viewMonth - 1, 1)
    return prev >= new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1)
  }

  const prevMonth = () => {
    if (!canGoPrev()) return
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} disabled={!canGoPrev()} className="p-1.5 rounded-lg hover:bg-stone-100 disabled:opacity-30 transition">
          <ChevronLeft size={18} />
        </button>
        <span className="font-semibold text-stone-900">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-stone-100 transition">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-stone-400 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const date = new Date(viewYear, viewMonth, day)
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isDisabled = date < tomorrow || date > maxDate || closedDays.has(date.getDay())
          const isSelected = selected === dateStr
          const isToday = date.getTime() === today.getTime()
          return (
            <button
              key={i}
              onClick={() => !isDisabled && onChange(dateStr)}
              disabled={isDisabled}
              className={[
                'aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition',
                isSelected ? 'bg-teal-600 text-white' : '',
                !isSelected && !isDisabled ? 'hover:bg-teal-50 text-stone-800' : '',
                isDisabled ? 'text-stone-300 cursor-not-allowed' : '',
                isToday && !isSelected ? 'ring-2 ring-teal-200' : '',
              ].join(' ')}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── StepBar ──────────────────────────────────────────────────────────────────

const STEP_LABELS = ['Service', 'Date & Time', 'Your Details', 'Confirm']

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <div key={n} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <div className={[
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition',
                done || active ? 'bg-teal-600 text-white' : 'bg-stone-200 text-stone-400',
              ].join(' ')}>
                {done ? <Check size={13} /> : n}
              </div>
              <span className={`text-xs hidden sm:block whitespace-nowrap ${active ? 'text-teal-700 font-medium' : 'text-stone-400'}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-3 sm:mb-4 ${done ? 'bg-teal-600' : 'bg-stone-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface BookingFormClientProps {
  clinic?: Clinic
  service?: Service
  price: string
  serviceName: string
}

export default function BookingFormClient({ clinic, service, price, serviceName }: BookingFormClientProps) {
  const router = useRouter()

  const hasPreselectedService = !!(serviceName && service)
  const [step, setStep] = useState(hasPreselectedService ? 2 : 1)
  const [selectedService, setSelectedService] = useState<Service | undefined>(service)
  const [selectedServiceName, setSelectedServiceName] = useState(serviceName || service?.name || '')
  const [selectedPrice, setSelectedPrice] = useState(parseInt(price) || service?.price_from || 0)

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isDuplicate, setIsDuplicate] = useState(false)

  // Restore draft from localStorage
  useEffect(() => {
    if (!clinic) return
    try {
      const saved = localStorage.getItem(`booking_draft_${clinic.id}`)
      if (saved) {
        const draft = JSON.parse(saved)
        if (draft.name) setName(draft.name)
        if (draft.phone) setPhone(draft.phone)
        if (draft.notes) setNotes(draft.notes)
        if (draft.date) setDate(draft.date)
        if (draft.time) setTime(draft.time)
      }
    } catch {}
  }, [clinic?.id])

  // Persist draft to localStorage
  useEffect(() => {
    if (!clinic) return
    localStorage.setItem(`booking_draft_${clinic.id}`, JSON.stringify({ name, phone, notes, date, time }))
  }, [clinic?.id, name, phone, notes, date, time])

  const closedDays = clinic ? getClosedDays(clinic.timings) : new Set([0])
  const openHours = clinic ? parseOpenHours(clinic.timings) : { start: 9, end: 18 }
  const allSlots = generateSlots(openHours.start, openHours.end)

  const filteredSlots = allSlots.filter(slot => {
    const h = parseInt(slot)
    if (timeFilter === 'morning') return h >= 6 && h < 12
    if (timeFilter === 'afternoon') return h >= 12 && h < 17
    if (timeFilter === 'evening') return h >= 17
    return true
  })

  const formatDateDisplay = (d: string) => {
    if (!d) return ''
    return new Date(d + 'T12:00:00').toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  const goNext = (currentStep: number) => {
    trackBookingStepCompleted(STEP_LABELS[currentStep - 1], currentStep)
    setStep(currentStep + 1)
  }

  const handleSubmit = async () => {
    const err = validatePhone(phone)
    if (err) { setPhoneError(err); return }
    if (!name.trim()) return

    setLoading(true)
    setSubmitError('')
    setIsDuplicate(false)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinic_id: clinic?.id,
          patient_name: name.trim(),
          patient_phone: phone.replace(/\D/g, ''),
          service_name: selectedServiceName,
          preferred_date: date,
          preferred_time: time,
          notes: notes.trim() || undefined,
        }),
      })

      if (res.status === 409) {
        setIsDuplicate(true)
        setLoading(false)
        return
      }

      if (!res.ok) {
        const data = await res.json()
        setSubmitError(data.error || 'Failed to submit booking. Please try again.')
        trackError('booking_failed', { clinic_id: clinic?.id, error: data.error })
        setLoading(false)
        return
      }

      const booking = await res.json()
      trackBookingSubmitted(clinic?.id || '', selectedServiceName, selectedPrice)

      if (clinic) localStorage.removeItem(`booking_draft_${clinic.id}`)
      sessionStorage.setItem('lastBooking', JSON.stringify(booking))
      localStorage.setItem('lastBooking', JSON.stringify(booking))

      router.push(`/booking-confirmation?id=${booking.id}`)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-white px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 mb-4">
            <ArrowLeft size={16} /> Back
          </Link>
          <p className="text-stone-600">Invalid booking details. Please select a clinic first.</p>
        </div>
      </div>
    )
  }

  const clinicHeader = (
    <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{clinic.image}</div>
        <div>
          <p className="font-semibold text-stone-900">{clinic.name}</p>
          <p className="text-sm text-stone-500">{clinic.doctor} · {clinic.area}, {clinic.city}</p>
          {selectedServiceName && (
            <p className="text-sm text-teal-700 font-medium mt-1">
              {selectedServiceName}
              {selectedPrice > 0 && ` · ₹${selectedPrice.toLocaleString('en-IN')} onwards`}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  // ── Step 1: Service selection ──────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href={`/clinic/${clinic.id}`} className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 mb-6">
            <ArrowLeft size={16} /> {clinic.name}
          </Link>
          <StepBar current={1} />
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <h1 className="font-display text-2xl font-bold text-stone-900 mb-1">Select a Service</h1>
            <p className="text-stone-500 text-sm mb-6">Choose the treatment you'd like to book</p>
            <div className="space-y-3">
              {clinic.services.map((svc) => (
                <button
                  key={svc.name}
                  onClick={() => {
                    setSelectedService(svc)
                    setSelectedServiceName(svc.name)
                    setSelectedPrice(svc.price_from)
                    goNext(1)
                  }}
                  className={[
                    'w-full text-left p-4 rounded-xl border-2 transition',
                    selectedServiceName === svc.name
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-stone-200 hover:border-teal-300 hover:bg-stone-50',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-stone-900">{svc.name}</p>
                      <p className="text-stone-500 text-sm mt-0.5 leading-snug">{svc.description}</p>
                      <p className="text-xs text-stone-400 mt-1">{svc.duration}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-teal-700">₹{svc.price_from.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-stone-400">onwards</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 2: Date & Time ────────────────────────────────────────────────────
  if (step === 2) {
    const canAdvance = date.length > 0 && time.length > 0
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-8 pb-28">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 mb-6">
            <ArrowLeft size={16} /> Back
          </button>
          <StepBar current={2} />
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-4">
            {clinicHeader}
            <h2 className="font-display text-xl font-bold text-stone-900 mb-1">Choose Date & Time</h2>
            <p className="text-stone-500 text-sm mb-5">Select your preferred appointment slot</p>

            <CalendarPicker selected={date} onChange={(d) => { setDate(d); setTime('') }} closedDays={closedDays} />

            {date && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-stone-700">
                    Slots for {formatDateDisplay(date)}
                  </p>
                  <div className="flex gap-1">
                    {(['all', 'morning', 'afternoon', 'evening'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setTimeFilter(f)}
                        className={[
                          'px-2.5 py-1 rounded-full text-xs font-medium transition',
                          timeFilter === f ? 'bg-teal-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200',
                        ].join(' ')}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {filteredSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={[
                        'py-2 px-1 rounded-lg text-sm font-medium border-2 transition',
                        time === slot
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'border-stone-200 text-stone-700 hover:border-teal-300 hover:bg-teal-50',
                      ].join(' ')}
                    >
                      {fmt12(slot)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-stone-400 mt-4">
              Preferred time will be confirmed by the clinic within 2 hours.
            </p>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-200 sm:relative sm:bg-transparent sm:border-0 sm:p-0">
            <button
              onClick={() => goNext(2)}
              disabled={!canAdvance}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold py-3.5 rounded-xl hover:bg-teal-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue to Details <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 3: Patient details ────────────────────────────────────────────────
  if (step === 3) {
    const canAdvance = name.trim().length > 0 && phone.length > 0 && validatePhone(phone) === ''
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-8 pb-28">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 mb-6">
            <ArrowLeft size={16} /> Back
          </button>
          <StepBar current={3} />
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-4">
            {clinicHeader}
            <h2 className="font-display text-xl font-bold text-stone-900 mb-1">Your Details</h2>
            <p className="text-stone-500 text-sm mb-6">The clinic will call you to confirm your appointment</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <User size={14} className="text-stone-400" />
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-stone-900"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <div className={[
                  'flex items-center border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500',
                  phoneError ? 'border-red-400' : 'border-stone-200 focus-within:border-teal-500',
                ].join(' ')}>
                  <span className="px-3 py-3 bg-stone-50 text-stone-500 text-sm border-r border-stone-200 font-medium select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    value={phone}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setPhone(val)
                      if (phoneError) setPhoneError(validatePhone(val))
                    }}
                    onBlur={() => setPhoneError(validatePhone(phone))}
                    className="flex-1 px-4 py-3 outline-none text-stone-900 bg-transparent"
                  />
                </div>
                {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-stone-400" />
                  Any concerns?{' '}
                  <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="E.g., tooth pain, specific concern, urgency..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-stone-900 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-200 sm:relative sm:bg-transparent sm:border-0 sm:p-0">
            <button
              onClick={() => goNext(3)}
              disabled={!canAdvance}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold py-3.5 rounded-xl hover:bg-teal-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Review Booking <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 4: Review & Confirm ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 pb-28">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setStep(3)} className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 mb-6">
          <ArrowLeft size={16} /> Back
        </button>
        <StepBar current={4} />

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-4">
          <h2 className="font-display text-xl font-bold text-stone-900 mb-1">Review Your Booking</h2>
          <p className="text-stone-500 text-sm mb-6">Confirm the details below before submitting</p>

          <div className="bg-stone-50 rounded-xl p-4 space-y-2.5 text-sm mb-5">
            <div className="flex justify-between">
              <span className="text-stone-500">Clinic</span>
              <span className="font-medium text-stone-900 text-right">{clinic.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Doctor</span>
              <span className="font-medium text-stone-900">{clinic.doctor}</span>
            </div>
            <div className="border-t border-stone-200 pt-2.5 flex justify-between">
              <span className="text-stone-500">Service</span>
              <span className="font-medium text-stone-900 text-right">{selectedServiceName}</span>
            </div>
            {selectedPrice > 0 && (
              <div className="flex justify-between">
                <span className="text-stone-500">Est. Price</span>
                <span className="font-semibold text-teal-700">₹{selectedPrice.toLocaleString('en-IN')} onwards</span>
              </div>
            )}
            <div className="border-t border-stone-200 pt-2.5 flex justify-between">
              <span className="text-stone-500">Date</span>
              <span className="font-medium text-stone-900">{formatDateDisplay(date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Time</span>
              <span className="font-medium text-stone-900">{fmt12(time)}</span>
            </div>
            <div className="border-t border-stone-200 pt-2.5 flex justify-between">
              <span className="text-stone-500">Name</span>
              <span className="font-medium text-stone-900">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Phone</span>
              <span className="font-medium text-stone-900">+91 {phone}</span>
            </div>
            {notes && (
              <div className="flex justify-between gap-4">
                <span className="text-stone-500 flex-shrink-0">Notes</span>
                <span className="font-medium text-stone-900 text-right">{notes}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm text-stone-600 mb-4">
            {['Free cancellation anytime', 'No payment required now', 'Clinic will call within 2 hours to confirm'].map(t => (
              <div key={t} className="flex items-start gap-2">
                <Check size={15} className="text-teal-500 flex-shrink-0 mt-0.5" />
                <span>{t}</span>
              </div>
            ))}
          </div>

          {isDuplicate && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              You already have a pending booking at this clinic for that date. Please call the clinic directly or choose a different date.
            </div>
          )}

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {submitError}
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-200 sm:relative sm:bg-transparent sm:border-0 sm:p-0 space-y-2">
          <button
            onClick={handleSubmit}
            disabled={loading || isDuplicate}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold py-3.5 rounded-xl hover:bg-teal-700 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <Check size={16} />
                Confirm Appointment Request
              </>
            )}
          </button>
          <a
            href={`tel:${clinic.phone}`}
            className="block w-full text-center text-sm text-stone-500 py-2 hover:text-stone-700"
          >
            Prefer to call? {clinic.phone}
          </a>
        </div>
      </div>
    </div>
  )
}
