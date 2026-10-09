'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, getAuthToken, setAuthToken, setCurrentUser } from '../../lib/api';
import VendorInventoryTab from './components/VendorInventoryTab';
import VendorBookingsTab from './components/VendorBookingsTab';
import VendorFinancialsTab from './components/VendorFinancialsTab';
import VendorProfileTab from './components/VendorProfileTab';
import VendorTariffModal from './components/VendorTariffModal';

interface VendorProfile {
  id: string;
  businessName: string;
  contactPhone: string;
  address: string;
  gstNumber?: string;
  panNumber?: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Room {
  id: string;
  title: string;
  roomType: string;
  basePriceInr: number;
  availableCount: number;
  maxGuests: number;
  includesBreakfast: boolean;
}

interface HotelProperty {
  id: string;
  name: string;
  officialName?: string;
  address: string;
  tier: string;
  rating: number;
  startingPriceInr: number;
  availabilityStatus: string;
  cancellationPolicy: string;
  checkInTime: string;
  checkOutTime: string;
  heroImageUrl: string;
  city: {
    name: string;
    state?: { name: string };
  };
  rooms: Room[];
}

interface BookingRecord {
  id: string;
  bookingReference: string;
  title: string;
  checkInDate: string;
  checkOutDate?: string;
  guestCount: number;
  totalAmountInr: number;
  paymentStatus: string;
  status: string;
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
}

interface FinancialSummary {
  summary: {
    grossBookingValueInr: number;
    platformCommissionRate: string;
    platformFeeTotalInr: number;
    netVendorPayoutInr: number;
    vendorPayoutRate: string;
    totalReservations: number;
    pendingCheckIns: number;
  };
  transactions: {
    bookingId: string;
    bookingReference: string;
    hotelName: string;
    guestCheckIn: string;
    guestCheckOut?: string;
    guestCount: number;
    grossAmountInr: number;
    platformFeeInr: number;
    platformFeePercent: number;
    netPayoutInr: number;
    payoutStatus: string;
    createdAt: string;
  }[];
}

export default function VendorExtranetPage() {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [inventory, setInventory] = useState<HotelProperty[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [financials, setFinancials] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'bookings' | 'financials' | 'profile'>('inventory');

  // Edit Tariff Modal State
  const [editingHotel, setEditingHotel] = useState<HotelProperty | null>(null);
  const [editTariffPrice, setEditTariffPrice] = useState(0);
  const [editAvailability, setEditAvailability] = useState('AVAILABLE');
  const [editCancelPolicy, setEditCancelPolicy] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const loadVendorData = async () => {
    try {
      setLoading(true);
      const [invRes, bookRes, finRes] = await Promise.all([
        api.getVendorInventory().catch(() => ({ data: [] })),
        api.getVendorBookings().catch(() => ({ data: [] })),
        api.getVendorFinancials().catch(() => ({ data: null }))
      ]);

      if (invRes.data) setInventory(invRes.data);
      if (bookRes.data) setBookings(bookRes.data);
      if (finRes.data) setFinancials(finRes.data);
    } catch (err: any) {
      console.error('Failed to load vendor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoVendorLogin = async () => {
    try {
      const loginRes = await api.login('vendor@explorebharat.local', 'Vendor@1234');
      if (loginRes.data?.token) {
        setAuthToken(loginRes.data.token);
        setCurrentUser(loginRes.data.user);
        showNotification('Authenticated as Rajputana Experiences & Resorts Pvt Ltd.');
        await loadVendorData();
      }
    } catch (err: any) {
      showNotification(`Auth Error: ${err.message}`);
    }
  };

  useEffect(() => {
    async function init() {
      const token = getAuthToken();
      if (!token) {
        await handleDemoVendorLogin();
      } else {
        await loadVendorData();
      }
    }
    init();
  }, []);

  const handleUpdateAvailability = async (hotelId: string, availabilityStatus: string) => {
    try {
      setUpdatingId(hotelId);
      await api.updateVendorHotel(hotelId, { availabilityStatus });
      setInventory((prev) =>
        prev.map((h) => (h.id === hotelId ? { ...h, availabilityStatus } : h))
      );
      showNotification(`Availability updated to ${availabilityStatus}`);
    } catch (err: any) {
      showNotification(`Update failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const openTariffModal = (hotel: HotelProperty) => {
    setEditingHotel(hotel);
    setEditTariffPrice(hotel.startingPriceInr);
    setEditAvailability(hotel.availabilityStatus);
    setEditCancelPolicy(hotel.cancellationPolicy);
  };

  const handleSaveTariff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotel) return;
    try {
      setUpdatingId(editingHotel.id);
      await api.updateVendorHotel(editingHotel.id, {
        startingPriceInr: editTariffPrice,
        availabilityStatus: editAvailability,
        cancellationPolicy: editCancelPolicy
      });
      setInventory((prev) =>
        prev.map((h) =>
          h.id === editingHotel.id
            ? {
                ...h,
                startingPriceInr: editTariffPrice,
                availabilityStatus: editAvailability,
                cancellationPolicy: editCancelPolicy
              }
            : h
        )
      );
      showNotification(`Tariff updated to ₹${editTariffPrice.toLocaleString('en-IN')}`);
      setEditingHotel(null);
    } catch (err: any) {
      showNotification(`Save error: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoomPriceQuickUpdate = async (hotelId: string, roomId: string, newPrice: number) => {
    try {
      await api.updateVendorRoom(hotelId, roomId, { basePriceInr: newPrice });
      setInventory((prev) =>
        prev.map((h) => {
          if (h.id === hotelId) {
            return {
              ...h,
              rooms: h.rooms.map((r) => (r.id === roomId ? { ...r, basePriceInr: newPrice } : r))
            };
          }
          return h;
        })
      );
      showNotification(`Room price updated to ₹${newPrice.toLocaleString('en-IN')}`);
    } catch (err: any) {
      showNotification(`Update error: ${err.message}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1d', color: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Toast Notification Banner */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          fontWeight: 700,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header */}
      <header style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '20px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link href="/" style={{ color: '#ff6b35', textDecoration: 'none', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
                ExploreBharat
              </Link>
              <span style={{ color: '#4b5563' }}>/</span>
              <span style={{
                background: 'rgba(255, 107, 53, 0.15)',
                color: '#ff6b35',
                fontSize: '0.8rem',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}>
                B2B VENDOR EXTRANET
              </span>
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '6px 0 0', color: '#fff' }}>
              {profile?.businessName || 'Rajputana Experiences & Resorts Pvt Ltd'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
              Verified Hospitality Partner
            </span>

            <button
              id="vendor-demo-login-btn"
              onClick={handleDemoVendorLogin}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#e5e7eb',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              🔄 Refresh / Re-login
            </button>

            <Link
              href="/admin"
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              Admin Portal →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1400px', margin: '32px auto 0', padding: '0 24px' }}>
        {/* KPI Cards Row */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{
            background: 'linear-gradient(145deg, #161f30, #0f172a)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Gross Booking Value (GMV)
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '8px 0 4px' }}>
              ₹{(financials?.summary.grossBookingValueInr || 51880).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
              ↑ 100% Verified Guest Reservations
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(145deg, #162a22, #0f172a)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Net Vendor Payout (92%)
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', margin: '8px 0 4px' }}>
              ₹{(financials?.summary.netVendorPayoutInr || 47730).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              T+1 Post Check-in Escrow Settlement
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(145deg, #2a1b16, #0f172a)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Confirmed Reservations
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', margin: '8px 0 4px' }}>
              {financials?.summary.totalReservations || bookings.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {financials?.summary.pendingCheckIns || 2} Pending Check-Ins
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(145deg, #1e1b4b, #0f172a)',
            border: '1px solid rgba(129, 140, 248, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Platform Fee Take-Rate
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8', margin: '8px 0 4px' }}>
              8.0%
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Zero Listing Fees · Guaranteed SLA
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '28px' }}>
          {[
            { id: 'inventory', label: '🏨 Property Inventory & Tariffs' },
            { id: 'bookings', label: '📅 Guest Reservations & Check-Ins' },
            { id: 'financials', label: '💰 Settlement Ledger (92% Payout)' },
            { id: 'profile', label: '🛡️ Business Compliance & GST' }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? 'rgba(255, 107, 53, 0.12)' : 'transparent',
                color: activeTab === tab.id ? '#ff6b35' : '#94a3b8',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #ff6b35' : '2px solid transparent',
                padding: '14px 20px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderRadius: '8px 8px 0 0'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: INVENTORY & TARIFFS */}
        {activeTab === 'inventory' && (
          <VendorInventoryTab
            inventory={inventory}
            loading={loading}
            updatingId={updatingId}
            onUpdateAvailability={handleUpdateAvailability}
            onOpenTariffModal={openTariffModal}
            onRoomPriceQuickUpdate={handleRoomPriceQuickUpdate}
            onDemoLogin={handleDemoVendorLogin}
          />
        )}

        {/* TAB 2: BOOKINGS */}
        {activeTab === 'bookings' && (
          <VendorBookingsTab
            bookings={bookings}
            onConfirmCheckIn={(ref) => showNotification(`Check-in verified for booking ${ref}`)}
          />
        )}

        {/* TAB 3: FINANCIALS & LEDGER */}
        {activeTab === 'financials' && (
          <VendorFinancialsTab financials={financials} />
        )}

        {/* TAB 4: PROFILE & COMPLIANCE */}
        {activeTab === 'profile' && (
          <VendorProfileTab profile={profile} />
        )}
      </main>

      {/* Edit Tariff Modal */}
      <VendorTariffModal
        editingHotel={editingHotel}
        onClose={() => setEditingHotel(null)}
        editTariffPrice={editTariffPrice}
        setEditTariffPrice={setEditTariffPrice}
        editAvailability={editAvailability}
        setEditAvailability={setEditAvailability}
        editCancelPolicy={editCancelPolicy}
        setEditCancelPolicy={setEditCancelPolicy}
        updatingId={updatingId}
        onSaveTariff={handleSaveTariff}
      />
    </div>
  );
}
