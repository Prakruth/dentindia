import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, isSuperAdmin } from '@/lib/auth-helpers'
import { createAdminClient } from '@/lib/supabase/admin'

// Mark this route as dynamic (not statically generated)
export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
  try {
    // Only super_admin can view all bookings
    const { user, clinicUser, error: authError } = await getAuthenticatedUser()

    if (authError === 'Not authenticated' || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (authError) {
      console.error('[admin/bookings GET] auth error', authError)
      return NextResponse.json({ error: 'Failed to verify permissions' }, { status: 500 })
    }

    if (!isSuperAdmin(clinicUser)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminClient = createAdminClient()

    const { data: bookings, error } = await adminClient
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[admin/bookings GET] query error', error)
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    return NextResponse.json({ data: bookings ?? [] }, { status: 200 })
  } catch (err) {
    console.error('[admin/bookings GET] unexpected error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
