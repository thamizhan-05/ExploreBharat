'use client';

import React from 'react';
import { Train, Car, Hotel as HotelIcon, Ticket, DollarSign } from 'lucide-react';

interface JourneyCostTabProps {
  cost: {
    totalEstimatedCost?: number;
    intercityTransport?: number;
    localTransport?: number;
    hotelCost?: number;
    attractionTickets?: number;
    foodEstimate?: number;
    knownCost?: number;
    estimatedCost?: number;
    unknownCost?: number;
  };
}

export default function JourneyCostTab({ cost }: JourneyCostTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <h3 className="text-lg font-black text-stone-900">Total Travel Cost Audit</h3>
          <p className="text-xs text-stone-500">
            Transparent accounting with strict separation of verified scheduled tariffs vs. estimated road fares.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-stone-400 block font-bold">Estimated Trip Total</span>
          <span className="text-2xl font-black text-stone-900">
            ₹{cost.totalEstimatedCost?.toLocaleString('en-IN') || '---'}
          </span>
        </div>
      </div>

      {/* Subcategory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-1">
            <span>Intercity Transport</span>
            <Train className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-stone-900">
            ₹{cost.intercityTransport?.toLocaleString('en-IN') || '0'}
          </p>
          <span className="inline-block mt-2 text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
            VERIFIED TARIFF
          </span>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-1">
            <span>Local First/Last Mile</span>
            <Car className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-stone-900">
            ₹{cost.localTransport?.toLocaleString('en-IN') || '0'}
          </p>
          <span className="inline-block mt-2 text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
            ESTIMATED METERED
          </span>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-1">
            <span>Hotel Accommodation</span>
            <HotelIcon className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-black text-stone-900">
            ₹{cost.hotelCost?.toLocaleString('en-IN') || '0'}
          </p>
          <span className="inline-block mt-2 text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
            ESTIMATED ROOM RATE
          </span>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-1">
            <span>Attractions &amp; Tickets</span>
            <Ticket className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-black text-stone-900">
            ₹{cost.attractionTickets?.toLocaleString('en-IN') || '0'}
          </p>
          <span className="inline-block mt-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
            OFFICIAL ENTRY
          </span>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-1">
            <span>Estimated Dining</span>
            <DollarSign className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-black text-stone-900">
            ₹{cost.foodEstimate?.toLocaleString('en-IN') || '0'}
          </p>
          <span className="inline-block mt-2 text-[10px] bg-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded">
            FOOD ESTIMATE
          </span>
        </div>
      </div>

      {/* Accuracy Classification */}
      <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs space-y-2">
        <div className="flex items-center justify-between font-bold text-stone-800">
          <span>Known Cost (Confirmed booking tariffs):</span>
          <span className="text-emerald-700 font-extrabold">₹{cost.knownCost?.toLocaleString('en-IN') || '0'}</span>
        </div>
        <div className="flex items-center justify-between font-bold text-stone-800">
          <span>Estimated Cost (Subject to road meter / dining choices):</span>
          <span className="text-amber-700 font-extrabold">₹{cost.estimatedCost?.toLocaleString('en-IN') || '0'}</span>
        </div>
        <div className="flex items-center justify-between font-bold text-stone-800">
          <span>Unknown / Unaccounted:</span>
          <span className="text-stone-500 font-extrabold">₹{cost.unknownCost || 0}</span>
        </div>
      </div>

      <div className="text-[11px] text-stone-500 italic">
        * Note: Metered auto and cab tariffs are calculated using regional RTO fare equations. ExploreBharat never guarantees dynamic ride-hail pricing. Please confirm with driver or app before boarding.
      </div>
    </div>
  );
}
