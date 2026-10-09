'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Calendar, Clock, Users, ShieldCheck, CheckCircle2, Ticket } from 'lucide-react';
import { api, getAuthToken } from '../lib/api';

interface TicketModalProps {
  attraction: any;
  onClose: () => void;
  onSuccess?: (bookingResult: any) => void;
}

export default function TicketModal({ attraction, onClose, onSuccess }: TicketModalProps) {
  const router = useRouter();
  const [selectedTicketType, setSelectedTicketType] = useState<any>(attraction.ticketTypes?.[0] || null);
  const [visitDate, setVisitDate] = useState('2026-10-15');
  const [timeSlot, setTimeSlot] = useState('09:00 - 12:00');
  const [quantity, setQuantity] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const availableSlots = [
    { slot: '09:00 - 12:00', label: 'Morning Slot (Fast-track)' },
    { slot: '12:00 - 15:00', label: 'Midday Slot' },
    { slot: '15:00 - 18:00', label: 'Sunset & Golden Hour' }
  ];

  const pricePerTicket = selectedTicketType?.priceInr || 50;
  const subtotal = pricePerTicket * quantity;
  const tax = Math.round(subtotal * 0.05);
  const convenienceFee = 20;
  const total = subtotal + tax + convenienceFee;

  const handleConfirmBooking = async () => {
    setError('');
    const token = getAuthToken();
    if (!token) {
      alert('Please sign in or select demo login to book tickets.');
      router.push('/login');
      return;
    }

    if (!selectedTicketType) {
      setError('Please select a ticket type.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.bookTicket({
        attractionId: attraction.id,
        ticketTypeId: selectedTicketType.id,
        visitDate,
        timeSlot,
        quantity
      });

      setConfirmedBooking(res.data);
      if (onSuccess) onSuccess(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to book ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="relative p-6 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-bharat-saffron flex items-center justify-center font-bold">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900 leading-tight">{attraction.name}</h3>
              <p className="text-xs text-stone-500">Official Monument Admission</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBooking ? (
          // Booking Confirmation Success Screen
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 inline-block mb-2">
                VERIFIED ASI ADMISSION
              </span>
              <h4 className="text-2xl font-black text-stone-900">Ticket Confirmed!</h4>
              <p className="text-sm text-stone-500 mt-1">
                Booking Reference: <span className="font-mono font-bold text-bharat-saffron">{confirmedBooking.bookingReference}</span>
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Monument:</span>
                <span className="font-bold text-stone-900">{attraction.name}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Date & Slot:</span>
                <span className="font-bold text-stone-900">{visitDate} ({timeSlot})</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Guests:</span>
                <span className="font-bold text-stone-900">{quantity} Tickets</span>
              </div>
              <div className="flex justify-between text-stone-600 border-t border-stone-200 pt-2 font-bold text-sm">
                <span>Paid Total:</span>
                <span className="text-emerald-700">₹{confirmedBooking.totalAmountInr}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/bookings`)}
                className="w-full py-3 bg-bharat-saffron hover:bg-bharat-terracotta text-white font-bold rounded-xl shadow-md transition-all text-sm"
              >
                View Digital QR Ticket
              </button>
            </div>
          </div>
        ) : (
          // Booking Form
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
                {error}
              </div>
            )}

            {/* Ticket Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">Ticket Category</label>
              <div className="space-y-2">
                {attraction.ticketTypes?.map((tt: any) => (
                  <div
                    key={tt.id}
                    onClick={() => setSelectedTicketType(tt)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedTicketType?.id === tt.id
                        ? 'border-bharat-saffron bg-orange-50/50 ring-2 ring-orange-200'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">{tt.name}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">{tt.description}</p>
                    </div>
                    <span className="text-base font-black text-bharat-charcoal">₹{tt.priceInr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date and Quantity Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" /> Visit Date
                </label>
                <input
                  type="date"
                  value={visitDate}
                  min="2026-10-06"
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-bharat-saffron"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-stone-400" /> Quantity
                </label>
                <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 py-2 font-bold text-stone-600 hover:bg-stone-200"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-sm text-stone-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 py-2 font-bold text-stone-600 hover:bg-stone-200"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Time Slot */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" /> Entry Time Slot
              </label>
              <div className="grid grid-cols-1 gap-2">
                {availableSlots.map((s) => (
                  <button
                    type="button"
                    key={s.slot}
                    onClick={() => setTimeSlot(s.slot)}
                    className={`p-2.5 text-left rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      timeSlot === s.slot
                        ? 'border-bharat-saffron bg-orange-50/60 text-bharat-saffron ring-1 ring-bharat-saffron'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <span>{s.slot}</span>
                    <span className="text-[11px] font-normal text-stone-500">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>{quantity}x {selectedTicketType?.name || 'Ticket'}:</span>
                <span className="font-semibold text-stone-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Taxes & GST (5%):</span>
                <span className="font-semibold text-stone-900">₹{tax}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Gateway Convenience Fee:</span>
                <span className="font-semibold text-stone-900">₹{convenienceFee}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 font-black text-sm text-stone-900">
                <span>Total Payable:</span>
                <span className="text-bharat-saffron text-base">₹{total}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              className="w-full py-3.5 bg-bharat-saffron hover:bg-bharat-terracotta disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? 'Confirming Ticket...' : `Pay ₹${total} & Get QR Pass`}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
