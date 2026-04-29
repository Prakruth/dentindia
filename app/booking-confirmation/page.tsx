"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { CheckCircle, Calendar, MapPin, Phone, Mail, Download } from "lucide-react";

interface Booking {
  id: string;
  clinic: string;
  service: string;
  price: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  selectedVariant?: string;
  createdAt: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id") || "";
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const found = bookings.find((b: Booking) => b.id === bookingId);
    setBooking(found || null);
    setLoading(false);
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-stone-500 text-lg mb-4">Booking not found</p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
          >
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Simple PDF generation (would use a library in production)
    const text = `
APPOINTMENT CONFIRMATION
========================

Booking ID: ${booking.id}
Date: ${new Date(booking.createdAt).toLocaleDateString()}

PATIENT DETAILS
Name: ${booking.firstName} ${booking.lastName}
Email: ${booking.email}
Phone: ${booking.phone}

APPOINTMENT DETAILS
Service: ${booking.service}${booking.selectedVariant ? ` (${booking.selectedVariant})` : ""}
Price: ₹${booking.price.toLocaleString()}
Date: ${booking.preferredDate}
Time: ${booking.preferredTime}

CLINIC
${booking.clinic}

Notes: ${booking.notes || "None"}
    `;

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", `booking-${booking.id}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Banner */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Booking Confirmed!</h1>
          <p className="text-stone-600">Your appointment request has been successfully submitted.</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-2xl border-2 border-green-200 p-8 mb-6 shadow-lg">
          <div className="text-center mb-8">
            <p className="text-stone-600 text-sm mb-1">BOOKING REFERENCE</p>
            <p className="font-display text-2xl font-bold text-stone-900 font-mono">{booking.id}</p>
          </div>

          {/* Patient Info */}
          <div className="mb-8 pb-8 border-b border-stone-200">
            <h2 className="font-semibold text-stone-900 mb-4">Patient Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-stone-50 p-3 rounded-lg">
                <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-1">Name</p>
                <p className="text-sm font-semibold text-stone-900">{booking.firstName} {booking.lastName}</p>
              </div>
              <div className="bg-stone-50 p-3 rounded-lg">
                <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm font-semibold text-stone-900 break-all">{booking.email}</p>
              </div>
              <div className="bg-stone-50 p-3 rounded-lg">
                <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-1">Phone</p>
                <p className="text-sm font-semibold text-stone-900">{booking.phone}</p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="mb-8 pb-8 border-b border-stone-200">
            <h2 className="font-semibold text-stone-900 mb-4">Appointment Details</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">📋</span>
                </div>
                <div>
                  <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">Service</p>
                  <p className="text-sm font-semibold text-stone-900">
                    {booking.service}
                    {booking.selectedVariant && (
                      <span className="block text-xs text-stone-600 font-normal mt-1">
                        Option: {booking.selectedVariant}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <Calendar size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">Date & Time</p>
                  <p className="text-sm font-semibold text-stone-900">
                    {new Date(booking.preferredDate).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at {booking.preferredTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                  <span className="text-green-600 font-semibold text-lg">₹</span>
                </div>
                <div>
                  <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">Service Fee</p>
                  <p className="text-sm font-semibold text-stone-900">₹{booking.price.toLocaleString()}</p>
                </div>
              </div>

              {booking.notes && (
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                    <span className="text-amber-600">📝</span>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">Notes</p>
                    <p className="text-sm text-stone-700">{booking.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Clinic Info */}
          <div className="mb-8 pb-8 border-b border-stone-200">
            <h2 className="font-semibold text-stone-900 mb-4">Clinic Information</h2>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-stone-900 mb-3">{booking.clinic}</p>
              <div className="space-y-2 text-sm">
                <p className="text-stone-600">
                  🕐 <strong>Timings:</strong> Mon–Sat: 10 AM – 7 PM
                </p>
                <p className="text-stone-600">
                  🏥 <strong>Status:</strong> <span className="text-green-600 font-semibold">Confirmed</span>
                </p>
                <p className="text-stone-600 text-xs mt-3 italic">
                  A confirmation call will be made to your phone number within the next 2 hours.
                </p>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div>
            <h2 className="font-semibold text-stone-900 mb-4">What's Next?</h2>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">
                  1
                </span>
                <span className="text-sm text-stone-700">
                  <strong>Clinic will call you</strong> within 2 hours to confirm the appointment
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">
                  2
                </span>
                <span className="text-sm text-stone-700">
                  <strong>Review the details</strong> provided in the confirmation call
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">
                  3
                </span>
                <span className="text-sm text-stone-700">
                  <strong>Arrive 10 minutes early</strong> on the appointment date
                </span>
              </li>
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-stone-200 rounded-lg font-semibold text-stone-700 hover:bg-stone-50 transition"
          >
            <Download size={16} />
            Print Confirmation
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-stone-200 rounded-lg font-semibold text-stone-700 hover:bg-stone-50 transition"
          >
            <Download size={16} />
            Download
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Book Another
          </Link>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-sm">
          <p className="text-stone-700">
            Have questions? Check your email or call{" "}
            <a href="tel:+919876543210" className="text-blue-600 font-semibold hover:underline">
              the clinic directly
            </a>
            .
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
