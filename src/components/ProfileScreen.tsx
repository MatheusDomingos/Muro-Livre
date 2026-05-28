import React from 'react';
import { User, Shield, Terminal, Clock, Trash2, Award, FileSpreadsheet, HardDrive } from 'lucide-react';
import { UserSession, Capture } from '../types';

interface ProfileScreenProps {
  session: UserSession | null;
  captures: Capture[];
  onLogout: () => void;
  onResetData: () => void;
}

export function ProfileScreen({ session, captures, onLogout, onResetData }: ProfileScreenProps) {
  // Filter captures by matching current user
  const userCaptures = captures.filter((cap) => cap.archivist === session?.uniqueTag);

  // Compute rank dynamically
  const getRank = (count: number) => {
    if (count <= 1) return 'INFORMANT_NODE';
    if (count <= 3) return 'RECON_ARCHIVIST';
    if (count <= 5) return 'CHIEF_CHRONICLER';
    return 'LEAD ARCHIVIST';
  };

  const currentRank = session ? getRank(captures.length) : 'INFORMANT_NODE';

  return (
    <div className="flex flex-col h-[calc(100vh-144px)] overflow-y-auto text-white p-4 space-y-5 font-mono select-none" id="profile-screen-container">
      
      {/* Profiler Hero Panel card */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 relative overflow-hidden flex flex-col space-y-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF5511] opacity-[0.03] blur-[80px] pointer-events-none rounded-full" />
        
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-[#FF5511] shadow-inner relative">
            <User className="w-7 h-7 stroke-[1.5]" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-900" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              <Shield className="w-3.5 h-3.5" />
              <span>SPATIAL CONSOLE</span>
            </div>
            <h3 className="text-lg font-black text-[#F8C3A6] truncate">{session?.uniqueTag || '@STREET_ARCHIVE_01'}</h3>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{session?.email || 'contact@muro-libre.io'}</p>
          </div>
        </div>

        {/* Dynamic Metrics grid dials */}
        <div className="grid grid-cols-2 gap-3.5 text-xs pt-2 border-t border-zinc-800/65">
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-3 space-y-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-wider">RANK STATUS</span>
            <div className="flex items-center space-x-1.5 text-orange-500 font-extrabold text-[11px] uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>{currentRank}</span>
            </div>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800  rounded-lg p-3 space-y-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-wider">ARCHIVED INDEX</span>
            <div className="flex items-center space-x-1.5 text-[#F8C3A6] font-extrabold text-[11px] uppercase tracking-widest">
              <HardDrive className="w-3.5 h-3.5 shrink-0" />
              <span>{userCaptures.length} / {captures.length} RECORDS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Node Diagnostic Specs Info */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-3">
        <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest border-b border-zinc-950 pb-2.5">
          <Terminal className="w-3.5 h-3.5 text-orange-500" />
          <span>NODE DIAGNOSTICS telemetry</span>
        </div>

        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between py-1 border-b border-zinc-950">
            <span className="text-zinc-500 uppercase">PEER DEVICE ID</span>
            <span className="text-[#F8C3A6] text-right font-bold truncate max-w-[180px]">{session?.device_id || 'NODE-SHA256-402X'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-zinc-950">
            <span className="text-zinc-500 uppercase">CONSOLIDATED GATEWAY</span>
            <span className="text-zinc-300">https://muro-libre.io:3000</span>
          </div>
          <div className="flex justify-between py-1 border-b border-zinc-950">
            <span className="text-zinc-500 uppercase">SESSION STARTED</span>
            <div className="flex items-center space-x-1 text-zinc-300">
              <Clock className="w-3 h-3 text-orange-500" />
              <span>{session ? new Date(session.start_time).toLocaleTimeString() : 'N/A'}</span>
            </div>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-zinc-500 uppercase">STORAGE TYPE</span>
            <span className="text-orange-500 font-bold uppercase">SEC_LOCAL_CACHE</span>
          </div>
        </div>
      </div>

      {/* Your Submitted Logs feed */}
      <div className="flex flex-col space-y-2">
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">YOUR COMMITTED COMMITS</h4>
        
        {userCaptures.length === 0 ? (
          <div className="bg-zinc-900/30 border border-zinc-805/40 rounded-xl p-6 text-center text-zinc-500 text-xs">
            No dynamic captures on current device cache yet. Tap "CAPTURE" tab to record.
          </div>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {userCaptures.map((capture) => (
              <div 
                key={capture.id}
                className="bg-zinc-950 border border-zinc-840/60 p-2.5 rounded-lg flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded overflow-hidden bg-black border border-zinc-800 flex-shrink-0">
                    <img src={capture.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="space-y-0.5">
                    <h6 className="font-extrabold text-[#F8C3A6] tracking-wider text-[11px]">{capture.tag}</h6>
                    <span className="text-[9px] text-[#FF5511] font-semibold">{capture.category}</span>
                  </div>
                </div>

                <div className="text-right text-[10px] text-zinc-500">
                  <span>{new Date(capture.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone / Diagnostic utilities */}
      <div className="bg-zinc-900/30 border border-zinc-805/40 rounded-xl p-4 space-y-4">
        <div className="flex items-center space-x-2 text-[10px] text-red-500/80 font-bold uppercase tracking-widest">
          <Trash2 className="w-3.5 h-3.5" />
          <span>UTILITIES & DANGER ZONE</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              if (confirm('Clear local caching and restore preloaded database? This will reset all new captures.')) {
                onResetData();
              }
            }}
            className="flex-1 border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-amber-500 font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
            id="reset-database-btn"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>RESET DATABASE</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to terminate this active secure session?')) {
                onLogout();
              }
            }}
            className="flex-1 border border-red-950 bg-red-955/20 hover:bg-red-900 hover:text-white text-red-500 font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
            id="logout-session-btn"
          >
            <span>TERMINATE SESSION</span>
          </button>
        </div>
      </div>
    </div>
  );
}
