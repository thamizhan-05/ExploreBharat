'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  PieChart, 
  ShieldCheck, 
  CheckCircle2, 
  Hotel as HotelIcon,
  Ticket
} from 'lucide-react';
import { api } from '../../lib/api';
import Logo from '../../components/Logo';

function AiPlannerContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '4 days in Rajasthan with family under ₹30,000 for forts & culture';
  const initialDest = searchParams.get('destination') || '';

  const [prompt, setPrompt] = useState(initialPrompt);
  const [daysCount, setDaysCount] = useState(4);
  const [budgetInr, setBudgetInr] = useState(28000);
  const [companions, setCompanions] = useState('FAMILY');
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState<any | null>(null);

  useEffect(() => {
    if (initialDest) {
      setPrompt(`4 days in ${initialDest} with family under ₹25,000 for top sights`);
    }
  }, [initialDest]);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.generateAiPlan({
        prompt,
        daysCount,
        budgetInr,
        travelCompanions: companions
      });
      setPlanResult(res.data);
    } catch (err: any) {
      alert(err.message || 'Failed to synthesize AI itinerary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Logo variant="compact" size="lg" className="justify-center mx-auto" />
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#F58220] rounded-full text-xs font-bold border border-orange-200/60">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LLM Natural Language + Deterministic Database Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#132238] tracking-tight">
          ExploreBharat AI Trip Planner
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Specify your vision in natural language. ExploreBharat connects to verified tourist attractions and live accommodation catalogs to compute an accurate schedule and budget.
        </p>
      </div>

      {/* Input Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xl max-w-4xl mx-auto">
        <form onSubmit={handleGeneratePlan} className="space-y-6">
          <div>
            <label className="font-bold text-xs uppercase tracking-wider text-stone-700 block mb-2">
              Describe Your Indian Journey
            </label>
            <textarea
              rows={3}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 5 days in Kerala starting from Kochi with family under ₹25,000 for houseboats, spice plantations, and beaches"
              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-bharat-saffron focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div>
              <label className="text-stone-600 block mb-1">Duration (Days)</label>
              <select
                value={daysCount}
                onChange={(e) => setDaysCount(parseInt(e.target.value, 10))}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl"
              >
                <option value="2">2 Days (Weekend Getaway)</option>
                <option value="3">3 Days (Long Weekend)</option>
                <option value="4">4 Days (Signature Tour)</option>
                <option value="5">5 Days (Immersive)</option>
                <option value="7">7 Days (Full Circuit)</option>
              </select>
            </div>

            <div>
              <label className="text-stone-600 block mb-1">Companions</label>
              <select
                value={companions}
                onChange={(e) => setCompanions(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl"
              >
                <option value="FAMILY">Family (All Ages)</option>
                <option value="COUPLE">Couple (Romantic)</option>
                <option value="SOLO">Solo Explorer</option>
                <option value="FRIENDS">Group of Friends</option>
              </select>
            </div>

            <div>
              <label className="text-stone-600 block mb-1">Max Budget (₹)</label>
              <input
                type="number"
                value={budgetInr}
                onChange={(e) => setBudgetInr(parseFloat(e.target.value))}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-bharat-saffron hover:bg-bharat-terracotta disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Synthesizing Itinerary with Live Database...' : 'Generate Optimized Travel Plan'}
          </button>
        </form>
      </div>

      {/* Plan Output */}
      {planResult && (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
          
          {/* Summary Box */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-bharat-saffron">AI Synthesized</span>
                <h2 className="text-2xl font-black text-stone-900">{planResult.destination}</h2>
              </div>
              <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full">
                Best Season: {planResult.bestTimeToVisit}
              </span>
            </div>
            <p className="text-sm text-stone-700 leading-relaxed font-medium">
              {planResult.summary}
            </p>
          </div>

          {/* Budget Breakdown Summary */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-stone-50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Hotels & Stays</span>
              <span className="text-base font-black text-stone-900">₹{planResult.budgetBreakdown?.hotelsInr?.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Monument Passes</span>
              <span className="text-base font-black text-stone-900">₹{planResult.budgetBreakdown?.ticketsInr?.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Food & Dining</span>
              <span className="text-base font-black text-stone-900">₹{planResult.budgetBreakdown?.foodInr?.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100">
              <span className="text-[10px] uppercase font-bold text-bharat-saffron block">Total Estimated</span>
              <span className="text-base font-black text-bharat-saffron">₹{planResult.budgetBreakdown?.totalInr?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Daily Schedule */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-stone-900 tracking-tight">Day-by-Day Schedule</h3>
            {planResult.days?.map((day: any) => (
              <div key={day.dayNumber} className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
                  <span className="w-8 h-8 rounded-xl bg-bharat-saffron text-white flex items-center justify-center font-black text-sm">
                    {day.dayNumber}
                  </span>
                  <div>
                    <h4 className="font-bold text-base text-stone-900">Day {day.dayNumber}</h4>
                    <p className="text-xs text-stone-500">{day.theme}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Morning */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px] uppercase">
                      🌅 Morning ({day.morning.duration})
                    </span>
                    <h5 className="font-bold text-sm text-stone-900">{day.morning.place}</h5>
                    <p className="text-stone-600 leading-relaxed">{day.morning.activity}</p>
                    <span className="font-bold text-stone-800 block pt-1">Est. Cost: ₹{day.morning.costInr}</span>
                  </div>

                  {/* Afternoon */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-2">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded font-bold text-[10px] uppercase">
                      ☀️ Afternoon ({day.afternoon.duration})
                    </span>
                    <h5 className="font-bold text-sm text-stone-900">{day.afternoon.place}</h5>
                    <p className="text-stone-600 leading-relaxed">{day.afternoon.activity}</p>
                    <span className="font-bold text-stone-800 block pt-1">Est. Cost: ₹{day.afternoon.costInr}</span>
                  </div>

                  {/* Evening */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-2">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold text-[10px] uppercase">
                      🌙 Evening ({day.evening.duration})
                    </span>
                    <h5 className="font-bold text-sm text-stone-900">{day.evening.place}</h5>
                    <p className="text-stone-600 leading-relaxed">{day.evening.activity}</p>
                    <span className="font-bold text-stone-800 block pt-1">Est. Cost: ₹{day.evening.costInr}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Optimization Tips */}
          {planResult.optimizationTips?.length > 0 && (
            <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200/60 space-y-3">
              <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>AI Travel Optimization Insights</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-800 list-disc list-inside">
                {planResult.optimizationTips.map((tip: string, i: number) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default function AiPlannerPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-stone-500">Loading AI Planner...</div>}>
      <AiPlannerContent />
    </Suspense>
  );
}
