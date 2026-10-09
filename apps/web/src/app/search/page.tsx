'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Compass, Hotel as HotelIcon, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';
import AttractionCard from '../../components/AttractionCard';
import HotelCard from '../../components/HotelCard';
import CircuitCard from '../../components/CircuitCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';

  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function performSearch() {
      if (!q) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await api.search(q);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [q]);

  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Search Results for <span className="text-bharat-saffron">"{q}"</span>
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across attractions, cities, hotels, circuits..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-bharat-saffron"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
        </form>
      </div>

      {loading ? (
        <div className="py-20 text-center text-stone-500 font-medium">Searching catalog...</div>
      ) : !results ? (
        <div className="py-20 text-center text-stone-500 font-medium">Please enter a search query.</div>
      ) : (
        <div className="space-y-12">
          
          {/* Attractions */}
          {results.attractions?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                <Compass className="w-5 h-5 text-bharat-saffron" />
                <span>Attractions ({results.attractions.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.attractions.map((a: any) => (
                  <AttractionCard key={a.id} attraction={a} />
                ))}
              </div>
            </div>
          )}

          {/* Destinations */}
          {results.destinations?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                <MapPin className="w-5 h-5 text-bharat-saffron" />
                <span>Destinations & Cities ({results.destinations.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {results.destinations.map((city: any) => (
                  <Link
                    key={city.id}
                    href={`/destinations/${city.id}`}
                    className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all space-y-1 block"
                  >
                    <h3 className="font-bold text-sm text-stone-900">{city.name}</h3>
                    <p className="text-xs text-stone-500">{city.state?.name || 'India'}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Hotels */}
          {results.hotels?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                <HotelIcon className="w-5 h-5 text-bharat-indigo" />
                <span>Hotels & Stays ({results.hotels.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.hotels.map((h: any) => (
                  <HotelCard key={h.id} hotel={h} />
                ))}
              </div>
            </div>
          )}

          {/* Circuits */}
          {results.circuits?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-stone-900 tracking-tight">Tourism Circuits</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.circuits.map((c: any) => (
                  <CircuitCard key={c.id} circuit={c} />
                ))}
              </div>
            </div>
          )}

          {results.attractions?.length === 0 && results.destinations?.length === 0 && results.hotels?.length === 0 && (
            <div className="py-20 text-center text-stone-500 font-medium">
              No matching records found for "{q}". Try searching for "Amber", "Jaipur", "Fort", or "Kerala".
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-stone-500">Searching...</div>}>
      <SearchContent />
    </Suspense>
  );
}
