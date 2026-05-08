'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Stethoscope,
  LayoutDashboard,
  Calendar,
  Building2,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface ClinicInfo {
  name: string;
}

export default function ClinicPortalSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clinicName, setClinicName] = useState('Clinic Portal');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/clinic-portal/clinic')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(({ data }: { data: ClinicInfo }) => {
        if (data?.name) setClinicName(data.name);
      })
      .catch(() => {
        // Keep default "Clinic Portal" title on any error
      });
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '/login';
    }
  };

  // Active match: exact for /clinic-portal, prefix for sub-routes
  const isActive = (href: string) => {
    if (href === '/clinic-portal') return pathname === '/clinic-portal';
    return pathname.startsWith(href);
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/clinic-portal' },
    { label: 'Bookings', icon: Calendar, href: '/clinic-portal/bookings' },
    { label: 'My Clinic', icon: Building2, href: '/clinic-portal/clinic' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-stone-200 flex flex-col p-6 z-30 transition-transform md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / header */}
        <Link
          href="/clinic-portal"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 mb-10"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
            <Stethoscope size={16} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold text-stone-900 truncate leading-tight">
            {clinicName}
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium ${
                  active
                    ? 'bg-teal-50 text-teal-700 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <Icon
                  size={18}
                  className={active ? 'text-teal-600' : 'text-stone-400'}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <LogOut size={18} />
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
