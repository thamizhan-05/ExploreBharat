'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Star, 
  MapPin, 
  Wifi, 
  Coffee, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  ChevronLeft 
} from 'lucide-react';
import { api, getAuthToken } from '../../../lib/api';

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id as string;

  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [checkInDate, setCheckInDate] = useState('2026-10-20');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-23');
  const [guestCount, setGuestCount] = useState(2);
  const [reserving, setReserving] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  useEffect(() => {
    async function loadHotel() {
      try {
        const res = await api.getHotel(hotelId);
        setHotel(res.data);
        if (res.data?.rooms?.length > 0) {
          setSelectedRoom(res.data.rooms[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHotel();
  }, [hotelId]);

  const handleBookHotel = async () => {
    const token = getAuthToken();
    if (!token) {
      alert('Please sign in or select demo login to book hotel rooms.');
      router.push('/login');
      return;
    }

    if (!selectedRoom) return;

    setReserving(true);
    try {
      const res = await api.bookHotel({
        hotelId: hotel.id,
        roomId: selectedRoom.id,
        checkInDate,
        checkOutDate,
        guestCount
      });
      setConfirmedBooking(res.data);
    } catch (err: any) {
      alert(err.message || 'Failed to book room.');
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <div className="py-24 text-center text-stone-500 font-medium">Loading hotel details...</div>;
  if (!hotel) return <div className="py-24 text-center text-stone-700 font-bold">Hotel not found.</div>;

  // Nights calculation
  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const nights = Math.max(1, Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
  const subtotal = (selectedRoom?.basePriceInr || hotel.startingPriceInr) * nights;
  const tax = Math.round(subtotal * 0.12);
  const convenienceFee = 150;
  const total = subtotal + tax + convenienceFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Navigation */}
      <Link href="/hotels" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Hotels
      </Link>

      {/* Hotel Title & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-full uppercase">
              {hotel.tier} Stay
            </span>
            <div className="flex items-center text-amber-500 text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
              <span>{hotel.rating?.toFixed(1) || '4.8'}</span>
              <span className="text-stone-400 font-normal ml-1">({hotel.reviewsCount || 110} reviews)</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">{hotel.name}</h1>
          <p className="text-xs text-stone-500 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-bharat-saffron" />
            <span>{hotel.address}, {hotel.city?.name}</span>
          </p>
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-3xl overflow-hidden aspect-[16/8] max-h-[440px]">
        <div className="md:col-span-2 h-full bg-stone-100">
          <img src={hotel.heroImageUrl} alt={hotel.name} className="w-full h-full object-cover" />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-3 h-full">
          {hotel.galleryImages?.slice(0, 2).map((img: string, i: number) => (
            <img key={i} src={img} alt="" className="w-full h-full object-cover" />
          )) || <img src={hotel.heroImageUrl} alt="" className="w-full h-full object-cover" />}
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left: Rooms and Description */}
        <div className="lg:col-span-2 space-y-10">
          
          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
            <h2 className="text-xl font-black text-stone-900 tracking-tight">About {hotel.name}</h2>
            <p className="text-stone-700 text-sm leading-relaxed">{hotel.description}</p>
          </div>

          {/* Room Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-stone-900 tracking-tight">Available Rooms</h2>
            <div className="space-y-4">
              {hotel.rooms?.map((r: any) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRoom(r)}
                  className={`p-6 bg-white rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row justify-between gap-4 ${
                    selectedRoom?.id === r.id
                      ? 'border-bharat-saffron ring-2 ring-orange-200 shadow-md'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-stone-900">{r.title}</h3>
                    <div className="flex flex-wrap gap-3 text-xs text-stone-600">
                      <span>Max {r.maxGuests} Guests</span>
                      <span>•</span>
                      <span>{r.bedType}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">✓ Complimentary Breakfast</span>
                    </div>
                  </div>
                  <div className="text-right sm:self-center shrink-0">
                    <span className="text-xl font-black text-stone-900">₹{r.basePriceInr?.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-stone-500 block"> /night + taxes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/60 space-y-2 text-xs text-stone-700">
            <h4 className="font-bold text-stone-900 text-sm">Hotel Policies</h4>
            <p>• Check-in: {hotel.checkInTime || '14:00'} | Check-out: {hotel.checkOutTime || '11:00'}</p>
            <p>• {hotel.cancellationPolicy}</p>
            <p>• Valid government photo identification (Aadhaar, Passport, or Driving License) required at reception.</p>
          </div>

        </div>

        {/* Right: Booking Summary / Confirmed Box */}
        <div>
          <div className="sticky top-28 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xl space-y-6">
            {confirmedBooking ? (
              <div className="text-center space-y-4 py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-black text-stone-900">Reservation Confirmed!</h3>
                <p className="text-xs text-stone-500">
                  Ref: <span className="font-mono font-bold text-bharat-saffron">{confirmedBooking.bookingReference}</span>
                </p>
                <div className="bg-stone-50 p-4 rounded-xl text-left text-xs space-y-1.5">
                  <p><strong>Hotel:</strong> {hotel.name}</p>
                  <p><strong>Room:</strong> {selectedRoom?.title}</p>
                  <p><strong>Nights:</strong> {nights} ({checkInDate} to {checkOutDate})</p>
                  <p><strong>Paid Total:</strong> ₹{confirmedBooking.totalAmountInr}</p>
                </div>
                <button
                  onClick={() => router.push('/bookings')}
                  className="w-full py-3 bg-bharat-saffron text-white font-bold rounded-xl text-sm"
                >
                  View in My Bookings
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-black text-lg text-stone-900">Reserve Your Stay</h3>
                
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Check-in Date</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Check-out Date</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Guests</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>{nights} nights x ₹{selectedRoom?.basePriceInr || hotel.startingPriceInr}:</span>
                    <span className="font-bold text-stone-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Taxes & GST (12%):</span>
                    <span className="font-bold text-stone-900">₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Convenience Fee:</span>
                    <span className="font-bold text-stone-900">₹{convenienceFee}</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200 pt-2 font-black text-sm text-stone-900">
                    <span>Total Amount:</span>
                    <span className="text-bharat-saffron text-base">₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookHotel}
                  disabled={reserving}
                  className="w-full py-3.5 bg-bharat-indigo hover:bg-blue-950 text-white font-bold rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {reserving ? 'Reserving...' : `Confirm & Pay ₹${total}`}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
