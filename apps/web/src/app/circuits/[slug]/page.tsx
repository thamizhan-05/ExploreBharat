'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Compass, 
  Calendar, 
  MapPin, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  IndianRupee,
  ArrowRight
} from 'lucide-react';
import { api } from '../../../lib/api';

export default function CircuitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [circuit, setCircuit] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCircuit() {
      try {
        const res = await api.getCircuit(slug);
        setCircuit(res.data);
      } catch (err) {
        console.error('Failed to load circuit detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCircuit();
  }, [slug]);

  if (loading) {
    return <div className="py-24 text-center text-slate-500 font-medium">Loading circuit itinerary...</div>;
  }

  if (!circuit) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-2xl font-black text-[#132238]">Circuit Not Found</h2>
        <p className="text-xs text-slate-500">The requested circuit expedition could not be located.</p>
        <Link href="/circuits" className="inline-block px-5 py-2.5 bg-[#132238] text-white font-bold rounded-xl text-xs">
          Browse All Circuits
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Banner */}
      <div className="relative bg-[#0A1320] text-white min-h-[420px] flex items-end">
        <div className="absolute inset-0 z-0">
          <img
            src={circuit.coverImageUrl || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2000&q=85'}
            alt={circuit.title}
            className="w-full h-full object-cover filter brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1320] via-[#132238]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-4">
          <Link
            href="/circuits"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white mb-2 transition-colors bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to All Circuits
          </Link>

          <span className="text-xs font-bold uppercase tracking-widest text-[#F58220] block">
            {circuit.subtitle || 'Iconic Expedition Corridor'}
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {circuit.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
              <Calendar className="w-4 h-4 text-[#F58220]" />
              <span>{circuit.recommendedDays} Days Recommended</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
              <span>₹{circuit.estimatedCostInr?.toLocaleString('en-IN')} / person (est.)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Description & Highlights */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-[#132238]">Circuit Overview</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {circuit.description}
            </p>
          </div>

          {/* Destinations / Corridor stops */}
          {circuit.destinations && circuit.destinations.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-[#132238] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F58220]" /> Corridor Stops & Cities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {circuit.destinations.map((dest: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="w-7 h-7 rounded-full bg-[#132238] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-bold text-sm text-[#132238]">{dest}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Highlights */}
          {circuit.highlights && circuit.highlights.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-[#132238]">Key Highlights & Experiences</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {circuit.highlights.map((hl: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-xs text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-[#F58220] shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Planning Action Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl space-y-6 sticky top-28">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Duration</span>
              <p className="text-2xl font-black text-[#132238]">{circuit.recommendedDays} Days / {circuit.recommendedDays - 1} Nights</p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Estimated Cost:</span>
                <span className="font-bold text-slate-900">₹{circuit.estimatedCostInr?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Starting Point:</span>
                <span className="font-bold text-slate-900">{circuit.destinations?.[0] || 'Delhi'}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Route Type:</span>
                <span className="font-bold text-slate-900">Multi-City Heritage</span>
              </div>
            </div>

            <button
              onClick={() => router.push(`/ai-planner?prompt=${encodeURIComponent(`Plan a ${circuit.recommendedDays} days trip for ${circuit.title} with stops at ${circuit.destinations?.join(', ')} under ₹${circuit.estimatedCostInr * 2}`)}`)}
              className="w-full py-3.5 bg-[#F58220] hover:bg-[#DC6E10] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 text-xs transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan with AI Trip Planner</span>
            </button>

            <Link
              href="/attractions"
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-[#132238] font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 text-center"
            >
              <Compass className="w-4 h-4 text-[#F58220]" />
              <span>Explore Included Attractions</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
