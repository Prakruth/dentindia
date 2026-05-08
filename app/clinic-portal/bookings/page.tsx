'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Calendar,
  Clock3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  User,
  Phone,
} from 'lucide-react';
import type { Booking } from '@/lib/types';

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface ActionState {
  id: string;
  action: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const FILTER_TABS: FilterStatus[] = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function ClinicPortalBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [actionState, setActionState] = useState<ActionState | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/clinic-portal/bookings');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch bookings');
      setBookings(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = async (
    id: string,
    status: 'confirmed' | 'completed' | 'cancelled',
    label: string
  ) => {
    setActionState({ id, action: label });
    setActionError(null);
    try {
      const res = await fetch(`/api/clinic-portal/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Failed to ${label.toLowerCase()} booking`);
      // Update local state instead of refetching
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: json.data.status } : b))
      );
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Action failed. Please try again.'
      );
    } finally {
      setActionState(null);
    }
  };

  const filteredBookings =
    filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const countFor = (status: FilterStatus) =>
    status === 'all' ? bookings.length : bookings.filter((b) => b.status === status).length;

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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-1">Bookings</h1>
        <p className="text-stone-500 text-sm">Manage appointments for your clinic</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-400 ${
              filter === tab
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-teal-300 hover:text-teal-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span
              className={`ml-1.5 text-xs ${
                filter === tab ? 'text-teal-100' : 'text-stone-400'
              }`}
            >
              ({countFor(tab)})
            </span>
          </button>
        ))}
      </div>

      {/* Action error */}
      {actionError && (
        <div className="mb-4 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
          <p className="text-red-800 text-sm">{actionError}</p>
          <button
            onClick={() => setActionError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
            aria-label="Dismiss error"
          >
            <XCircle size={16} />
          </button>
        </div>
      )}

      {/* Fetch error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchBookings}
            className="ml-auto text-sm font-medium text-red-700 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader size={32} className="animate-spin text-teal-600 mx-auto mb-3" />
            <p className="text-stone-500 text-sm">Loading bookings...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredBookings.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
          <Calendar size={44} className="mx-auto mb-4 text-stone-300" />
          <p className="text-stone-600 font-medium">
            {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
          </p>
          <p className="text-stone-400 text-sm mt-1">
            {filter !== 'all' && 'Try switching to a different filter'}
          </p>
        </div>
      )}

      {/* Booking cards */}
      {!loading && filteredBookings.length > 0 && (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isPending = booking.status === 'pending';
            const isConfirmed = booking.status === 'confirmed';
            const isActioning = actionState?.id === booking.id;

            return (
              <div
                key={booking.id}
                className="bg-white border border-stone-200 rounded-xl p-5 hover:shadow-sm transition"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-stone-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-stone-900">{booking.patient_name}</p>
                      <div className="flex items-center gap-1 text-stone-500 text-xs mt-0.5">
                        <Phone size={11} />
                        <span>{booking.patient_phone}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      STATUS_COLORS[booking.status ?? 'pending'] ?? STATUS_COLORS.pending
                    }`}
                  >
                    {booking.status ?? 'pending'}
                  </span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">
                      Service
                    </p>
                    <p className="text-stone-800 text-sm font-medium">{booking.service_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">
                      Date
                    </p>
                    <div className="flex items-center gap-1.5 text-stone-700 text-sm">
                      <Calendar size={13} className="text-stone-400" />
                      {formatDate(booking.preferred_date)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">
                      Time
                    </p>
                    <div className="flex items-center gap-1.5 text-stone-700 text-sm">
                      <Clock3 size={13} className="text-stone-400" />
                      {booking.preferred_time}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="mb-4 p-3 bg-stone-50 rounded-lg">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">
                      Notes
                    </p>
                    <p className="text-stone-700 text-sm">{booking.notes}</p>
                  </div>
                )}

                {/* Action buttons */}
                {(isPending || isConfirmed) && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-stone-100">
                    {isPending && (
                      <button
                        onClick={() =>
                          updateBookingStatus(booking.id!, 'confirmed', 'Confirm')
                        }
                        disabled={isActioning}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {isActioning && actionState?.action === 'Confirm' ? (
                          <Loader size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        Confirm
                      </button>
                    )}
                    {isConfirmed && (
                      <>
                        <button
                          onClick={() =>
                            updateBookingStatus(booking.id!, 'completed', 'Complete')
                          }
                          disabled={isActioning}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                          {isActioning && actionState?.action === 'Complete' ? (
                            <Loader size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle size={14} />
                          )}
                          Complete
                        </button>
                        <button
                          onClick={() =>
                            updateBookingStatus(booking.id!, 'cancelled', 'Cancel')
                          }
                          disabled={isActioning}
                          className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                          {isActioning && actionState?.action === 'Cancel' ? (
                            <Loader size={14} className="animate-spin" />
                          ) : (
                            <XCircle size={14} />
                          )}
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Timestamp */}
                {booking.created_at && (
                  <p className="text-xs text-stone-400 mt-3">
                    Booked{' '}
                    {new Date(booking.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
