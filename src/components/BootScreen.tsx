import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MuroLivreLogo } from './MuroLivreLogo';

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING BOOTSTRAP...');

  useEffect(() => {
    // Stage-based progress increments for cyberpunk realism
    const intervals = [
      { ms: 100, inc: 8, text: 'RESOLVING IPFS LOCAL ALIASES...' },
      { ms: 400, inc: 12, text: 'DECRYPTING SECURE PUBLIC KEY...' },
      { ms: 800, inc: 15, text: 'ESTABLISHING PEER CONNECTION...' },
      { ms: 1200, inc: 20, text: 'SYNCING SPATIAL GRAPH DATA...' },
      { ms: 1700, inc: 15, text: 'DOWNLOADING LOCALLY ENCRYPTED PINS...' },
      { ms: 2100, inc: 30, text: 'DECENTRALIZED ARCHIVE SYNC FULLY ONLINE.' }
    ];

    let currentProgress = 0;
    const timers: NodeJS.Timeout[] = [];

    intervals.forEach((stage, idx) => {
      const timer = setTimeout(() => {
        currentProgress += stage.inc;
        setProgress(Math.min(currentProgress, 100));
        setStatusText(stage.text);
        if (idx === intervals.length - 1) {
          // Final complete timeout
          setTimeout(() => {
            onComplete();
          }, 400);
        }
      }, stage.ms);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-between p-8 font-mono select-none overflow-hidden">
      {/* Visual Crop Marks / Corner Ticks */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-zinc-900 pointer-events-none" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-zinc-900 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-zinc-900 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-zinc-900 pointer-events-none" />

      {/* Decorative center grid matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(#1c1917_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

      <div /> {/* Spacer */}

      {/* Center Branding Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center space-y-6 z-10"
      >
        <MuroLivreLogo className="w-36 h-24 mb-4" />
        
        <h1 className="text-4xl sm:text-5xl font-mono tracking-tight font-extrabold text-[#F8C3A6]">
          MURO LIVRE
        </h1>
        
        <p className="text-xs tracking-[0.3em] font-medium text-zinc-500 uppercase">
          DECENTRALIZED URBAN ARCHIVE
        </p>
      </motion.div>

      {/* Loading Mechanics and Ticker */}
      <div className="w-full max-w-sm flex flex-col space-y-6 z-10 text-center px-4" id="boot-loader-container">
        {/* Retro visual progress line */}
        <div className="relative h-[3px] w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div
            style={{ width: `${progress}%` }}
            className="h-full bg-[#FF5511] shadow-[0_0_8px_#FF5511]"
            transition={{ type: 'spring', stiffness: 80 }}
          />
        </div>

        {/* Low level tech feedback logs */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2 text-[10px] text-zinc-600">
            <span className="w-1.5 h-1.5 bg-[#FF5511] rounded-full animate-ping" />
            <span>PORT 3000 / PEER PROTOCOL UDP_V2</span>
          </div>
          
          <div className="text-[11px] font-mono font-semibold text-[#FF5511] tracking-wider animate-pulse uppercase leading-none min-h-[16px]">
            ((●)) {statusText}
          </div>
        </div>
      </div>

      {/* Footer metadata alignment */}
      <div className="text-[9px] text-zinc-700 tracking-widest uppercase z-10">
        SYS_VER_2.0.4 // DEV_GEO_NODE_TRUE
      </div>
    </div>
  );
}
