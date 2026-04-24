"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Calendar, Clock, User, MessageSquare } from "lucide-react";
import { getClinic, getAllServices } from "@/lib/data";
import { useSearchParams } from "next/navigation";

function BookingForm() {
  const searchParams = useSearchParams();
  const clinicId = searchParams.get("clinic") || "";
  const serviceName = searchParams.get("service") || "";
  const price = searchParams.get("price") || "0";

  const clinic = getClinic(clinicId);
  const service = clinic?.services.find((s) => s.name === serviceName);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
    agreeToTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!clinic || !service) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-stone-500 text-lg mb-4">Booking information not found</p>
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const booking = {
        id: `BOOK-${Date.now()}`,
        clinic: clinic.name,
        service: service.name,
        price: service.priceFrom,
        ...formData,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      bookings.push(booking);
      localStorage.setItem("bookings", JSON.stringify(bookings));

      setLoading(false);
      setSubmitted(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = `/booking-confirmation?id=${booking.id}`;
      }, 2000);
    }, 1500);
  };

  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-stone-900 mb-2">Booking Confirmed!</h1>
          <p className="text-stone-600 mb-1">Your appointment request has been submitted.</p>
          <p className="text-stone-500 text-sm">
            {clinic.doctor} will contact you at {formData.phone} to confirm.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 text-sm mb-3 transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </Link>
          <h1 className="font-display text-2xl font-bold text-stone-900">Book Appointment</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Service Summary Card */}
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{clinic.image}</div>
            <div className="flex-1">
              <h2 className="font-semibold text-stone-900 mb-1">{clinic.name}</h2>
              <p className="text-sm text-stone-600 mb-3">{clinic.doctor}</p>

              <div className="space-y-2 bg-stone-50 p-3 rounded-lg">
                <div>
                  <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">Service</p>
                  <p className="text-sm font-semibold text-stone-900">{service.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200">
                  <div>
                    <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">Price</p>
                    <p className="text-lg font-bold text-blue-600">₹{service.priceFrom.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">Duration</p>
                    <p className="text-sm font-semibold text-stone-700">{service.duration}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-stone-200">
          <h3 className="font-display text-lg font-bold text-stone-900 mb-6">Your Details</h3>

          <div className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  <User size={14} className="inline mr-2" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                <Mail size={14} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                <Phone size={14} className="inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  <Calendar size={14} className="inline mr-2" />
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={minDate}
                  max={maxDate}
                  required
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  <Clock size={14} className="inline mr-2" />
                  Preferred Time
                </label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
                >
                  <option value="">Select time slot</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                <MessageSquare size={14} className="inline mr-2" />
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any specific concerns or medical history we should know?"
                rows={3}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                className="mt-1 w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-xs text-stone-600">
                I agree to the{" "}
                <a href="#" className="text-blue-600 font-medium hover:underline">
                  terms & conditions
                </a>{" "}
                and confirm that the information provided is accurate.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.agreeToTerms}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                loading || !formData.agreeToTerms
                  ? "bg-stone-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Confirm Booking"
              )}
            </button>
          </div>
        </form>

        {/* Clinic Info Footer */}
        <div className="mt-8 p-4 bg-stone-100 rounded-lg text-center text-sm text-stone-600">
          <p className="mb-2">Questions? Contact the clinic directly:</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`tel:${clinic.phone}`}
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <Phone size={14} />
              {clinic.phone}
            </a>
            <span>•</span>
            <a
              href={`mailto:${clinic.email}`}
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <Mail size={14} />
              {clinic.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>}>
      <BookingForm />
    </Suspense>
  );
}
