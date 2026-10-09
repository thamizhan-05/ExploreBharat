'use client';

import React from 'react';

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

interface VendorProfileTabProps {
  profile: VendorProfile | null;
}

export default function VendorProfileTab({ profile }: VendorProfileTabProps) {
  return (
    <section>
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '800px'
      }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', margin: '0 0 24px' }}>
          Vendor Verification & Regulatory Profile
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Registered Business Name</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', marginTop: '4px' }}>
              {profile?.businessName || 'Rajputana Experiences & Resorts Pvt Ltd'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Verification Status</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
              ✓ VERIFIED GOVERNMENT ENTITY
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>GSTIN / Tax Registration</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e5e7eb', marginTop: '4px' }}>
              {profile?.gstNumber || '08AAAAA0000A1Z5'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Authorized Contact Phone</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e5e7eb', marginTop: '4px' }}>
              {profile?.contactPhone || '+91 98765 11223'}
            </div>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Registered Business Address</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e5e7eb', marginTop: '4px' }}>
              {profile?.address || 'Amer Road, Jaipur, Rajasthan 302002'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
