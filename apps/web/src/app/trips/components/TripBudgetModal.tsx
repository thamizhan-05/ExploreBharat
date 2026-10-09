'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface TripBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  calcDest: string;
  setCalcDest: (val: string) => void;
  calcDays: number;
  setCalcDays: (val: number) => void;
  calcTravellers: number;
  setCalcTravellers: (val: number) => void;
  calcBudget: number;
  setCalcBudget: (val: number) => void;
  calcStyle: 'BUDGET' | 'HERITAGE' | 'FAMILY' | 'LUXURY';
  setCalcStyle: (val: 'BUDGET' | 'HERITAGE' | 'FAMILY' | 'LUXURY') => void;
  onApplyToTrip: () => void;
}

export default function TripBudgetModal({
  isOpen,
  onClose,
  calcDest,
  setCalcDest,
  calcDays,
  setCalcDays,
  calcTravellers,
  setCalcTravellers,
  calcBudget,
  setCalcBudget,
  calcStyle,
  setCalcStyle,
  onApplyToTrip,
}: TripBudgetModalProps) {
  if (!isOpen) return null;

  const stayNight = calcStyle === 'BUDGET' ? 700 * Math.ceil(calcTravellers / 2)
    : calcStyle === 'HERITAGE' ? 2500 * Math.ceil(calcTravellers / 2)
    : calcStyle === 'FAMILY' ? 4500 * Math.ceil(calcTravellers / 2)
    : 12000 * Math.ceil(calcTravellers / 2);
  const estStay = stayNight * Math.max(1, calcDays - 1);

  const foodDaily = calcStyle === 'BUDGET' ? 350 * calcTravellers
    : calcStyle === 'HERITAGE' ? 800 * calcTravellers
    : calcStyle === 'FAMILY' ? 1400 * calcTravellers
    : 3500 * calcTravellers;
  const estFood = foodDaily * calcDays;

  const transitDaily = calcStyle === 'BUDGET' ? 200 * calcTravellers
    : calcStyle === 'HERITAGE' ? 600 * calcTravellers
    : calcStyle === 'FAMILY' ? 1200 * calcTravellers
    : 3000 * calcTravellers;
  const estTransit = transitDaily * calcDays;

  const estTickets = calcStyle === 'BUDGET' ? 100 * calcTravellers
    : (350 * calcTravellers * calcDays);
  const estActivities = calcStyle === 'BUDGET' ? 0 : 500 * calcTravellers;
  const estMisc = Math.round((estStay + estFood + estTransit + estTickets + estActivities) * 0.06);
  const estTotal = estStay + estFood + estTransit + estTickets + estActivities + estMisc;
  const estRemaining = calcBudget - estTotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-bharat-saffron block">Planning Intelligence</span>
            <h3 className="text-xl font-black text-stone-900">Budget-Based Trip Estimator</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Input Parameters Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-stone-700 block mb-1">Destination</label>
            <input
              type="text"
              value={calcDest}
              onChange={(e) => setCalcDest(e.target.value)}
              placeholder="e.g. Mumbai, Jaipur, Varanasi"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>
          <div>
            <label className="font-bold text-stone-700 block mb-1">Target Budget (₹)</label>
            <input
              type="number"
              value={calcBudget}
              onChange={(e) => setCalcBudget(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold"
            />
          </div>
          <div>
            <label className="font-bold text-stone-700 block mb-1">Number of Days</label>
            <input
              type="number"
              min={1}
              max={14}
              value={calcDays}
              onChange={(e) => setCalcDays(parseInt(e.target.value, 10) || 1)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>
          <div>
            <label className="font-bold text-stone-700 block mb-1">Number of Travellers</label>
            <input
              type="number"
              min={1}
              max={10}
              value={calcTravellers}
              onChange={(e) => setCalcTravellers(parseInt(e.target.value, 10) || 1)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>
        </div>

        {/* Travel Style Selector */}
        <div className="space-y-1.5 text-xs">
          <label className="font-bold text-stone-700 block">Travel Style</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'BUDGET', label: 'Budget Explorer', note: 'Hostels / Public transit' },
              { id: 'HERITAGE', label: 'Heritage Culture', note: 'Havelis / Local cabs' },
              { id: 'FAMILY', label: 'Family Comfort', note: 'Hotels / AC cabs' },
              { id: 'LUXURY', label: 'Royal Luxury', note: 'Palaces / Chauffeur' }
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setCalcStyle(style.id as any)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  calcStyle === style.id
                    ? 'border-bharat-saffron bg-orange-50/70 text-bharat-saffron font-bold'
                    : 'border-stone-200 bg-stone-50 text-stone-700'
                }`}
              >
                <div className="font-bold text-xs">{style.label}</div>
                <div className="text-[10px] text-stone-500 font-normal">{style.note}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Deterministic Estimates Breakdown */}
        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80 space-y-2.5 text-xs">
          <span className="font-bold text-stone-400 uppercase text-[10px] block">Baseline Cost Breakdown</span>
          
          <div className="flex justify-between items-center text-stone-700">
            <span>🏨 Accommodation ({calcDays > 1 ? `${calcDays - 1} nights` : 'day trip'}):</span>
            <span className="font-mono font-bold text-stone-900">₹{estStay.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-stone-700">
            <span>🍲 Regional Food & Dining ({calcDays} days):</span>
            <span className="font-mono font-bold text-stone-900">₹{estFood.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-stone-700">
            <span>🚕 Local Transit & Cabs:</span>
            <span className="font-mono font-bold text-stone-900">₹{estTransit.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-stone-700">
            <span>🎫 Monument Passes & Admissions:</span>
            <span className="font-mono font-bold text-stone-900">₹{estTickets.toLocaleString('en-IN')}</span>
          </div>
          {estActivities > 0 && (
            <div className="flex justify-between items-center text-stone-700">
              <span>🧭 Cultural Activities & Guides:</span>
              <span className="font-mono font-bold text-stone-900">₹{estActivities.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-stone-700">
            <span>🧾 GST & Contingency (6%):</span>
            <span className="font-mono font-bold text-stone-900">₹{estMisc.toLocaleString('en-IN')}</span>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-between items-center font-bold text-sm">
            <span>Estimated Total:</span>
            <span className="font-mono text-stone-900">₹{estTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-xs">
            <span>Target Budget:</span>
            <span className="font-mono text-stone-700">₹{calcBudget.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-xs">
            <span>Remaining Balance:</span>
            <span className={`font-mono ${estRemaining >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
              ₹{estRemaining.toLocaleString('en-IN')} {estRemaining < 0 ? '(Budget Exceeded)' : '(Surplus)'}
            </span>
          </div>
        </div>

        {/* Transparency Notice */}
        <p className="text-[11px] text-stone-500 italic">
          * Note: Baseline estimations calculated using deterministic regional travel averages. Actual live prices depend on selected hotel inventory and dates. Live booking prices are never fabricated.
        </p>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-3 bg-stone-100 hover:bg-stone-200 font-bold rounded-xl text-stone-700 text-xs"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onApplyToTrip}
            className="w-2/3 py-3 bg-bharat-saffron hover:bg-bharat-terracotta text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Convert into Custom Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
