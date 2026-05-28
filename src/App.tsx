import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView, Capture, MapMarker, UserSession } from './types';
import { PRESET_CAPTURES, PRESET_MARKERS } from './constants';

// Subcomponents imports
import { BootScreen } from './components/BootScreen';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MapScreen } from './components/MapScreen';
import { CaptureScreen } from './components/CaptureScreen';
import { ProfileScreen } from './components/ProfileScreen';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('BOOT');
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [session, setSession] = useState<UserSession | null>(null);
  
  // Real or Fallback GPS tracking
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize and load persistent data
  useEffect(() => {
    try {
      const cachedCaptures = localStorage.getItem('muro_captures_v1');
      const cachedMarkers = localStorage.getItem('muro_markers_v1');
      const cachedSession = localStorage.getItem('muro_session_v1');

      if (cachedCaptures) {
        setCaptures(JSON.parse(cachedCaptures));
      } else {
        setCaptures(PRESET_CAPTURES);
        localStorage.setItem('muro_captures_v1', JSON.stringify(PRESET_CAPTURES));
      }

      if (cachedMarkers) {
        setMarkers(JSON.parse(cachedMarkers));
      } else {
        setMarkers(PRESET_MARKERS);
        localStorage.setItem('muro_markers_v1', JSON.stringify(PRESET_MARKERS));
      }

      if (cachedSession) {
        setSession(JSON.parse(cachedSession));
      }
    } catch (err) {
      console.warn("Storage syncing error, falling back to clean state:", err);
      setCaptures(PRESET_CAPTURES);
      setMarkers(PRESET_MARKERS);
    }

    // Proactively query approximate GPS position
    triggerGPSRequest();
  }, []);

  const triggerGPSRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserCoords(coords);
          console.log("GPS Lock established:", coords);
        },
        (error) => {
          console.warn("Geolocation request rejected, utilizing default New York node coordinates.", error);
          // Set standard default NY coordinates so user still gets a fully featured map
          setUserCoords({ lat: 40.7128, lng: -74.0060 });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

  const handleBootComplete = () => {
    if (session) {
      setCurrentView('MAP');
    } else {
      setCurrentView('LOGIN');
    }
  };

  const handleLogin = (uniqueTag: string, email: string) => {
    const newSession: UserSession = {
      uniqueTag,
      email,
      start_time: new Date().toISOString(),
      rank: 'INFORMANT_NODE',
      device_id: `ML-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    };

    setSession(newSession);
    localStorage.setItem('muro_session_v1', JSON.stringify(newSession));
    setCurrentView('MAP');
  };

  const handleCaptureSave = (newCapture: Capture, newMarker?: MapMarker) => {
    const updatedCaptures = [newCapture, ...captures];
    setCaptures(updatedCaptures);
    localStorage.setItem('muro_captures_v1', JSON.stringify(updatedCaptures));

    if (newMarker) {
      const updatedMarkers = [newMarker, ...markers];
      setMarkers(updatedMarkers);
      localStorage.setItem('muro_markers_v1', JSON.stringify(updatedMarkers));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('muro_session_v1');
    setSession(null);
    setCurrentView('LOGIN');
  };

  const handleResetData = () => {
    localStorage.setItem('muro_captures_v1', JSON.stringify(PRESET_CAPTURES));
    localStorage.setItem('muro_markers_v1', JSON.stringify(PRESET_MARKERS));
    setCaptures(PRESET_CAPTURES);
    setMarkers(PRESET_MARKERS);
  };

  const handleSelectCaptureOnMap = (capture: Capture) => {
    console.log("Interactive card map focal point:", capture.tag);
  };

  // Centralized View renderer
  const renderCurrentView = () => {
    switch (currentView) {
      case 'MAP':
        return (
          <MapScreen
            captures={captures}
            markers={markers}
            onSelectCapture={handleSelectCaptureOnMap}
            userCoords={userCoords}
            requestGPS={triggerGPSRequest}
          />
        );
      case 'CAPTURE':
        return (
          <CaptureScreen
            onCaptureSave={handleCaptureSave}
            userCoords={userCoords}
            currentUserTag={session?.uniqueTag || '@STREET_ARCHIVE_01'}
          />
        );
      case 'PROFILE':
        return (
          <ProfileScreen
            session={session}
            captures={captures}
            onLogout={handleLogout}
            onResetData={handleResetData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col selection:bg-[#FF5511] selection:text-white">
      {currentView === 'BOOT' ? (
        <BootScreen onComplete={handleBootComplete} />
      ) : currentView === 'LOGIN' ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <div className="flex flex-col min-h-screen pb-20 justify-between">
          {/* Header navigation bar */}
          <Header
            captureCount={captures.filter(c => c.archivist === session?.uniqueTag).length}
            goalCount={5}
            onLogoClick={() => setCurrentView('MAP')}
          />

          {/* Primary View Slider */}
          <main className="flex-1 w-full bg-[#0c0c0e]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                {renderCurrentView()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Persistent sticky Bottom Navigation tray */}
          <BottomNav currentView={currentView} onViewChange={setCurrentView} />
        </div>
      )}
    </div>
  );
}
