import Link from 'next/link';
import { Star, MapPin, Wifi, Coffee, Sparkles, ShieldCheck } from 'lucide-react';
import SafePlaceImage from './SafePlaceImage';

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    officialName?: string;
    cityName?: string;
    district?: string;
    city?: { name: string };
    address: string;
    tier: string;
    rating: number;
    reviewsCount: number;
    startingPriceInr?: number | null;
    priceType?: string;
    priceSource?: string;
    availabilityStatus?: string;
    verificationStatus?: string;
    heroImageUrl: string;
    amenities?: string[];
    distanceFromAttractionKm?: number;
  };
  onBookClick?: (hotel: any) => void;
}

export default function HotelCard({ hotel, onBookClick }: HotelCardProps) {
  const cityName = hotel.city?.name || hotel.cityName || hotel.district || 'India';
  const tierColors: Record<string, string> = {
    LUXURY: 'bg-purple-100 text-purple-800 border-purple-200',
    HERITAGE: 'bg-amber-100 text-amber-800 border-amber-200',
    STANDARD: 'bg-blue-100 text-blue-800 border-blue-200',
    BUDGET: 'bg-green-100 text-green-800 border-green-200'
  };
  const isVerified = hotel.verificationStatus === 'VERIFIED';
  const hasPrice = hotel.startingPriceInr !== null && hotel.startingPriceInr !== undefined && hotel.startingPriceInr > 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <SafePlaceImage
          src={hotel.heroImageUrl}
          alt={hotel.name}
          fallbackType="hotel"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Tier & Verification badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
          <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full border shadow-sm ${tierColors[hotel.tier] || tierColors.HERITAGE}`}>
            {hotel.tier}
          </span>
          {isVerified && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          )}
        </div>

        {hotel.distanceFromAttractionKm !== undefined && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-md text-amber-300 text-[11px] font-bold">
            {hotel.distanceFromAttractionKm} km away
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow-md">
          <MapPin className="w-3.5 h-3.5 text-amber-300" />
          <span>{cityName}</span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs mb-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{hotel.rating?.toFixed(1) || '4.7'}</span>
            <span className="text-stone-400 font-normal">({hotel.reviewsCount || 80} reviews)</span>
          </div>

          <Link href={`/hotels/${hotel.id}`} className="block">
            <h3 className="font-bold text-base text-stone-900 group-hover:text-bharat-saffron transition-colors line-clamp-1 leading-snug">
              {hotel.name}
            </h3>
          </Link>
          <p className="text-xs text-stone-500 line-clamp-1 mt-1">{hotel.address}</p>
        </div>

        {/* Amenities Icons */}
        <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
          <span className="flex items-center gap-1"><Wifi className="w-3.5 h-3.5 text-stone-400" /> Free Wi-Fi</span>
          <span className="flex items-center gap-1"><Coffee className="w-3.5 h-3.5 text-stone-400" /> Breakfast</span>
        </div>

        {/* Price and Action */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            {hasPrice ? (
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 block">
                  {hotel.priceType ? hotel.priceType.replace('_', ' ') : 'Nightly From'}
                </span>
                <span className="text-base font-black text-bharat-charcoal">
                  ₹{hotel.startingPriceInr?.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-stone-500"> /night</span>
                </span>
                {hotel.priceSource && (
                  <span className="text-[9px] text-stone-400 block truncate max-w-[120px]">
                    Source: {hotel.priceSource}
                  </span>
                )}
              </div>
            ) : (
              <div>
                <span className="text-xs font-bold text-stone-600 block">Price unavailable</span>
                <span className="text-[10px] text-stone-400 block">Contact property</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/hotels/${hotel.id}`}
              className="px-3.5 py-2 text-xs font-bold text-white bg-bharat-indigo hover:bg-blue-900 rounded-lg shadow-sm transition-all"
            >
              Reserve
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
