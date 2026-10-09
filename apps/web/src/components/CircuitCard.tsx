import Link from 'next/link';
import { Compass, Calendar, ArrowRight } from 'lucide-react';
import SafePlaceImage from './SafePlaceImage';

interface CircuitCardProps {
  circuit: {
    id: string;
    title: string;
    slug: string;
    subtitle: string;
    description: string;
    coverImageUrl: string;
    recommendedDays: number;
    estimatedCostInr: number;
    destinations: string[];
    highlights: string[];
  };
}

export default function CircuitCard({ circuit }: CircuitCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
        <SafePlaceImage
          src={circuit.coverImageUrl}
          alt={circuit.title}
          fallbackType="circuit"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-stone-900 flex items-center gap-1 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-bharat-saffron" />
          <span>{circuit.recommendedDays} Days Circuit</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-300 block mb-0.5">
            {circuit.subtitle}
          </span>
          <h3 className="text-lg font-bold leading-tight group-hover:text-amber-200 transition-colors">
            {circuit.title}
          </h3>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
          {circuit.description}
        </p>

        {/* Highlights pills */}
        <div className="flex flex-wrap gap-1.5">
          {circuit.highlights?.slice(0, 3).map((hl, i) => (
            <span key={i} className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-medium rounded-md">
              ✓ {hl}
            </span>
          ))}
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Est. Cost</span>
            <span className="text-base font-black text-bharat-charcoal">
              ₹{circuit.estimatedCostInr?.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-stone-500"> /person</span>
            </span>
          </div>

          <Link
            href={`/circuits/${circuit.slug || circuit.id}`}
            className="px-3.5 py-2 text-xs font-bold text-bharat-saffron hover:text-white bg-orange-50 hover:bg-bharat-saffron rounded-lg transition-all flex items-center gap-1"
          >
            <span>Explore Circuit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
