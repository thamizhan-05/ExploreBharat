'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Compass, 
  MapPin, 
  Accessibility, 
  Users, 
  Baby, 
  Sparkles, 
  Map as MapIcon, 
  Grid, 
  Navigation, 
  ExternalLink,
  ShieldCheck,
  Clock,
  Ticket
} from 'lucide-react';
import { api } from '../../lib/api';
import AttractionCard from '../../components/AttractionCard';
import TicketModal from '../../components/TicketModal';
import OpenStreetMap from '../../components/OpenStreetMap';

function AttractionsContent() {
  const searchParams = useSearchParams();
  const [attractions, setAttractions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedEntryType, setSelectedEntryType] = useState(searchParams.get('entryType') || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingModalAttraction, setBookingModalAttraction] = useState<any | null>(null);
  const [selectedMapAttraction, setSelectedMapAttraction] = useState<any | null>(null);

  // 8. Accessibility & Family filters
  const [filterWheelchair, setFilterWheelchair] = useState(false);
  const [filterSenior, setFilterSenior] = useState(false);
  const [filterKid, setFilterKid] = useState(false);
  const [filterHiddenGems, setFilterHiddenGems] = useState(false);

  // 3. Smart "Near Me" Location
  const [nearMeActive, setNearMeActive] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState(25);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // 4. View Mode: Grid or Tourism Map View
  const [viewMode, setViewMode] = useState<'GRID' | 'MAP'>('GRID');

  // Trigger Smart "Near Me"
  const handleNearMeToggle = () => {
    if (nearMeActive) {
      setNearMeActive(false);
      setUserLocation(null);
      setLocationStatus(null);
      return;
    }

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('Locating nearby destinations...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNearMeActive(true);
        setLocationStatus(null);
      },
      (err) => {
        console.warn('Geolocation permission denied or error:', err.message);
        setUserLocation(null);
        setNearMeActive(false);
        setLocationStatus('Location access denied. Please type your city in the search bar above to find local attractions.');
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let query = '?limit=40';
        if (selectedCategory) query += `&categoryId=${selectedCategory}`;
        if (selectedEntryType) query += `&entryType=${selectedEntryType}`;
        if (selectedPriceRange) query += `&priceRange=${selectedPriceRange}`;
        if (search) query += `&search=${encodeURIComponent(search)}`;
        if (filterWheelchair) query += `&wheelchair=true`;
        if (filterSenior) query += `&seniorFriendly=true`;
        if (filterKid) query += `&childFriendly=true`;
        if (filterHiddenGems) query += `&hiddenGems=true`;

        const [catsRes, attrRes] = await Promise.all([
          api.getCategories(),
          nearMeActive && userLocation
            ? api.getNearbyAttractions(userLocation.lat, userLocation.lng, radiusKm)
            : api.getAttractions(query)
        ]);

        setCategories(catsRes.data || []);
        // api.getNearbyAttractions returns raw array, api.getAttractions returns { items: [...] } or array
        const list = Array.isArray(attrRes) ? attrRes : (attrRes.data || attrRes.items || []);
        setAttractions(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [
    selectedCategory, 
    selectedEntryType, 
    selectedPriceRange, 
    search, 
    filterWheelchair, 
    filterSenior, 
    filterKid, 
    filterHiddenGems, 
    nearMeActive, 
    userLocation, 
    radiusKm
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron">Architectural & Natural Heritage</span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Explore Tourist Places Across India
          </h1>
          <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
            Discover thousands of authentic monuments, free public landmarks, natural viewpoints, and ASI heritage sanctuaries across India.
          </p>
        </div>

        {/* View Mode Toggle Button */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-stone-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setViewMode('GRID')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'GRID' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> Grid View
          </button>
          <button
            onClick={() => setViewMode('MAP')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'MAP' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-bharat-saffron" /> Tourism Map
          </button>
        </div>
      </div>

      {/* Main Filter & Search Control Center */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-5">
        
        {/* Row 1: Search & Entry Types & Near Me Trigger */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by monument, city, state, or keywords..."
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-bharat-saffron"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 3. SMART NEAR ME BUTTON */}
            <button
              onClick={handleNearMeToggle}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                nearMeActive 
                  ? 'bg-bharat-saffron text-white shadow-md shadow-orange-500/20' 
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${nearMeActive ? 'animate-spin' : ''}`} />
              <span>{nearMeActive ? 'Near Me: Active' : '📍 Places Near Me'}</span>
            </button>

            {/* Entry Type Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: '', label: 'All Entry' },
                { id: 'FREE', label: '🟢 Free Entry' },
                { id: 'PAID', label: '🎟️ Paid Entry' },
                { id: 'CONDITIONAL', label: '🟡 Free / Paid' },
                { id: 'PERMIT_REQUIRED', label: '⚠️ Permit' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedEntryType(t.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    selectedEntryType === t.id ? 'bg-bharat-charcoal text-white shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Smart Near Me Distance Chips (if Near Me active) */}
        {nearMeActive && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-orange-50/80 border border-orange-200/80 rounded-2xl text-xs">
            <span className="font-bold text-bharat-saffron flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Discovery Radius:
            </span>
            {[1, 5, 10, 25, 50].map((km) => (
              <button
                key={km}
                onClick={() => setRadiusKm(km)}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  radiusKm === km ? 'bg-bharat-saffron text-white' : 'bg-white text-stone-700 hover:bg-orange-100'
                }`}
              >
                Within {km} km
              </button>
            ))}
            {locationStatus && (
              <span className="text-[11px] text-stone-500 italic ml-auto">{locationStatus}</span>
            )}
          </div>
        )}

        {/* Row 2: Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-stone-100">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-1 shrink-0">Category:</span>
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              !selectedCategory ? 'bg-bharat-saffron text-white shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === c.id ? 'bg-bharat-saffron text-white shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Row 3: 8. Accessibility & Family Intelligence Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-stone-400 uppercase tracking-wider text-[11px] mr-1">Accessibility & Intelligence:</span>
            
            <button
              onClick={() => setFilterWheelchair(!filterWheelchair)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                filterWheelchair ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Accessibility className="w-3.5 h-3.5" /> Wheelchair Friendly
            </button>

            <button
              onClick={() => setFilterSenior(!filterSenior)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                filterSenior ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Senior Friendly
            </button>

            <button
              onClick={() => setFilterKid(!filterKid)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                filterKid ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Baby className="w-3.5 h-3.5" /> Kid & Stroller Friendly
            </button>

            <button
              onClick={() => setFilterHiddenGems(!filterHiddenGems)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                filterHiddenGems ? 'bg-purple-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> ✨ Hidden Gems
            </button>
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-stone-400 font-bold text-[11px] uppercase">Price:</span>
            {[
              { id: '', label: 'Any' },
              { id: 'free', label: '₹0 Free' },
              { id: 'under_100', label: '< ₹100' },
              { id: '100_500', label: '₹100–500' },
              { id: 'above_500', label: '₹500+' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPriceRange(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  selectedPriceRange === p.id ? 'bg-bharat-saffron text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. TOURISM MAP VIEW */}
      {viewMode === 'MAP' ? (
        <div className="space-y-6">
          {/* Active OpenStreetMap Interactive Embed */}
          {(() => {
            const activeAttraction = selectedMapAttraction || (attractions.length > 0 ? attractions[0] : null);
            if (!activeAttraction || !activeAttraction.latitude || !activeAttraction.longitude) return null;
            return (
              <div className="space-y-2">
                <OpenStreetMap
                  latitude={activeAttraction.latitude}
                  longitude={activeAttraction.longitude}
                  placeName={activeAttraction.name}
                  height="440px"
                  zoom={15}
                  showDirectionsButton={true}
                />
                <div className="flex items-center justify-between text-xs px-2 text-stone-500">
                  <span>
                    Currently viewing: <strong className="text-stone-800">{activeAttraction.name}</strong> ({activeAttraction.city?.name || 'India'})
                  </span>
                  <span className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono">
                    {activeAttraction.latitude.toFixed(4)}°N, {activeAttraction.longitude.toFixed(4)}°E
                  </span>
                </div>
              </div>
            );
          })()}

          <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white p-6 rounded-3xl border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Compass className="w-6 h-6 text-bharat-saffron" />
                <div>
                  <h3 className="font-black text-lg text-white">Geospatial Tourism Explorer</h3>
                  <p className="text-xs text-stone-400">Click any landmark below to focus the OpenStreetMap interactive view</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-amber-300">
                {attractions.length} Verified Monuments Displayed
              </span>
            </div>

            {/* Interactive Monument Switcher Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
              {attractions.map((a) => {
                const isSelected = selectedMapAttraction?.id === a.id || (!selectedMapAttraction && attractions[0]?.id === a.id);
                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedMapAttraction(a)}
                    className={`cursor-pointer backdrop-blur-md p-4 rounded-2xl border transition-all space-y-3 ${
                      isSelected
                        ? 'bg-bharat-saffron/20 border-bharat-saffron shadow-lg ring-1 ring-bharat-saffron'
                        : 'bg-white/10 border-white/10 hover:bg-white/15'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{a.name}</h4>
                        <p className="text-xs text-stone-300 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-bharat-saffron" />
                          <span>{a.city?.name}, {a.city?.state?.name || 'India'}</span>
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        a.entryType === 'FREE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {a.entryType === 'FREE' ? 'FREE' : `₹${a.entryFee || a.adultIndianFee || 50}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span>GPS: {a.latitude?.toFixed(4)}, {a.longitude?.toFixed(4)}</span>
                      {a.distanceKm !== undefined && (
                        <span className="text-amber-300 font-bold">{a.distanceKm} km away</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                        {isSelected ? '✓ Showing on Map' : 'Focus Map →'}
                      </span>
                      <Link
                        href={`/attractions/${a.slug || a.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1 bg-bharat-saffron text-white rounded-lg text-xs font-bold hover:bg-bharat-terracotta transition-colors"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Regular Grid of Attractions */
        loading ? (
          <div className="py-20 text-center text-stone-500 font-medium">Loading attractions catalog...</div>
        ) : attractions.length === 0 ? (
          <div className="py-20 text-center text-stone-500 font-medium">No attractions found matching your search.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction) => (
              <AttractionCard
                key={attraction.id}
                attraction={attraction}
                onBookClick={(a) => setBookingModalAttraction(a)}
              />
            ))}
          </div>
        )
      )}

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

export default function AttractionsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-stone-500">Loading catalog...</div>}>
      <AttractionsContent />
    </Suspense>
  );
}
