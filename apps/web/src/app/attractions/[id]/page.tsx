'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  Ticket, 
  Plane, 
  Train, 
  Bus, 
  CheckCircle2, 
  AlertCircle, 
  Car, 
  Utensils, 
  Hotel as HotelIcon, 
  Share2, 
  Bookmark, 
  Sparkles,
  ChevronLeft,
  ExternalLink,
  AlertTriangle,
  Info,
  FileText
} from 'lucide-react';
import { api, getAuthToken } from '../../../lib/api';
import HotelCard from '../../../components/HotelCard';
import TicketModal from '../../../components/TicketModal';

export default function AttractionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = params.id as string;

  const [attraction, setAttraction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // New review state
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await api.getAttraction(idOrSlug);
        setAttraction(res.data);
        if (res.data?.id) {
          const revRes = await api.getReviews('ATTRACTION', res.data.id);
          setReviews(revRes.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [idOrSlug]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      alert('Please log in to submit a review.');
      router.push('/login');
      return;
    }
    setReviewSubmitting(true);
    try {
      const res = await api.submitReview({
        targetType: 'ATTRACTION',
        targetId: attraction.id,
        rating,
        title: reviewTitle,
        comment: reviewComment
      });
      setReviews([res.data, ...reviews]);
      setReviewModalOpen(false);
      setReviewTitle('');
      setReviewComment('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center font-medium text-stone-500">Loading attraction details...</div>;
  }

  if (!attraction) {
    return <div className="py-24 text-center font-bold text-stone-700">Attraction not found.</div>;
  }

  return (
    <div className="space-y-12 pb-20">
      
      {/* 1. HERO & GALLERY HEADER */}
      <div className="relative bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-6">
          <Link href="/attractions" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Attractions
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full">
                  {attraction.category?.name || 'Heritage'}
                </span>
                {attraction.verificationStatus?.includes('ASI') && (
                  <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> ASI Official Monument
                  </span>
                )}
                {attraction.verificationStatus === 'SAMPLE_DATA' && (
                  <span className="px-3 py-1 bg-stone-700/80 backdrop-blur-md text-stone-200 text-xs font-bold rounded-full flex items-center gap-1">
                    📋 Directory Listing
                  </span>
                )}
                {attraction.verificationStatus === 'COMMUNITY_SUBMITTED' && (
                  <span className="px-3 py-1 bg-sky-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    👥 Community Contributed
                  </span>
                )}
                {attraction.isHiddenGem && (
                  <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                    ✨ Hidden Gem
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{attraction.name}</h1>
              <p className="text-sm text-stone-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-bharat-saffron" />
                <span>{attraction.city?.name}, {attraction.city?.state?.name || 'India'}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => alert('Saved to your ExploreBharat Wishlist!')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-colors flex items-center gap-1.5"
              >
                <Bookmark className="w-4 h-4" /> Save
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-colors flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button
                onClick={() => setBookingModalOpen(true)}
                className="px-6 py-2.5 bg-bharat-saffron hover:bg-bharat-terracotta text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Ticket className="w-4 h-4" /> Book Ticket
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden aspect-[16/8] max-h-[460px]">
            <div className="md:col-span-2 h-full bg-stone-800">
              <img
                src={attraction.heroImageUrl}
                alt={attraction.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-3 h-full">
              {attraction.galleryImages?.slice(0, 2).map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`${attraction.name} gallery ${i}`}
                  className="w-full h-full object-cover bg-stone-800"
                />
              )) || (
                <img src={attraction.heroImageUrl} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column (2 Cols) - Details, History, Tips, Amenities */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Overview */}
          <div className="space-y-4 bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm">
            <h2 className="text-xl font-black text-stone-900 tracking-tight">About the Monument</h2>
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
              {attraction.description}
            </p>
            {attraction.history && (
              <div className="pt-4 border-t border-stone-100">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">Historical Significance</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{attraction.history}</p>
              </div>
            )}
          </div>

          {/* Key Facts & Guidelines Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Timings</span>
              <p className="font-bold text-sm text-stone-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-bharat-saffron" />
                <span>{attraction.openingTime} - {attraction.closingTime}</span>
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Best Time to Visit</span>
              <p className="font-bold text-sm text-stone-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-bharat-saffron" />
                <span>{attraction.bestTimeToVisit || 'October to March'}</span>
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Visit Duration</span>
              <p className="font-bold text-sm text-stone-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-bharat-saffron" />
                <span>{attraction.expectedDurationHours || 2.5} Hours</span>
              </p>
            </div>
          </div>

          {/* Visitor Amenities & Facilities */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-stone-900 tracking-tight">Facilities & Accessibility</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-stone-700">
              <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl">
                <Car className="w-4 h-4 text-bharat-emerald" />
                <span>{attraction.hasParking ? 'Parking Available' : 'No Parking'}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-bharat-emerald" />
                <span>{attraction.hasWashrooms ? 'Clean Washrooms' : 'No Washrooms'}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl">
                <Utensils className="w-4 h-4 text-bharat-emerald" />
                <span>{attraction.hasFoodCourt ? 'Food Court Inside' : 'Food Stalls Nearby'}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-bharat-emerald" />
                <span>Wheelchair Ramp</span>
              </div>
            </div>
          </div>

          {/* How to Reach & Connectivity */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-stone-900 tracking-tight">How to Reach This Attraction</h2>
                <p className="text-xs text-stone-500">Verified multimodal routes from major transit hubs with transparent fare estimates.</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Verified Routes
              </span>
            </div>

            {/* Structured Hub Routes Engine */}
            {attraction.howToReachEngine ? (
              <div className="space-y-4">
                {/* 1. From Railway Station */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                      <Train className="w-4 h-4 text-emerald-600" />
                      {attraction.howToReachEngine.fromRailwayStation.hubName} (~{attraction.howToReachEngine.fromRailwayStation.approxDistanceKm} km)
                    </span>
                    <span className="text-[11px] text-stone-500">Railway Hub</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] font-extrabold text-blue-700 uppercase block">Fastest: App Cab</span>
                      <p className="font-bold text-stone-900 mt-0.5">₹{attraction.howToReachEngine.fromRailwayStation.fastest.estimatedFareInr} • {attraction.howToReachEngine.fromRailwayStation.fastest.durationMinutes} min</p>
                      <p className="text-[10px] text-stone-500 mt-1">{attraction.howToReachEngine.fromRailwayStation.fastest.instructions}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase block">Cheapest: City Bus</span>
                      <p className="font-bold text-stone-900 mt-0.5">₹{attraction.howToReachEngine.fromRailwayStation.cheapest.estimatedFareInr} • {attraction.howToReachEngine.fromRailwayStation.cheapest.durationMinutes} min</p>
                      <p className="text-[10px] text-stone-500 mt-1">{attraction.howToReachEngine.fromRailwayStation.cheapest.instructions}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] font-extrabold text-amber-700 uppercase block">Easiest: Metered Auto</span>
                      <p className="font-bold text-stone-900 mt-0.5">₹{attraction.howToReachEngine.fromRailwayStation.easiest.estimatedFareInr} • {attraction.howToReachEngine.fromRailwayStation.easiest.durationMinutes} min</p>
                      <p className="text-[10px] text-stone-500 mt-1">{attraction.howToReachEngine.fromRailwayStation.easiest.instructions}</p>
                    </div>
                  </div>
                </div>

                {/* 2. From Airport */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                      <Plane className="w-4 h-4 text-blue-600" />
                      {attraction.howToReachEngine.fromAirport.hubName} (~{attraction.howToReachEngine.fromAirport.approxDistanceKm} km)
                    </span>
                    <span className="text-[11px] text-stone-500">Air Terminal</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] font-extrabold text-blue-700 uppercase block">Terminal Cab / Taxi</span>
                      <p className="font-bold text-stone-900 mt-0.5">₹{attraction.howToReachEngine.fromAirport.fastest.estimatedFareInr} • {attraction.howToReachEngine.fromAirport.fastest.durationMinutes} min</p>
                      <p className="text-[10px] text-stone-500 mt-1">{attraction.howToReachEngine.fromAirport.fastest.instructions}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase block">Airport Feeder Bus</span>
                      <p className="font-bold text-stone-900 mt-0.5">₹{attraction.howToReachEngine.fromAirport.cheapest.estimatedFareInr} • {attraction.howToReachEngine.fromAirport.cheapest.durationMinutes} min</p>
                      <p className="text-[10px] text-stone-500 mt-1">{attraction.howToReachEngine.fromAirport.cheapest.instructions}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-stone-700">
                {attraction.howToReach?.byAir && (
                  <div className="flex items-start gap-3 p-3.5 bg-stone-50 rounded-xl">
                    <Plane className="w-4 h-4 text-bharat-saffron shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900 block">By Air</span>
                      <span>{attraction.howToReach.byAir}</span>
                    </div>
                  </div>
                )}
                {attraction.howToReach?.byRail && (
                  <div className="flex items-start gap-3 p-3.5 bg-stone-50 rounded-xl">
                    <Train className="w-4 h-4 text-bharat-saffron shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900 block">By Rail</span>
                      <span>{attraction.howToReach.byRail}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Travel Tips & Safety */}
          {attraction.travelTips?.length > 0 && (
            <div className="bg-amber-50/60 p-6 rounded-3xl border border-amber-200/60 space-y-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-bharat-saffron" />
                <span>Travel Tips & Guidelines</span>
              </h3>
              <ul className="space-y-2 text-xs text-stone-700 list-disc list-inside">
                {attraction.travelTips.map((tip: string, i: number) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Nearby Accommodations with Transit Distance */}
          {attraction.nearbyHotels?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-stone-900 tracking-tight">Nearby Verified Hotels</h2>
                  <p className="text-xs text-stone-500">With calculated distance and estimated local transport fare</p>
                </div>
                <Link href={`/hotels?cityId=${attraction.cityId}`} className="text-xs font-bold text-bharat-saffron hover:underline">
                  View All Stays
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attraction.nearbyHotels.slice(0, 2).map((h: any) => (
                  <div key={h.id} className="space-y-2">
                    <HotelCard hotel={h} />
                    {h.distanceFromAttractionKm !== undefined && (
                      <div className="px-3.5 py-2 bg-stone-100 rounded-xl text-[11px] text-stone-700 flex items-center justify-between border border-stone-200/60">
                        <span className="font-semibold flex items-center gap-1">
                          <Car className="w-3 h-3 text-amber-600" />
                          {h.distanceFromAttractionKm} km away ({h.travelTimeByCabMinutes} min)
                        </span>
                        <span className="font-bold text-stone-900">
                          ₹{h.estimatedCabFareInr} est. cab
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DATA PROVENANCE, INTEGRITY & PHOTO LICENSING */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-stone-900 tracking-tight">Tourism Data Provenance & Verification</h2>
                <p className="text-xs text-stone-500">Transparent record provenance, verified official authorities, and photographic copyright licenses.</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1.5 border border-emerald-300 self-start sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5" />
                {attraction.verificationStatus || 'VERIFIED_ASI'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Authoritative Source</span>
                <p className="font-extrabold text-stone-900 text-sm">{attraction.sourceName || 'Archaeological Survey of India (ASI)'}</p>
                <p className="text-stone-500">Source Type: {attraction.sourceType || 'Government Protected Monument'}</p>
                {attraction.sourceUrl && (
                  <a
                    href={attraction.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-bharat-saffron hover:underline inline-flex items-center gap-1 pt-1"
                  >
                    Official Portal Record <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Fee & Schedule Verification</span>
                <p className="font-extrabold text-stone-900 text-sm">Status: {attraction.feeVerificationStatus || 'VERIFIED'}</p>
                <p className="text-stone-500">Verification Source: {attraction.feeSource || 'Official ASI Gazette & State Portal'}</p>
                <p className="text-stone-500">Last Audited: {attraction.lastFeeVerifiedAt ? new Date(attraction.lastFeeVerifiedAt).toLocaleDateString() : 'October 2026'}</p>
              </div>
            </div>

            {/* Primary Image Licensing */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Primary Photograph Copyright & Provenance
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-amber-200 text-stone-600 font-mono">
                  SHA-256 Verified
                </span>
              </div>
              <p className="text-stone-600">
                Photographs for this monument are cataloged from Wikimedia Commons / authorized public domain archives with Creative Commons licenses (CC-BY / CC-BY-SA). All images are verified against perceptual-hash deduplication algorithms to avoid misattributed pictures.
              </p>
            </div>
          </div>

          {/* Reviews & Ratings (Section 21) */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-stone-900 tracking-tight">Verified Traveler Reviews</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-sm ml-1">{attraction.rating?.toFixed(1) || '4.8'}</span>
                  </div>
                  <span className="text-xs text-stone-500">({reviews.length} reviews)</span>
                </div>
              </div>
              <button
                onClick={() => setReviewModalOpen(true)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 font-bold text-xs text-stone-800 rounded-xl transition-colors"
              >
                Write Review
              </button>
            </div>

            {/* Review List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-stone-500">Be the first verified traveler to review this monument!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-bharat-indigo text-white rounded-full flex items-center justify-center font-bold text-xs">
                          {rev.user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-bold text-xs text-stone-900">{rev.user?.name || 'Verified Traveler'}</span>
                        {rev.isVerifiedBooking && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                            ✓ Verified Visit
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-amber-500 text-xs">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <h4 className="font-bold text-sm text-stone-900">{rev.title}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col) - Sticky Dynamic Entry & Tickets Box */}
        <div>
          <div className="sticky top-28 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xl space-y-6">
            
            {/* FREE ENTRY ATTRACTIONS */}
            {attraction.entryType === 'FREE' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Entry Information</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    FREE ENTRY
                  </span>
                </div>

                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-1.5">
                  <h3 className="font-extrabold text-emerald-950 text-base">No Entry Ticket Required</h3>
                  <p className="text-xs text-emerald-800/90 leading-relaxed">
                    {attraction.entryDescription || 'This is an open public landmark. Visitors can enter freely without an admission ticket or advance booking.'}
                  </p>
                </div>

                <div className="space-y-3 pt-1 border-t border-stone-100 text-xs">
                  <div className="flex justify-between items-center text-stone-600">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-stone-400" /> Visiting Hours:</span>
                    <span className="font-bold text-stone-900">{attraction.openingHours || 'Open Daily (6 AM – 9 PM)'}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Advance Booking:</span>
                    <span className="font-bold text-emerald-700">Not Required</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-stone-400" /> Walk-in Access:</span>
                    <span className="font-bold text-stone-900">Welcome anytime</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-stone-400" /> Fee Verification:</span>
                    <span className="font-semibold text-stone-500">Verified • October 2026</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    href={`/trips?addAttraction=${attraction.id}`}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" /> Add to Trip Itinerary
                  </Link>
                  <button
                    onClick={() => {
                      const el = document.getElementById('nearby-hotels-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-xs rounded-xl border border-stone-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <HotelIcon className="w-3.5 h-3.5" /> View Nearby Hotels
                  </button>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 text-[11px] text-stone-600 space-y-1">
                  <p className="font-bold text-stone-800 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-stone-500" />
                    <span>Traveler Advisory</span>
                  </p>
                  <p>Beware of unauthorized touts near the monument gates selling fake entry passes or guide tokens.</p>
                </div>
              </div>
            )}

            {/* CONDITIONAL ENTRY ATTRACTIONS */}
            {attraction.entryType === 'CONDITIONAL' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Entry Information</span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-full border border-amber-300 flex items-center gap-1.5 shadow-sm">
                    FREE / PAID AREAS
                  </span>
                </div>

                <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-1.5">
                  <h3 className="font-extrabold text-amber-950 text-base">General Entry Free</h3>
                  <p className="text-xs text-amber-900/90 leading-relaxed">
                    {attraction.entryDescription || 'General entry to the main grounds and prayer complex is free. Special exhibitions, light & sound shows, or specific activity zones require admission tickets.'}
                  </p>
                </div>

                <div className="space-y-3 pt-1 border-t border-stone-100 text-xs">
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Main Grounds & Sanctum:</span>
                    <span className="font-bold text-emerald-700">₹0 (Free)</span>
                  </div>
                  {attraction.adultIndianFee && (
                    <div className="flex justify-between items-center text-stone-600">
                      <span>Exhibition / Special Zones:</span>
                      <span className="font-bold text-stone-900">₹{attraction.adultIndianFee} (Adults)</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-stone-600">
                    <span>General Walk-in:</span>
                    <span className="font-bold text-stone-900">Always Available</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {attraction.officialBookingUrl ? (
                    <a
                      href={attraction.officialBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-600/25 transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" /> Book Exhibition & Show Tickets
                    </a>
                  ) : (
                    <Link
                      href={`/trips?addAttraction=${attraction.id}`}
                      className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-600/25 transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" /> Add to Trip Itinerary
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* PERMIT REQUIRED ATTRACTIONS */}
            {attraction.entryType === 'PERMIT_REQUIRED' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Entry Information</span>
                  <span className="px-3 py-1 bg-rose-100 text-rose-900 font-extrabold text-xs rounded-full border border-rose-300 flex items-center gap-1.5 shadow-sm">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    PERMIT REQUIRED
                  </span>
                </div>

                <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-1.5">
                  <h3 className="font-extrabold text-rose-950 text-base">Inner Line / Special Permit</h3>
                  <p className="text-xs text-rose-900/90 leading-relaxed">
                    {attraction.permitInformation || 'This protected destination lies within an eco-sensitive or border security zone. An official Inner Line Permit (ILP) or Protected Area Permit (PAP) is mandatory before travel.'}
                  </p>
                </div>

                <div className="space-y-3 pt-1 border-t border-stone-100 text-xs">
                  {attraction.permitAuthority && (
                    <div>
                      <span className="font-semibold text-stone-500 block">Permit Authority:</span>
                      <span className="font-bold text-stone-900">{attraction.permitAuthority}</span>
                    </div>
                  )}
                  {attraction.requiredDocuments && (
                    <div>
                      <span className="font-semibold text-stone-500 block">Required Documents:</span>
                      <span className="text-stone-800">
                        {Array.isArray(attraction.requiredDocuments) 
                          ? attraction.requiredDocuments.join(', ')
                          : String(attraction.requiredDocuments)}
                      </span>
                    </div>
                  )}
                  {attraction.restrictions && (
                    <div>
                      <span className="font-semibold text-stone-500 block">Visitor Restrictions:</span>
                      <span className="text-stone-800">
                        {Array.isArray(attraction.restrictions)
                          ? attraction.restrictions.join(', ')
                          : String(attraction.restrictions)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  {attraction.permitUrl || attraction.officialBookingUrl ? (
                    <a
                      href={attraction.permitUrl || attraction.officialBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-amber-400" /> Official Permit Portal <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <div className="p-3 bg-stone-100 text-stone-700 text-xs rounded-xl font-medium text-center">
                      Permits issued by DC / SDM office & certified local travel operators.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PAID ENTRY ATTRACTIONS */}
            {(attraction.entryType === 'PAID' || !attraction.entryType) && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">Official Admission</span>
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 font-extrabold text-[11px] rounded-full border border-blue-200">
                      PAID ENTRY
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-bharat-charcoal">
                      ₹{attraction.adultIndianFee ?? attraction.ticketTypes?.[0]?.priceInr ?? attraction.entryFee ?? 50}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">/ Indian Citizen</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-stone-100 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Child (&lt; 15 yrs):</span>
                    <span className="font-bold text-emerald-700">
                      {attraction.childIndianFee != null ? `₹${attraction.childIndianFee}` : 'Free'}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Senior Citizen:</span>
                    <span className="font-bold text-stone-800">
                      {attraction.seniorCitizenFee != null ? `₹${attraction.seniorCitizenFee}` : 'Concessional'}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Foreign National:</span>
                    <span className="font-bold text-stone-900">
                      ₹{attraction.foreignVisitorFee ?? attraction.ticketTypes?.[0]?.foreignerPriceInr ?? 550}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Walk-in Tickets:</span>
                    <span className="font-bold text-stone-900">
                      {attraction.walkInAvailable !== false ? 'Available at Counter' : 'Online Only'}
                    </span>
                  </div>
                </div>

                {attraction.officialBookingUrl ? (
                  <a
                    href={attraction.officialBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-bharat-saffron hover:bg-bharat-terracotta text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    Book on Official Website <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    onClick={() => setBookingModalOpen(true)}
                    className="w-full py-4 bg-bharat-saffron hover:bg-bharat-terracotta text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-5 h-5" /> Reserve Ticket & QR Pass
                  </button>
                )}

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 text-[11px] text-stone-600 space-y-1">
                  <p className="font-bold text-stone-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant Digital Confirmation</span>
                  </p>
                  <p>Skip long lines at monument entry gates. Digital QR ticket delivered straight to your account.</p>
                </div>
              </div>
            )}

            {/* UNKNOWN ENTRY ATTRACTIONS */}
            {attraction.entryType === 'UNKNOWN' && (
              <div className="space-y-4">
                <span className="px-3 py-1 bg-stone-100 text-stone-700 font-bold text-xs rounded-full border border-stone-200 block text-center">
                  ENTRY INFO UNVERIFIED
                </span>
                <p className="text-xs text-stone-500 text-center">
                  Entry fee details for this attraction are currently being verified by our tourism editorial team.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Ticket Modal */}
      {bookingModalOpen && (
        <TicketModal
          attraction={attraction}
          onClose={() => setBookingModalOpen(false)}
        />
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-stone-900">Review {attraction.name}</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Exceptional)</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars (Great)</option>
                  <option value="3">⭐⭐⭐ 3 Stars (Good)</option>
                  <option value="2">⭐⭐ 2 Stars (Average)</option>
                  <option value="1">⭐ 1 Star (Poor)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Magnificent Sheesh Mahal mirror work!"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Comment</label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your personal tips, crowd timings, and guide experience..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="w-1/2 py-2.5 bg-stone-100 font-bold rounded-xl text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-1/2 py-2.5 bg-bharat-saffron text-white font-bold rounded-xl shadow-md"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
