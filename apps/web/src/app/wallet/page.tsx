'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  QrCode, 
  Ticket, 
  Hotel, 
  Train, 
  Plane, 
  Bus, 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Download, 
  Share2, 
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../lib/api';

interface PassItem {
  id: string;
  reference: string;
  category: 'ATTRACTION' | 'HOTEL' | 'TRANSPORT';
  title: string;
  subtitle: string;
  location: string;
  validDate: string;
  validTime?: string;
  status: 'CONFIRMED' | 'ACTIVE' | 'USED' | 'CANCELLED';
  qrPayload: string;
  passholders: { name: string; type: string }[];
  details: {
    slot?: string;
    gate?: string;
    seatOrRoom?: string;
    provider?: string;
    amountPaid?: number;
    currency?: string;
  };
  importantNotes?: string[];
}

const DEFAULT_PASSES: PassItem[] = [
  {
    id: 'pass-amber-01',
    reference: 'EB-AMB-998241',
    category: 'ATTRACTION',
    title: 'Amber Palace & Fort Priority Entry',
    subtitle: 'ASI Monument Entry Pass',
    location: 'Amer, Jaipur, Rajasthan',
    validDate: '15 Nov 2026',
    validTime: '09:00 AM - 12:00 PM',
    status: 'CONFIRMED',
    qrPayload: 'EB:TKT:AMBER:998241:VALID:20261115',
    passholders: [
      { name: 'Aarav Sharma', type: 'Indian Adult' },
      { name: 'Pooja Sharma', type: 'Indian Adult' }
    ],
    details: {
      slot: 'Morning 09:00 AM',
      gate: 'Suraj Pol (Sun Gate)',
      provider: 'Archaeological Survey of India',
      amountPaid: 200,
      currency: 'INR'
    },
    importantNotes: [
      'Government photo ID matching ticket name required at turnstile.',
      'Suraj Pol entry closes at 05:00 PM sharp.',
      'Light & Sound show requires separate booking.'
    ]
  },
  {
    id: 'pass-hotel-02',
    reference: 'EB-HTL-481902',
    category: 'HOTEL',
    title: 'ITC Rajputana, a Luxury Collection Hotel',
    subtitle: 'Thikana Heritage Room (1 King Bed)',
    location: 'Station Road, Gopalbari, Jaipur',
    validDate: '15 Nov 2026 - 18 Nov 2026',
    validTime: 'Check-in: 02:00 PM',
    status: 'CONFIRMED',
    qrPayload: 'EB:HTL:ITC:481902:20261115-20261118',
    passholders: [
      { name: 'Aarav Sharma', type: 'Primary Guest' }
    ],
    details: {
      seatOrRoom: 'Heritage King, High Floor',
      provider: 'ExploreBharat Direct Heritage Tie-up',
      amountPaid: 18500,
      currency: 'INR'
    },
    importantNotes: [
      'Breakfast buffet included at Jal Mahal restaurant.',
      'Complimentary pickup from Jaipur Jn available on prior request.',
      'Zero cancellation until 48h prior to check-in.'
    ]
  },
  {
    id: 'pass-rail-03',
    reference: 'EB-RL-248199',
    category: 'TRANSPORT',
    title: 'Vande Bharat Express (Train #20977)',
    subtitle: 'NDLS → JP (AC Chair Car / CC)',
    location: 'New Delhi (NDLS) → Jaipur Jn (JP)',
    validDate: '15 Nov 2026',
    validTime: 'Dep: 06:10 AM | Arr: 09:45 AM',
    status: 'ACTIVE',
    qrPayload: 'EB:PNR:2481992019:VB20977',
    passholders: [
      { name: 'Aarav Sharma', type: 'Seat C4-22 (Window)' },
      { name: 'Pooja Sharma', type: 'Seat C4-23 (Middle)' }
    ],
    details: {
      seatOrRoom: 'Coach C4, Seats 22 & 23',
      provider: 'Indian Railways / IRCTC Authorized Channel',
      amountPaid: 2150,
      currency: 'INR'
    },
    importantNotes: [
      'Catering included with morning tea and vegetarian breakfast.',
      'Please carry digital pass or Aadhaar/Voter ID for onboard TTE verification.',
      'Arrive at NDLS Platform 16 minimum 25 minutes prior to departure.'
    ]
  }
];

export default function WalletPage() {
  const [passes, setPasses] = useState<PassItem[]>(DEFAULT_PASSES);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'ATTRACTION' | 'HOTEL' | 'TRANSPORT'>('ALL');
  const [selectedPass, setSelectedPass] = useState<PassItem | null>(DEFAULT_PASSES[0]);
  const [searchRef, setSearchRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPasses();
  }, []);

  const loadPasses = async () => {
    try {
      setError(null);
      const res = await api.getWalletPasses();
      const loaded = res.passes || [];
      if (loaded.length > 0) {
        setPasses(loaded);
        setSelectedPass(loaded[0]);
      }
    } catch (err: any) {
      console.warn('Wallet fetch fallback to default demo passes:', err.message);
    }
  };

  const filteredPasses = passes.filter(p => {
    const matchesCat = activeCategory === 'ALL' || p.category === activeCategory;
    const matchesSearch = !searchRef || 
      p.reference.toLowerCase().includes(searchRef.toLowerCase()) ||
      p.title.toLowerCase().includes(searchRef.toLowerCase()) ||
      p.location.toLowerCase().includes(searchRef.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full border border-amber-400/30 mb-3">
                <Wallet className="w-3.5 h-3.5" />
                <span>Unified Digital Travel Wallet</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-50">
                My Travel Wallet & Digital Passes
              </h1>
              <p className="text-stone-300 text-sm max-w-2xl mt-1">
                Your verified tickets, monument passes, railway reservation vouchers, and hotel check-in tokens stored securely in one place with offline QR verification.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/passport"
                className="px-4 py-2.5 bg-amber-600/90 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                <span>View Bharat Passport</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-4 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {(['ALL', 'ATTRACTION', 'HOTEL', 'TRANSPORT'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat === 'ALL' && 'All Passes'}
                {cat === 'ATTRACTION' && 'Monument Passes'}
                {cat === 'HOTEL' && 'Hotel Vouchers'}
                {cat === 'TRANSPORT' && 'Transport Tickets'}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              placeholder="Search reference or monument..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Ticket className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Passes List (Left 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
              <span>Active Passes ({filteredPasses.length})</span>
              <span className="text-xs text-stone-400 normal-case">Tamper-proof verifiable tokens</span>
            </h2>

            {filteredPasses.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center">
                <Ticket className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-stone-800 font-bold text-base">No passes found</h3>
                <p className="text-stone-500 text-xs mt-1">Book an attraction ticket, hotel, or smart journey to see your passes here.</p>
                <Link
                  href="/attractions"
                  className="inline-block mt-4 px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl"
                >
                  Explore Attractions
                </Link>
              </div>
            ) : (
              filteredPasses.map(pass => {
                const isSelected = selectedPass?.id === pass.id;
                return (
                  <div
                    key={pass.id}
                    onClick={() => setSelectedPass(pass)}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-amber-50/40 border-amber-500 ring-2 ring-amber-400/30 shadow-md'
                        : 'bg-white border-stone-200 hover:border-amber-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        pass.category === 'ATTRACTION' ? 'bg-amber-100 text-amber-800' :
                        pass.category === 'HOTEL' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {pass.category === 'ATTRACTION' && <Ticket className="w-3 h-3" />}
                        {pass.category === 'HOTEL' && <Hotel className="w-3 h-3" />}
                        {pass.category === 'TRANSPORT' && <Train className="w-3 h-3" />}
                        <span>{pass.category}</span>
                      </span>

                      <span className="text-[11px] font-mono font-bold text-stone-500">
                        {pass.reference}
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-sm mb-1">{pass.title}</h3>
                    <p className="text-xs text-stone-600 mb-3">{pass.subtitle}</p>

                    <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{pass.validDate}</span>
                      </div>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                        {pass.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pass Detail & QR Visualizer (Right 7 cols) */}
          <div className="lg:col-span-7">
            {selectedPass ? (
              <div className="bg-white rounded-3xl border border-stone-200/90 shadow-lg overflow-hidden sticky top-28">
                {/* Boarding Card Header */}
                <div className={`p-6 text-white ${
                  selectedPass.category === 'ATTRACTION' 
                    ? 'bg-gradient-to-r from-amber-800 via-amber-700 to-yellow-800'
                    : selectedPass.category === 'HOTEL'
                    ? 'bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-800'
                    : 'bg-gradient-to-r from-blue-900 via-slate-800 to-stone-900'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-widest uppercase opacity-85">
                      ExploreBharat Travel Wallet Pass
                    </span>
                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-[11px] font-bold rounded-lg uppercase tracking-wide">
                      {selectedPass.status}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1">
                    {selectedPass.title}
                  </h2>
                  <p className="text-amber-100/90 text-xs sm:text-sm">
                    {selectedPass.subtitle}
                  </p>
                </div>

                {/* Body Details */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Key Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-stone-100 text-xs">
                    <div>
                      <span className="text-stone-400 block uppercase font-medium text-[10px]">Pass Reference</span>
                      <span className="font-mono font-bold text-stone-800 text-sm">{selectedPass.reference}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block uppercase font-medium text-[10px]">Valid Date</span>
                      <span className="font-bold text-stone-800">{selectedPass.validDate}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block uppercase font-medium text-[10px]">Schedule / Time</span>
                      <span className="font-bold text-stone-800">{selectedPass.validTime || 'Full Day Access'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block uppercase font-medium text-[10px]">Issuing Source</span>
                      <span className="font-bold text-stone-800 truncate block">{selectedPass.details.provider || 'ExploreBharat'}</span>
                    </div>
                  </div>

                  {/* QR Code Presentation */}
                  <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 flex flex-col sm:flex-row items-center gap-6">
                    {/* Simulated High-Res QR */}
                    <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center">
                      <div className="w-36 h-36 border-2 border-stone-800 rounded-lg p-2 flex flex-col justify-between items-center bg-stone-900 text-amber-400">
                        <QrCode className="w-28 h-28 text-white" />
                        <span className="text-[9px] font-mono text-stone-300">SCAN AT GATE</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Cryptographically Traceable Token</span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">Present at turnstile or reception</h4>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        This token is pre-validated with monument entry gates and hotel PMS systems. Works fully offline without active internet connection.
                      </p>
                      <p className="font-mono text-[11px] text-stone-400 bg-stone-100 px-3 py-1.5 rounded-lg break-all">
                        {selectedPass.qrPayload}
                      </p>
                    </div>
                  </div>

                  {/* Passholders & Allocation */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                      Authorized Passholders ({selectedPass.passholders.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedPass.passholders.map((ph, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl text-xs">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="font-bold text-stone-800">{ph.name}</span>
                          </div>
                          <span className="text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded text-[11px] font-medium">
                            {ph.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Important Guidelines */}
                  {selectedPass.importantNotes && selectedPass.importantNotes.length > 0 && (
                    <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/60">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs mb-2">
                        <Info className="w-4 h-4 text-amber-700" />
                        <span>Important Instructions</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs text-amber-900/90 leading-relaxed">
                        {selectedPass.importantNotes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <button 
                      onClick={() => alert(`Pass ${selectedPass.reference} downloaded as offline PDF voucher.`)}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Offline PDF</span>
                    </button>
                    <button 
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Pass link copied to clipboard!');
                        }
                      }}
                      className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Pass</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center bg-white rounded-3xl border border-stone-200 text-stone-400 text-sm">
                Select a pass from the left list to view QR voucher.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
