import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MuroLivreLogo } from './MuroLivreLogo';

interface LoginScreenProps {
  onLogin: (uniqueTag: string, email: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [tag, setTag] = useState('STREET_ARCHIVE_01');
  const [email, setEmail] = useState('contact@muro-libre.io');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag.trim() || !email.trim()) return;

    setIsSubmitting(true);
    // Add brief stylized submit transition
    setTimeout(() => {
      // Ensure there is the @ prefix
      const formattedTag = tag.startsWith('@') ? tag : `@${tag}`;
      onLogin(formattedTag, email);
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 font-mono overflow-hidden">
      {/* Decorative ambient lighting behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5511] opacity-5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Visual Crop Marks / Corner Ticks on Screen Edge */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-zinc-900 pointer-events-none" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-zinc-900 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-zinc-900 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-zinc-900 pointer-events-none" />

      {/* Main Login Frame Panel (exactly replicating Screen 1 structure) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        id="login-card-frame"
        className="w-full max-w-sm border border-zinc-805/90 bg-zinc-900/40 backdrop-blur-md rounded-xl p-8 flex flex-col space-y-8 relative shadow-2xl"
      >
        {/* Top-aligned subtle thin wireframe line details */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <MuroLivreLogo className="w-24 h-16" />
          
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#F8C3A6]">
              MURO LIVRE
            </h2>
            <p className="text-[9px] tracking-[0.25em] font-medium text-zinc-500 uppercase">
              DECENTRALIZED URBAN ARCHIVE
            </p>
          </div>
        </div>

        {/* Input Access Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          {/* Tag Field */}
          <div className="flex flex-col space-y-1.5" id="tag-input-group">
            <label className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
              UNIQUE TAG (PUBLIC IDENTITY)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-zinc-650 font-bold">@</span>
              <input
                type="text"
                required
                value={tag.replace(/^@/, '')}
                onChange={(e) => setTag(e.target.value)}
                placeholder="STREET_ARCHIVE_01"
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-[#FF5511] rounded-lg py-3.5 pl-10 pr-4 text-sm font-semibold tracking-wide text-[#F8C3A6] placeholder-zinc-700 outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Contact Field */}
          <div className="flex flex-col space-y-1.5" id="contact-input-group">
            <label className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
              PHONE / EMAIL
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@muro-libre.io"
              className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-[#FF5511] rounded-lg py-3.5 px-4 text-sm font-semibold tracking-wide text-zinc-300 placeholder-zinc-700 outline-none transition-all duration-200"
            />
          </div>

          {/* Start Session Trigger Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF5511] hover:bg-[#FF6622] active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm tracking-widest uppercase py-4 rounded-lg shadow-lg hover:shadow-[#FF5511]/15 transition-all duration-200"
            id="start-session-btn"
          >
            {isSubmitting ? 'ESTABLISHING PROTOCOL...' : 'START SESSION'}
          </button>
        </form>

        {/* Metadata Status Tray (replicating exact Screen 1 bottom banner) */}
        <div className="border border-zinc-800/60 rounded-md py-2 px-3 flex justify-between items-center text-[10px] tracking-wide text-zinc-500 bg-zinc-950/40">
          <span className="font-semibold text-zinc-600">ARCHIVE_V.2.0.4</span>
          
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5511]"></span>
            </span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">LIVE FEED ACTIVE</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
