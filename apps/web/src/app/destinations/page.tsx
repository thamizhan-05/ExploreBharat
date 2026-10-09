'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Search, Sparkles, Filter, ChevronRight, Check } from 'lucide-react';
import { api } from '../../lib/api';
import SafePlaceImage from '../../components/SafePlaceImage';

export default function DestinationsPage() {
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStateCode, setSelectedStateCode] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statesRes, citiesRes] = await Promise.all([
          api.getStates(),
          api.getCities()
        ]);
        setStates(statesRes.data || []);
        setCities(citiesRes.data || []);

        if (typeof window !== 'undefined') {
          const sp = new URLSearchParams(window.location.search);
          const st = sp.get('state') || sp.get('stateCode');
          if (st) {
            setSelectedStateCode(st.toUpperCase());
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCities = cities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.state?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesState =
      selectedStateCode === 'ALL' ||
      c.state?.code === selectedStateCode ||
      c.stateId === selectedStateCode;
    return matchesSearch && matchesState;
  });

  const featuredStates = [
    { code: 'ALL', label: 'All India' },
    { code: 'MH', label: 'Maharashtra (Pilot)' },
    { code: 'RJ', label: 'Rajasthan' },
    { code: 'TN', label: 'Tamil Nadu' },
    { code: 'KL', label: 'Kerala' },
    { code: 'KA', label: 'Karnataka' },
    { code: 'GA', label: 'Goa' },
    { code: 'DL', label: 'Delhi' },
    { code: 'UP', label: 'Uttar Pradesh' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron">Geography of Bharat</span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Destinations Across 28 States & 8 Union Territories
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          From the Sahyadri mountains of Mahabaleshwar and Mumbai’s Queen’s Necklace to royal Rajasthani citadels and emerald backwaters of Kerala — explore the authentic destinations of India.
        </p>
      </div>

      {/* State Filter Pills & Search */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          {featuredStates.map((st) => {
            const isSelected = selectedStateCode === st.code;
            return (
              <button
                key={st.code}
                onClick={() => setSelectedStateCode(st.code)}
                className={`px-3 py-1.5 rounded-full transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-bharat-saffron text-white shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by city (Mahabaleshwar, Mumbai, Pune, Jaipur, Madurai...)"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-bharat-saffron"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Cities Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span>Tourist Destinations & Hubs</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
              {filteredCities.length} {filteredCities.length === 1 ? 'City' : 'Cities'}
            </span>
          </h2>
          {selectedStateCode !== 'ALL' && (
            <button
              onClick={() => setSelectedStateCode('ALL')}
              className="text-xs font-bold text-bharat-saffron hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-12 text-center text-stone-500 font-medium">Loading verified destinations...</div>
        ) : filteredCities.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-600 space-y-2">
            <p className="font-bold">No cities found matching your filter.</p>
            <button
              onClick={() => { setSelectedStateCode('ALL'); setSearch(''); }}
              className="text-xs text-bharat-saffron font-bold underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredCities.map((city) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-sm sm:text-base group-hover:text-amber-300 transition-colors leading-tight truncate">
                    {city.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-stone-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-bharat-saffron shrink-0" />
                    <span className="truncate">{city.state?.name || 'India'}</span>
                  </p>
                  {city._count?.attractions > 0 && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-sm text-[9px] font-black text-amber-200">
                      {city._count.attractions} Places
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* States List */}
      <div className="space-y-6 pt-6 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">All 28 States & 8 Union Territories</h2>
            <p className="text-xs text-stone-500">Click any state to filter destination cities and explore regional tourism circuits.</p>
          </div>
          <span className="text-xs font-mono font-bold text-stone-400">Total: 36 Entities</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {states.map((st) => {
            const isSelected = selectedStateCode === st.code;
            return (
              <div
                key={st.id}
                onClick={() => {
                  setSelectedStateCode(st.code);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'border-bharat-saffron ring-2 ring-bharat-saffron/20 shadow-md bg-amber-50/20'
                    : 'border-stone-200/80 hover:border-stone-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-bharat-saffron px-1.5 py-0.5 bg-orange-50 rounded">
                    {st.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {st.citiesCount > 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {st.citiesCount} {st.citiesCount === 1 ? 'City' : 'Cities'}
                      </span>
                    )}
                    <span className="text-[9px] text-stone-400 font-bold uppercase">
                      {st.isUnionTerritory ? 'UT' : 'State'}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-sm text-stone-900 flex items-center justify-between">
                  <span>{st.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{st.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
