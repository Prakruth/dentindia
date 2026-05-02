"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Building2, LayoutDashboard, LogOut, Menu, X, Calendar } from "lucide-react";
import { useState } from "react";
import { clearAdminAuth } from "@/lib/adminData";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearAdminAuth();
    router.push('/admin/login');
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Clinics', icon: Building2, href: '/admin/clinics' },
    { label: 'Bookings', icon: Calendar, href: '/admin/bookings' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-50"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-stone-200 p-6 z-30 transition-transform md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
            <Building2 size={16} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold text-stone-900">
            Dent<span className="text-teal-600">Admin</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2 mb-12">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
