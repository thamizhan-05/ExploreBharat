'use client';

import React, { useState } from 'react';
import { MapPin, ExternalLink, Navigation, ZoomIn, ZoomOut, Layers } from 'lucide-react';

interface OpenStreetMapProps {
  latitude: number;
  longitude: number;
  placeName: string;
  zoom?: number;
  height?: string;
  showDirectionsButton?: boolean;
}

export default function OpenStreetMap({
  latitude,
  longitude,
  placeName,
  zoom = 14,
  height = '360px',
  showDirectionsButton = true
}: OpenStreetMapProps) {
  const [currentZoom, setCurrentZoom] = useState(zoom);

  // Calculate bounding box around the coordinates for OpenStreetMap embed
  const delta = 0.02 * (15 / currentZoom);
  const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;

  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
  const osmDirectUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${currentZoom}/${latitude}/${longitude}`;
  const directionsUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B${latitude}%2C${longitude}`;

  return (
    <div style={{
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
      background: '#0f172a'
    }}>
      {/* Top Banner with OpenStreetMap Attribution */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin style={{ width: '16px', height: '16px', color: '#ff6b35' }} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{placeName}</span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            ({latitude.toFixed(4)}, {longitude.toFixed(4)})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.7rem',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: 600
          }}>
            OpenStreetMap (100% Free & Open Source)
          </span>

          <a
            href={osmDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in full OpenStreetMap"
            style={{
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              padding: '4px'
            }}
          >
            <ExternalLink style={{ width: '14px', height: '14px' }} />
          </a>
        </div>
      </div>

      {/* Interactive OSM Map Frame */}
      <iframe
        title={`OpenStreetMap for ${placeName}`}
        width="100%"
        height={height}
        style={{
          border: 'none',
          display: 'block',
          filter: 'contrast(1.05) saturate(1.1)'
        }}
        src={osmEmbedUrl}
        loading="lazy"
      />

      {/* Controls Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        zIndex: 10
      }}>
        <button
          onClick={() => setCurrentZoom((z) => Math.min(z + 1, 18))}
          title="Zoom In"
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ZoomIn style={{ width: '16px', height: '16px' }} />
        </button>
        <button
          onClick={() => setCurrentZoom((z) => Math.max(z - 1, 6))}
          title="Zoom Out"
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ZoomOut style={{ width: '16px', height: '16px' }} />
        </button>
      </div>

      {/* Free Turn-by-Turn Navigation Action */}
      {showDirectionsButton && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          zIndex: 10
        }}>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #ff6b35, #ea580c)',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(255, 107, 53, 0.4)'
            }}
          >
            <Navigation style={{ width: '14px', height: '14px' }} />
            Free OSRM Navigation
          </a>
        </div>
      )}
    </div>
  );
}
