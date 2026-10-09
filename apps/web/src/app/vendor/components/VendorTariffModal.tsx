'use client';

import React from 'react';

interface HotelProperty {
  id: string;
  name: string;
  startingPriceInr: number;
  availabilityStatus: string;
  cancellationPolicy: string;
}

interface VendorTariffModalProps {
  editingHotel: HotelProperty | null;
  onClose: () => void;
  editTariffPrice: number;
  setEditTariffPrice: (val: number) => void;
  editAvailability: string;
  setEditAvailability: (val: string) => void;
  editCancelPolicy: string;
  setEditCancelPolicy: (val: string) => void;
  updatingId: string | null;
  onSaveTariff: (e: React.FormEvent) => void;
}

export default function VendorTariffModal({
  editingHotel,
  onClose,
  editTariffPrice,
  setEditTariffPrice,
  editAvailability,
  setEditAvailability,
  editCancelPolicy,
  setEditCancelPolicy,
  updatingId,
  onSaveTariff,
}: VendorTariffModalProps) {
  if (!editingHotel) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#161f30',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '16px',
        padding: '28px',
        maxWidth: '540px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 8px', color: '#fff' }}>
          Update Tariff & Policies
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 20px' }}>
          {editingHotel.name}
        </p>

        <form onSubmit={onSaveTariff}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#e5e7eb', marginBottom: '6px', fontWeight: 600 }}>
              Starting Nightly Tariff (₹ INR)
            </label>
            <input
              type="number"
              min="500"
              value={editTariffPrice}
              onChange={(e) => setEditTariffPrice(Number(e.target.value))}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 600
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#e5e7eb', marginBottom: '6px', fontWeight: 600 }}>
              Availability Status
            </label>
            <select
              value={editAvailability}
              onChange={(e) => setEditAvailability(e.target.value)}
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '0.95rem'
              }}
            >
              <option value="AVAILABLE">AVAILABLE (Open for instant booking)</option>
              <option value="LIMITED">LIMITED (Few rooms left)</option>
              <option value="UNAVAILABLE">UNAVAILABLE (Sold out)</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#e5e7eb', marginBottom: '6px', fontWeight: 600 }}>
              Cancellation Policy
            </label>
            <input
              type="text"
              value={editCancelPolicy}
              onChange={(e) => setEditCancelPolicy(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#e5e7eb',
                padding: '10px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatingId === editingHotel.id}
              style={{
                background: 'linear-gradient(135deg, #ff6b35, #ea580c)',
                border: 'none',
                color: '#fff',
                padding: '10px 22px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Save & Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
