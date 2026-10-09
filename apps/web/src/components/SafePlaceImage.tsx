'use client';

import React, { useState } from 'react';
import { Camera, ImageOff, ShieldCheck, Hotel as HotelIcon, Landmark } from 'lucide-react';

interface SafePlaceImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackType?: 'attraction' | 'hotel' | 'destination' | 'circuit';
  provenance?: {
    sourceType?: string;
    sourceName?: string;
    photographer?: string;
    license?: string;
  };
}

export default function SafePlaceImage({
  src,
  alt,
  className = '',
  fallbackType = 'attraction',
  provenance
}: SafePlaceImageProps) {
  const [error, setError] = useState(false);

  // If source is missing, or image fails to load, render clean neutral placeholder
  if (!src || error) {
    const isDarkBg = fallbackType === 'circuit';
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 text-center select-none ${
          isDarkBg ? 'bg-stone-900 text-stone-300' : 'bg-stone-100 text-stone-500'
        } ${className}`}
        aria-label={`${alt} - Photo coming soon`}
      >
        <div className={`p-3 rounded-full mb-2 ${isDarkBg ? 'bg-stone-800' : 'bg-white shadow-sm'}`}>
          {fallbackType === 'hotel' ? (
            <HotelIcon className="w-6 h-6 text-stone-400" />
          ) : fallbackType === 'attraction' ? (
            <Landmark className="w-6 h-6 text-stone-400" />
          ) : (
            <Camera className="w-6 h-6 text-stone-400" />
          )}
        </div>
        <span className="text-xs font-semibold tracking-wide text-stone-600">
          Photo coming soon
        </span>
        <span className="text-[10px] text-stone-400 mt-0.5 max-w-[80%] truncate">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        onError={() => setError(true)}
      />
    </div>
  );
}
