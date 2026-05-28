import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, MapPin, Sliders, Palette, CheckCircle2, ChevronRight, RefreshCw, Layers } from 'lucide-react';
import { Capture, MapMarker } from '../types';

interface CaptureScreenProps {
  onCaptureSave: (newCapture: Capture, newMarker?: MapMarker) => void;
  userCoords: { lat: number; lng: number } | null;
  currentUserTag: string;
}

export function CaptureScreen({ onCaptureSave, userCoords, currentUserTag }: CaptureScreenProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  
  // Paint Simulator State
  const [paintColor, setPaintColor] = useState('#FF5511');
  const [brushSize, setBrushSize] = useState(12);
  const [selectedStencil, setSelectedStencil] = useState<string>('VORTEX');
  const [wallTexture, setWallTexture] = useState<'concrete' | 'brick'>('concrete');
  const [paintMode, setPaintMode] = useState<boolean>(true); // True = Draw, False = Live Webcam

  // Canvas Drawing variables
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Capturing flow states
  const [shutterFlashing, setShutterFlashing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Custom Tag form
  const [tagLabel, setTagLabel] = useState('');
  const [category, setCategory] = useState<'STENCIL' | 'THROWUP' | 'POSTER' | 'MURAL' | 'OTHER'>('STENCIL');

  // Multi-step form flow
  const [currentStep, setCurrentStep] = useState<'VIEWPORT' | 'FORM' | 'SUCCESS'>('VIEWPORT');

  // Coordinates values
  const lat = userCoords?.lat ?? 40.7128;
  const lng = userCoords?.lng ?? -74.0060;

  // Initialize WebRTC Webcam stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (!paintMode) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((mStream) => {
          setStream(mStream);
          activeStream = mStream;
          setCameraActive(true);
          setCameraError(false);
          if (videoRef.current) {
            videoRef.current.srcObject = mStream;
          }
        })
        .catch((err) => {
          console.warn("Camera fallback triggered or blocked:", err);
          setCameraError(true);
          setPaintMode(true); // fall back to creative draw painting
        });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [paintMode]);

  // Paint Mode initialization / wall draw backing
  useEffect(() => {
    if (paintMode && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear background
        ctx.fillStyle = wallTexture === 'concrete' ? '#1c1c1f' : '#221510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw elegant mockup street-wall texture
        ctx.strokeStyle = wallTexture === 'concrete' ? '#27272a' : '#2e1912';
        ctx.lineWidth = 1;
        
        if (wallTexture === 'concrete') {
          // Splatters on concrete
          for (let i = 0; i < 200; i++) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.15})`;
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
          }
          // Grid cracking lines
          ctx.beginPath();
          ctx.moveTo(0, canvas.height * 0.3);
          ctx.lineTo(canvas.width, canvas.height * 0.35);
          ctx.moveTo(canvas.width * 0.6, 0);
          ctx.lineTo(canvas.width * 0.55, canvas.height);
          ctx.stroke();
        } else {
          // Brick walls lines
          for (let row = 0; row < canvas.height; row += 25) {
            ctx.beginPath();
            ctx.moveTo(0, row);
            ctx.lineTo(canvas.width, row);
            ctx.stroke();
            const offset = (row / 25) % 2 === 0 ? 0 : 30;
            for (let col = offset; col < canvas.width; col += 60) {
              ctx.beginPath();
              ctx.moveTo(col, row);
              ctx.lineTo(col, row + 25);
              ctx.stroke();
            }
          }
        }
      }
    }
  }, [paintMode, wallTexture]);

  // Touch & Mouse Paint actions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!paintMode) return;
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !paintMode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fetch coordinate
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.fillStyle = paintColor;

    // Simulate spray paint fuzziness using radial gradient arches or random scatter!
    const scatterCount = brushSize * 4;
    for (let i = 0; i < scatterCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * brushSize;
      const sx = x + Math.cos(angle) * radius;
      const sy = y + Math.sin(angle) * radius;
      
      ctx.fillStyle = paintColor;
      ctx.globalAlpha = 0.12; // faint spray paint splatter opacity
      ctx.beginPath();
      ctx.arc(sx, sy, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Centered opaque core path
    ctx.globalAlpha = 1.0;
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  // Spray predetermined stencil shapes onto the wall!
  const applyStencil = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    ctx.strokeStyle = paintColor;
    ctx.fillStyle = paintColor;
    ctx.lineWidth = 4;
    ctx.shadowColor = paintColor;
    ctx.shadowBlur = 10;

    if (selectedStencil === 'VORTEX') {
      ctx.translate(cx, cy);
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, i * 4 + 10, i * 0.15, i * 0.15 + (Math.PI / 2));
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedStencil === 'STAR') {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = cx + Math.cos(angle) * 75;
        const y = cy + Math.sin(angle) * 75;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 0.3;
      ctx.fill();
    } else if (selectedStencil === 'PEERS') {
      // Draw stylized wifi peer rings
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI, true);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 65, 0, Math.PI, true);
      ctx.stroke();
    } else if (selectedStencil === 'MURO') {
      // Draw giant M tag letter
      ctx.font = '90px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#fff';
      ctx.strokeText('MURO', cx, cy);
      ctx.fillText('MURO', cx, cy - 5);
    }

    ctx.restore();
    ctx.globalAlpha = 1.0;
  };

  const handleCapture = () => {
    setShutterFlashing(true);

    // Dynamic photo serialization
    setTimeout(() => {
      setShutterFlashing(false);
      let imgData = '';

      if (paintMode && canvasRef.current) {
        imgData = canvasRef.current.toDataURL('image/png');
      } else if (!paintMode && videoRef.current) {
        // Copy webcam view frame to dummy canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 400;
        tempCanvas.height = 400;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx && videoRef.current) {
          tempCtx.drawImage(videoRef.current, 0, 0, 400, 400);
          
          // Draw coordinates watermarking on top
          tempCtx.fillStyle = 'rgba(0,0,0,0.6)';
          tempCtx.fillRect(0, 360, 400, 40);
          tempCtx.fillStyle = '#ff5511';
          tempCtx.font = '10px monospace';
          tempCtx.fillText(`COORDS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° W`, 15, 384);
          
          imgData = tempCanvas.toDataURL('image/png');
        }
      }

      setCapturedImage(imgData || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="orange" width="100" height="100"/></svg>');
      
      // Auto pre-populate serial number
      const num = Math.floor(Math.random() * 900) + 100;
      setTagLabel(`TAG_${num}_LOCKED`);

      setCurrentStep('FORM');
    }, 450);
  };

  // Save full capture
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagLabel) return;

    const capId = `cap_${Date.now()}`;
    const userTagFixed = tagLabel.toUpperCase().replace(/\s+/g, '_');

    const newCapture: Capture = {
      id: capId,
      tag: userTagFixed,
      title: userTagFixed,
      distance: '0m DISTANCE (LOCKED)',
      imageUrl: capturedImage || '',
      timestamp: new Date().toISOString(),
      lat,
      lng,
      category,
      archivist: currentUserTag
    };

    const newMarker: MapMarker = {
      id: `m_${Date.now()}`,
      label: userTagFixed,
      lat,
      lng,
      type: 'LOCKED',
      status: 'active',
      captureId: capId,
      category
    };

    onCaptureSave(newCapture, newMarker);
    setCurrentStep('SUCCESS');
  };

  return (
    <div className="relative h-[calc(100vh-144px)] bg-zinc-950 font-mono text-white flex flex-col items-center justify-between overflow-hidden" id="capture-container">
      
      {/* Light pulse overlay flash on capture */}
      <AnimatePresence>
        {shutterFlashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Screen Steps layout */}
      {currentStep === 'VIEWPORT' && (
        <div className="flex-1 w-full flex flex-col justify-between items-stretch">
          
          {/* Main Visual Shutter Viewport Area */}
          <div className="relative flex-1 w-full max-w-sm mx-auto flex flex-col justify-center items-center px-4 pt-4 select-none">
            
            {/* Visual Crop Marks / Corner Ticks */}
            <div className="absolute top-[20px] left-[20px] w-6 h-6 border-t-2 border-l-2 border-orange-500/80 pointer-events-none z-10" />
            <div className="absolute top-[20px] right-[20px] w-6 h-6 border-t-2 border-r-2 border-orange-500/80 pointer-events-none z-10" />
            <div className="absolute bottom-[20px] left-[20px] w-6 h-6 border-b-2 border-l-2 border-orange-500/80 pointer-events-none z-10" />
            <div className="absolute bottom-[20px] right-[20px] w-6 h-6 border-b-2 border-r-2 border-orange-500/80 pointer-events-none z-10" />

            {/* Custom Mode selectors */}
            <div className="absolute top-8 left-8 right-8 z-20 flex space-x-2 bg-zinc-950/80 border border-zinc-800 p-1.5 rounded-lg">
              <button
                onClick={() => setPaintMode(true)}
                className={`flex-1 text-[10px] font-bold py-1.5 rounded uppercase tracking-wider transition-colors ${
                  paintMode ? 'bg-[#FF5511] text-white' : 'text-zinc-400 hover:text-white'
                }`}
                id="paint-mode-btn"
              >
                STREET DRAW
              </button>
              <button
                onClick={() => setPaintMode(false)}
                className={`flex-1 text-[10px] font-bold py-1.5 rounded uppercase tracking-wider transition-colors ${
                  !paintMode ? 'bg-[#FF5511] text-white' : 'text-zinc-400 hover:text-white'
                }`}
                id="webcam-mode-btn"
              >
                LIVE CAMERA
              </button>
            </div>

            {/* Simulated overlay coordinate display (As mockup Screen 2) */}
            <div className="absolute text-center z-20 pointer-events-none space-y-2">
              <div className="bg-[#FF5511] text-white py-1.5 px-3 rounded shadow-md border border-orange-400/30 flex items-center justify-center space-x-1.5 text-[10px] font-bold tracking-[0.2em] uppercase">
                <MapPin className="w-3 h-3 text-white" />
                <span>COORDINATES LOCKED</span>
              </div>
              <div className="text-[11px] text-[#FFE9DB] font-semibold font-mono tracking-widest text-shadow">
                {lat.toFixed(4)}° N,  {lng.toFixed(4)}° W
              </div>
            </div>

            {/* Content Medium Canvas / Video Stream Frame */}
            <div className="w-full aspect-square border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-900 shadow-2xl relative">
              {paintMode ? (
                <canvas
                  ref={canvasRef}
                  width="400"
                  height="400"
                  className="w-full h-full object-cover cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={endDrawing}
                  onMouseLeave={endDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={endDrawing}
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              )}
            </div>

            {/* Paint Control panel HUD on bottom edge of viewport */}
            {paintMode && (
              <div 
                className="w-full bg-zinc-90 w bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-2.5 mt-4 flex items-center justify-between gap-3 text-xs"
                id="paint-tool-panel"
              >
                <div className="flex items-center space-x-2">
                  <Palette className="w-3.5 h-3.5 text-zinc-500 hover:text-white" />
                  <input
                    type="color"
                    value={paintColor}
                    onChange={(e) => setPaintColor(e.target.value)}
                    className="w-5 h-5 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                    title="Paint Color"
                  />
                  
                  {/* Texture toggler */}
                  <button
                    onClick={() => setWallTexture(wallTexture === 'concrete' ? 'brick' : 'concrete')}
                    className="text-[9px] border border-zinc-700 bg-zinc-950 px-2 py-1 rounded hover:text-white text-zinc-400 capitalize"
                  >
                    Wall: {wallTexture}
                  </button>
                </div>

                {/* Spray select trigger */}
                <div className="flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-zinc-500" />
                  <select
                    value={selectedStencil}
                    onChange={(e) => setSelectedStencil(e.target.value)}
                    className="bg-zinc-950 text-zinc-300 border border-zinc-800 rounded px-1.5 py-1 text-[9px] outline-none"
                  >
                    <option value="VORTEX">Vortex Stencil</option>
                    <option value="STAR">Star Tag</option>
                    <option value="PEERS">Peer Ring</option>
                    <option value="MURO">Muro Lettering</option>
                  </select>
                  <button
                    onClick={applyStencil}
                    className="bg-orange-950 hover:bg-[#FF5511] text-orange-500 hover:text-white border border-orange-900 rounded px-2.5 py-1 text-[9px] font-bold"
                  >
                    Stamp
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger Shutter Console Drawer (exact Screen 2 alignment) */}
          <div className="pb-8 w-full flex flex-col items-center justify-center space-y-3">
            
            <p className="text-[10px] text-zinc-500 tracking-wider font-semibold">
              {paintMode ? 'DRAW ON THE WALL OR PRESS STITCH' : 'AIM TO TEXTURE CARD AND FOCUS CAPTURE'}
            </p>

            {/* Custom rounded shutter button wrapped inside square crop bounds (Exactly Screen 2) */}
            <div className="border border-[#FF5511] p-1.5 rounded-2xl relative shadow-lg bg-zinc-900/10">
              <button
                onClick={handleCapture}
                className="w-16 h-16 bg-[#FF5511] hover:bg-[#FF6622] rounded-xl flex items-center justify-center active:scale-95 transition-all outline-none"
                id="shutter-trigger-btn"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metadata Detail form */}
      {currentStep === 'FORM' && (
        <form onSubmit={handleSaveForm} className="flex-1 w-full max-w-sm px-6 py-6 flex flex-col justify-between items-stretch">
          
          <div className="space-y-6">
            <h3 className="text-lg font-black tracking-widest text-[#F8C3A6] border-b border-zinc-900 pb-2.5">
              DOCUMENT STREET ARTIFACT
            </h3>

            {/* Picture preview frame */}
            <div className="aspect-video w-full border border-zinc-800 rounded-lg overflow-hidden bg-black flex items-center justify-center">
              <img
                src={capturedImage || ''}
                alt="Captured street graffiti"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Serial code Label */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                STREET TAG NAME
              </label>
              <input
                type="text"
                required
                value={tagLabel}
                onChange={(e) => setTagLabel(e.target.value)}
                placeholder="STENCIL_402_LOCKED"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-4 text-sm font-bold text-[#F8C3A6] outline-none tracking-widest focus:border-[#FF5511]"
              />
            </div>

            {/* Classification categorization */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                ART CLASSIFICATION
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['STENCIL', 'THROWUP', 'POSTER', 'MURAL', 'OTHER'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`border px-3 py-2.5 rounded font-bold uppercase transition-colors text-left flex justify-between items-center ${
                      category === cat 
                        ? 'border-[#FF5511] text-[#FF5511] bg-orange-950/20' 
                        : 'border-zinc-800 text-zinc-400 bg-transparent hover:text-white'
                    }`}
                  >
                    <span>{cat}</span>
                    {category === cat && <span className="w-1.5 h-1.5 bg-[#FF5511] rounded-full" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF5511] text-white py-4 rounded-lg font-extrabold text-sm tracking-widest uppercase mt-6 flex justify-center items-center space-x-2 shadow-lg"
            id="register-artifact-btn"
          >
            <span>REGISTER ART ARTIFACT</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>
      )}

      {/* Success View */}
      {currentStep === 'SUCCESS' && (
        <div className="flex-1 w-full max-w-sm px-6 py-12 flex flex-col justify-center items-center text-center space-y-6">
          <div className="w-16 h-16 bg-orange-950/40 rounded-full border border-[#FF5511] flex items-center justify-center animate-bounce shadow-2xl">
            <CheckCircle2 className="w-8 h-8 text-[#FF5511]" />
          </div>

          <div className="space-y-2">
            <h4 className="text-2xl font-black tracking-widest text-[#F8C3A6]">
              CAPTURE COMMITTED
            </h4>
            <p className="text-xs text-zinc-450 max-w-xs font-sans tracking-wide">
              The spatial node has resolved your coordinate. Your document is locked onto the decentralised map layout.
            </p>
          </div>

          <button
            onClick={() => {
              setCapturedImage(null);
              setCurrentStep('VIEWPORT');
            }}
            className="border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-6 py-3 rounded-lg flex items-center space-x-2 transition-all"
            id="add-new-capture-btn"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RECORD ANOTHER TAG</span>
          </button>
        </div>
      )}
    </div>
  );
}
