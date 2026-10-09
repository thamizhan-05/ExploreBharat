'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Award, 
  MapPin, 
  Shield, 
  Sparkles, 
  Compass, 
  CheckCircle, 
  Lock, 
  Calendar, 
  Share2, 
  Download, 
  Star,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { api } from '../../lib/api';

interface PassportData {
  passportNumber: string;
  holderName: string;
  tier: string;
  issuedAt: string;
  metrics: {
    statesVisited: number;
    totalStates: number;
    utsVisited: number;
    totalUts: number;
    unescoSitesVisited: number;
    totalUnescoSites: number;
    fortsVisited: number;
    templesVisited: number;
    beachesVisited: number;
    totalDistrictsExplored: number;
  };
  badges: {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: string;
    progress: number;
    total: number;
  }[];
  stamps: {
    id: string;
    destinationName: string;
    state: string;
    stampedDate: string;
    category: string;
    colorCode: string;
  }[];
}

const DEFAULT_PASSPORT: PassportData = {
  passportNumber: 'EB-IND-882194',
  holderName: 'Aarav Sharma',
  tier: 'Gold Sentinel Explorer',
  issuedAt: '12 January 2026',
  metrics: {
    statesVisited: 8,
    totalStates: 28,
    utsVisited: 2,
    totalUts: 8,
    unescoSitesVisited: 6,
    totalUnescoSites: 42,
    fortsVisited: 9,
    templesVisited: 14,
    beachesVisited: 5,
    totalDistrictsExplored: 24
  },
  badges: [
    {
      id: 'fort-hunter',
      title: 'Fort Hunter (Durgadhipati)',
      description: 'Visit 8 historic hill forts and bastions across Rajasthan & Maharashtra',
      category: 'HERITAGE',
      icon: '🏰',
      unlocked: true,
      unlockedAt: '18 March 2026',
      progress: 9,
      total: 8
    },
    {
      id: 'unesco-sentinel',
      title: 'UNESCO Heritage Sentinel',
      description: 'Stand witness to at least 5 UNESCO World Heritage monuments in India',
      category: 'WORLD_HERITAGE',
      icon: '🏛️',
      unlocked: true,
      unlockedAt: '04 February 2026',
      progress: 6,
      total: 5
    },
    {
      id: 'temple-trail',
      title: 'Temple Trail Pioneer',
      description: 'Explore 12 historic temples built prior to the 17th century',
      category: 'SPIRITUAL',
      icon: '🛕',
      unlocked: true,
      unlockedAt: '22 April 2026',
      progress: 14,
      total: 12
    },
    {
      id: 'maharashtra-explorer',
      title: 'Maharashtra Sahyadri Explorer',
      description: 'Explore 5 districts across the Western Ghats and Deccan plateau',
      category: 'REGIONAL',
      icon: '⛰️',
      unlocked: false,
      progress: 3,
      total: 5
    },
    {
      id: 'coastal-voyager',
      title: 'Coastal Voyager (Samudrata)',
      description: 'Visit 8 scenic beaches along the Konkan, Malabar or Coromandel coast',
      category: 'COASTAL',
      icon: '🌊',
      unlocked: false,
      progress: 5,
      total: 8
    },
    {
      id: 'bharat-samrat',
      title: 'Bharat Explorer Grandmaster',
      description: 'Set foot in at least 15 Indian States and Union Territories',
      category: 'NATIONAL',
      icon: '🇮🇳',
      unlocked: false,
      progress: 10,
      total: 15
    }
  ],
  stamps: [
    {
      id: 'st-01',
      destinationName: 'Amber Palace & Jaigarh',
      state: 'Rajasthan',
      stampedDate: '15 Nov 2025',
      category: 'Hill Fort',
      colorCode: '#D97706'
    },
    {
      id: 'st-02',
      destinationName: 'Meenakshi Amman Kovil',
      state: 'Tamil Nadu',
      stampedDate: '10 Jan 2026',
      category: 'Dravidian Architecture',
      colorCode: '#DC2626'
    },
    {
      id: 'st-03',
      destinationName: 'Taj Mahal & Agra Fort',
      state: 'Uttar Pradesh',
      stampedDate: '24 Feb 2026',
      category: 'Mughal Heritage',
      colorCode: '#059669'
    },
    {
      id: 'st-04',
      destinationName: 'Qutb Shahi Tombs & Golconda',
      state: 'Telangana',
      stampedDate: '12 Apr 2026',
      category: 'Deccan Sultanate',
      colorCode: '#4F46E5'
    },
    {
      id: 'st-05',
      destinationName: 'Hampi Virupaksha Temple Complex',
      state: 'Karnataka',
      stampedDate: '19 May 2026',
      category: 'Vijayanagara Empire',
      colorCode: '#B45309'
    },
    {
      id: 'st-06',
      destinationName: 'Ellora Caves (Kailasa Temple)',
      state: 'Maharashtra',
      stampedDate: '02 Aug 2026',
      category: 'Rock-Cut Architecture',
      colorCode: '#7C3AED'
    }
  ]
};

export default function PassportPage() {
  const [passport, setPassport] = useState<PassportData>(DEFAULT_PASSPORT);
  const [activeTab, setActiveTab] = useState<'BADGES' | 'STAMPS' | 'METRICS'>('BADGES');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPassport();
  }, []);

  const loadPassport = async () => {
    try {
      const res = await api.getTravelPassport();
      if (res.passport) {
        setPassport(res.passport);
      }
    } catch (err: any) {
      console.warn('Passport fallback data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const { metrics, badges, stamps } = passport;

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 pb-20 selection:bg-amber-500 selection:text-stone-950">
      {/* Royal Cover Banner */}
      <div className="relative border-b border-amber-600/30 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/40 pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Decorative Emblem Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <div className="w-[800px] h-[800px] rounded-full border-[16px] border-amber-400 rotate-45" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Government Certified Tourism Passport</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-100 tracking-tight">
                ExploreBharat Passport
              </h1>
              <p className="text-stone-400 text-sm max-w-xl">
                A verified record of your travels across India. Authenticated entry stamps, heritage badges, and state discovery milestones.
              </p>
            </div>

            {/* Passport Identity Card Badge */}
            <div className="bg-gradient-to-br from-stone-850 to-stone-900 border border-amber-500/40 rounded-2xl p-5 shadow-2xl shadow-amber-950/50 w-full sm:w-80 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">REPUBLIC OF INDIA</span>
                <span className="text-xs font-mono font-bold text-amber-300">{passport.passportNumber}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-stone-500 uppercase">Explorer Name</span>
                <p className="font-serif font-bold text-base text-white">{passport.holderName}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-amber-400 font-semibold">{passport.tier}</span>
                  <span className="text-[10px] text-stone-400">Est. {passport.issuedAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mt-10">
            <div className="bg-stone-850/80 border border-stone-800 rounded-xl p-4 text-center">
              <span className="text-2xl font-bold font-mono text-amber-300">{metrics.statesVisited} <span className="text-xs text-stone-500 font-normal">/ {metrics.totalStates}</span></span>
              <p className="text-[11px] text-stone-400 uppercase mt-1 tracking-wider">States</p>
            </div>
            <div className="bg-stone-850/80 border border-stone-800 rounded-xl p-4 text-center">
              <span className="text-2xl font-bold font-mono text-amber-300">{metrics.unescoSitesVisited} <span className="text-xs text-stone-500 font-normal">/ {metrics.totalUnescoSites}</span></span>
              <p className="text-[11px] text-stone-400 uppercase mt-1 tracking-wider">UNESCO Sites</p>
            </div>
            <div className="bg-stone-850/80 border border-stone-800 rounded-xl p-4 text-center">
              <span className="text-2xl font-bold font-mono text-amber-300">{metrics.fortsVisited}</span>
              <p className="text-[11px] text-stone-400 uppercase mt-1 tracking-wider">Forts & Citadels</p>
            </div>
            <div className="bg-stone-850/80 border border-stone-800 rounded-xl p-4 text-center">
              <span className="text-2xl font-bold font-mono text-amber-300">{metrics.templesVisited}</span>
              <p className="text-[11px] text-stone-400 uppercase mt-1 tracking-wider">Historic Temples</p>
            </div>
            <div className="bg-stone-850/80 border border-stone-800 rounded-xl p-4 text-center">
              <span className="text-2xl font-bold font-mono text-amber-300">{metrics.utsVisited} <span className="text-xs text-stone-500 font-normal">/ {metrics.totalUts}</span></span>
              <p className="text-[11px] text-stone-400 uppercase mt-1 tracking-wider">UTs Visited</p>
            </div>
            <div className="bg-stone-850/80 border border-stone-800 rounded-xl p-4 text-center">
              <span className="text-2xl font-bold font-mono text-amber-300">{metrics.totalDistrictsExplored}</span>
              <p className="text-[11px] text-stone-400 uppercase mt-1 tracking-wider">Districts Explored</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center gap-3 border-b border-stone-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('BADGES')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'BADGES'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-850 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Badges & Achievements ({badges.filter(b => b.unlocked).length}/{badges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('STAMPS')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'STAMPS'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-850 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Monument Visa Stamps ({stamps.length})</span>
          </button>
        </div>

        {/* Tab 1: Badges & Achievements */}
        {activeTab === 'BADGES' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map(badge => (
              <div
                key={badge.id}
                className={`rounded-2xl p-6 border transition-all relative overflow-hidden ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-stone-850 to-stone-900 border-amber-500/40 shadow-xl shadow-amber-950/30'
                    : 'bg-stone-850/40 border-stone-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner">
                    {badge.icon}
                  </div>
                  {badge.unlocked ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-full border border-amber-400/30">
                      <CheckCircle className="w-3 h-3" />
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-800 text-stone-500 text-[10px] font-bold rounded-full">
                      <Lock className="w-3 h-3" />
                      LOCKED
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-lg text-amber-100 mb-1">{badge.title}</h3>
                <p className="text-xs text-stone-400 mb-4 leading-relaxed">{badge.description}</p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2 border-t border-stone-800">
                  <div className="flex justify-between text-[11px] text-stone-400 font-mono">
                    <span>Progress</span>
                    <span>{badge.progress} / {badge.total}</span>
                  </div>
                  <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        badge.unlocked ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-stone-600'
                      }`}
                      style={{ width: `${Math.min(100, (badge.progress / badge.total) * 100)}%` }}
                    />
                  </div>
                  {badge.unlockedAt && (
                    <p className="text-[10px] text-amber-400/80 font-mono text-right pt-1">
                      Awarded {badge.unlockedAt}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Visited Monument Stamps */}
        {activeTab === 'STAMPS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stamps.map(stamp => (
              <div
                key={stamp.id}
                className="bg-stone-850 rounded-2xl p-6 border-2 border-dashed border-stone-700/80 hover:border-amber-500/60 transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: stamp.colorCode }}
                    >
                      {stamp.category}
                    </span>
                    <span className="text-[11px] font-mono text-stone-400">{stamp.stampedDate}</span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-white mb-1">
                    {stamp.destinationName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{stamp.state}, India</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> VERIFIED VISIT
                  </span>
                  <span className="text-[9px] font-mono text-stone-500">SEAL #EB-{stamp.id.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
