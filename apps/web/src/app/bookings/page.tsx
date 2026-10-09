'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Ticket, 
  Hotel as HotelIcon, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  AlertCircle,
  QrCode,
  Compass,
  Wallet,
  Award,
  Sparkles,
  Map
} from 'lucide-react';
import { api, getAuthToken } from '../../lib/api';
import Logo from '../../components/Logo';

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ATTRACTIONS' | 'HOTELS'>('ALL');
  const [loading, setLoading] = useState(true);
  const [activeQrModal, setActiveQrModal] = useState<any | null>(null);

  useEffect(() => {
    async function loadBookings() {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMyBookings();
        setBookings(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? A full refund will be processed.')) return;
    try {
      await api.cancelBooking(bookingId, 'Requested by traveler');
      // Reload bookings
      const res = await api.getMyBookings();
      setBookings(res.data || []);
      if (activeQrModal?.id === bookingId) setActiveQrModal(null);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking.');
    }
  };

  const handleViewQr = async (booking: any) => {
    try {
      const res = await api.getBooking(booking.id);
      setActiveQrModal(res.data);
    } catch {
      setActiveQrModal(booking);
    }
  };

  const token = getAuthToken();
  if (!token) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <Wallet className="w-12 h-12 text-bharat-saffron mx-auto" />
        <h2 className="text-2xl font-black text-stone-900">My Travel Wallet</h2>
        <p className="text-xs text-stone-500">Sign in to view your verified ASI monument admission passes, hotel vouchers, and ExploreBharat Digital Passport.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-3 bg-bharat-saffron text-white font-bold rounded-2xl shadow-md text-sm"
        >
          Sign In / Demo Login
        </button>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ATTRACTIONS') return b.bookingType === 'ATTRACTION_TICKET';
    if (activeTab === 'HOTELS') return b.bookingType === 'HOTEL';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 24. DIGITAL TRAVEL WALLET HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-bharat-saffron flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5" /> Digital Travel Wallet
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            My Passes, Vouchers & Travel Wallet
          </h1>
          <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
            Instant presentation of verified cryptographic QR passes at ASI monument turnstiles and hotel check-in desks across India.
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl self-start md:self-auto">
          {[
            { id: 'ALL', label: `All (${bookings.length})` },
            { id: 'ATTRACTIONS', label: '🎟️ Monument Passes' },
            { id: 'HOTELS', label: '🏨 Hotel Vouchers' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 27. GAMIFICATION — EXPLOREBHARAT PASSPORT WIDGET */}
      {(() => {
        // Derive dynamic stats from confirmed bookings
        const stateSet = new Set<string>();
        let heritageCount = 0;
        let natureCount = 0;
        let fortCount = 0;
        let spiritualCount = 0;

        bookings.forEach((b) => {
          const stateName = b.attraction?.city?.state?.name || b.hotel?.city?.state?.name || b.attraction?.city?.name;
          if (stateName) stateSet.add(stateName);

          const cat = b.attraction?.category?.code || '';
          const name = (b.attraction?.name || '').toLowerCase();
          if (cat === 'HERITAGE' || cat === 'CULTURE') heritageCount++;
          if (cat === 'NATURE' || cat === 'BEACH' || cat === 'ADVENTURE') natureCount++;
          if (name.includes('fort') || name.includes('palace')) fortCount++;
          if (cat === 'SPIRITUAL' || name.includes('temple') || name.includes('ghat')) spiritualCount++;
        });

        const statesCount = stateSet.size;
        const totalPasses = bookings.length;
        const explorerLevel = totalPasses === 0 
          ? 'LEVEL 1 NOVICE' 
          : totalPasses < 3 
            ? 'LEVEL 2 EXPLORER' 
            : totalPasses < 6 
              ? 'LEVEL 3 TRAILBLAZER' 
              : 'LEVEL 4 HERITAGE MASTER';

        return (
          <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>ExploreBharat Digital Passport</span>
                    <span className="text-[10px] px-2 py-0.5 bg-amber-400/20 text-amber-300 font-bold rounded-md uppercase">
                      {explorerLevel}
                    </span>
                  </h2>
                  <p className="text-xs text-stone-400">
                    Live dynamic tracker based on your verified monument visits and confirmed bookings
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="text-2xl font-black text-white">
                    {statesCount} <span className="text-xs text-stone-400 font-normal">/ 36</span>
                  </span>
                  <p className="text-[10px] uppercase font-bold text-stone-400">States & UTs Explored</p>
                </div>
              </div>
            </div>

            {/* Badges Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                <span className="text-2xl">🏛️</span>
                <div>
                  <span className="font-extrabold text-stone-200 block text-xs">Heritage Master</span>
                  <span className="text-[10px] text-stone-400">{heritageCount} Monument Passes</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                <span className="text-2xl">🏖️</span>
                <div>
                  <span className="font-extrabold text-stone-200 block text-xs">Nature Explorer</span>
                  <span className="text-[10px] text-stone-400">{natureCount} Outdoor Expeditions</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                <span className="text-2xl">🏰</span>
                <div>
                  <span className="font-extrabold text-stone-200 block text-xs">Fort & Citadel Trail</span>
                  <span className="text-[10px] text-stone-400">{fortCount} Historic Citadels</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                <span className="text-2xl">🕉️</span>
                <div>
                  <span className="font-extrabold text-stone-200 block text-xs">Spiritual Circuit</span>
                  <span className="text-[10px] text-stone-400">{spiritualCount} Sacred Sanctuaries</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Bookings List */}
      {loading ? (
        <div className="py-20 text-center text-stone-500 font-medium">Loading wallet items...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-4 max-w-md mx-auto">
          <Ticket className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800">No Passes Found</h3>
          <p className="text-xs text-stone-500">You do not have any bookings under this filter.</p>
          <button
            onClick={() => router.push('/attractions')}
            className="px-6 py-2.5 bg-bharat-saffron text-white font-bold text-xs rounded-xl"
          >
            Explore Attractions
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  b.bookingType === 'ATTRACTION_TICKET' ? 'bg-orange-50 text-bharat-saffron' : 'bg-blue-50 text-bharat-indigo'
                }`}>
                  {b.bookingType === 'ATTRACTION_TICKET' ? <Ticket className="w-6 h-6" /> : <HotelIcon className="w-6 h-6" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-bharat-saffron">{b.bookingReference}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-stone-900 leading-snug">{b.title}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-stone-500 pt-0.5">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-stone-400" /> {b.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-stone-400" /> {b.checkInDate} {b.slotTime ? `(${b.slotTime})` : ''}</span>
                    <span>•</span>
                    <span>{b.guestCount} Guest(s)</span>
                  </div>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-stone-100">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Paid Amount</span>
                  <span className="text-lg font-black text-stone-900">₹{b.totalAmountInr?.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewQr(b)}
                    className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <QrCode className="w-4 h-4 text-amber-300" />
                    <span>Show QR Pass</span>
                  </button>
                  {b.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Digital QR Modal */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl space-y-6 text-center border border-stone-200 relative">
            <button
              onClick={() => setActiveQrModal(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <Logo variant="compact" size="sm" className="mx-auto pb-1" />
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded-full tracking-wider">
                Official Digital Admission
              </span>
              <h3 className="text-lg font-black text-stone-900 pt-2 leading-tight">{activeQrModal.title}</h3>
              <p className="text-xs text-stone-500 font-mono font-bold text-bharat-saffron">{activeQrModal.bookingReference}</p>
            </div>

            {/* Rendered QR Code */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 inline-block shadow-inner mx-auto">
              {activeQrModal.qrImageDataUri ? (
                <img
                  src={activeQrModal.qrImageDataUri}
                  alt="Official Admission QR Code"
                  className="w-48 h-48 mx-auto"
                />
              ) : (
                <div className="w-48 h-48 bg-stone-100 flex items-center justify-center font-mono text-xs text-stone-500 break-all p-2">
                  <QrCode className="w-24 h-24 text-stone-800" />
                </div>
              )}
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60 text-left text-xs space-y-1 text-stone-700">
              <p><strong>Date & Slot:</strong> {activeQrModal.checkInDate} {activeQrModal.slotTime ? `(${activeQrModal.slotTime})` : ''}</p>
              <p><strong>Holder:</strong> Verified ExploreBharat Account</p>
              <p><strong>Guests:</strong> {activeQrModal.guestCount} Admission(s)</p>
              <p className="text-[10px] text-stone-400 pt-1">Scan this QR pass at the entrance turnstile reader.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
