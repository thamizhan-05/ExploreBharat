'use client';

import React from 'react';
import { 
  Sliders, 
  MapPin, 
  LocateFixed, 
  RefreshCw, 
  Navigation, 
  Info 
} from 'lucide-react';

interface PresetOrigin {
  label: string;
  city: string;
  lat: number;
  lng: number;
}

interface JourneyParametersFormProps {
  origin: string;
  setOrigin: (val: string) => void;
  setOriginLat: (val: number | null) => void;
  setOriginLng: (val: number | null) => void;
  destination: string;
  setDestination: (val: string) => void;
  travelDate: string;
  setTravelDate: (val: string) => void;
  returnDate: string;
  setReturnDate: (val: string) => void;
  travellers: number;
  setTravellers: (val: number) => void;
  travellerType: string;
  setTravellerType: (val: string) => void;
  budget: number;
  setBudget: (val: number) => void;
  travelPreference: string;
  setTravelPreference: (val: string) => void;
  walkingPreference: string;
  setWalkingPreference: (val: string) => void;
  hotelPreference: string;
  setHotelPreference: (val: string) => void;
  maxTransfers: number;
  setMaxTransfers: (val: number) => void;
  geoLocating: boolean;
  geoStatus: string | null;
  onGetCurrentLocation: () => void;
  planning: boolean;
  onExecutePlan: () => void;
  presetOrigins: PresetOrigin[];
  presetDestinations: string[];
}

export default function JourneyParametersForm({
  origin,
  setOrigin,
  setOriginLat,
  setOriginLng,
  destination,
  setDestination,
  travelDate,
  setTravelDate,
  returnDate,
  setReturnDate,
  travellers,
  setTravellers,
  travellerType,
  setTravellerType,
  budget,
  setBudget,
  travelPreference,
  setTravelPreference,
  walkingPreference,
  setWalkingPreference,
  hotelPreference,
  setHotelPreference,
  maxTransfers,
  setMaxTransfers,
  geoLocating,
  geoStatus,
  onGetCurrentLocation,
  planning,
  onExecutePlan,
  presetOrigins,
  presetDestinations,
}: JourneyParametersFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-bharat-saffron" />
            Journey Parameters
          </h2>
          <span className="text-xs text-stone-400">Step-by-step</span>
        </div>

        {/* 1. Origin Location */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              Origin Location (Start Point)
            </label>
            <button
              type="button"
              onClick={onGetCurrentLocation}
              disabled={geoLocating}
              className="text-[11px] font-semibold text-bharat-saffron hover:text-orange-700 flex items-center gap-1"
            >
              <LocateFixed className="w-3 h-3" />
              {geoLocating ? 'Detecting...' : 'Use Current GPS'}
            </button>
          </div>
          <input
            type="text"
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
              setOriginLat(null);
              setOriginLng(null);
            }}
            placeholder="e.g. Connaught Place, New Delhi"
            className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-bharat-saffron focus:border-transparent transition-all font-medium text-stone-900"
          />
          {geoStatus && (
            <p className="mt-1 text-[11px] text-stone-500 italic">{geoStatus}</p>
          )}

          {/* Preset origins */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {presetOrigins.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setOrigin(preset.label);
                  setOriginLat(preset.lat);
                  setOriginLng(preset.lng);
                }}
                className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                  origin === preset.label
                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {preset.city}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Destination */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Destination City
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {presetDestinations.slice(0, 6).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setDestination(city)}
                className={`py-2 text-xs rounded-xl font-semibold border transition-all ${
                  destination.toLowerCase() === city.toLowerCase()
                    ? 'bg-orange-500 border-orange-600 text-white shadow-sm'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Travel Date
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Return Date
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800"
            />
          </div>
        </div>

        {/* 4. Travellers & Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Travellers
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={travellers}
              onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Traveller Group
            </label>
            <select
              value={travellerType}
              onChange={(e) => setTravellerType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800"
            >
              <option value="solo">Solo</option>
              <option value="couple">Couple</option>
              <option value="family">Family</option>
              <option value="senior_citizens">Senior Citizens</option>
              <option value="children">With Children</option>
            </select>
          </div>
        </div>

        {/* 5. Transit Priority Preference */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Transportation Priority
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'balanced', label: 'Balanced' },
              { id: 'fastest', label: 'Fastest' },
              { id: 'cheapest', label: 'Cheapest' },
              { id: 'train_preferred', label: 'Train First' },
              { id: 'flight_preferred', label: 'Flight First' },
              { id: 'bus_preferred', label: 'Bus First' }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setTravelPreference(p.id)}
                className={`py-1.5 px-2 text-[11px] rounded-lg border font-semibold transition-all ${
                  travelPreference === p.id
                    ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Walking & Transfers */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100">
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">
              Walking Tolerance
            </label>
            <select
              value={walkingPreference}
              onChange={(e) => setWalkingPreference(e.target.value)}
              className="w-full px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
            >
              <option value="minimal">Minimal (&lt; 500m)</option>
              <option value="moderate">Moderate (&lt; 1.5km)</option>
              <option value="active">Active Walk (&gt; 2km)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">
              Max Transfers
            </label>
            <select
              value={maxTransfers}
              onChange={(e) => setMaxTransfers(parseInt(e.target.value))}
              className="w-full px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
            >
              <option value={1}>1 Transfer</option>
              <option value={2}>2 Transfers</option>
              <option value={3}>3+ Transfers</option>
            </select>
          </div>
        </div>

        {/* 7. Hotel Preference & Total Budget */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">
              Lodging Style
            </label>
            <select
              value={hotelPreference}
              onChange={(e) => setHotelPreference(e.target.value)}
              className="w-full px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
            >
              <option value="budget">Budget Comfort</option>
              <option value="heritage">Heritage Haveli</option>
              <option value="boutique">Boutique &amp; Arts</option>
              <option value="luxury">Luxury Palace</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">
              Target Budget (₹)
            </label>
            <input
              type="number"
              step={1000}
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value) || 10000)}
              className="w-full px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-bold text-stone-800"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onExecutePlan}
          disabled={planning}
          className="w-full py-3 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
        >
          {planning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              Finding Verified Services...
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 text-amber-400" />
              Generate Door-to-Door Plan
            </>
          )}
        </button>
      </div>

      {/* Caveat & Accuracy Card */}
      <div className="bg-amber-50/70 rounded-2xl border border-amber-200/70 p-5 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <Info className="w-4 h-4 text-amber-700" />
          Transparency &amp; Buffer Rules
        </div>
        <ul className="list-disc pl-4 space-y-1 text-stone-700 text-[11px] leading-relaxed">
          <li>
            <strong>Train &amp; Flight Times:</strong> Sourced from authentic operational schedules (GTFS / official registries). Never generated by AI.
          </li>
          <li>
            <strong>Road Transit (Auto/Cab):</strong> Metered tariffs calculated via state rules (₹30 base + ₹14/km auto; ₹70 base + ₹18/km taxi) and clearly marked as <em>ESTIMATED</em>.
          </li>
          <li>
            <strong>Safety Buffer:</strong> 30-min buffer at railway stations, 90-min buffer at domestic airport terminals.
          </li>
          <li>
            <strong>Connection Validation:</strong> Transfers under 20 minutes are flagged as risk alerts.
          </li>
        </ul>
      </div>
    </div>
  );
}
