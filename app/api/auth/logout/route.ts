/**
 * POST /api/auth/logout
 *
 * Auth:    optional (safe to call even when not logged in)
 * Request: empty body
 *
 * Response 200: { success: true }
 *
 * Clears the Supabase session cookie via supabase.auth.signOut().
 * Always returns 200 — calling logout when already logged out is not an error.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()

  // signOut clears the session cookie through the server client's cookie integration.
  // We intentionally ignore any error here — a missing/expired session is not a failure.
  await supabase.auth.signOut()

  return NextResponse.json({ success: true }, { status: 200 })
}
