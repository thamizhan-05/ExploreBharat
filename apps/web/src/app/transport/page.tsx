'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Train, 
  Plane, 
  Bus, 
  Car, 
  Search, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  Radio,
  RefreshCw,
  Info
} from 'lucide-react';
import { api } from '../../lib/api';

export default function TransportHubPage() {
  const [activeTab, setActiveTab] = useState<'TRAINS' | 'FLIGHTS' | 'BUSES' | 'CABS'>('TRAINS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trains state
  const [trainOrigin, setTrainOrigin] = useState('New Delhi');
  const [trainDest, setTrainDest] = useState('Jaipur');
  const [trainResults, setTrainResults] = useState<any[]>([]);
  const [pnrInput, setPnrInput] = useState('');
  const [pnrResult, setPnrResult] = useState<any | null>(null);
  const [liveTrainNumber, setLiveTrainNumber] = useState('');
  const [liveStatusResult, setLiveStatusResult] = useState<any | null>(null);

  // Flights state
  const [flightOrigin, setFlightOrigin] = useState('DEL');
  const [flightDest, setFlightDest] = useState('JAI');
  const [flightDate, setFlightDate] = useState('2026-11-15');
  const [flightResults, setFlightResults] = useState<any[]>([]);

  // Buses state
  const [busOrigin, setBusOrigin] = useState('Delhi');
  const [busDest, setBusDest] = useState('Jaipur');
  const [busDate, setBusDate] = useState('2026-11-15');
  const [busResults, setBusResults] = useState<any[]>([]);

  // Cabs state
  const [cabOrigin, setCabOrigin] = useState('Jaipur Railway Station');
  const [cabDest, setCabDest] = useState('Amber Fort');
  const [cabQuotes, setCabQuotes] = useState<any[]>([]);

  // Train Search
  const handleTrainSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.searchTrainsPlatform(`from=${encodeURIComponent(trainOrigin)}&to=${encodeURIComponent(trainDest)}`);
      setTrainResults(res.trains || []);
      if (res.trains?.length === 0) {
        setError('No direct train services found for this corridor.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search trains');
    } finally {
      setLoading(false);
    }
  };

  // PNR Search
  const handlePnrCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrInput || pnrInput.length !== 10) {
      setError('Please enter a valid 10-digit Indian Railways PNR number');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await api.checkTrainPnr(pnrInput);
      setPnrResult(res.pnrStatus);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch PNR status');
    } finally {
      setLoading(false);
    }
  };

  // Live Train Status
  const handleLiveStatusCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTrainNumber) {
      setError('Please enter a 5-digit train number (e.g. 20977 or 12015)');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await api.getTrainLiveStatus(liveTrainNumber);
      setLiveStatusResult(res.liveStatus);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch live train running status');
    } finally {
      setLoading(false);
    }
  };

  // Flight Search
  const handleFlightSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.searchFlights(`origin=${encodeURIComponent(flightOrigin)}&destination=${encodeURIComponent(flightDest)}&date=${flightDate}`);
      setFlightResults(res.flights || []);
      if (res.flights?.length === 0) {
        setError('No direct flights found for the selected route/date.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  // Bus Search
  const handleBusSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.searchBuses(`origin=${encodeURIComponent(busOrigin)}&destination=${encodeURIComponent(busDest)}&date=${busDate}`);
      setBusResults(res.buses || []);
      if (res.buses?.length === 0) {
        setError('No scheduled RTC or private buses found for this corridor.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search buses');
    } finally {
      setLoading(false);
    }
  };

  // Cab Search
  const handleCabSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.getTaxiQuotes(`pickup=${encodeURIComponent(cabOrigin)}&drop=${encodeURIComponent(cabDest)}`);
      setCabQuotes(res.quotes || []);
      if (res.quotes?.length === 0) {
        setError('Could not calculate metered cab fares for this route.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to calculate cab quotes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full border border-amber-400/30 mb-3">
                <Train className="w-3.5 h-3.5" />
                <span>Multimodal Transport Platform</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-50">
                India Transport Discovery & Booking
              </h1>
              <p className="text-stone-300 text-sm max-w-2xl mt-1">
                Indian Railways schedules, 10-digit PNR tracker, domestic flights, state RTC bus fleets, and transparent metered taxi rates with zero fabricated data.
              </p>
            </div>

            <Link
              href="/smart-journey"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <span>Door-to-Door Journey Planner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Transport Navigation Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Mode Selector Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-2 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('TRAINS'); setError(null); }}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'TRAINS'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Train className="w-4 h-4" />
            <span>Trains & Live PNR</span>
          </button>

          <button
            onClick={() => { setActiveTab('FLIGHTS'); setError(null); }}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'FLIGHTS'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Flights</span>
          </button>

          <button
            onClick={() => { setActiveTab('BUSES'); setError(null); }}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'BUSES'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>State RTC Buses</span>
          </button>

          <button
            onClick={() => { setActiveTab('CABS'); setError(null); }}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'CABS'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Metered Cabs & Auto</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-2 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: TRAINS & PNR & LIVE RUNNING STATUS */}
        {/* ========================================================================= */}
        {activeTab === 'TRAINS' && (
          <div className="mt-8 space-y-8">
            {/* Search Bar & Secondary Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Train Corridor Search (Left 8 cols) */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Train className="w-4 h-4 text-amber-600" />
                    <span>Search Train Schedules</span>
                  </h2>
                  <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                    IRCTC / NTES Verified Data
                  </span>
                </div>

                <form onSubmit={handleTrainSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-5">
                    <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">From Station / City</label>
                    <input
                      type="text"
                      value={trainOrigin}
                      onChange={(e) => setTrainOrigin(e.target.value)}
                      placeholder="e.g. New Delhi (NDLS)"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">To Station / City</label>
                    <input
                      type="text"
                      value={trainDest}
                      onChange={(e) => setTrainDest(e.target.value)}
                      placeholder="e.g. Jaipur (JP)"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      <span>Find</span>
                    </button>
                  </div>
                </form>

                {/* Train Results */}
                {trainResults.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Available Trains ({trainResults.length})
                    </h3>
                    {trainResults.map((t, idx) => (
                      <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 hover:border-amber-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-xs text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                              #{t.trainNumber}
                            </span>
                            <span className="font-bold text-stone-900 text-sm">{t.trainName}</span>
                            <span className="text-[10px] text-stone-500 font-medium bg-stone-200/60 px-1.5 py-0.5 rounded">
                              Runs: {t.runsOn?.join(', ') || 'Daily'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-stone-600 mt-2">
                            <span><strong className="text-stone-800">{t.departureTime}</strong> ({t.originStation})</span>
                            <span className="text-stone-400">→ {t.duration} →</span>
                            <span><strong className="text-stone-800">{t.arrivalTime}</strong> ({t.destStation})</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            {t.classes?.map((c: any, cIdx: number) => (
                              <span key={cIdx} className="text-[10px] font-mono bg-white border border-stone-200 px-2 py-0.5 rounded text-stone-700">
                                {c.code}: ₹{c.fare}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center">
                          <a
                            href={t.bookingUrl || 'https://www.irctc.co.in'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                          >
                            <span>Book IRCTC</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Utility Tools (Right 4 cols): PNR Tracker & Live Status */}
              <div className="lg:col-span-4 space-y-6">
                {/* 10-Digit PNR Tracker */}
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Live 10-Digit PNR Tracker</span>
                  </h3>
                  <form onSubmit={handlePnrCheck} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      maxLength={10}
                      value={pnrInput}
                      onChange={(e) => setPnrInput(e.target.value)}
                      placeholder="Enter 10-digit PNR"
                      className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-3.5 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl"
                    >
                      Check
                    </button>
                  </form>

                  {pnrResult && (
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1 font-mono">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Train:</span>
                        <span className="font-bold text-stone-800">{pnrResult.trainNumber} {pnrResult.trainName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Date:</span>
                        <span>{pnrResult.doj}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Status:</span>
                        <span className="text-emerald-700 font-bold">{pnrResult.passengers?.[0]?.bookingStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Charting:</span>
                        <span className="text-stone-700">{pnrResult.chartPrepared ? 'Chart Prepared' : 'Chart Not Prepared'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* NTES Live Running Status */}
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-blue-600" />
                    <span>Live Running Status (NTES)</span>
                  </h3>
                  <form onSubmit={handleLiveStatusCheck} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={liveTrainNumber}
                      onChange={(e) => setLiveTrainNumber(e.target.value)}
                      placeholder="Train # (e.g. 20977)"
                      className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-3.5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                    >
                      Status
                    </button>
                  </form>

                  {liveStatusResult && (
                    <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-blue-900">
                        <span>{liveStatusResult.trainName}</span>
                        <span className="text-emerald-700 text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded font-mono">
                          {liveStatusResult.status}
                        </span>
                      </div>
                      <p className="text-stone-600 text-[11px]">
                        Last Passed: <strong className="text-stone-800">{liveStatusResult.currentStation}</strong>
                      </p>
                      <p className="text-[10px] text-stone-400">
                        Updated {liveStatusResult.updatedAt}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FLIGHTS */}
        {/* ========================================================================= */}
        {activeTab === 'FLIGHTS' && (
          <div className="mt-8 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Plane className="w-4 h-4 text-amber-600" />
                <span>Domestic Flights Search</span>
              </h2>
              <span className="text-xs text-stone-500">IATA Airport Corridors</span>
            </div>

            <form onSubmit={handleFlightSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Origin Airport Code</label>
                <input
                  type="text"
                  value={flightOrigin}
                  onChange={(e) => setFlightOrigin(e.target.value.toUpperCase())}
                  placeholder="e.g. DEL, BOM, BLR"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Destination Airport Code</label>
                <input
                  type="text"
                  value={flightDest}
                  onChange={(e) => setFlightDest(e.target.value.toUpperCase())}
                  placeholder="e.g. JAI, GOI, MAA"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Departure Date</label>
                <input
                  type="date"
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>Search Flights</span>
                </button>
              </div>
            </form>

            {/* Flight Results */}
            {flightResults.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Available Scheduled Flights ({flightResults.length})
                </h3>
                {flightResults.map((f, idx) => (
                  <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 hover:border-amber-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-stone-900 text-sm">{f.airline}</span>
                        <span className="font-mono text-xs text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded">
                          {f.flightNumber}
                        </span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                          {f.stops === 0 ? 'Non-Stop' : `${f.stops} Stop`}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-stone-600 mt-2">
                        <span><strong>{f.departureTime}</strong> ({f.originAirport})</span>
                        <span className="text-stone-400">→ {f.duration} →</span>
                        <span><strong>{f.arrivalTime}</strong> ({f.destAirport})</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-2">
                        <span>Baggage: {f.baggage || '15 kg Cabin+Checkin'}</span>
                        <span>•</span>
                        <span>Refundable: {f.isRefundable ? 'Yes' : 'Subject to airline policy'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block uppercase font-medium">All-Inclusive Fare</span>
                        <span className="font-mono font-bold text-base text-stone-900">₹{f.fare.toLocaleString('en-IN')}</span>
                      </div>
                      <a
                        href={f.bookingUrl || 'https://www.makemytrip.com/flights/'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <span>Book Flight</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: STATE RTC & PRIVATE BUSES */}
        {/* ========================================================================= */}
        {activeTab === 'BUSES' && (
          <div className="mt-8 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Bus className="w-4 h-4 text-amber-600" />
                <span>Interstate Bus Services</span>
              </h2>
              <span className="text-xs text-stone-500">Government RTCs & Private Fleet</span>
            </div>

            <form onSubmit={handleBusSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Origin City</label>
                <input
                  type="text"
                  value={busOrigin}
                  onChange={(e) => setBusOrigin(e.target.value)}
                  placeholder="e.g. Delhi, Jaipur, Agra"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Destination City</label>
                <input
                  type="text"
                  value={busDest}
                  onChange={(e) => setBusDest(e.target.value)}
                  placeholder="e.g. Jaipur, Udaipur, Manali"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Travel Date</label>
                <input
                  type="date"
                  value={busDate}
                  onChange={(e) => setBusDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>Search Buses</span>
                </button>
              </div>
            </form>

            {/* Bus Results */}
            {busResults.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Available Buses ({busResults.length})
                </h3>
                {busResults.map((b, idx) => (
                  <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 hover:border-amber-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-stone-900 text-sm">{b.operatorName}</span>
                        <span className="text-[10px] font-mono bg-stone-200/70 text-stone-700 px-2 py-0.5 rounded">
                          {b.busType}
                        </span>
                        <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-semibold">
                          {b.isGovt ? 'State RTC' : 'Private Carrier'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-stone-600 mt-2">
                        <span><strong>{b.departureTime}</strong> ({b.boardingPoint || b.originBoardingPoint})</span>
                        <span className="text-stone-400">→ {b.duration} →</span>
                        <span><strong>{b.arrivalTime}</strong> ({b.dropPoint || b.destDropPoint})</span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Seats Left: {b.availableSeats || 'Available on booking portal'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block uppercase font-medium">Standard Fare</span>
                        <span className="font-mono font-bold text-base text-stone-900">₹{b.fare}</span>
                      </div>
                      <a
                        href={b.bookingUrl || 'https://www.redbus.in'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <span>Book Bus</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: METERED CABS & AUTO */}
        {/* ========================================================================= */}
        {activeTab === 'CABS' && (
          <div className="mt-8 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Car className="w-4 h-4 text-amber-600" />
                  <span>Transparent Metered Taxi & Auto Rates</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Official RTO non-surge transparent estimations with night buffer and luggage allowance.
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full">
                <Info className="w-3 h-3" />
                <span>NO SURGE PRICING</span>
              </div>
            </div>

            <form onSubmit={handleCabSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Pickup Location</label>
                <input
                  type="text"
                  value={cabOrigin}
                  onChange={(e) => setCabOrigin(e.target.value)}
                  placeholder="e.g. Jaipur Railway Station"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="sm:col-span-5">
                <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Drop Location</label>
                <input
                  type="text"
                  value={cabDest}
                  onChange={(e) => setCabDest(e.target.value)}
                  placeholder="e.g. Amber Fort or Jal Mahal"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>Calculate</span>
                </button>
              </div>
            </form>

            {/* Cab Rates Grid */}
            {cabQuotes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-stone-100">
                {cabQuotes.map((q, idx) => (
                  <div key={idx} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-amber-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-stone-900">{q.vehicleType}</span>
                        <span className="text-[10px] font-mono text-stone-500">{q.capacity}</span>
                      </div>
                      <p className="text-2xl font-mono font-bold text-amber-700 mb-1">₹{q.estimatedFare}</p>
                      <span className="text-[10px] font-mono bg-amber-100/70 text-amber-900 px-1.5 py-0.5 rounded">
                        ESTIMATED — {q.distanceKm} km ({q.durationMins}m)
                      </span>
                      <div className="space-y-1 text-[11px] text-stone-500 mt-4 pt-3 border-t border-stone-200">
                        <div className="flex justify-between">
                          <span>Base Fare:</span>
                          <span>₹{q.breakdown?.baseFare || 50}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rate per km:</span>
                          <span>₹{q.breakdown?.perKmRate || 14}/km</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Waiting / Toll:</span>
                          <span>Standard RTO</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-stone-400 mt-4 italic">
                      *Prepaid counter or app-based booking recommended.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
