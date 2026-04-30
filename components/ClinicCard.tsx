import Link from "next/link";
import { MapPin, Star, Clock, ChevronRight } from "lucide-react";
import type { Clinic } from "@/lib/types";

interface ClinicCardProps {
  clinic: Clinic;
  index: number;
}

export default function ClinicCard({ clinic, index }: ClinicCardProps) {
  const delayClass = `animate-fade-up-delay-${Math.min(index + 1, 4)}`;

  return (
    <Link
      href={`/clinic/${clinic.id}`}
      className={`group block bg-white rounded-2xl border border-stone-200 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-50 transition-all duration-300 overflow-hidden ${delayClass}`}
    >
      {/* Header band */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 px-5 pt-5 pb-8 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="flex items-start justify-between relative">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
            {clinic.image}
          </div>
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1 text-white text-xs font-medium">
            <Star size={11} className="fill-amber-300 text-amber-300" />
            <span>{clinic.rating}</span>
            <span className="text-white/70">({clinic.reviewCount})</span>
          </div>
        </div>
        <h3 className="text-white font-display font-bold text-lg mt-3 leading-tight">{clinic.name}</h3>
        <p className="text-teal-100 text-sm mt-0.5">{clinic.doctor}</p>
      </div>

      {/* Body */}
      <div className="px-5 py-4 -mt-4 relative">
        <div className="bg-white rounded-xl border border-stone-100 p-3 shadow-sm mb-4">
          <p className="text-stone-500 text-xs italic leading-relaxed">"{clinic.tagline}"</p>
        </div>

        <div className="space-y-2 text-sm text-stone-600">
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-teal-500 flex-shrink-0" />
            <span>{clinic.area}, {clinic.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-teal-500 flex-shrink-0" />
            <span className="truncate">{clinic.timings}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {clinic.specializations.slice(0, 2).map((s) => (
            <span key={s} className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-100">
              {s}
            </span>
          ))}
          {clinic.specializations.length > 2 && (
            <span className="text-xs bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full">
              +{clinic.specializations.length - 2}
            </span>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-400">{clinic.experience} yrs experience</span>
          <span className="text-teal-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            View Profile <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
