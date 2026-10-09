'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Trash2, 
  DollarSign, 
  PieChart, 
  Compass, 
  Clock, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { api, getAuthToken } from '../../lib/api';
import TripCreateModal from './components/TripCreateModal';
import TripAddItemModal from './components/TripAddItemModal';
import TripBudgetModal from './components/TripBudgetModal';

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New trip form
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('Jaipur');
  const [startDate, setStartDate] = useState('2026-10-25');
  const [endDate, setEndDate] = useState('2026-10-28');
  const [budget, setBudget] = useState(30000);
  const [creating, setCreating] = useState(false);

  // 5. Budget-Based Trip Estimator Calculator State
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [calcDest, setCalcDest] = useState('Mumbai');
  const [calcDays, setCalcDays] = useState(2);
  const [calcTravellers, setCalcTravellers] = useState(2);
  const [calcBudget, setCalcBudget] = useState(5000);
  const [calcStyle, setCalcStyle] = useState<'BUDGET' | 'HERITAGE' | 'FAMILY' | 'LUXURY'>('BUDGET');

  // New item form
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [targetDayId, setTargetDayId] = useState('');
  const [itemTimeSlot, setItemTimeSlot] = useState<'MORNING' | 'AFTERNOON' | 'EVENING'>('MORNING');
  const [itemTitle, setItemTitle] = useState('');
  const [itemPlace, setItemPlace] = useState('');
  const [itemType, setItemType] = useState<'ATTRACTION' | 'HOTEL' | 'RESTAURANT' | 'ACTIVITY' | 'TRANSIT'>('ATTRACTION');
  const [itemCost, setItemCost] = useState(150);

  useEffect(() => {
    async function loadTrips() {
      // 1. Load from offline cache first
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('explorebharat_cached_trips');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setTrips(parsed);
              setSelectedTrip(parsed[0]);
            }
          } catch (e) {
            console.warn('Failed parsing cached trips:', e);
          }
        }
      }

      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMyTrips();
        const tripList = res.data || [];
        setTrips(tripList);
        if (tripList.length > 0) {
          setSelectedTrip(tripList[0]);
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('explorebharat_cached_trips', JSON.stringify(tripList));
        }
      } catch (err) {
        console.error('Trip fetch fallback to cached trips:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.createTrip({
        title,
        destination,
        startDate,
        endDate,
        allocatedBudgetInr: budget
      });
      setTrips([res.data, ...trips]);
      setSelectedTrip(res.data);
      setCreateModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create trip');
    } finally {
      setCreating(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !targetDayId) return;

    try {
      await api.addTripItem(selectedTrip.id, {
        tripDayId: targetDayId,
        timeSlot: itemTimeSlot,
        title: itemTitle,
        type: itemType,
        placeName: itemPlace,
        estimatedCostInr: itemCost
      });

      // Reload trip
      const refreshed = await api.getTrip(selectedTrip.id);
      setSelectedTrip(refreshed.data);
      setAddItemModalOpen(false);
      setItemTitle('');
      setItemPlace('');
    } catch (err: any) {
      alert(err.message || 'Failed to add item');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!selectedTrip) return;
    try {
      await api.removeTripItem(selectedTrip.id, itemId);
      const refreshed = await api.getTrip(selectedTrip.id);
      setSelectedTrip(refreshed.data);
    } catch (err: any) {
      alert(err.message || 'Failed to remove item');
    }
  };

  const token = getAuthToken();
  if (!token) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <Compass className="w-12 h-12 text-bharat-saffron mx-auto" />
        <h2 className="text-2xl font-black text-stone-900">Trip Planner</h2>
        <p className="text-xs text-stone-500">Sign in to create custom Indian travel itineraries and calculate real-time budgets.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-3 bg-bharat-saffron text-white font-bold rounded-2xl shadow-md text-sm"
        >
          Sign In / Demo Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron">Custom Itineraries</span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Trip Planner & Budget Engine</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <Link
            href="/smart-journey"
            className="px-4 py-3 bg-gradient-to-r from-stone-900 to-amber-950 hover:bg-black text-white font-bold text-sm rounded-2xl transition-all flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Smart Journey (Door-to-Door)
          </Link>
          <button
            onClick={() => setBudgetModalOpen(true)}
            className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm rounded-2xl transition-all flex items-center gap-2"
          >
            <PieChart className="w-4 h-4 text-bharat-saffron" /> Budget Estimator
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-5 py-3 bg-bharat-saffron hover:bg-bharat-terracotta text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create New Trip
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-stone-500 font-medium">Loading your trips...</div>
      ) : trips.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-4 max-w-lg mx-auto">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800">No Trips Planned Yet</h3>
          <p className="text-xs text-stone-500">Create your first Indian expedition to organize day-by-day sightseeing and track budget breakdown.</p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-6 py-2.5 bg-bharat-saffron text-white font-bold text-xs rounded-xl"
          >
            Start Planning
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Trip Switcher & Budget Breakdown */}
          <div className="space-y-6">
            
            {/* Trip Tabs */}
            <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block px-2">Your Trips</span>
              {trips.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTrip(t)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${
                    selectedTrip?.id === t.id
                      ? 'bg-orange-50 border border-orange-200 text-bharat-saffron font-bold'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold">{t.title}</h4>
                    <p className="text-xs text-stone-500">{t.destination} • {t.days?.length || 1} Days</p>
                  </div>
                  <Calendar className="w-4 h-4 text-stone-400" />
                </div>
              ))}
            </div>

            {/* Budget Breakdown Chart (Section 31) */}
            {selectedTrip && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-stone-900 flex items-center gap-1.5">
                    <PieChart className="w-4 h-4 text-bharat-saffron" />
                    <span>Deterministic Budget</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Total: ₹{selectedTrip.budgetBreakdown?.totalInr?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center text-stone-600">
                    <span>🏨 Stays & Accommodation</span>
                    <span className="font-bold text-stone-900">₹{selectedTrip.budgetBreakdown?.hotelsInr?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>🎫 Monument Entry Passes</span>
                    <span className="font-bold text-stone-900">₹{selectedTrip.budgetBreakdown?.ticketsInr?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>🍲 Authentic Regional Food</span>
                    <span className="font-bold text-stone-900">₹{selectedTrip.budgetBreakdown?.foodInr?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>🚕 Local Transit & Cabs</span>
                    <span className="font-bold text-stone-900">₹{selectedTrip.budgetBreakdown?.transportInr?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>🧾 GST Taxes & Service</span>
                    <span className="font-bold text-stone-900">₹{selectedTrip.budgetBreakdown?.taxesInr?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-500">Allocated Budget:</span>
                    <span className="font-mono font-bold text-stone-900">₹{selectedTrip.allocatedBudgetInr?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-600">Remaining Budget:</span>
                    <span className="font-mono font-bold text-emerald-600">₹{selectedTrip.budgetBreakdown?.remainingBudgetInr?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Multi-Day Itinerary Schedule */}
          {selectedTrip && (
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-stone-900">{selectedTrip.title}</h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {selectedTrip.destination} • {selectedTrip.startDate} to {selectedTrip.endDate} • {selectedTrip.companions} Travel
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/ai-planner?prompt=${encodeURIComponent(`Optimize my ${selectedTrip.destination} trip`)}`)}
                  className="px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-bharat-saffron font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Optimize
                </button>
              </div>

              {/* Days List */}
              <div className="space-y-6">
                {selectedTrip.days?.map((day: any) => (
                  <div key={day.id} className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 bg-bharat-saffron text-white rounded-lg flex items-center justify-center font-black text-xs">
                          {day.dayNumber}
                        </span>
                        <h3 className="font-bold text-base text-stone-900">{day.title || `Day ${day.dayNumber}`}</h3>
                      </div>
                      <button
                        onClick={() => {
                          setTargetDayId(day.id);
                          setAddItemModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-bold text-stone-700 flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add Place
                      </button>
                    </div>

                    {/* Day Itinerary Items */}
                    <div className="space-y-3">
                      {day.items?.length === 0 ? (
                        <p className="text-xs text-stone-400 italic py-2">No places added for this day yet. Click "Add Place" above.</p>
                      ) : (
                        day.items?.map((item: any) => (
                          <div
                            key={item.id}
                            className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-stone-600 border border-stone-200">
                                {item.timeSlot}
                              </span>
                              <div>
                                <h4 className="font-bold text-xs text-stone-900">{item.title}</h4>
                                <p className="text-[11px] text-stone-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-bharat-saffron" />
                                  <span>{item.placeName} • {item.durationMinutes} min</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-bold text-xs text-stone-900">₹{item.estimatedCostInr}</span>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-stone-400 hover:text-red-600 transition-colors p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      )}

      {/* Create Trip Modal */}
      <TripCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={title}
        setTitle={setTitle}
        destination={destination}
        setDestination={setDestination}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        budget={budget}
        setBudget={setBudget}
        creating={creating}
        onSubmit={handleCreateTrip}
      />

      {/* Add Item Modal */}
      <TripAddItemModal
        isOpen={addItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
        itemTimeSlot={itemTimeSlot}
        setItemTimeSlot={setItemTimeSlot}
        itemTitle={itemTitle}
        setItemTitle={setItemTitle}
        itemPlace={itemPlace}
        setItemPlace={setItemPlace}
        itemCost={itemCost}
        setItemCost={setItemCost}
        onSubmit={handleAddItem}
      />

      {/* Budget Estimator Calculator Modal */}
      <TripBudgetModal
        isOpen={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        calcDest={calcDest}
        setCalcDest={setCalcDest}
        calcDays={calcDays}
        setCalcDays={setCalcDays}
        calcTravellers={calcTravellers}
        setCalcTravellers={setCalcTravellers}
        calcBudget={calcBudget}
        setCalcBudget={setCalcBudget}
        calcStyle={calcStyle}
        setCalcStyle={setCalcStyle}
        onApplyToTrip={() => {
          setTitle(`${calcDays} Days in ${calcDest}`);
          setDestination(calcDest);
          setBudget(calcBudget);
          setBudgetModalOpen(false);
          setCreateModalOpen(true);
        }}
      />

    </div>
  );
}
