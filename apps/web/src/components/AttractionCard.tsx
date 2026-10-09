import Link from 'next/link';
import { Star, MapPin, Clock, ShieldCheck, Ticket, CheckCircle2, AlertTriangle, Info, Check } from 'lucide-react';
import SafePlaceImage from './SafePlaceImage';

interface AttractionCardProps {
  attraction: {
    id: string;
    slug: string;
    name: string;
    city?: { name: string; state?: { name: string } };
    cityName?: string;
    district?: string;
    category?: { name: string };
    categoryName?: string;
    heroImageUrl: string;
    rating: number;
    reviewsCount: number;
    expectedDurationHours: number;
    ticketTypes?: { priceInr: number }[];
    entryType?: 'FREE' | 'PAID' | 'CONDITIONAL' | 'PERMIT_REQUIRED' | 'UNKNOWN';
    entryFee?: number | null;
    adultIndianFee?: number | null;
    ticketRequired?: boolean;
    verificationStatus?: string;
    qualityScore?: number;
    isHiddenGem?: boolean;
    isFeatured?: boolean;
    images?: Array<{
      sourceType: string;
      sourceName: string;
      attribution?: string;
      license?: string;
    }>;
  };
  onBookClick?: (attraction: any) => void;
}

export default function AttractionCard({ attraction, onBookClick }: AttractionCardProps) {
  const entryType = attraction.entryType || (attraction.ticketRequired === false ? 'FREE' : 'PAID');
  const isFree = entryType === 'FREE';
  const isConditional = entryType === 'CONDITIONAL';
  const isPermit = entryType === 'PERMIT_REQUIRED';
  const isPaid = entryType === 'PAID';

  const price = attraction.adultIndianFee || attraction.entryFee || attraction.ticketTypes?.[0]?.priceInr || 0;
  const locationText = attraction.city?.name || attraction.cityName || attraction.district || 'India';
  const categoryTitle = attraction.category?.name || attraction.categoryName || 'Heritage';
  const isVerified = attraction.verificationStatus === 'VERIFIED' || attraction.verificationStatus === 'OFFICIAL';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <SafePlaceImage
          src={attraction.heroImageUrl}
          alt={attraction.name}
          fallbackType="attraction"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-white/90 backdrop-blur-md text-stone-800 shadow-sm">
            {categoryTitle}
          </span>
          {isVerified && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          )}
          {attraction.isHiddenGem && (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-500 text-white shadow-sm">
              ✨ Hidden Gem
            </span>
          )}
        </div>

        {/* Entry Status Pill on Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          {isFree && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> FREE ENTRY
            </span>
          )}
          {isConditional && (
            <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
              <Info className="w-3 h-3" /> FREE / PAID AREAS
            </span>
          )}
          {isPermit && (
            <span className="px-2.5 py-1 rounded-full bg-amber-600 text-white text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> PERMIT REQUIRED
            </span>
          )}
          {isPaid && (
            <span className="px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase">
              ENTRY ₹{price}
            </span>
          )}
        </div>

        {/* City on bottom image overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow-md">
          <MapPin className="w-3.5 h-3.5 text-amber-300" />
          <span>{locationText}</span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{attraction.rating?.toFixed(1) || '4.8'}</span>
              <span className="text-stone-400 font-normal">({attraction.reviewsCount ?? 0})</span>
            </div>
            <div className="flex items-center gap-1 text-stone-500 text-xs">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>{attraction.expectedDurationHours || 2.5}h visit</span>
            </div>
          </div>

          <Link href={`/attractions/${attraction.slug || attraction.id}`} className="block">
            <h3 className="font-bold text-base text-stone-900 group-hover:text-bharat-saffron transition-colors line-clamp-1 leading-snug">
              {attraction.name}
            </h3>
          </Link>
        </div>

        {/* Action and Pricing */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            {isFree ? (
              <div>
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                  FREE ENTRY
                </span>
                <span className="text-[10px] text-stone-500 block">No ticket required</span>
              </div>
            ) : isConditional ? (
              <div>
                <span className="text-xs font-black text-blue-700">General Entry Free</span>
                <span className="text-[10px] text-stone-500 block">Exhibits may require fee</span>
              </div>
            ) : isPermit ? (
              <div>
                <span className="text-xs font-black text-amber-700">Permit Required</span>
                <span className="text-[10px] text-stone-500 block">Check entry rules</span>
              </div>
            ) : (
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Entry from</span>
                <span className="text-base font-black text-bharat-charcoal">
                  ₹{price}
                  <span className="text-xs font-normal text-stone-500"> /person</span>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/attractions/${attraction.slug || attraction.id}`}
              className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Details
            </Link>
            {isPaid && (
              onBookClick ? (
                <button
                  onClick={() => onBookClick(attraction)}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-bharat-saffron hover:bg-bharat-terracotta rounded-lg shadow-sm shadow-orange-500/20 transition-all flex items-center gap-1"
                >
                  <Ticket className="w-3.5 h-3.5" /> Book
                </button>
              ) : (
                <Link
                  href={`/attractions/${attraction.slug || attraction.id}#book`}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-bharat-saffron hover:bg-bharat-terracotta rounded-lg shadow-sm shadow-orange-500/20 transition-all flex items-center gap-1"
                >
                  <Ticket className="w-3.5 h-3.5" /> Book
                </Link>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
