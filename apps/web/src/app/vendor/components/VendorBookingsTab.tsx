'use client';

import React from 'react';

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

interface VendorBookingsTabProps {
  bookings: BookingRecord[];
  onConfirmCheckIn: (bookingRef: string) => void;
}

export default function VendorBookingsTab({
  bookings,
  onConfirmCheckIn,
}: VendorBookingsTabProps) {
  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#fff' }}>
          Guest Reservations & Check-In Log ({bookings.length})
        </h2>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          All bookings verified via ExploreBharat payment gateway
        </span>
      </div>

      {bookings.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: '#0f172a', borderRadius: '16px', color: '#94a3b8' }}>
          No active reservations for your properties yet.
        </div>
      ) : (
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Reference</th>
                <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Property & Category</th>
                <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Dates</th>
                <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Guests</th>
                <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Total Amount</th>
                <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Payment</th>
                <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#ff6b35' }}>
                    {b.bookingReference}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#fff' }}>
                    <div style={{ fontWeight: 600 }}>{b.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Guest: {b.user?.name || 'Priya Iyer'}</div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#e5e7eb' }}>
                    <div>{b.checkInDate}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>to {b.checkOutDate || 'Next Day'}</div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#e5e7eb' }}>
                    {b.guestCount} Guests
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#10b981' }}>
                    ₹{b.totalAmountInr.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      background: b.paymentStatus === 'SUCCESS' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: b.paymentStatus === 'SUCCESS' ? '#10b981' : '#f59e0b',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <button
                      onClick={() => onConfirmCheckIn(b.bookingReference)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      ✓ Confirm Check-In
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
