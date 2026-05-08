'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react'

interface FormState {
  clinic_name: string
  email: string
  password: string
  confirm_password: string
  phone: string
}

interface FieldError {
  clinic_name?: string
  email?: string
  password?: string
  confirm_password?: string
  phone?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(form: FormState): FieldError {
  const errors: FieldError = {}

  if (!form.clinic_name.trim()) {
    errors.clinic_name = 'Clinic name is required'
  }
  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }
  if (!form.confirm_password) {
    errors.confirm_password = 'Please confirm your password'
  } else if (form.password !== form.confirm_password) {
    errors.confirm_password = 'Passwords do not match'
  }
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required'
  }

  return errors
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>({
    clinic_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldError>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear per-field error on change
    if (fieldErrors[name as keyof FieldError]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    const errors = validateForm(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
          clinic_name: form.clinic_name.trim(),
          phone: form.phone.trim(),
        }),
      })

      const data = await res.json()

      if (res.status === 201) {
        setSuccess(true)
        return
      }

      if (res.status === 409) {
        setServerError('An account with this email already exists')
      } else if (res.status === 400) {
        setServerError(data.error ?? 'Validation error. Please check your inputs.')
      } else if (res.status === 429) {
        setServerError(data.error ?? 'Too many attempts. Please try again later.')
      } else {
        setServerError('Registration failed. Please try again.')
      }
    } catch {
      setServerError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 flex items-center justify-center px-4 py-12 overflow-auto">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center mx-auto mb-4 shadow-md">
              <Building2 size={32} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-stone-900">
              Dent<span className="text-teal-600">India</span>
            </h1>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={52} className="text-teal-500" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              Registration submitted!
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              Your clinic registration is pending approval. We'll review your application and
              you'll be able to log in once approved.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:underline focus:outline-none focus-visible:underline"
            >
              <ArrowLeft size={15} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Form state ─────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 overflow-auto">
      <div className="min-h-full flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to login */}
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-teal-600 transition-colors focus:outline-none focus-visible:text-teal-600"
          >
            <ArrowLeft size={15} />
            Back to Login
          </Link>
        </div>

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center mx-auto mb-4 shadow-md">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            Dent<span className="text-teal-600">India</span>
          </h1>
          <p className="text-stone-500 text-sm mt-1">Register your clinic</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-1">Create an account</h2>
          <p className="text-sm text-stone-500 mb-6">
            Submit your details and we'll review your application.
          </p>

          {/* Server error banner */}
          {serverError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
            >
              <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold leading-none">!</span>
              </span>
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Clinic Name */}
            <div>
              <label
                htmlFor="reg-clinic_name"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Clinic Name <span className="text-red-500">*</span>
              </label>
              <input
                id="reg-clinic_name"
                name="clinic_name"
                type="text"
                autoComplete="organization"
                value={form.clinic_name}
                onChange={handleChange}
                placeholder="e.g. Smile Dental Clinic"
                disabled={loading}
                required
                aria-describedby={fieldErrors.clinic_name ? 'err-clinic_name' : undefined}
                className={`w-full px-4 py-2.5 border rounded-lg text-stone-900 placeholder-stone-400
                           focus:ring-2 outline-none transition disabled:bg-stone-50 disabled:text-stone-400
                           ${
                             fieldErrors.clinic_name
                               ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                               : 'border-stone-200 focus:border-teal-500 focus:ring-teal-100'
                           }`}
              />
              {fieldErrors.clinic_name && (
                <p id="err-clinic_name" className="mt-1 text-xs text-red-600">
                  {fieldErrors.clinic_name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="reg-email"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
                required
                aria-describedby={fieldErrors.email ? 'err-email' : undefined}
                className={`w-full px-4 py-2.5 border rounded-lg text-stone-900 placeholder-stone-400
                           focus:ring-2 outline-none transition disabled:bg-stone-50 disabled:text-stone-400
                           ${
                             fieldErrors.email
                               ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                               : 'border-stone-200 focus:border-teal-500 focus:ring-teal-100'
                           }`}
              />
              {fieldErrors.email && (
                <p id="err-email" className="mt-1 text-xs text-red-600">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="reg-phone"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Phone number <span className="text-red-500">*</span>
              </label>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                disabled={loading}
                required
                aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
                className={`w-full px-4 py-2.5 border rounded-lg text-stone-900 placeholder-stone-400
                           focus:ring-2 outline-none transition disabled:bg-stone-50 disabled:text-stone-400
                           ${
                             fieldErrors.phone
                               ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                               : 'border-stone-200 focus:border-teal-500 focus:ring-teal-100'
                           }`}
              />
              {fieldErrors.phone && (
                <p id="err-phone" className="mt-1 text-xs text-red-600">
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  disabled={loading}
                  required
                  aria-describedby={fieldErrors.password ? 'err-password' : undefined}
                  className={`w-full px-4 py-2.5 pr-11 border rounded-lg text-stone-900 placeholder-stone-400
                             focus:ring-2 outline-none transition disabled:bg-stone-50 disabled:text-stone-400
                             ${
                               fieldErrors.password
                                 ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                                 : 'border-stone-200 focus:border-teal-500 focus:ring-teal-100'
                             }`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-stone-400 hover:text-stone-600 focus:outline-none focus-visible:text-teal-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="err-password" className="mt-1 text-xs text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="reg-confirm_password"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="reg-confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  disabled={loading}
                  required
                  aria-describedby={fieldErrors.confirm_password ? 'err-confirm_password' : undefined}
                  className={`w-full px-4 py-2.5 pr-11 border rounded-lg text-stone-900 placeholder-stone-400
                             focus:ring-2 outline-none transition disabled:bg-stone-50 disabled:text-stone-400
                             ${
                               fieldErrors.confirm_password
                                 ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                                 : 'border-stone-200 focus:border-teal-500 focus:ring-teal-100'
                             }`}
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-stone-400 hover:text-stone-600 focus:outline-none focus-visible:text-teal-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.confirm_password && (
                <p id="err-confirm_password" className="mt-1 text-xs text-red-600">
                  {fieldErrors.confirm_password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-3 rounded-lg font-semibold text-white transition-all
                ${
                  loading
                    ? 'bg-stone-300 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98] shadow-sm'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    aria-hidden="true"
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  Submitting…
                </span>
              ) : (
                'Register Clinic'
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-stone-500 mt-6">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-teal-600 font-medium hover:underline focus:outline-none focus-visible:underline"
          >
            Sign in →
          </Link>
        </p>
      </div>
      </div>
    </div>
  )
}
