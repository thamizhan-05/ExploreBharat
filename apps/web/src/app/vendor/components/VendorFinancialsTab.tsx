'use client';

import React from 'react';

interface FinancialTransaction {
  bookingId: string;
  bookingReference: string;
  hotelName: string;
  grossAmountInr: number;
  platformFeeInr: number;
  netPayoutInr: number;
  payoutStatus: string;
}

interface VendorFinancialsTabProps {
  financials: {
    summary?: any;
    transactions?: FinancialTransaction[];
  } | null;
}

export default function VendorFinancialsTab({ financials }: VendorFinancialsTabProps) {
  const defaultTransactions = [
    {
      bookingId: '1',
      bookingReference: 'EB-HTL-VNDR-2026-001',
      hotelName: 'Shahpura Haveli Heritage Stay',
      grossAmountInr: 22000,
      platformFeeInr: 1760,
      netPayoutInr: 20240,
      payoutStatus: 'ESCROW_PENDING_CHECKIN'
    },
    {
      bookingId: '2',
      bookingReference: 'EB-HTL-VNDR-2026-002',
      hotelName: 'Shahpura Haveli Heritage Stay',
      grossAmountInr: 14710,
      platformFeeInr: 1177,
      netPayoutInr: 13533,
      payoutStatus: 'ESCROW_PENDING_CHECKIN'
    }
  ];

  const transactions = financials?.transactions || defaultTransactions;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#fff' }}>
            Financial Settlement & Payout Ledger
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
            Commission structure: 8% ExploreBharat platform fee · 92% Vendor net payout
          </div>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          padding: '8px 16px',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          Auto-Payout Schedule: Every Tuesday & Friday
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Booking Ref</th>
              <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Property</th>
              <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Gross Amount</th>
              <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>ExploreBharat (8%)</th>
              <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Vendor Net (92%)</th>
              <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Escrow Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '16px 20px', fontWeight: 700, color: '#ff6b35' }}>
                  {tx.bookingReference}
                </td>
                <td style={{ padding: '16px 20px', color: '#fff' }}>
                  {tx.hotelName}
                </td>
                <td style={{ padding: '16px 20px', color: '#e5e7eb', fontWeight: 600 }}>
                  ₹{tx.grossAmountInr.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '16px 20px', color: '#d8b4fe' }}>
                  - ₹{tx.platformFeeInr.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 800 }}>
                  ₹{tx.netPayoutInr.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    background: tx.payoutStatus === 'SETTLED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                    color: tx.payoutStatus === 'SETTLED' ? '#10b981' : '#60a5fa',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {tx.payoutStatus === 'SETTLED' ? 'SETTLED' : 'ESCROW CLEARANCE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
