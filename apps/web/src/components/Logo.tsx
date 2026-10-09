import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'primary' | 'compact' | 'icon' | 'reverse' | 'reverse-compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  href?: string;
}

export default function Logo({
  variant = 'compact',
  size = 'md',
  className = '',
  href
}: LogoProps) {
  // Sizing definitions
  const sizeMap = {
    sm: { height: 28, iconSize: 24, textClass: 'text-lg', tagClass: 'text-[7px]' },
    md: { height: 38, iconSize: 34, textClass: 'text-2xl', tagClass: 'text-[9px]' },
    lg: { height: 48, iconSize: 42, textClass: 'text-3xl', tagClass: 'text-[11px]' },
    xl: { height: 62, iconSize: 54, textClass: 'text-4xl', tagClass: 'text-[13px]' }
  };

  const { height, iconSize, textClass, tagClass } = sizeMap[size];
  const isDark = variant === 'reverse' || variant === 'reverse-compact';
  const showTagline = variant === 'primary' || variant === 'reverse';

  const mark = (
    <svg
      width={iconSize}
      height={iconSize * 1.15}
      viewBox="0 0 80 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
    >
      {/* Outer Pin Body */}
      <path
        d="M 40 88 C 38 84 10 54 10 36 C 10 20 23.4 7 40 7 C 42 7 44 7.2 46 7.6 L 46 15.5 C 44 15.2 42 15 40 15 C 28.4 15 19 24.4 19 36 C 19 50 38 74 40 78 C 42 74 61 50 61 36 C 61 34.2 60.8 32.5 60.5 30.8 L 68.2 29.2 C 68.7 31.4 69 33.7 69 36 C 69 54 42 84 40 88 Z"
        fill={isDark ? '#FFFFFF' : '#132238'}
      />

      {/* Top-Right Vibrant Orange Arc */}
      <path
        d="M 48.5 7.7 C 59.8 10.4 68.6 19.2 71.3 30.5 L 63.8 32.2 C 61.8 23.5 55 16.7 46.3 14.7 Z"
        fill="#F58220"
      />

      {/* Inner Compass Dial Disk */}
      <circle
        cx="40"
        cy="36"
        r="21"
        fill={isDark ? '#132238' : '#FFFFFF'}
        stroke={isDark ? '#FFFFFF' : '#132238'}
        strokeWidth="2.2"
      />

      {/* Compass Crosshair Ticks */}
      <line x1="40" y1="12" x2="40" y2="18" stroke={isDark ? '#FFFFFF' : '#132238'} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="40" y1="54" x2="40" y2="60" stroke={isDark ? '#FFFFFF' : '#132238'} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="16" y1="36" x2="22" y2="36" stroke={isDark ? '#FFFFFF' : '#132238'} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="58" y1="36" x2="64" y2="36" stroke={isDark ? '#FFFFFF' : '#132238'} strokeWidth="2.2" strokeLinecap="round" />

      {/* S-curved River / Path flowing upward */}
      <path
        d="M 38 57 C 38 50 45 48 43 42 C 41 37 33 36 37 29"
        stroke={isDark ? '#FFFFFF' : '#132238'}
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Compass Needle / Arrow pointing North-East */}
      <polygon points="40,33 53,23 43,36" fill="#F58220" />
      <polygon points="40,33 43,36 37,38" fill={isDark ? '#FFFFFF' : '#132238'} />
    </svg>
  );

  if (variant === 'icon') {
    if (href) {
      return (
        <Link href={href} className={`inline-flex items-center ${className}`}>
          {mark}
        </Link>
      );
    }
    return <div className={`inline-flex items-center ${className}`}>{mark}</div>;
  }

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {mark}
      <div className="flex flex-col">
        <span
          className={`font-sans font-extrabold tracking-tight leading-none ${textClass} ${
            isDark ? 'text-white' : 'text-[#132238]'
          }`}
        >
          Explore<span className="font-black text-[#132238] dark:text-white" style={{ color: isDark ? '#FFFFFF' : '#132238' }}>Bharat</span>
        </span>
        {showTagline && (
          <span
            className={`font-sans font-bold uppercase tracking-[0.16em] mt-1 leading-none ${tagClass} ${
              isDark ? 'text-slate-300' : 'text-[#132238]/80'
            }`}
          >
            DISCOVER INDIA. PLAN YOUR JOURNEY.
          </span>
        )}
      </div>
      {isDark && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-slate-400 opacity-70 ml-1">
          <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z" fill="currentColor"/>
        </svg>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
