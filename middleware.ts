import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Always start with a pass-through response so cookies can be written onto it.
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // First write onto the request so any downstream middleware sees them.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Recreate the response so the updated request object is used as base.
          supabaseResponse = NextResponse.next({ request })
          // Then write the cookies onto the outgoing response.
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: never call supabase.auth.getSession() here.
  // getUser() revalidates the JWT with the Supabase Auth server on every call.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ── /admin/* protection (excluding /admin/login) ────────────────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const { data: clinicUser } = await supabase
      .from('clinic_users')
      .select('role, status')
      .eq('user_id', user.id)
      .single()

    if (
      !clinicUser ||
      clinicUser.role !== 'super_admin' ||
      clinicUser.status !== 'approved'
    ) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return supabaseResponse
  }

  // ── /clinic-portal/* protection ─────────────────────────────────────────────
  if (pathname.startsWith('/clinic-portal')) {
    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.searchParams.set('redirect', '/clinic-portal')
      return NextResponse.redirect(loginUrl)
    }

    const { data: clinicUser } = await supabase
      .from('clinic_users')
      .select('role, status')
      .eq('user_id', user.id)
      .single()

    const allowedRoles = ['clinic_admin', 'clinic_staff']

    if (
      !clinicUser ||
      !allowedRoles.includes(clinicUser.role) ||
      clinicUser.status !== 'approved'
    ) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.searchParams.set('redirect', '/clinic-portal')
      return NextResponse.redirect(loginUrl)
    }

    return supabaseResponse
  }

  // ── All other routes: pass through after session refresh ────────────────────
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
