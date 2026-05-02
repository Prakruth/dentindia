'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, MapPin, Loader, AlertCircle, CheckCircle, Clock3 } from 'lucide-react';
import type { Booking } from '@/lib/types';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

function BookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/admin/bookings');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch bookings');
        }

        const data: Booking[] = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'pending':
      default:
        return <Clock3 size={16} />;
    }
  };

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
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Bookings</h1>
        <p className="text-stone-600">Manage all appointment bookings</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {(['all', 'pending', 'confirmed', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-blue-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-2 text-sm">
                ({bookings.filter(b => b.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={20} className="text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader size={32} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-stone-600">Loading bookings...</p>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
          <Calendar size={48} className="mx-auto mb-4 text-stone-300" />
          <p className="text-stone-600">
            {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-stone-200 rounded-lg p-6 hover:shadow-md transition"
            >
              {/* Top Row - Status and ID */}
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-stone-100">
                <div>
                  <p className="text-sm text-stone-500 mb-1">Booking ID</p>
                  <p className="font-mono text-sm font-semibold text-stone-900">{booking.id}</p>
                </div>
                <span
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {getStatusIcon(booking.status)}
                  {booking.status || 'pending'}
                </span>
              </div>

              {/* Main Content - Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {/* Patient Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase mb-1">Patient</p>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-stone-400" />
                      <p className="font-medium text-stone-900">{booking.patient_name}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-stone-400" />
                      <p className="text-stone-700">{booking.patient_email}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase mb-1">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-stone-400" />
                      <p className="text-stone-700">{booking.patient_phone}</p>
                    </div>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase mb-1">Service</p>
                    <p className="font-medium text-stone-900">{booking.service_name}</p>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-stone-500 uppercase mb-1">Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-stone-400" />
                        <p className="text-stone-700">{formatDate(booking.preferred_date)}</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-stone-500 uppercase mb-1">Time</p>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-stone-400" />
                        <p className="text-stone-700">{booking.preferred_time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="pt-4 border-t border-stone-100">
                  <p className="text-xs font-semibold text-stone-500 uppercase mb-2">Notes</p>
                  <p className="text-stone-700 text-sm">{booking.notes}</p>
                </div>
              )}

              {/* Timestamp */}
              <div className="mt-4 pt-4 border-t border-stone-100">
                <p className="text-xs text-stone-500">
                  Booked on{' '}
                  {booking.created_at
                    ? new Date(booking.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <BookingsContent />
    </ProtectedRoute>
  );
}
