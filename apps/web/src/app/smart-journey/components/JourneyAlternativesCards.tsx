'use client';

import React from 'react';
import { Layers, Clock } from 'lucide-react';

interface JourneyAlternativesCardsProps {
  options: any[];
  selectedAlternative: string;
  onSelectAlternative: (key: string) => void;
}

export default function JourneyAlternativesCards({
  options,
  selectedAlternative,
  onSelectAlternative,
}: JourneyAlternativesCardsProps) {
  if (!options || options.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-bharat-saffron" />
          Verified Route Alternatives ({options.length})
        </h3>
        <span className="text-[11px] text-stone-500 font-medium">Click alternative to recalculate itinerary</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt: any) => {
          const isSelected = selectedAlternative === opt.optionKey;
          return (
            <button
              key={opt.optionKey}
              type="button"
              onClick={() => onSelectAlternative(opt.optionKey)}
              className={`text-left p-3.5 rounded-xl border transition-all relative ${
                isSelected
                  ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                  : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                  opt.optionKey === 'FASTEST'
                    ? 'bg-blue-100 text-blue-800'
                    : opt.optionKey === 'CHEAPEST'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {opt.optionKey}
                </span>
                <span className="text-xs font-extrabold text-stone-900">
                  ₹{opt.totalFare?.toLocaleString('en-IN') || '---'}
                </span>
              </div>
              <p className="text-xs font-bold text-stone-800 line-clamp-1">{opt.title}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  {Math.floor(opt.totalDurationMinutes / 60)}h {opt.totalDurationMinutes % 60}m
                </span>
                <span className="text-stone-400">
                  {opt.transferCount} {opt.transferCount === 1 ? 'transfer' : 'transfers'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
