import React from 'react';
import { Map, Target, User } from 'lucide-react';
import { AppView } from '../types';

interface BottomNavProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

export function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const tabs = [
    { id: 'MAP' as AppView, label: 'MAP', icon: Map },
    { id: 'CAPTURE' as AppView, label: 'CAPTURE', icon: Target },
    { id: 'PROFILE' as AppView, label: 'PROFILE', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-zinc-950 border-t border-zinc-900 z-40 h-20 flex justify-around items-stretch select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center relative transition-all duration-200 outline-none ${
              isActive 
                ? 'text-white bg-zinc-900/30' 
                : 'text-zinc-550 hover:text-zinc-300'
            }`}
            id={`nav-tab-${tab.id.toLowerCase()}`}
          >
            {/* The active top highlight accent line (highly accurate to Screen 2 & 4 style) */}
            {isActive && (
              <div className="absolute top-0 inset-x-4 h-1 bg-[#FF5511] shadow-[0_0_8px_#FF5511]" />
            )}

            {/* Icon representation */}
            <div className={`p-1.5 rounded transition-all duration-200 ${
              isActive && tab.id === 'CAPTURE' 
                ? 'bg-[#FF5511] text-white rounded-md p-2 -translate-y-1' 
                : ''
            }`}>
              <Icon className={`w-5 h-5 stroke-[2] ${
                isActive && tab.id !== 'CAPTURE' ? 'text-[#FF5511]' : ''
              }`} />
            </div>

            {/* Semantic Label */}
            <span className="text-[10px] font-bold font-mono tracking-wider mt-1 block">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
