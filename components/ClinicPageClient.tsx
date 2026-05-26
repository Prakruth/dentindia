"use client";

import { useEffect } from "react";
import { Phone, Mail, MessageCircle } from "lucide-react";
import {
  trackClinicViewed,
  trackPhoneClick,
  trackCallInitiated,
  trackLeadGenerated,
} from "@/lib/analytics";

interface ClinicPageClientProps {
  clinicId: string;
  clinicName: string;
  city: string;
  phone: string;
  email: string;
  whatsappLink: string;
  doctor: string;
}

export default function ClinicPageClient({
  clinicId,
  clinicName,
  city,
  phone,
  email,
  whatsappLink,
  doctor,
}: ClinicPageClientProps) {
  // Track clinic view on mount
  useEffect(() => {
    trackClinicViewed(clinicId, clinicName, city, document.referrer);
  }, [clinicId, clinicName, city]);

  const handlePhoneClick = () => {
    trackPhoneClick(clinicId, clinicName);
    trackCallInitiated(clinicId, window.location.pathname);
    trackLeadGenerated(clinicId, "phone_click");
  };

  const handleWhatsAppClick = () => {
    trackLeadGenerated(clinicId, "whatsapp_click");
  };

  const handleEmailClick = () => {
    trackLeadGenerated(clinicId, "email_click");
  };

  return (
    <section className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-2xl p-6 sm:p-8 text-white">
      <h2 className="font-display text-xl font-bold mb-1">Book an Appointment</h2>
      <p className="text-teal-100 text-sm mb-6">
        Call or WhatsApp {doctor} directly to schedule your visit.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={`tel:${phone}`}
          onClick={handlePhoneClick}
          className="flex items-center justify-center gap-2 bg-white text-teal-700 font-semibold px-5 py-3 rounded-full hover:bg-teal-50 transition text-sm"
        >
          <Phone size={16} />
          {phone}
        </a>
        <a
          href={whatsappLink}
          onClick={handleWhatsAppClick}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-5 py-3 rounded-full hover:bg-green-600 transition text-sm"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
        <a
          href={`mailto:${email}`}
          onClick={handleEmailClick}
          className="flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-medium px-5 py-3 rounded-full hover:bg-white/25 transition text-sm"
        >
          <Mail size={16} />
          Email
        </a>
      </div>
    </section>
  );
}
