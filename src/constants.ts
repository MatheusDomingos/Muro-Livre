import { Capture, MapMarker } from './types';

// Let's create procedurally detailed SVG strings or SVG components for preset street arts.
// High-fidelity SVG of a central vortex with outward radial rays (vivid replication of STENCIL_094)
export const SVG_STENCIL_094 = `
<svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#000;">
  <defs>
    <radialGradient id="vortexGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#050505" />
      <stop offset="30%" stop-color="#111111" />
      <stop offset="70%" stop-color="#444444" />
      <stop offset="90%" stop-color="#888888" />
      <stop offset="100%" stop-color="#000" />
    </radialGradient>
  </defs>
  <!-- Background Rays structure -->
  <g transform="translate(200,200)">
    ${Array.from({ length: 90 })
      .map((_, i) => {
        const angle = (i * 4 * Math.PI) / 180;
        const x2 = Math.cos(angle) * 220;
        const y2 = Math.sin(angle) * 220;
        const strokeWidth = 1 + (i % 3) * 1.5;
        const opacity = 0.2 + (i % 4) * 0.25;
        return `<line x1="0" y1="0" x2="${x2}" y2="${y2}" stroke="#fff" stroke-width="${strokeWidth}" opacity="${opacity}" />`;
      })
      .join('')}
    <!-- Center Vortex Hole -->
    <circle cx="0" cy="0" r="60" fill="url(#vortexGrad)" stroke="#000" stroke-width="4" />
    <circle cx="0" cy="0" r="45" fill="#000" />
    <!-- Fine inner rays -->
    ${Array.from({ length: 45 })
      .map((_, i) => {
        const angle = (i * 8 * Math.PI) / 180 + 0.3;
        const x1 = Math.cos(angle) * 45;
        const y1 = Math.sin(angle) * 45;
        const x2 = Math.cos(angle - 0.4) * 120;
        const y2 = Math.sin(angle - 0.4) * 120;
        return `<path d="M ${x1} ${y1} Q 0 0 ${x2} ${y2}" fill="none" stroke="#666" stroke-width="1.5" opacity="0.6" />`;
      })
      .join('')}
  </g>
</svg>
`;

// Procedurally styled swirly brush strokes for THROWUP_X2 (fluid liquid paint strokes)
export const SVG_THROWUP_X2 = `
<svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#151515;">
  <defs>
    <linearGradient id="linesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="50%" stop-color="#aaaaaa" />
      <stop offset="100%" stop-color="#333333" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#121212" />
  <!-- Dynamic smooth tracks -->
  <g stroke="url(#linesGrad)" fill="none" stroke-linecap="round" opacity="0.9">
    <!-- Group of sweeps -->
    <path d="M 50,220 C 120,40 280,40 350,200 C 380,260 250,380 180,350 C 90,310 120,180 200,160 C 260,150 300,220 280,270 C 260,310 200,300 180,240 C 170,200 210,130 260,150" stroke-width="24" />
    <path d="M 55,220 C 122,45 278,45 348,200 C 378,255 252,375 182,345" stroke="#ffffff" stroke-width="4" opacity="0.5" />
    <path d="M 60,215 C 124,35 282,35 352,205" stroke="#222" stroke-width="2" />
    
    <!-- Secondary fluid overlay lines -->
    <path d="M 80,180 C 130,100 250,100 320,170 C 340,190 320,290 260,310 C 180,330 140,240 180,200 C 220,160 270,180 260,240 C 250,280 200,270 190,230" stroke-width="12" stroke="#ddd" />
    <path d="M 120,150 Q 200,90 280,150 T 200,300" stroke-width="6" stroke="#fff" />
  </g>
</svg>
`;

export const SVG_MURAL_901 = `
<svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#111;">
  <g stroke="#FF5511" fill="none" stroke-width="2" opacity="0.8">
    <circle cx="200" cy="200" r="140" stroke-dasharray="10 5" />
    <circle cx="200" cy="200" r="100" />
    <circle cx="200" cy="200" r="60" stroke-width="4" />
    <line x1="50" y1="200" x2="350" y2="200" />
    <line x1="200" y1="50" x2="200" y2="350" />
    <rect x="150" y="150" width="100" height="100" stroke-width="1" stroke-dasharray="4 2" />
  </g>
  <rect x="180" y="180" width="40" height="40" fill="#FF5511" />
</svg>
`;

export const SVG_WILDSTYLE_A1 = `
<svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0f0f0f;">
  <!-- Wildstyle graffiti vectors -->
  <g fill="none" stroke-linejoin="miter">
    <!-- Outer thick shadow -->
    <path d="M 40,200 L 120,80 L 180,180 L 260,60 L 360,200 L 310,320 L 220,240 L 150,340 Z" fill="#1e0c02" stroke="#FF5511" stroke-width="14" />
    <!-- Bright fill colors -->
    <path d="M 40,200 L 120,80 L 180,180 L 260,60 L 360,200 L 310,320 L 220,240 L 150,340 Z" fill="#252525" stroke="#FFE9DB" stroke-width="4" />
    <!-- Sharp tag arrows -->
    <path d="M 120,80 L 80,40 L 100,10" stroke="#FF5511" stroke-width="4" fill="#FF5511" />
    <path d="M 360,200 L 390,240 L 370,270" stroke="#FF5511" stroke-width="4" fill="#FF5511" />
    <path d="M 150,340 L 110,380 L 70,360" stroke="#FF5511" stroke-width="4" fill="#FF5511" />
    <!-- Inset details -->
    <path d="M 80,160 H 320" stroke="#FF5511" stroke-dasharray="8 4" stroke-width="3" />
    <circle cx="200" cy="180" r="30" fill="none" stroke="#FFD1BA" stroke-width="2" />
  </g>
</svg>
`;

export const PRESET_CAPTURES: Capture[] = [
  {
    id: 'cap_stencil_094',
    tag: 'STENCIL_094',
    title: 'STENCIL_094',
    distance: '200m DISTANCE',
    imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(SVG_STENCIL_094)}`,
    timestamp: '2026-05-27T22:15:00Z',
    lat: 40.7138,
    lng: -74.0080,
    category: 'STENCIL',
    archivist: 'STREET_ARCHIVE_01',
  },
  {
    id: 'cap_throwup_x2',
    tag: 'THROWUP_X2',
    title: 'THROWUP_X2',
    distance: '450m DISTANCE',
    imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(SVG_THROWUP_X2)}`,
    timestamp: '2026-05-27T21:40:00Z',
    lat: 40.7100,
    lng: -74.0010,
    category: 'THROWUP',
    archivist: 'STREET_ARCHIVE_01',
  },
  {
    id: 'cap_mural_901',
    tag: 'MURAL_901',
    title: 'MURAL_901',
    distance: '1.2km DISTANCE',
    imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(SVG_MURAL_901)}`,
    timestamp: '2026-05-27T18:10:00Z',
    lat: 40.7188,
    lng: -74.0120,
    category: 'MURAL',
    archivist: 'STREET_ARCHIVE_05',
  },
  {
    id: 'cap_wildstyle_a1',
    tag: 'WILDSTYLE_A1',
    title: 'WILDSTYLE_A1',
    distance: '1.8km DISTANCE',
    imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(SVG_WILDSTYLE_A1)}`,
    timestamp: '2026-05-27T15:30:00Z',
    lat: 40.7060,
    lng: -74.0095,
    category: 'THROWUP',
    archivist: 'STREET_ARCHIVE_08',
  }
];

export const PRESET_MARKERS: MapMarker[] = [
  {
    id: 'm1',
    label: 'TAG_402_LOCKED',
    lat: 40.7138,
    lng: -74.0080,
    type: 'LOCKED',
    status: 'active',
    captureId: 'cap_stencil_094',
    category: 'STENCIL',
  },
  {
    id: 'm2',
    label: 'THROWUP_X2',
    lat: 40.7100,
    lng: -74.0010,
    type: 'GRID',
    status: 'active',
    captureId: 'cap_throwup_x2',
    category: 'THROWUP',
  },
  {
    id: 'm3',
    label: 'SEC_MURAL_901',
    lat: 40.7188,
    lng: -74.0120,
    type: 'DOT',
    status: 'active',
    captureId: 'cap_mural_901',
    category: 'MURAL',
  },
  {
    id: 'm4',
    label: 'WILDSTYLE_A1',
    lat: 40.7060,
    lng: -74.0095,
    type: 'LOCKED',
    status: 'active',
    captureId: 'cap_wildstyle_a1',
    category: 'THROWUP',
  }
];
