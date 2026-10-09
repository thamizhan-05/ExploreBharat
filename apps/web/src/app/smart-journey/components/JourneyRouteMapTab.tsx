'use client';

import React from 'react';
import OpenStreetMap from '../../../components/OpenStreetMap';

interface JourneyRouteMapTabProps {
  destination: string;
  origin: string;
  destinationCoordinates: Record<string, { lat: number; lng: number }>;
  currentOption?: any;
}

export default function JourneyRouteMapTab({
  destination,
  origin,
  destinationCoordinates,
  currentOption,
}: JourneyRouteMapTabProps) {
  const destCoords = destinationCoordinates[destination] || { lat: 26.9124, lng: 75.7873 };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-stone-900">Door-to-Door Route Map</h3>
          <p className="text-xs text-stone-500">Geospatial map powered by OpenStreetMap &amp; OSRM open routing engine</p>
        </div>
        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          OpenStreetMap (100% Free &amp; Open Source)
        </span>
      </div>

      {/* Real Interactive OpenStreetMap Embed */}
      <OpenStreetMap
        latitude={destCoords.lat}
        longitude={destCoords.lng}
        placeName={`${destination} Tourism Corridor`}
        height="380px"
        zoom={13}
        showDirectionsButton={true}
      />

      {/* Visual Multimodal Corridor Map */}
      <div className="w-full bg-stone-900 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-stone-300">ORIGIN: {origin}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-400">DESTINATION: {destination}</span>
            <div className="w-3 h-3 rounded-full bg-amber-400" />
          </div>
        </div>

        {/* Multimodal Flow Graph */}
        <div className="relative py-8">
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 -translate-y-1/2 z-0" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-600 border-4 border-stone-900 flex items-center justify-center font-bold text-sm shadow">
                🏠
              </div>
              <span className="text-[11px] font-bold mt-2 text-stone-200">Start</span>
              <span className="text-[9px] text-stone-400">Origin</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-amber-600 border-4 border-stone-900 flex items-center justify-center font-bold text-sm shadow">
                🛺
              </div>
              <span className="text-[11px] font-bold mt-2 text-stone-200">First-Mile</span>
              <span className="text-[9px] text-stone-400">Auto / Metro</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 border-4 border-stone-900 flex items-center justify-center font-bold text-sm shadow">
                🚉
              </div>
              <span className="text-[11px] font-bold mt-2 text-stone-200">Terminal</span>
              <span className="text-[9px] text-stone-400">Station/Airport</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-purple-600 border-4 border-stone-900 flex items-center justify-center font-bold text-sm shadow">
                🚆
              </div>
              <span className="text-[11px] font-bold mt-2 text-stone-200">Intercity</span>
              <span className="text-[9px] text-stone-400">Vande Bharat / Rail</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 border-4 border-stone-900 flex items-center justify-center font-bold text-sm shadow">
                🏨
              </div>
              <span className="text-[11px] font-bold mt-2 text-stone-200">Hotel</span>
              <span className="text-[9px] text-stone-400">Check-in</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-rose-600 border-4 border-stone-900 flex items-center justify-center font-bold text-sm shadow">
                🏰
              </div>
              <span className="text-[11px] font-bold mt-2 text-stone-200">Sights</span>
              <span className="text-[9px] text-stone-400">Attractions</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
          <span>Route Corridor: {origin} → Hub Station → {destination} Station → Hotel → Attractions</span>
          <span>Total Distance: ~{currentOption?.totalDistanceKm || 310} km</span>
        </div>
      </div>
    </div>
  );
}
