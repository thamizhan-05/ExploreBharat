'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  Hotel, 
  Train, 
  Compass, 
  Check, 
  X, 
  Star, 
  MapPin, 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { api } from '../../lib/api';

export default function SmartComparisonPage() {
  const [activeTab, setActiveTab] = useState<'HOTELS' | 'TRANSPORT' | 'ATTRACTIONS'>('HOTELS');
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const res = await api.getHotels('?limit=4');
      setHotels(res.data?.hotels || res.hotels || []);
    } catch (err: any) {
      console.warn('Fallback comparison data');
    } finally {
      setLoading(false);
    }
  };

  const sampleTransportOptions = [
    {
      id: 'opt-vb',
      mode: 'TRAIN',
      name: 'Vande Bharat Express (#20977)',
      speed: 'FASTEST (Rail)',
      duration: '3h 35m',
      cost: 1250,
      comfort: 'Executive Class / Ergonomic',
      transfers: 0,
      departure: '06:10 AM (NDLS)',
      arrival: '09:45 AM (JP)',
      punctuality: '96% On-time',
      mealsIncluded: true,
      bestFor: 'Business & Heritage Travellers'
    },
    {
      id: 'opt-shatabdi',
      mode: 'TRAIN',
      name: 'Ajmer Shatabdi (#12015)',
      speed: 'FAST',
      duration: '4h 40m',
      cost: 980,
      comfort: 'AC Chair Car',
      transfers: 0,
      departure: '06:10 AM (NDLS)',
      arrival: '10:50 AM (JP)',
      punctuality: '91% On-time',
      mealsIncluded: true,
      bestFor: 'Couples & Family'
    },
    {
      id: 'opt-flight',
      mode: 'FLIGHT',
      name: 'Air India / IndiGo Non-stop',
      speed: 'FASTEST AIR (55m flight + airport checkin)',
      duration: '3h 10m (Door-to-door with security)',
      cost: 3850,
      comfort: 'Economy Jet',
      transfers: 0,
      departure: '08:20 AM (DEL T3)',
      arrival: '09:15 AM (JAI)',
      punctuality: '88% On-time',
      mealsIncluded: false,
      bestFor: 'Time-critical Solo Travellers'
    },
    {
      id: 'opt-bus',
      mode: 'BUS',
      name: 'RSRTC Goldline Scania Multi-Axle',
      speed: 'ECONOMICAL',
      duration: '5h 30m',
      cost: 450,
      comfort: 'Semi-Sleeper AC',
      transfers: 0,
      departure: '07:00 AM (ISBT Kashmiri Gate)',
      arrival: '12:30 PM (Sindhi Camp)',
      punctuality: '82% (Traffic dependent)',
      mealsIncluded: false,
      bestFor: 'Budget Explorers & Students'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full border border-amber-400/30 mb-3">
                <Scale className="w-3.5 h-3.5" />
                <span>Decision Intelligence Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-50">
                Smart Side-by-Side Comparison
              </h1>
              <p className="text-stone-300 text-sm max-w-2xl mt-1">
                Transparently evaluate tariffs, distance to monuments, transfer comfort, cancellation guarantees, and genuine user value.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Tab Selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-2 flex items-center gap-2 overflow-x-auto mb-8">
          <button
            onClick={() => setActiveTab('HOTELS')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'HOTELS'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Hotel className="w-4 h-4" />
            <span>Compare Hotels</span>
          </button>

          <button
            onClick={() => setActiveTab('TRANSPORT')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'TRANSPORT'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Train className="w-4 h-4" />
            <span>Compare Transport Corridors</span>
          </button>
        </div>

        {/* COMPARISON 1: HOTELS */}
        {activeTab === 'HOTELS' && (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 overflow-x-auto">
            <h2 className="text-lg font-bold text-stone-900 mb-6 flex items-center gap-2">
              <Hotel className="w-5 h-5 text-amber-600" />
              <span>Jaipur Heritage vs Luxury Stay Comparison</span>
            </h2>

            <div className="min-w-[700px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 uppercase">
                    <th className="py-4 px-3 w-48">Feature / Metric</th>
                    <th className="py-4 px-3 font-bold text-stone-900 bg-amber-50/50 rounded-t-xl">
                      ITC Rajputana, Luxury Collection
                    </th>
                    <th className="py-4 px-3 font-bold text-stone-900">
                      Samode Haveli Heritage
                    </th>
                    <th className="py-4 px-3 font-bold text-stone-900">
                      Pearl Palace Heritage Boutique
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  <tr>
                    <td className="py-3 px-3 font-bold text-stone-500">Nightly Tariff</td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-700 bg-amber-50/30">₹6,500 / night</td>
                    <td className="py-3 px-3 font-mono font-bold text-stone-800">₹9,800 / night</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">₹2,800 / night</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-stone-500">Verified Rating</td>
                    <td className="py-3 px-3 bg-amber-50/30 font-bold">⭐ 4.8 / 5.0 (2,100+ verified)</td>
                    <td className="py-3 px-3 font-bold">⭐ 4.9 / 5.0 (890+ verified)</td>
                    <td className="py-3 px-3 font-bold">⭐ 4.6 / 5.0 (1,450+ verified)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-stone-500">Distance to Amber Fort</td>
                    <td className="py-3 px-3 bg-amber-50/30">11.4 km (26 min by cab)</td>
                    <td className="py-3 px-3">9.2 km (20 min by cab)</td>
                    <td className="py-3 px-3">13.1 km (30 min by cab)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-stone-500">Complimentary Breakfast</td>
                    <td className="py-3 px-3 bg-amber-50/30 text-emerald-700 font-bold">✓ Included (Royal Buffet)</td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">✓ Included (Courtyard Dining)</td>
                    <td className="py-3 px-3 text-stone-500">Optional (+ ₹350)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-stone-500">Swimming Pool & Spa</td>
                    <td className="py-3 px-3 bg-amber-50/30 text-emerald-700 font-bold">✓ Kaya Kalp Spa & Royal Pool</td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">✓ Heritage Marble Pool</td>
                    <td className="py-3 px-3 text-stone-400">✗ No pool (Rooftop cafe only)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-stone-500">Station / Airport Pickup</td>
                    <td className="py-3 px-3 bg-amber-50/30">✓ Included from Railway Station</td>
                    <td className="py-3 px-3">Available on request (₹800)</td>
                    <td className="py-3 px-3">Available on request (₹300)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-stone-500">Free Cancellation</td>
                    <td className="py-3 px-3 bg-amber-50/30 text-emerald-700 font-semibold">Until 48h prior</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">Until 72h prior</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">Until 24h prior</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-stone-500">Action</td>
                    <td className="py-3 px-3 bg-amber-50/30">
                      <Link href="/hotels" className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg block text-center">
                        Select Room
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <Link href="/hotels" className="px-3 py-1.5 bg-stone-900 text-white font-bold rounded-lg block text-center">
                        Select Room
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <Link href="/hotels" className="px-3 py-1.5 bg-stone-900 text-white font-bold rounded-lg block text-center">
                        Select Room
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMPARISON 2: TRANSPORT */}
        {activeTab === 'TRANSPORT' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleTransportOptions.map(opt => (
              <div
                key={opt.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-amber-400 shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      {opt.speed}
                    </span>
                    <span className="font-mono font-bold text-xs text-stone-500">{opt.mode}</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-stone-900 mb-2">{opt.name}</h3>

                  <div className="space-y-2 py-4 border-y border-stone-100 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Duration:</span>
                      <span className="font-bold text-stone-800">{opt.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">One-way Fare:</span>
                      <span className="font-mono font-bold text-amber-700 text-sm">₹{opt.cost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Schedule:</span>
                      <span className="text-stone-700 font-medium">{opt.departure} → {opt.arrival}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Comfort:</span>
                      <span className="text-stone-700 font-medium">{opt.comfort}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Reliability:</span>
                      <span className="text-emerald-700 font-bold">{opt.punctuality}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 mt-3">
                    <strong>Best Fit:</strong> {opt.bestFor}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100">
                  <Link
                    href="/transport"
                    className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Check Live Timetable</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
