import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Plus, Minus, Navigation2, MapPin, Grid, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { Capture, MapMarker } from '../types';

interface MapScreenProps {
  captures: Capture[];
  markers: MapMarker[];
  onSelectCapture: (capture: Capture) => void;
  userCoords: { lat: number; lng: number } | null;
  requestGPS: () => void;
}

export function MapScreen({
  captures,
  markers,
  onSelectCapture,
  userCoords,
  requestGPS
}: MapScreenProps) {
  // Map pan and zoom state
  const [zoom, setZoom] = useState(1.1);
  const [offset, setOffset] = useState({ x: -40, y: -80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // Default coordinate projection (Center near NY Manhattan coordinates)
  const mapCenter = { lat: 40.7128, lng: -74.0060 };

  // Calculate coordinates to SVG pixel projection
  const projectCoords = (lat: number, lng: number) => {
    // Basic mercator projection scale around NY coordinates
    const scaleY = 3200; // arbitrary scale for map coordinate fitting
    const scaleX = 2400;

    const x = 500 + (lng - mapCenter.lng) * scaleX;
    const y = 400 - (lat - mapCenter.lat) * scaleY;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Safe zoom function
  const zoomIn = () => setZoom(z => Math.min(z + 0.15, 2.5));
  const zoomOut = () => setZoom(z => Math.max(z - 0.15, 0.7));

  // Center on user position or default New York
  const handleRecenter = () => {
    if (userCoords) {
      const proj = projectCoords(userCoords.lat, userCoords.lng);
      // Let's pan to center this SVG point
      setOffset({
        x: (mapContainerRef.current?.clientWidth || 800) / 2 - proj.x * zoom,
        y: (mapContainerRef.current?.clientHeight || 600) / 2 - proj.y * zoom
      });
    } else {
      requestGPS();
      setOffset({ x: -40, y: -80 });
      setZoom(1.1);
    }
  };

  // Center on capture coordinate when a carousel card is clicked
  const handleCardClick = (capture: Capture) => {
    const proj = projectCoords(capture.lat, capture.lng);
    const containerWidth = mapContainerRef.current?.clientWidth || 800;
    const containerHeight = mapContainerRef.current?.clientHeight || 600;
    
    // Pan and zoom elegantly
    setZoom(1.4);
    setOffset({
      x: containerWidth / 2 - proj.x * 1.4,
      y: containerHeight / 2 - proj.y * 1.4
    });

    // Find custom marker related to capture
    const marker = markers.find(m => m.captureId === capture.id);
    if (marker) {
      setSelectedMarker(marker);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-144px)] text-white relative font-mono select-none overflow-hidden" id="map-screen-viewport">
      
      {/* Dynamic Cyber-Map Canvas area */}
      <div
        ref={mapContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 bg-[#0c0c0e] overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        
        {/* Procedural Cyber Grid System & Waterways SVG background */}
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
          className="absolute inset-0 w-[2000px] h-[1500px] transition-transform duration-300 ease-out pointer-events-none"
        >
          <svg width="2000" height="1500" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0">
            {/* Fine Grid pattern */}
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#16161c" strokeWidth="1" />
                <circle cx="0" cy="0" r="1.5" fill="#252530" />
              </pattern>
            </defs>
            <rect width="2000" height="1500" fill="url(#mapGrid)" />

            {/* Simulated Cyber City Water Channel Vectors (E.g. Hudson/East River layout) */}
            <path
              d="M 50,0 Q 250,400 350,750 T 600,1500 L 100,1500 L 0,600 Z"
              fill="#0d1117"
              stroke="#1a2333"
              strokeWidth="2"
            />
            <path
              d="M 900,0 Q 1100,500 1200,900 T 1450,1500"
              fill="none"
              stroke="#0f141d"
              strokeWidth="80"
              opacity="0.6"
            />

            {/* Urban Street Grid Overlay representation */}
            <g stroke="#181822" strokeWidth="1.5" strokeLinecap="square">
              {/* Horizontal primary arterial routes */}
              <line x1="0" y1="200" x2="2000" y2="200" strokeWidth="3" stroke="#222" />
              <line x1="0" y1="550" x2="2000" y2="550" strokeWidth="4" stroke="#2a2a35" />
              <line x1="0" y1="950" x2="2000" y2="950" strokeWidth="3" stroke="#222" />

              {/* Vertical primary avenues */}
              <line x1="450" y1="0" x2="450" y2="1500" strokeWidth="3.5" stroke="#2a2a35" />
              <line x1="1100" y1="0" x2="1100" y2="1500" strokeWidth="3" stroke="#1f1f2a" />
              <line x1="1600" y1="0" x2="1600" y2="1500" strokeWidth="4" stroke="#2a2a35" />

              {/* Secondary grids */}
              {Array.from({ length: 25 }).map((_, i) => (
                <g key={`sec-${i}`}>
                  <line x1="0" y1={100 + i * 80} x2="2000" y2={100 + i * 80} />
                  <line x1={150 + i * 120} y1="0" x2={150 + i * 120} y2="1500" />
                </g>
              ))}
            </g>

            {/* Radial cyber scan elements */}
            <circle cx="500" cy="400" r="300" fill="none" stroke="#FF5511" strokeWidth="1" strokeDasharray="3 20" opacity="0.3" />
            <circle cx="500" cy="400" r="150" fill="none" stroke="#FF5511" strokeWidth="1" strokeDasharray="5 5" opacity="0.15" />

            {/* Real or Mock Coordinates Reference Ticks */}
            <text x="350" y="540" fill="#444" fontSize="10">GRID NODE_NY_A4</text>
            <text x="1120" y="940" fill="#444" fontSize="10">SUB_CHANNEL_PEER_09</text>
          </svg>

          {/* Interactive Capture Pins / Markers */}
          {markers.map((marker) => {
            const pos = projectCoords(marker.lat, marker.lng);
            const isSelected = selectedMarker?.id === marker.id;

            return (
              <div
                key={marker.id}
                style={{
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="pointer-events-auto cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMarker(marker);
                  // Highlight card
                  const linkedCapture = captures.find(c => c.id === marker.captureId);
                  if (linkedCapture) {
                    onSelectCapture(linkedCapture);
                  }
                }}
              >
                {/* Visual Label (exactly mimicking rotated style in Screen 4) */}
                {marker.type === 'LOCKED' && (
                  <div
                    style={{ transform: 'rotate(-42deg) translate(25px, -15px)' }}
                    className="absolute whitespace-nowrap bg-zinc-950/90 border border-[#FF5511] text-[9px] font-bold text-[#F8C3A6] py-1 px-2 uppercase tracking-widest rounded-sm"
                  >
                    {marker.label}
                  </div>
                )}

                {/* Cyber diamond structure */}
                <div className={`w-8 h-8 flex items-center justify-center transition-all duration-200 relative`}>
                  
                  {/* Glowing halo when selected */}
                  {isSelected && (
                    <span className="absolute inset-0 bg-[#FF5511] rounded-full blur-md opacity-60 scale-125 animate-pulse" />
                  )}

                  <div className={`w-6 h-6 rotate-45 border flex items-center justify-center transition-all bg-zinc-900 duration-200 ${
                    isSelected 
                      ? 'border-[#FF5511] bg-black shadow-[0_0_10px_#FF5511]' 
                      : 'border-orange-500/80 hover:border-[#FF5511]'
                  }`}>
                    {/* Inner symbol depending on marker types */}
                    <div className="rotate-[-45deg] scale-80 text-[#FF5511] flex items-center justify-center">
                      {marker.type === 'LOCKED' && <span className="font-extrabold text-[12px] -mt-0.5">*</span>}
                      {marker.type === 'GRID' && <Grid className="w-2.5 h-2.5" />}
                      {marker.type === 'DOT' && <span className="w-1.5 h-1.5 bg-[#FF5511] rounded-full" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* User's Current GPS Location glowing point marker */}
          {userCoords && (
            <div
              style={{
                position: 'absolute',
                left: `${projectCoords(userCoords.lat, userCoords.lng).x}px`,
                top: `${projectCoords(userCoords.lat, userCoords.lng).y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="pointer-events-none"
            >
              <span className="absolute inline-flex h-10 w-10 -left-3 -top-3 rounded-full bg-blue-550/20 blur-md animate-ping" />
              <div className="relative h-4 w-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-70" />
              </div>
            </div>
          )}
        </div>

        {/* Floating Top Left Satellite Active Status (exactly Screen 4) */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-[#FF5511] text-white py-2 px-3 border border-orange-600/50 flex items-center space-x-2 shadow-lg rounded-sm text-[10px] tracking-widest font-bold uppercase select-none">
            <MapPin className="w-3.5 h-3.5" />
            <span>SATELLITE SYNC ACTIVE</span>
          </div>
        </div>

        {/* Floating Right Side Technical zoom HUD console controls */}
        <div className="absolute right-4 top-4 z-10 flex flex-col space-y-2.5">
          <button
            onClick={(e) => { e.stopPropagation(); zoomIn(); }}
            className="w-11 h-11 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 active:scale-95 flex items-center justify-center rounded-lg shadow-lg"
            title="Zoom In"
          >
            <Plus className="w-5 h-5 stroke-2" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); zoomOut(); }}
            className="w-11 h-11 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 active:scale-95 flex items-center justify-center rounded-lg shadow-lg"
            title="Zoom Out"
          >
            <Minus className="w-5 h-5 stroke-2" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleRecenter(); }}
            className={`w-11 h-11 border bg-zinc-900/90 hover:bg-zinc-800 active:scale-95 flex items-center justify-center rounded-lg shadow-lg ${
              userCoords ? 'border-blue-500 text-blue-400' : 'border-zinc-800 text-[#FF5511]'
            }`}
            title="Re-center Location"
          >
            <Navigation2 className="w-[18px] h-[18px] stroke-2 rotate-45" />
          </button>
        </div>

        {/* Animated Slide-Up Drawer Detail when marker is selected */}
        <AnimatePresence>
          {selectedMarker && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="absolute bottom-4 inset-x-4 z-20 bg-zinc-950/95 border border-[#FF5511] text-white p-4 rounded-xl flex flex-col sm:flex-row items-stretch gap-4 shadow-[0_4px_25px_rgba(255,85,17,0.15)] font-mono"
            >
              {/* Linked Capture preview */}
              {(() => {
                const mockCap = captures.find((c) => c.id === selectedMarker.captureId);
                return (
                  <>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">MAP MARKER ID</span>
                        <button
                          onClick={() => setSelectedMarker(null)}
                          className="hover:text-amber-500 text-zinc-500 text-xs px-2 py-0.5 bg-zinc-900/80 border border-zinc-800 rounded font-bold"
                        >
                          CLOSE
                        </button>
                      </div>
                      
                      <h4 className="text-sm font-bold text-[#F8C3A6] tracking-widest">{selectedMarker.label}</h4>
                      
                      <div className="grid grid-cols-2 gap-3 text-[10px] text-zinc-400 py-1 border-t border-b border-zinc-900">
                        <div>
                          <span className="text-zinc-650 block">CLASSIFICATION</span>
                          <span className="text-zinc-300 font-bold uppercase tracking-widest">{selectedMarker.category}</span>
                        </div>
                        <div>
                          <span className="text-zinc-650 block">COORDINATES</span>
                          <span className="text-[#FF5511] font-bold">{selectedMarker.lat.toFixed(4)}°, {selectedMarker.lng.toFixed(4)}°</span>
                        </div>
                      </div>

                      {mockCap ? (
                        <div className="flex items-center space-x-2 text-[10px] text-zinc-500 py-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                          <span>CAPTURED BY: <strong className="text-zinc-300">{mockCap.archivist}</strong></span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-[10px] text-zinc-500 py-0.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                          <span>TAG RECONNAISSANCE PENDING</span>
                        </div>
                      )}
                    </div>

                    {/* Left edge visualization badge */}
                    {mockCap && (
                      <div className="w-24 h-24 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 relative self-center flex-shrink-0">
                        <img
                          src={mockCap.imageUrl}
                          alt={mockCap.tag}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Retro Bottom Nearby captures slider panel (exactly matching Screen 4) */}
      <div className="bg-zinc-950 border-t border-zinc-900 pb-2 flex flex-col space-y-3 pt-4 select-none">
        
        {/* Caption Header Alignment */}
        <div className="flex justify-between items-center px-4" id="nearby-captures-header">
          <span className="text-[11px] font-bold tracking-[0.25em] text-zinc-500 uppercase">
            RECENT CAPTURES NEARBY
          </span>
          <span className="text-[10px] font-bold tracking-widest text-[#FF5511] bg-orange-950/20 border border-orange-900/40 rounded px-2 py-0.5">
            {captures.length} TOTAL
          </span>
        </div>

        {/* Carousel slide items */}
        <div 
          className="flex overflow-x-auto space-x-4 px-4 pb-3 scrollbar-none"
          id="nearby-captures-carousel"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {captures.map((capture) => (
            <div
              key={capture.id}
              onClick={() => handleCardClick(capture)}
              className="flex-shrink-0 w-44 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-840/60 p-3 rounded-lg flex flex-col space-y-3 cursor-pointer select-none transition-all duration-200"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Captured Art Visual frame */}
              <div className="aspect-video w-full bg-black rounded overflow-hidden border border-zinc-950 relative">
                <img
                  src={capture.imageUrl}
                  alt={capture.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Micro tech categorizer */}
                <span className="absolute bottom-1 right-1 bg-zinc-950/80 text-[8px] font-mono border border-zinc-800 text-zinc-400 py-0.5 px-1 rounded uppercase tracking-wider">
                  {capture.category}
                </span>
              </div>

              {/* Tag information metadata fields */}
              <div className="flex flex-col space-y-1">
                <h5 className="text-xs font-black tracking-widest text-[#F8C3A6] shrink-0 truncate">
                  {capture.tag}
                </h5>
                <div className="flex justify-between items-center text-[9px] text-[#FF5511] font-bold">
                  <span>{capture.distance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
