"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, MessageCircle, CalendarCheck } from "lucide-react";
import {
  trackClinicViewed,
  trackPhoneClick,
  trackCallInitiated,
  trackLeadGenerated,
  trackBookingInitiated,
  trackWhatsAppClick,
  trackWhatsAppInitiated,
} from "@/lib/analytics";

interface ClinicPageClientProps {
  clinicId: string;
  clinicName: string;
  city: string;
  phone: string;
  email: string;
  whatsappLink: string;
  doctor: string;
  hasServices: boolean;
}

export default function ClinicPageClient({
  clinicId,
  clinicName,
  city,
  phone,
  email,
  whatsappLink,
  doctor,
  hasServices,
}: ClinicPageClientProps) {
  useEffect(() => {
    trackClinicViewed(clinicId, clinicName, city, document.referrer);
  }, [clinicId, clinicName, city]);

  const handlePhoneClick = () => {
    trackPhoneClick(clinicId, clinicName);
    trackCallInitiated(clinicId, window.location.pathname);
    trackLeadGenerated(clinicId, "phone_click");
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick(clinicId, clinicName);
    trackWhatsAppInitiated(clinicId, window.location.pathname);
    trackLeadGenerated(clinicId, "whatsapp_click");
  };

  const handleEmailClick = () => {
    trackLeadGenerated(clinicId, "email_click");
  };

  const handleBookOnlineClick = () => {
    trackBookingInitiated(clinicId, "from_clinic_profile");
    trackLeadGenerated(clinicId, "book_online_click");
  };

  return (
    <section className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-2xl p-6 sm:p-8 text-white">
      <h2 className="font-display text-xl font-bold mb-1">Book an Appointment</h2>
      <p className="text-teal-100 text-sm mb-6">
        Call, WhatsApp, or book online with {doctor}.
      </p>

      {hasServices && (
        <Link
          href={`/booking?clinic=${clinicId}`}
          onClick={handleBookOnlineClick}
          className="flex items-center justify-center gap-2 w-full bg-white text-teal-700 font-semibold px-5 py-3.5 rounded-full hover:bg-teal-50 transition text-sm mb-4"
        >
          <CalendarCheck size={17} />
          Book Online
        </Link>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={`tel:${phone}`}
          onClick={handlePhoneClick}
          className="flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-5 py-3 rounded-full hover:bg-white/25 transition text-sm flex-1"
        >
          <Phone size={16} />
          {phone}
        </a>
        <a
          href={whatsappLink}
          onClick={handleWhatsAppClick}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-5 py-3 rounded-full hover:bg-green-600 transition text-sm flex-1"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
        <a
          href={`mailto:${email}`}
          onClick={handleEmailClick}
          className="flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-medium px-5 py-3 rounded-full hover:bg-white/25 transition text-sm flex-1"
        >
          <Mail size={16} />
          Email
        </a>
      </div>
    </section>
  );
}
