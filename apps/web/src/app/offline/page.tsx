'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  WifiOff, 
  Wallet, 
  Compass, 
  PhoneCall, 
  ShieldAlert, 
  RefreshCw, 
  MapPin, 
  CheckCircle2, 
  Train, 
  LifeBuoy 
} from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCheckConnection = () => {
    setChecking(true);
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.reload();
      } else {
        setChecking(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Offline Hero Card */}
        <div className="bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-amber-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline Travel Companion Active</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-50">
                You're Currently Offline
              </h1>
              <p className="text-stone-300 text-sm max-w-xl leading-relaxed">
                No internet connection detected. ExploreBharat automatically stores your confirmed passes, hotel vouchers, and trip plans in your device's local offline cache so you never get stranded during your journeys.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <button
                onClick={handleCheckConnection}
                disabled={checking}
                className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
                <span>{checking ? 'Checking...' : 'Check Connection'}</span>
              </button>
              {isOnline && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Internet Restored! Click to reload</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Offline Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Digital Wallet Card */}
          <Link
            href="/wallet"
            className="group block bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:border-amber-400 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                  Digital Travel Wallet
                </h2>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Display confirmed monument tickets, QR codes, railway PNR passes, and hotel reservations stored offline on this device.
                </p>
                <span className="inline-block text-amber-600 font-semibold text-xs pt-2">
                  View Offline Passes &rarr;
                </span>
              </div>
            </div>
          </Link>

          {/* Saved Trips Card */}
          <Link
            href="/trips"
            className="group block bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:border-amber-400 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-stone-900 group-hover:text-orange-700 transition-colors">
                  My Trip Itineraries
                </h2>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Review day-by-day schedules, planned attractions, transit times, and estimated costs from your last synced trip.
                </p>
                <span className="inline-block text-orange-600 font-semibold text-xs pt-2">
                  View Saved Trips &rarr;
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* National Emergency Helplines (Essential for Offline Travel in India) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                India 24x7 Essential Travel & Emergency Helplines
              </h3>
              <p className="text-stone-500 text-xs">
                Accessible via voice call on all mobile networks across India without active internet.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <a
              href="tel:112"
              className="p-4 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-stone-500 font-medium">National Emergency (All-in-One)</p>
                <p className="text-xl font-bold font-mono text-stone-900">112</p>
              </div>
              <PhoneCall className="w-5 h-5 text-red-600" />
            </a>

            <a
              href="tel:1363"
              className="p-4 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-stone-500 font-medium">Incredible India Tourist Helpline</p>
                <p className="text-xl font-bold font-mono text-stone-900">1363</p>
              </div>
              <LifeBuoy className="w-5 h-5 text-amber-600" />
            </a>

            <a
              href="tel:139"
              className="p-4 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-stone-500 font-medium">RailMadad (Indian Railways)</p>
                <p className="text-xl font-bold font-mono text-stone-900">139</p>
              </div>
              <Train className="w-5 h-5 text-indigo-600" />
            </a>

            <a
              href="tel:108"
              className="p-4 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-stone-500 font-medium">Emergency Ambulance</p>
                <p className="text-xl font-bold font-mono text-stone-900">108</p>
              </div>
              <PhoneCall className="w-5 h-5 text-emerald-600" />
            </a>

            <a
              href="tel:1091"
              className="p-4 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-stone-500 font-medium">Women Safety Helpline</p>
                <p className="text-xl font-bold font-mono text-stone-900">1091</p>
              </div>
              <PhoneCall className="w-5 h-5 text-rose-600" />
            </a>

            <a
              href="tel:1033"
              className="p-4 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-stone-500 font-medium">NHAI Highway Emergency</p>
                <p className="text-xl font-bold font-mono text-stone-900">1033</p>
              </div>
              <MapPin className="w-5 h-5 text-blue-600" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
