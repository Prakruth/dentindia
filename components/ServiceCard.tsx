import { Clock, IndianRupee } from "lucide-react";
import type { Service } from "@/lib/data";

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const delay = `animate-fade-up-delay-${Math.min((index % 4) + 1, 4)}`;
  return (
    <div className={`bg-white rounded-2xl border border-stone-200 p-5 hover:border-teal-300 hover:shadow-md hover:shadow-teal-50 transition-all duration-200 ${delay}`}>
      <h3 className="font-semibold text-stone-900 mb-2">{service.name}</h3>
      <p className="text-stone-500 text-sm leading-relaxed mb-4">{service.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 text-stone-400">
          <Clock size={13} />
          {service.duration}
        </span>
        <span className="flex items-center gap-0.5 font-semibold text-teal-700">
          <IndianRupee size={13} />
          {service.priceFrom.toLocaleString("en-IN")}
          <span className="text-stone-400 font-normal text-xs ml-0.5">onwards</span>
        </span>
      </div>
    </div>
  );
}
