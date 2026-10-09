'use client';

import React from 'react';

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

interface VendorInventoryTabProps {
  inventory: HotelProperty[];
  loading: boolean;
  updatingId: string | null;
  onUpdateAvailability: (hotelId: string, status: string) => void;
  onOpenTariffModal: (hotel: HotelProperty) => void;
  onRoomPriceQuickUpdate: (hotelId: string, roomId: string, newPrice: number) => void;
  onDemoLogin: () => void;
}

export default function VendorInventoryTab({
  inventory,
  loading,
  updatingId,
  onUpdateAvailability,
  onOpenTariffModal,
  onRoomPriceQuickUpdate,
  onDemoLogin,
}: VendorInventoryTabProps) {
  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#fff' }}>
          Managed Hospitality Properties ({inventory.length})
        </h2>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          All room tariffs and availability toggles sync in real-time to travelers
        </span>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading inventory...</div>
      ) : inventory.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: '#0f172a', borderRadius: '16px' }}>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>No properties linked yet.</p>
          <button onClick={onDemoLogin} style={{ background: '#ff6b35', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            Load Rajputana Properties
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {inventory.map((hotel) => (
            <div
              key={hotel.id}
              id={`hotel-card-${hotel.id}`}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: '260px 1fr',
                gap: '24px'
              }}
            >
              {/* Hotel Image & Status */}
              <div>
                <div style={{ position: 'relative', height: '170px', borderRadius: '12px', overflow: 'hidden' }}>
                  <img
                    src={hotel.heroImageUrl}
                    alt={hotel.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: hotel.availabilityStatus === 'AVAILABLE' ? 'rgba(16, 185, 129, 0.9)' : (hotel.availabilityStatus === 'LIMITED' ? 'rgba(245, 158, 11, 0.9)' : 'rgba(239, 68, 68, 0.9)'),
                    color: '#fff',
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: 700
                  }}>
                    {hotel.availabilityStatus}
                  </span>
                </div>

                {/* Quick Status Toggle */}
                <div style={{ marginTop: '14px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>
                    Live Booking Status
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {['AVAILABLE', 'LIMITED', 'UNAVAILABLE'].map((st) => (
                      <button
                        key={st}
                        disabled={updatingId === hotel.id}
                        onClick={() => onUpdateAvailability(hotel.id, st)}
                        style={{
                          background: hotel.availabilityStatus === st ? '#ff6b35' : 'rgba(255, 255, 255, 0.05)',
                          color: hotel.availabilityStatus === st ? '#fff' : '#94a3b8',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          padding: '6px 4px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {st === 'AVAILABLE' ? 'OPEN' : (st === 'LIMITED' ? 'FEW' : 'CLOSED')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hotel Details & Room Inventory */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#ff6b35', fontWeight: 700, textTransform: 'uppercase' }}>
                      {hotel.tier} · {hotel.city?.name}
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0 6px', color: '#fff' }}>
                      {hotel.name}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      📍 {hotel.address}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Starting Tariff</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>
                      ₹{hotel.startingPriceInr.toLocaleString('en-IN')}
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 400 }}> / night</span>
                    </div>
                    <button
                      id={`edit-tariff-${hotel.id}`}
                      onClick={() => onOpenTariffModal(hotel)}
                      style={{
                        marginTop: '8px',
                        background: 'rgba(255, 107, 53, 0.15)',
                        color: '#ff6b35',
                        border: '1px solid rgba(255, 107, 53, 0.3)',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      ✏️ Edit Tariff & Policies
                    </button>
                  </div>
                </div>

                {/* Rooms Grid */}
                <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#e5e7eb', fontWeight: 700, marginBottom: '12px' }}>
                    Room Categories & Nightly Rates ({hotel.rooms?.length || 0})
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    {hotel.rooms?.map((room) => (
                      <div
                        key={room.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '10px',
                          padding: '14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{room.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                            Max Guests: {room.maxGuests} · {room.includesBreakfast ? 'Free Breakfast' : 'Room Only'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '2px' }}>
                            Available: {room.availableCount} units
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>
                            ₹{room.basePriceInr.toLocaleString('en-IN')}
                          </div>
                          <button
                            onClick={() => {
                              const next = prompt(`Enter new price for ${room.title}:`, room.basePriceInr.toString());
                              if (next && !isNaN(Number(next))) {
                                onRoomPriceQuickUpdate(hotel.id, room.id, Number(next));
                              }
                            }}
                            style={{
                              marginTop: '4px',
                              background: 'transparent',
                              color: '#94a3b8',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            Adjust ₹
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
