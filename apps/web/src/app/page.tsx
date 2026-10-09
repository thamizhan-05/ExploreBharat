'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Compass, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Star, 
  Clock, 
  Hotel as HotelIcon,
  CheckCircle2,
  ChevronRight,
  Route
} from 'lucide-react';
import { api } from '../lib/api';
import AttractionCard from '../components/AttractionCard';
import HotelCard from '../components/HotelCard';
import CircuitCard from '../components/CircuitCard';
import TicketModal from '../components/TicketModal';
import SafePlaceImage from '../components/SafePlaceImage';
import Logo from '../components/Logo';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredAttractions, setFeaturedAttractions] = useState<any[]>([]);
  const [hiddenGems, setHiddenGems] = useState<any[]>([]);
  const [freeAttractions, setFreeAttractions] = useState<any[]>([]);
  const [popularCities, setPopularCities] = useState<any[]>([]);
  const [circuits, setCircuits] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [bookingModalAttraction, setBookingModalAttraction] = useState<any | null>(null);

  // Quick AI prompt bar
  const [aiPrompt, setAiPrompt] = useState('4 days in Rajasthan with family under ₹30,000 for forts & culture');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [catsRes, attrRes, gemsRes, freeRes, citiesRes, circRes, hotelsRes] = await Promise.all([
          api.getCategories(),
          api.getAttractions('?featured=true&limit=6'),
          api.getHiddenGems('?limit=6').catch(() => ({ data: [] })),
          api.getAttractions('?entryType=FREE&limit=6'),
          api.getCities('?popular=true'),
          api.getCircuits(),
          api.getHotels('?limit=4')
        ]);
        setCategories(catsRes.data || []);
        setFeaturedAttractions(attrRes.data || []);
        setHiddenGems(gemsRes.data || []);
        setFreeAttractions(freeRes.data || []);
        setPopularCities(citiesRes.data?.slice(0, 6) || []);
        setCircuits(circRes.data?.slice(0, 3) || []);
        setHotels(hotelsRes.data || []);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      }
    }
    loadHomeData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAiPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPrompt.trim()) {
      router.push(`/ai-planner?prompt=${encodeURIComponent(aiPrompt.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[600px] lg:min-h-[660px] flex items-center justify-center bg-[#0A1320] text-white overflow-hidden">
        {/* Background Image with Deep Navy Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2000&q=85"
            alt="Amber Fort Jaipur Rajasthan"
            className="w-full h-full object-cover object-center filter brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1320] via-[#132238]/60 to-[#0A1320]/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7 py-16">
          <div className="flex justify-center">
            <Logo variant="reverse" size="xl" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F58220] text-xs sm:text-sm font-semibold shadow-lg">
            <Sparkles className="w-4 h-4 text-[#F58220]" />
            <span>Discover India. Plan Your Journey.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
            Explore<span className="text-[#F58220]">Bharat</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 font-normal leading-relaxed">
            Explore tourist places, discover hidden gems, find nearby hotels, plan your itinerary, and book experiences across India.
          </p>

          {/* Master Search Engine Box */}
          <div className="max-w-3xl mx-auto bg-white p-2.5 sm:p-3 rounded-3xl shadow-2xl border border-slate-200 text-[#132238]">
            <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-3 flex-1 w-full px-4 py-2">
                <Search className="w-5 h-5 text-[#F58220] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where do you want to explore? (e.g. Amber Fort, Jaipur, Taj Mahal...)"
                  className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#F58220] hover:bg-[#DC6E10] text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Search India</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick stats counter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4 text-stone-300 text-xs font-semibold">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>36 States & UTs</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>200+ Verified ASI Passes</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <HotelIcon className="w-4 h-4 text-emerald-400" />
              <span>Heritage Palaces & Stays</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Trip Synthesis</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES FILTER PILLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-stone-900 tracking-tight">Explore by Experience</h2>
          <Link href="/attractions" className="text-xs font-bold text-bharat-saffron hover:underline flex items-center gap-1">
            Browse All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/attractions?category=${c.id}`}
              className="px-4 py-2.5 bg-white hover:bg-orange-50 rounded-2xl border border-stone-200/80 shadow-sm text-stone-700 hover:text-bharat-saffron font-bold text-xs shrink-0 transition-all flex items-center gap-2 group"
            >
              <Compass className="w-4 h-4 text-stone-400 group-hover:text-bharat-saffron" />
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 2.5 SMART MULTIMODAL JOURNEY PLANNER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 sm:p-8 shadow-xl border border-amber-900/40">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <Route className="w-3.5 h-3.5" />
                <span>NEW FEATURE</span>
                <span>•</span>
                <span>DOOR-TO-DOOR MULTIMODAL ROUTING</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Smart Journey Planner
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed">
                Travel from your doorstep to station, intercity train/flight, local auto transfers, hotel check-in, and attraction visits with exact times and transparent fare breakdowns.
              </p>
            </div>
            <Link
              href="/smart-journey"
              className="shrink-0 px-6 py-3.5 bg-gradient-to-r from-bharat-saffron to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 group"
            >
              <span>Plan Door-to-Door Journey</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. POPULAR TOURIST DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron">Iconic Cities</span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Popular Tourist Destinations</h2>
          </div>
          <Link href="/destinations" className="text-xs font-bold text-bharat-saffron hover:underline flex items-center gap-1">
            All 36 States <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCities.map((city) => (
            <Link
              key={city.id}
              href={`/destinations/${city.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-stone-100 shadow-sm hover:shadow-lg transition-all"
            >
              <SafePlaceImage
                src={city.imageUrl}
                alt={city.name}
                fallbackType="destination"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-bold text-base group-hover:text-amber-300 transition-colors leading-tight">{city.name}</h3>
                <p className="text-[11px] text-stone-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-bharat-saffron" />
                  <span>{city.state?.name || 'India'}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED ATTRACTIONS & MONUMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron">World Heritage & Forts</span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Top Monument Attractions</h2>
          </div>
          <Link href="/attractions" className="text-xs font-bold text-bharat-saffron hover:underline flex items-center gap-1">
            View All Attractions <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAttractions.map((attraction) => (
            <AttractionCard
              key={attraction.id}
              attraction={attraction}
              onBookClick={(a) => setBookingModalAttraction(a)}
            />
          ))}
        </div>
      </section>

      {/* 4.5 HIDDEN GEMS & LESSER-KNOWN DESTINATIONS */}
      {hiddenGems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black tracking-wider uppercase mb-2 border border-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Off the Beaten Track • Serene & Uncrowded
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Hidden Gems & Lesser-Known India
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-2xl">
                Bypass overcrowded tourist hubs. Discover quiet ancient hill citadels, tranquil stepwells, and untouched sacred viewpoints verified by cultural researchers.
              </p>
            </div>
            <Link
              href="/attractions?hiddenGems=true"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 shrink-0 self-start sm:self-auto"
            >
              All Hidden Gems <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hiddenGems.slice(0, 6).map((attraction) => (
              <AttractionCard
                key={attraction.id}
                attraction={attraction}
                onBookClick={(a) => setBookingModalAttraction(a)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. EXPLORE INDIA FOR FREE 🇮🇳 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black tracking-wider uppercase mb-2 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Zero Ticket Cost • Unlimited Memories
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              Explore India for Free 🇮🇳
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-2xl">
              Discover iconic public landmarks, waterfronts, peaceful sacred sites, and breathtaking natural viewpoints where admission is completely free for everyone.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/attractions?entryType=FREE"
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
            >
              All Free Attractions <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick regional shortcuts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          <Link
            href="/attractions?entryType=FREE"
            className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 shrink-0 border border-stone-200/80 transition-colors"
          >
            All Free Spots
          </Link>
          <Link
            href="/attractions?entryType=FREE&city=Mumbai"
            className="px-3 py-1.5 rounded-xl bg-white text-stone-600 hover:bg-emerald-50 hover:text-emerald-800 shrink-0 border border-stone-200 transition-colors"
          >
            🌊 Free in Mumbai
          </Link>
          <Link
            href="/attractions?entryType=FREE&city=Delhi"
            className="px-3 py-1.5 rounded-xl bg-white text-stone-600 hover:bg-emerald-50 hover:text-emerald-800 shrink-0 border border-stone-200 transition-colors"
          >
            🏛️ Free in Delhi
          </Link>
          <Link
            href="/attractions?entryType=FREE&city=Jaipur"
            className="px-3 py-1.5 rounded-xl bg-white text-stone-600 hover:bg-emerald-50 hover:text-emerald-800 shrink-0 border border-stone-200 transition-colors"
          >
            🏰 Free in Jaipur
          </Link>
          <Link
            href="/attractions?entryType=FREE&state=Goa"
            className="px-3 py-1.5 rounded-xl bg-white text-stone-600 hover:bg-emerald-50 hover:text-emerald-800 shrink-0 border border-stone-200 transition-colors"
          >
            🏖️ Free Beaches in Goa
          </Link>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freeAttractions.slice(0, 6).map((attraction) => (
            <AttractionCard
              key={attraction.id}
              attraction={attraction}
              onBookClick={(a) => setBookingModalAttraction(a)}
            />
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE AI TRIP PLANNER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#132238] via-[#1E3557] to-[#0A1320] text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-white/10">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-[#F58220] border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#F58220]" />
              <span>Deterministic Budget & LLM Travel Engine</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Plan Your Dream Indian Journey with AI in 10 Seconds
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed">
              Tell ExploreBharat your budget, duration, starting city, and companion preferences. The AI generates day-by-day schedules with real tickets, verified stays, and live budget totals.
            </p>

            <form onSubmit={handleAiPlanSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. 5 days in Kerala under ₹25,000 for backwaters & food"
                className="flex-1 px-4 py-3 bg-white/10 text-white rounded-2xl border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#F58220] placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#F58220] hover:bg-[#DC6E10] text-white font-bold text-sm rounded-2xl shadow-lg transition-all shrink-0 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Synthesize Itinerary
              </button>
            </form>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none hidden lg:flex items-center justify-center">
            <Logo variant="icon" size="xl" className="scale-[4] text-white" />
          </div>
        </div>
      </section>

      {/* 6. TOURISM CIRCUITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron">Pre-Defined Expeditions</span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Iconic Tourism Circuits</h2>
          </div>
          <Link href="/circuits" className="text-xs font-bold text-bharat-saffron hover:underline flex items-center gap-1">
            All Circuits <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {circuits.map((c) => (
            <CircuitCard key={c.id} circuit={c} />
          ))}
        </div>
      </section>

      {/* 7. VERIFIED HERITAGE HOTELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron">Accommodations</span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Heritage Havelis & Luxury Resorts</h2>
          </div>
          <Link href="/hotels" className="text-xs font-bold text-bharat-saffron hover:underline flex items-center gap-1">
            Browse All Hotels <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
      </section>

      {/* 8. TRUST & PROVENANCE COMMITMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white p-8 sm:p-10 rounded-3xl border border-stone-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">Trustworthy Tourism Data Commitment</h3>
                <p className="text-xs text-stone-400">Authentic India discovery powered by verified cultural provenance</p>
              </div>
            </div>
            <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded-full border border-emerald-500/30 flex items-center gap-1.5 self-start sm:self-auto">
              ✓ 100% Zero Fabricated Data
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-300">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
              <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider block">Official Provenance</span>
              <p className="font-bold text-sm text-white">Archaeological Survey of India</p>
              <p className="text-stone-400 leading-relaxed">Every national monument is mapped with official timings, ASI ticket tariffs, and verified guidelines directly from Ministry records.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
              <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider block">Transparent Free Access</span>
              <p className="font-bold text-sm text-white">Guaranteed Free Entry Labels</p>
              <p className="text-stone-400 leading-relaxed">Public ghats, natural viewpoints, and shrines are explicitly marked FREE ENTRY with anti-scam advisories to protect travelers from touts.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
              <span className="font-bold text-sky-400 uppercase text-[10px] tracking-wider block">Verified Imagery</span>
              <p className="font-bold text-sm text-white">Attribution & Integrity Check</p>
              <p className="text-stone-400 leading-relaxed">Every photograph is indexed with Wikimedia Commons CC-BY licenses and SHA-256 cryptographic hashes to eliminate misattributed place photos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Booking Modal */}
      {bookingModalAttraction && (
        <TicketModal
          attraction={bookingModalAttraction}
          onClose={() => setBookingModalAttraction(null)}
        />
      )}

    </div>
  );
}
