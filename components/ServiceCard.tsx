import { Clock, IndianRupee } from "lucide-react";
import type { Service } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const delay = `animate-fade-up-delay-${Math.min((index % 4) + 1, 4)}`;
  return (
    <Card
      className={`hover:border-teal-300 hover:shadow-md hover:shadow-teal-50 transition-all duration-200 ring-0 border border-stone-200 ${delay}`}
    >
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-stone-900">{service.name}</h3>
          <Badge
            variant="outline"
            className="flex-shrink-0 flex items-center gap-0.5 border-stone-200 text-stone-500 text-xs"
          >
            <Clock size={10} />
            {service.duration}
          </Badge>
        </div>
        <p className="text-stone-500 text-sm leading-relaxed mb-4">{service.description}</p>
        <div className="flex items-center justify-end text-sm">
          <span className="flex items-center gap-0.5 font-semibold text-teal-700">
            <IndianRupee size={13} />
            {service.price_from.toLocaleString("en-IN")}
            <span className="text-stone-400 font-normal text-xs ml-0.5">onwards</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
