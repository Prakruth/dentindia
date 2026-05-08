'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import type { Booking, Clinic } from '@/lib/types';

interface ClinicWithActive extends Clinic {
  is_active?: boolean;
}

interface StatCard {
  label: string;
  value: number;
  colorClass: string;
  icon: React.ElementType;
}

export default function ClinicPortalDashboard() {
  const [clinic, setClinic] = useState<ClinicWithActive | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingClinic, setLoadingClinic] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [clinicError, setClinicError] = useState<string | null>(null);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const [toggleMessage, setToggleMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/clinic-portal/clinic')
      .then((r) => (r.ok ? r.json() : r.json().then((e) => Promise.reject(e.error))))
      .then(({ data }: { data: ClinicWithActive }) => setClinic(data))
      .catch((err: string) =>
        setClinicError(typeof err === 'string' ? err : 'Failed to load clinic details.')
      )
      .finally(() => setLoadingClinic(false));

    fetch('/api/clinic-portal/bookings')
      .then((r) => (r.ok ? r.json() : r.json().then((e) => Promise.reject(e.error))))
      .then(({ data }: { data: Booking[] }) => setBookings(data))
      .catch((err: string) =>
        setBookingsError(typeof err === 'string' ? err : 'Failed to load bookings.')
      )
      .finally(() => setLoadingBookings(false));
  }, []);

  const handleToggleActive = async () => {
    if (!clinic) return;
    setToggling(true);
    setToggleMessage(null);
    try {
      const res = await fetch('/api/clinic-portal/clinic', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !clinic.is_active }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update status');
      setClinic(json.data as ClinicWithActive);
      setToggleMessage({
        type: 'success',
        text: `Clinic is now ${json.data.is_active ? 'active' : 'inactive'}.`,
      });
    } catch (err) {
      setToggleMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update status.',
      });
    } finally {
      setToggling(false);
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  };

  const statCards: StatCard[] = [
    {
      label: 'Total Bookings',
      value: stats.total,
      colorClass: 'bg-stone-50 border-stone-200',
      icon: Calendar,
    },
    {
      label: 'Pending',
      value: stats.pending,
      colorClass: 'bg-yellow-50 border-yellow-200',
      icon: Clock3,
    },
    {
      label: 'Confirmed',
      value: stats.confirmed,
      colorClass: 'bg-blue-50 border-blue-200',
      icon: CheckCircle,
    },
    {
      label: 'Completed',
      value: stats.completed,
      colorClass: 'bg-green-50 border-green-200',
      icon: CheckCircle,
    },
  ];

  const recentBookings = bookings.slice(0, 5);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const statusBadge = (status?: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return map[status ?? 'pending'] ?? 'bg-stone-100 text-stone-700';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        {loadingClinic ? (
          <div className="flex items-center gap-3 mb-2">
            <Loader size={20} className="animate-spin text-teal-600" />
            <p className="text-stone-500">Loading clinic...</p>
          </div>
        ) : clinicError ? (
          <div className="flex items-center gap-3 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm">{clinicError}</p>
          </div>
        ) : clinic ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
            <div>
              <h1 className="font-display text-3xl font-bold text-stone-900">
                Welcome, {clinic.name}
              </h1>
              <p className="text-stone-500 text-sm mt-1">
                {clinic.doctor} &bull; {clinic.city}
              </p>
            </div>

            <div className="flex items-center gap-3 sm:ml-auto">
              {/* Status badge */}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  clinic.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {clinic.is_active ? 'Active' : 'Inactive'}
              </span>

              {/* Toggle button */}
              <button
                onClick={handleToggleActive}
                disabled={toggling}
                aria-label={clinic.is_active ? 'Set clinic inactive' : 'Set clinic active'}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                  clinic.is_active
                    ? 'border-stone-300 text-stone-700 hover:bg-stone-50'
                    : 'border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100'
                }`}
              >
                {toggling ? (
                  <Loader size={16} className="animate-spin" />
                ) : clinic.is_active ? (
                  <ToggleRight size={16} />
                ) : (
                  <ToggleLeft size={16} />
                )}
                {clinic.is_active ? 'Set Inactive' : 'Set Active'}
              </button>
            </div>
          </div>
        ) : null}

        {/* Toggle feedback */}
        {toggleMessage && (
          <div
            className={`mt-3 flex items-center gap-2 p-3 rounded-lg text-sm ${
              toggleMessage.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {toggleMessage.type === 'success' ? (
              <CheckCircle size={16} />
            ) : (
              <XCircle size={16} />
            )}
            {toggleMessage.text}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {loadingBookings
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border-2 border-stone-100 rounded-2xl p-5 animate-pulse"
              >
                <div className="h-4 bg-stone-100 rounded w-3/4 mb-3" />
                <div className="h-8 bg-stone-100 rounded w-1/2" />
              </div>
            ))
          : statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className={`${card.colorClass} border-2 rounded-2xl p-5`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">
                        {card.label}
                      </p>
                      <p className="font-display text-4xl font-bold text-stone-900">
                        {card.value}
                      </p>
                    </div>
                    <Icon size={20} className="text-stone-400 mt-1" />
                  </div>
                </div>
              );
            })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/clinic-portal/bookings"
          className="bg-white border-2 border-stone-200 rounded-2xl p-6 hover:border-teal-300 hover:shadow-lg transition group"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-stone-900 mb-1">Manage Bookings</h3>
              <p className="text-sm text-stone-500">Review, confirm and complete appointments</p>
            </div>
            <ArrowRight
              size={20}
              className="text-stone-400 group-hover:text-teal-600 transition mt-0.5"
            />
          </div>
        </Link>
        <Link
          href="/clinic-portal/clinic"
          className="bg-white border-2 border-stone-200 rounded-2xl p-6 hover:border-teal-300 hover:shadow-lg transition group"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-stone-900 mb-1">Edit Clinic Details</h3>
              <p className="text-sm text-stone-500">Update phone, timings, about and tagline</p>
            </div>
            <ArrowRight
              size={20}
              className="text-stone-400 group-hover:text-teal-600 transition mt-0.5"
            />
          </div>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-stone-900 text-lg">Recent Bookings</h2>
          <Link
            href="/clinic-portal/bookings"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            View all →
          </Link>
        </div>

        {bookingsError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm">{bookingsError}</p>
          </div>
        )}

        {!loadingBookings && recentBookings.length === 0 && !bookingsError && (
          <div className="text-center py-10 bg-white rounded-xl border border-stone-200">
            <Calendar size={40} className="mx-auto mb-3 text-stone-300" />
            <p className="text-stone-500 text-sm">No bookings yet</p>
          </div>
        )}

        {!loadingBookings && recentBookings.length > 0 && (
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    <th className="text-left px-4 py-3 font-semibold text-stone-600 text-xs uppercase tracking-wide">
                      Patient
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-stone-600 text-xs uppercase tracking-wide hidden sm:table-cell">
                      Service
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-stone-600 text-xs uppercase tracking-wide hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-stone-600 text-xs uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-stone-50 transition">
                      <td className="px-4 py-3">
                        <p className="font-medium text-stone-900">{booking.patient_name}</p>
                        <p className="text-stone-500 text-xs">{booking.patient_phone}</p>
                      </td>
                      <td className="px-4 py-3 text-stone-700 hidden sm:table-cell">
                        {booking.service_name}
                      </td>
                      <td className="px-4 py-3 text-stone-600 hidden md:table-cell">
                        {formatDate(booking.preferred_date)}
                        <span className="block text-xs text-stone-400">
                          {booking.preferred_time}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(
                            booking.status
                          )}`}
                        >
                          {booking.status ?? 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
