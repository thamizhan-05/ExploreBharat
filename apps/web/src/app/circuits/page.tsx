'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Calendar, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';
import CircuitCard from '../../components/CircuitCard';

export default function CircuitsPage() {
  const [circuits, setCircuits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState('ALL');

  useEffect(() => {
    async function loadCircuits() {
      try {
        const res = await api.getCircuits();
        setCircuits(res.data || []);
      } catch (err) {
        console.error('Failed to load circuits:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCircuits();
  }, []);

  const filteredCircuits = circuits.filter((c) => {
    if (selectedDuration === 'SHORT') return c.recommendedDays <= 5;
    if (selectedDuration === 'MEDIUM') return c.recommendedDays > 5 && c.recommendedDays <= 8;
    if (selectedDuration === 'LONG') return c.recommendedDays > 8;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#F58220] rounded-full text-xs font-bold border border-orange-200/60">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated Multi-City Expeditions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#132238] tracking-tight">
          Iconic Indian Tourism Circuits
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Pre-planned travel routes connecting India&apos;s most celebrated cultural monuments, spiritual corridors, and scenic wonders with optimized travel times and verified budgets.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { key: 'ALL', label: 'All Circuits' },
          { key: 'SHORT', label: 'Short Expeditions (1–5 Days)' },
          { key: 'MEDIUM', label: 'Classic Journeys (6–8 Days)' },
          { key: 'LONG', label: 'Grand Tours (9+ Days)' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setSelectedDuration(f.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedDuration === f.key
                ? 'bg-[#132238] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Circuits Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-medium">Loading circuits...</div>
      ) : filteredCircuits.length === 0 ? (
        <div className="py-16 text-center text-slate-500">No circuits found for the selected duration.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCircuits.map((circuit) => (
            <CircuitCard key={circuit.id} circuit={circuit} />
          ))}
        </div>
      )}

      {/* Bottom CTA to AI Planner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#132238] to-[#1E3557] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F58220]">
            <Sparkles className="w-4 h-4" /> Custom Itineraries
          </div>
          <h3 className="text-2xl font-black">Want to customize any circuit?</h3>
          <p className="text-xs text-slate-300 max-w-md">
            Our AI Trip Planner can adapt any circuit based on your budget, travel dates, starting city, and companion preferences.
          </p>
        </div>
        <Link
          href="/ai-planner"
          className="px-6 py-3 bg-[#F58220] hover:bg-[#DC6E10] text-white font-bold text-xs rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-2"
        >
          <span>Open AI Trip Planner</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
