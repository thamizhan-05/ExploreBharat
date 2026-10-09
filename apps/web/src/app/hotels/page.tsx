'use client';

import { useState, useEffect } from 'react';
import { Search, Hotel as HotelIcon } from 'lucide-react';
import { api } from '../../lib/api';
import HotelCard from '../../components/HotelCard';

export default function HotelsPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [tier, setTier] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHotels() {
      setLoading(true);
      try {
        const query = `?limit=24${tier ? `&tier=${tier}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
        const res = await api.getHotels(query);
        setHotels(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHotels();
  }, [tier, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron">Hospitality & Stays</span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Heritage Havelis, Luxury Palaces & Boutique Stays
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          Discover verified Indian accommodations with authentic architecture, traditional dining, proximity to monuments, and flexible cancellation policies.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hotel or city (Jaipur, Udaipur, Agra...)"
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bharat-saffron"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['', 'LUXURY', 'HERITAGE', 'STANDARD', 'BUDGET'].map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                tier === t ? 'bg-bharat-saffron text-white shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {t ? t.charAt(0) + t.slice(1).toLowerCase() : 'All Tiers'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-stone-500 font-medium">Loading verified hotels...</div>
      ) : hotels.length === 0 ? (
        <div className="py-20 text-center text-stone-500 font-medium">No hotels found matching criteria.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}
