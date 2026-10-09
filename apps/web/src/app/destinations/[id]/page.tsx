'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  Sun, 
  Calendar, 
  Compass, 
  Hotel as HotelIcon, 
  Utensils, 
  Sparkles,
  ChevronLeft,
  ShieldAlert,
  PhoneCall,
  Clock,
  Ticket,
  ExternalLink,
  ShieldCheck,
  Award,
  Train,
  Plane,
  Car,
  Route,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../../lib/api';
import AttractionCard from '../../../components/AttractionCard';
import HotelCard from '../../../components/HotelCard';

export default function DestinationDetailPage() {
  const params = useParams();
  const cityId = params.id as string;

  const [city, setCity] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [foodData, setFoodData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [emergencyData, setEmergencyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attractionFilter, setAttractionFilter] = useState<'ALL' | 'FREE' | 'PAID' | 'HIDDEN'>('ALL');

  useEffect(() => {
    async function loadData() {
      try {
        const [cityRes, weatherRes, foodRes, eventsRes, emergencyRes] = await Promise.all([
          api.getCity(cityId),
          api.getCityWeather(cityId).catch(() => null),
          api.getCityFood(cityId).catch(() => null),
          api.getCityEvents(cityId).catch(() => ({ data: [] })),
          api.getCityEmergency(cityId).catch(() => null)
        ]);
        setCity(cityRes.data);
        if (weatherRes) setWeather(weatherRes.data);
        if (foodRes) setFoodData(foodRes.data);
        if (eventsRes) setEvents(eventsRes.data || []);
        if (emergencyRes) setEmergencyData(emergencyRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [cityId]);

  if (loading) return <div className="py-24 text-center text-stone-500 font-medium">Loading destination...</div>;
  if (!city) return <div className="py-24 text-center text-stone-700 font-bold">Destination not found.</div>;

  return (
    <div className="space-y-12 pb-20">
      
      {/* Hero */}
      <div className="relative bg-stone-900 text-white min-h-[380px] flex items-end">
        <div className="absolute inset-0 z-0">
          {city.imageUrl ? (
            <img
              src={city.imageUrl}
              alt={city.name}
              className="w-full h-full object-cover filter brightness-[0.6]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full space-y-3">
          <Link href="/destinations" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" /> All Destinations
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                {city.state?.name || 'India'}
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight">{city.name}</h1>
              <p className="text-sm text-stone-300 max-w-xl mt-1 leading-relaxed">{city.description}</p>
            </div>
            <Link
              href={`/ai-planner?destination=${encodeURIComponent(city.name)}`}
              className="px-6 py-3 bg-bharat-saffron hover:bg-bharat-terracotta text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4" /> Plan Itinerary for {city.name}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Weather & Best Time Bar */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Climate & Weather</span>
              <p className="text-base font-black text-stone-900">{weather?.temperatureC || 28}°C Partly Sunny</p>
              <p className="text-xs text-stone-500">Air Quality: Good</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-bharat-saffron rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Best Season to Visit</span>
              <p className="text-base font-black text-stone-900">{city.bestTimeToVisit}</p>
              <p className="text-xs text-stone-500">Peak Cultural Festivals</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-bharat-indigo rounded-2xl flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Curated Attractions</span>
              <p className="text-base font-black text-stone-900">{city.attractions?.length || 8} Key Monuments</p>
              <p className="text-xs text-stone-500">ASI Verified</p>
            </div>
          </div>
        </div>

        {/* Top Attractions in this Destination with Category Filters */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron">Must-Visit</span>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">Attractions in {city.name}</h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              <button
                onClick={() => setAttractionFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-xl border transition-all ${
                  attractionFilter === 'ALL'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                All Places ({city.attractions?.length || 0})
              </button>
              <button
                onClick={() => setAttractionFilter('FREE')}
                className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  attractionFilter === 'FREE'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Free Entry ({(city.attractions || []).filter((a: any) => a.entryType === 'FREE' || a.entryFee === 0 || a.adultIndianFee === 0).length})
              </button>
              <button
                onClick={() => setAttractionFilter('PAID')}
                className={`px-3.5 py-1.5 rounded-xl border transition-all ${
                  attractionFilter === 'PAID'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                Ticketed & ASI ({(city.attractions || []).filter((a: any) => a.entryType === 'PAID').length})
              </button>
              <button
                onClick={() => setAttractionFilter('HIDDEN')}
                className={`px-3.5 py-1.5 rounded-xl border transition-all ${
                  attractionFilter === 'HIDDEN'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
                }`}
              >
                ✨ Hidden Gems ({(city.attractions || []).filter((a: any) => a.isHiddenGem || a.discoveryType === 'HIDDEN_GEM' || a.discoveryType === 'LESSER_KNOWN').length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(city.attractions || [])
              .filter((a: any) => {
                if (attractionFilter === 'FREE') return a.entryType === 'FREE' || a.entryFee === 0 || a.adultIndianFee === 0;
                if (attractionFilter === 'PAID') return a.entryType === 'PAID';
                if (attractionFilter === 'HIDDEN') return a.isHiddenGem || a.discoveryType === 'HIDDEN_GEM' || a.discoveryType === 'LESSER_KNOWN';
                return true;
              })
              .map((a: any) => (
                <AttractionCard key={a.id} attraction={a} />
              ))}
          </div>
        </div>

        {/* HOW TO REACH THIS DESTINATION */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron">Connectivity</span>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">How to Reach {city.name}</h2>
              <p className="text-xs text-stone-500 mt-0.5">Verified transport options with multimodal door-to-door integration</p>
            </div>
            <Link
              href={`/smart-journey?destination=${encodeURIComponent(city.name)}`}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <Route className="w-4 h-4 text-amber-400" />
              <span>Plan Full Journey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Train className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-stone-900 text-sm">By Indian Railways</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Connects directly to {city.name} Junction. Frequent Vande Bharat, Rajdhani, and Superfast express trains operate from major metros.
              </p>
              <Link 
                href={`/transport?destination=${encodeURIComponent(city.name)}`}
                className="text-[11px] font-bold text-bharat-saffron hover:underline inline-flex items-center gap-1 pt-1"
              >
                View Trains <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-stone-900 text-sm">By Air</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Served by regional and domestic terminals with scheduled flights from Delhi, Mumbai, Bengaluru, and Kolkata.
              </p>
              <Link 
                href={`/transport?destination=${encodeURIComponent(city.name)}`}
                className="text-[11px] font-bold text-bharat-saffron hover:underline inline-flex items-center gap-1 pt-1"
              >
                Flight Options <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-stone-900 text-sm">By Road & Expressways</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Well-paved National Highways with frequent State RTC deluxe buses, AC sleeper coaches, and intercity self-drive rentals.
              </p>
              <Link 
                href={`/smart-journey?destination=${encodeURIComponent(city.name)}`}
                className="text-[11px] font-bold text-bharat-saffron hover:underline inline-flex items-center gap-1 pt-1"
              >
                Check Road Corridors <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* TRIP BUDGET ESTIMATION ENGINE */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron">Transparent Costs</span>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">Estimated Trip Budget for {city.name}</h2>
              <p className="text-xs text-stone-500 mt-0.5">Realistic costs for a 2-day / 3-day journey per person (excluding intercity travel)</p>
            </div>
            <span className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-bold rounded-lg self-start sm:self-auto">
              Status: ESTIMATED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-b from-stone-50 to-white rounded-2xl border border-stone-200 space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Budget Explorer</span>
                <h3 className="text-2xl font-black text-stone-900 mt-2">₹2,800 – ₹3,800</h3>
                <p className="text-[11px] text-stone-500">2 Days / 1 Night (Per Person)</p>
              </div>
              <ul className="text-xs text-stone-600 space-y-2 border-t border-stone-100 pt-3">
                <li className="flex justify-between"><span>Stay (Hostel / Guesthouse):</span> <span className="font-bold text-stone-800">₹1,200</span></li>
                <li className="flex justify-between"><span>Local Transit (Bus/Auto):</span> <span className="font-bold text-stone-800">₹500</span></li>
                <li className="flex justify-between"><span>Food & Street Delicacies:</span> <span className="font-bold text-stone-800">₹800</span></li>
                <li className="flex justify-between"><span>Entry Fees (Focus on Free):</span> <span className="font-bold text-emerald-700">₹300 - ₹500</span></li>
              </ul>
              <Link 
                href={`/trips?destination=${encodeURIComponent(city.name)}&budget=3500`}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                Plan Budget Trip
              </Link>
            </div>

            <div className="p-6 bg-gradient-to-b from-amber-50/50 to-white rounded-2xl border border-amber-200/80 space-y-4 relative">
              <span className="absolute -top-3 right-4 px-2.5 py-0.5 bg-bharat-saffron text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded">Heritage & Culture</span>
                <h3 className="text-2xl font-black text-stone-900 mt-2">₹6,500 – ₹8,500</h3>
                <p className="text-[11px] text-stone-500">3 Days / 2 Nights (Per Person)</p>
              </div>
              <ul className="text-xs text-stone-600 space-y-2 border-t border-stone-100 pt-3">
                <li className="flex justify-between"><span>Stay (3-Star Heritage Hotel):</span> <span className="font-bold text-stone-800">₹3,800</span></li>
                <li className="flex justify-between"><span>Local Transit (Cab / Meter Auto):</span> <span className="font-bold text-stone-800">₹1,400</span></li>
                <li className="flex justify-between"><span>Authentic Restaurant Dining:</span> <span className="font-bold text-stone-800">₹1,600</span></li>
                <li className="flex justify-between"><span>Monument Tickets & Guides:</span> <span className="font-bold text-stone-800">₹700</span></li>
              </ul>
              <Link 
                href={`/ai-planner?destination=${encodeURIComponent(city.name)}`}
                className="w-full py-2.5 bg-bharat-saffron hover:bg-bharat-terracotta text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                Synthesize Itinerary
              </Link>
            </div>

            <div className="p-6 bg-gradient-to-b from-stone-50 to-white rounded-2xl border border-stone-200 space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded">Luxury Haveli & Resort</span>
                <h3 className="text-2xl font-black text-stone-900 mt-2">₹16,000+</h3>
                <p className="text-[11px] text-stone-500">3 Days / 2 Nights (Per Person)</p>
              </div>
              <ul className="text-xs text-stone-600 space-y-2 border-t border-stone-100 pt-3">
                <li className="flex justify-between"><span>Stay (Luxury Heritage Haveli):</span> <span className="font-bold text-stone-800">₹10,500</span></li>
                <li className="flex justify-between"><span>Private Chauffeur Car:</span> <span className="font-bold text-stone-800">₹3,200</span></li>
                <li className="flex justify-between"><span>Fine Heritage Dining & Tasting:</span> <span className="font-bold text-stone-800">₹3,000</span></li>
                <li className="flex justify-between"><span>Curated Experience Passes:</span> <span className="font-bold text-stone-800">₹1,500</span></li>
              </ul>
              <Link 
                href={`/hotels?cityId=${city.id}`}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                Explore Luxury Stays
              </Link>
            </div>
          </div>
        </div>

        {/* 9. FOOD DISCOVERY — Authentic Regional Cuisine & Dining */}
        {foodData?.restaurants?.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron">Culinary Heritage</span>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight">What to Eat in {city.name}</h2>
                <p className="text-xs text-stone-500 mt-1">Iconic authentic restaurants and must-try regional delicacies</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodData.restaurants.map((rest: any) => (
                <div key={rest.id} className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col">
                  <div className="relative h-44 bg-stone-100 overflow-hidden">
                    <img
                      src={rest.imageUrl || 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80'}
                      alt={rest.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-stone-900/80 backdrop-blur-md rounded-full text-white text-[10px] font-bold">
                      {rest.priceRange || '₹₹'}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-stone-900">{rest.name}</h3>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                          ★ {rest.rating || 4.6}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-1">{rest.address}</p>
                      
                      {/* Cuisines */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {rest.cuisine?.slice(0, 3).map((c: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-semibold rounded-md">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Must Try Dishes */}
                    {rest.mustTryDishes?.length > 0 && (
                      <div className="pt-3 border-t border-stone-100 text-xs">
                        <span className="font-bold text-stone-400 text-[10px] uppercase block mb-1">Must-Try Specialties</span>
                        <p className="font-medium text-stone-800 text-xs">
                          {rest.mustTryDishes.join(' • ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 13. EVENTS & FESTIVALS DISCOVERY */}
        {events.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron">Living Culture</span>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight">Events & Cultural Festivals</h2>
                <p className="text-xs text-stone-500 mt-1">Upcoming traditional celebrations and cultural gatherings in {city.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {events.map((ev) => (
                <div key={ev.id} className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 h-48 sm:h-auto bg-stone-100 relative">
                    <img src={ev.imageUrl} alt={ev.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-bharat-saffron text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                      {ev.category}
                    </span>
                  </div>
                  <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-bharat-saffron" />
                        <span>{ev.startDate} {ev.endDate && ev.endDate !== ev.startDate ? `to ${ev.endDate}` : ''}</span>
                      </div>
                      <h3 className="font-black text-base text-stone-900 leading-snug">{ev.name}</h3>
                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">{ev.description}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {ev.ticketInfo || 'Free Public Entry'}
                      </span>
                      {ev.officialUrl && (
                        <a
                          href={ev.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-bharat-saffron hover:underline flex items-center gap-1 text-xs"
                        >
                          Official Details <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hotels in this Destination */}
        {city.hotels?.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron">Accommodations</span>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight">Where to Stay in {city.name}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {city.hotels?.map((h: any) => (
                <HotelCard key={h.id} hotel={h} />
              ))}
            </div>
          </div>
        )}

        {/* 21. SAFETY & EMERGENCY HELPLINES */}
        {emergencyData && (
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-white">Tourist Safety & Verified Helplines</h2>
                  <p className="text-xs text-stone-400">Official 24x7 emergency and medical contacts for {city.name}, {city.state?.name}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30 flex items-center gap-1.5 self-start sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5" /> Pan-India Verified Helplines
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">National Emergency</span>
                <p className="text-2xl font-black text-white">{emergencyData.nationalHelpline}</p>
                <p className="text-[10px] text-stone-400">All-in-one Emergency Response</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Tourist Helpline</span>
                <p className="text-2xl font-black text-amber-400">{emergencyData.touristHelpline}</p>
                <p className="text-[10px] text-stone-400">Ministry of Tourism (Toll-free)</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Medical Ambulance</span>
                <p className="text-2xl font-black text-emerald-400">{emergencyData.ambulance}</p>
                <p className="text-[10px] text-stone-400">National Ambulance Service</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Women Safety</span>
                <p className="text-2xl font-black text-rose-400">{emergencyData.womenSafety}</p>
                <p className="text-[10px] text-stone-400">24x7 National Helpline</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs space-y-1">
                <span className="text-stone-400 font-bold block">Assistance Hubs in {city.name}:</span>
                <p className="font-semibold text-stone-200">👮 {emergencyData.touristPoliceStation}</p>
                <p className="font-semibold text-stone-200">🏥 {emergencyData.civilHospital}</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs space-y-1">
                <span className="text-stone-400 font-bold block">Traveler Safety Protocol:</span>
                <ul className="text-stone-300 space-y-1 list-disc list-inside">
                  {emergencyData.safetyGuidelines?.map((g: string, idx: number) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
