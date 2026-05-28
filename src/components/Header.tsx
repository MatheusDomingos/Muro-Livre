import React from 'react';
import { LayoutGrid } from 'lucide-react';

interface HeaderProps {
  captureCount: number;
  goalCount?: number;
  onLogoClick?: () => void;
}

export function Header({ captureCount, goalCount = 5, onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950 border-b border-zinc-900/80 px-4 py-4 flex items-center justify-between select-none">
      {/* Branding with Grid Icon */}
      <div 
        onClick={onLogoClick}
        className="flex items-center space-x-2.5 cursor-pointer active:opacity-80"
        id="header-brand-logo"
      >
        <LayoutGrid className="w-[18px] h-[18px] text-[#F8C3A6] stroke-2" />
        <span className="text-lg font-black tracking-tight text-[#F8C3A6] font-mono">
          MURO LIVRE
        </span>
      </div>

      {/* Capture Count Badge */}
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 flex items-center"
        id="header-captures-pill"
      >
        <span className="text-[10px] font-bold tracking-widest text-zinc-400 font-mono uppercase">
          {captureCount}/{Math.max(captureCount, goalCount)} CAPTURES
        </span>
      </div>
    </header>
  );
}
