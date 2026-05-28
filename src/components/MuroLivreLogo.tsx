import React from 'react';

interface LogoProps {
  className?: string;
  orangeColor?: string;
}

export function MuroLivreLogo({ className = 'w-28 h-20', orangeColor = '#FF5511' }: LogoProps) {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <svg
        viewBox="0 0 120 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-zinc-800"
      >
        {/* Outer frame with technical side tabs */}
        <rect x="15" y="10" width="90" height="50" stroke="currentColor" strokeWidth="3" />
        
        {/* Inner vertical support guidelines (archived industrial vibe) */}
        <line x1="25" y1="10" x2="25" y2="60" stroke="currentColor" strokeWidth="1.5" />
        <line x1="95" y1="10" x2="95" y2="60" stroke="currentColor" strokeWidth="1.5" />
        
        {/* Double diagonal lines forming local mesh "M" and envelope lines */}
        <path d="M15 10 L60 45 L105 10" stroke="currentColor" strokeWidth="2.5" />
        <path d="M15 60 L60 30 L105 60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        
        {/* The glowing neon orange communication/signal dome curve */}
        <path
          d="M 35 30 Q 60 16 85 30"
          stroke={orangeColor}
          strokeWidth="4"
          strokeLinecap="round"
          className="animate-pulse"
        />
        
        {/* Crosshair tech ticks */}
        <line x1="60" y1="5" x2="60" y2="10" stroke="currentColor" strokeWidth="1.5" />
        <line x1="60" y1="60" x2="60" y2="65" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
