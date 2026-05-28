export type AppView = 'BOOT' | 'LOGIN' | 'MAP' | 'CAPTURE' | 'PROFILE';

export interface GeoLocation {
  lat: number;
  lng: number;
  label?: string;
}

export interface Capture {
  id: string;
  tag: string;
  title: string;
  distance: string;
  imageUrl: string; // Dynamic canvas drawing or base64 or webcam photo
  timestamp: string;
  lat: number;
  lng: number;
  category: 'STENCIL' | 'THROWUP' | 'POSTER' | 'MURAL' | 'OTHER';
  archivist: string;
}

export interface MapMarker {
  id: string;
  label: string;
  lat: number;
  lng: number;
  type: 'LOCKED' | 'GRID' | 'DOT';
  status: 'active' | 'inactive';
  captureId?: string;
  category: string;
}

export interface UserSession {
  uniqueTag: string;
  email: string;
  start_time: string;
  rank: string;
  device_id: string;
}
