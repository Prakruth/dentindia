'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        // Navigate to the role-appropriate destination, honouring ?redirect= if present
        const params = new URLSearchParams(window.location.search)
        const redirectTo = params.get('redirect') || data.redirect
        window.location.href = redirectTo
        return
      }

      if (res.status === 401) {
        setError('Invalid email or password')
      } else if (res.status === 403) {
        setError(data.error ?? 'Access denied')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = loading || !email.trim() || !password

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 flex items-center justify-center px-4 py-12 overflow-auto">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center mx-auto mb-4 shadow-md">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            Dent<span className="text-teal-600">India</span>
          </h1>
          <p className="text-stone-500 text-sm mt-1">Clinic Management Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-1">Sign in to your account</h2>
          <p className="text-sm text-stone-500 mb-6">
            Welcome back — enter your credentials to continue.
          </p>

          {/* Error banner */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
            >
              <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold leading-none">!</span>
              </span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                required
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400
                           focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition
                           disabled:bg-stone-50 disabled:text-stone-400"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                  className="w-full px-4 py-2.5 pr-11 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400
                             focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition
                             disabled:bg-stone-50 disabled:text-stone-400"
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isDisabled}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all
                ${
                  isDisabled
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
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-stone-500 mt-6">
          Want to list your clinic?{' '}
          <Link
            href="/register"
            className="text-teal-600 font-medium hover:underline focus:outline-none focus-visible:underline"
          >
            Register your clinic →
          </Link>
        </p>
      </div>
    </div>
  )
}
