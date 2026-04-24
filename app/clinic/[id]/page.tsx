import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Star, Globe, ArrowLeft, MessageCircle, Award } from "lucide-react";
import { CLINICS, getClinic } from "@/lib/data";
import ServiceCard from "@/components/ServiceCard";

interface PageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return CLINICS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const clinic = getClinic(params.id);
  if (!clinic) return {};
  return {
    title: `${clinic.name} — ${clinic.doctor} | DentIndia`,
    description: clinic.about,
  };
}

export default function ClinicPage({ params }: PageProps) {
  const clinic = getClinic(params.id);
  if (!clinic) notFound();

  const whatsappNumber = clinic.phone.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20${encodeURIComponent(clinic.doctor)}%2C%20I%20found%20your%20clinic%20on%20DentIndia%20and%20would%20like%20to%20book%20an%20appointment.`;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 text-white px-4 pt-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-teal-100 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to all clinics
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-4xl flex-shrink-0">
              {clinic.image}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-display text-2xl sm:text-3xl font-bold">{clinic.name}</h1>
                <span className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1 text-xs font-medium">
                  <Star size={11} className="fill-amber-300 text-amber-300" />
                  {clinic.rating} · {clinic.reviewCount} reviews
                </span>
              </div>
              <p className="text-teal-100 font-medium">{clinic.doctor}</p>
              <p className="text-teal-200 text-sm">{clinic.qualification}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {clinic.specializations.map((s) => (
                  <span key={s} className="text-xs bg-white/15 border border-white/20 text-white px-3 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience badge */}
            <div className="sm:text-right hidden sm:block">
              <div className="inline-flex flex-col items-center bg-white/15 border border-white/20 rounded-2xl px-5 py-3">
                <span className="font-display text-3xl font-bold">{clinic.experience}</span>
                <span className="text-teal-100 text-xs">Years Exp.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 pb-20">
        {/* Quick info card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-teal-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-0.5">Address</p>
              <p className="text-sm text-stone-700 leading-snug">{clinic.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-teal-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-0.5">Timings</p>
              <p className="text-sm text-stone-700">{clinic.timings}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe size={16} className="text-teal-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-0.5">Languages</p>
              <p className="text-sm text-stone-700">{clinic.languages.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* About */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-bold text-stone-900 mb-3 flex items-center gap-2">
            <Award size={18} className="text-teal-500" />
            About {clinic.doctor}
          </h2>
          <p className="text-stone-600 leading-relaxed text-sm sm:text-base">{clinic.about}</p>
        </section>

        {/* Services */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-bold text-stone-900 mb-1">Services & Pricing</h2>
          <p className="text-stone-500 text-sm mb-6">All prices in INR · Subject to clinical assessment</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clinic.services.map((service, i) => (
              <ServiceCard key={service.name} service={service} index={i} />
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-2xl p-6 sm:p-8 text-white">
          <h2 className="font-display text-xl font-bold mb-1">Book an Appointment</h2>
          <p className="text-teal-100 text-sm mb-6">
            Call or WhatsApp {clinic.doctor} directly to schedule your visit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${clinic.phone}`}
              className="flex items-center justify-center gap-2 bg-white text-teal-700 font-semibold px-5 py-3 rounded-full hover:bg-teal-50 transition text-sm"
            >
              <Phone size={16} />
              {clinic.phone}
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-5 py-3 rounded-full hover:bg-green-600 transition text-sm"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <a
              href={`mailto:${clinic.email}`}
              className="flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-medium px-5 py-3 rounded-full hover:bg-white/25 transition text-sm"
            >
              <Mail size={16} />
              Email
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
