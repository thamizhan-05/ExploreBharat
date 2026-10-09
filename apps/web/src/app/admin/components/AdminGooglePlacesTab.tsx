'use client';

import React from 'react';
import { Search, AlertTriangle } from 'lucide-react';

interface GooglePlacesTabProps {
  googleQuery: string;
  setGoogleQuery: (val: string) => void;
  googleLoading: boolean;
  googleResults: any;
  onSearch: (e: React.FormEvent) => void;
}

export default function AdminGooglePlacesTab({
  googleQuery,
  setGoogleQuery,
  googleLoading,
  googleResults,
  onSearch,
}: GooglePlacesTabProps) {
  return (
    <div className="space-y-8">
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Official API Integration</span>
        <h2 className="text-2xl font-black tracking-tight text-white">🌐 Google Places API (New) Provider</h2>
        <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
          ExploreBharat uses the official Google Places API with strict Field Masking to discover and enrich places. Google Maps Platform policies prohibit prefetching, storing, or using Google photos without mandatory author attribution and source link access.
        </p>

        {/* Compliance Badge Alert */}
        <div className="p-3 bg-stone-800 border border-stone-700 rounded-2xl text-xs space-y-1">
          <span className="font-bold text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Compliance & Storage Notice
          </span>
          <p className="text-[11px] text-stone-300">
            Live Google photo URLs and Place IDs are handled according to Google terms. Author attributions (displayName, uri) are preserved and never stripped.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={onSearch} className="flex gap-2 max-w-xl pt-2">
          <input
            type="text"
            value={googleQuery}
            onChange={(e) => setGoogleQuery(e.target.value)}
            placeholder="Search place on Google (e.g. Meenakshi Amman Temple)"
            className="flex-1 bg-stone-800 text-white text-xs px-4 py-3 rounded-xl border border-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
          <button
            type="submit"
            disabled={googleLoading}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{googleLoading ? 'Querying...' : 'Query Places API'}</span>
          </button>
        </form>
      </div>

      {/* Results Preview */}
      {googleResults && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-stone-900">API Result & Attribution Preview</h3>
            <span className="text-xs font-bold text-stone-500">
              Quota Cost: 1 API Call | Field Mask: id,displayName,formattedAddress,photos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs">
              <div>
                <span className="font-bold text-stone-500 block uppercase text-[10px]">Place Name</span>
                <p className="font-extrabold text-stone-900 text-sm">{googleResults.displayName?.text || googleResults.name}</p>
              </div>
              <div>
                <span className="font-bold text-stone-500 block uppercase text-[10px]">Formatted Address</span>
                <p className="text-stone-700">{googleResults.formattedAddress}</p>
              </div>
              <div>
                <span className="font-bold text-stone-500 block uppercase text-[10px]">Coordinates</span>
                <p className="font-mono text-stone-600">
                  Lat: {googleResults.location?.latitude?.toFixed(4)}, Lng: {googleResults.location?.longitude?.toFixed(4)}
                </p>
              </div>
              <div>
                <span className="font-bold text-stone-500 block uppercase text-[10px]">Google Place ID</span>
                <p className="font-mono text-stone-600 break-all">{googleResults.id}</p>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs">
              <span className="font-bold text-stone-500 block uppercase text-[10px]">Photo & Mandatory Attribution</span>
              {googleResults.photos && googleResults.photos.length > 0 ? (
                <div className="space-y-2">
                  <div className="w-full h-40 rounded-xl overflow-hidden bg-stone-200">
                    <img
                      src={googleResults.photos[0].photoUri}
                      alt="Google Place Photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-[11px] space-y-1">
                    <span className="font-bold text-stone-800 block">Required Author Credit:</span>
                    <p className="text-stone-600">
                      Photo by{' '}
                      <a
                        href={googleResults.photos[0].authorAttributions?.[0]?.uri || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold underline"
                      >
                        {googleResults.photos[0].authorAttributions?.[0]?.displayName || 'Google Maps Contributor'}
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-stone-400 italic">No photos available for this entity.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
