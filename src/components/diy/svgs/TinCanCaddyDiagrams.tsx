import React from 'react';
import { DiagramSvgProps } from './JeansStep1CuttingSvg';

const TinCanCanvas: React.FC<{
  title: string;
  badgeText: string;
  className?: string;
  children: React.ReactNode;
}> = ({ title, badgeText, className = 'w-full h-auto', children }) => (
  <svg
    viewBox="0 0 600 420"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label={title}
  >
    <defs>
      <pattern id="craft-grid-tc" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
      </pattern>
      <marker id="arrow-blue-tc" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
      </marker>
      <filter id="shadow-tc" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.08" />
      </filter>
    </defs>
    <rect width="600" height="420" rx="16" fill="#FDFBF7" />
    <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />
    <rect width="600" height="420" rx="16" fill="url(#craft-grid-tc)" />

    <g transform="translate(24, 20)">
      <rect width="210" height="26" rx="6" fill="#234B35" />
      <text x="12" y="17" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="0.05em">
        {badgeText}
      </text>
    </g>

    {children}
  </svg>
);

/**
 * STEP 1: Safe Edge Deburring & Preparation
 * Metal can, inner rim deburring file tool smoothing sharp metal burrs.
 */
export const TinCanStep1DeburringSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <TinCanCanvas title="Step 1: Deburr Tin Can Rim" badgeText="ACTION: METAL RIM DEBURRING" className={className}>
    <g transform="translate(140, 70)" filter="url(#shadow-tc)">
      {/* Tin Can Silhouette */}
      <rect x="40" y="40" width="160" height="200" rx="10" fill="#E2E8F0" stroke="#475569" strokeWidth="3" />
      {/* Ribbed Can Ridges */}
      <line x1="40" y1="90" x2="200" y2="90" stroke="#94A3B8" strokeWidth="2" />
      <line x1="40" y1="120" x2="200" y2="120" stroke="#94A3B8" strokeWidth="2" />
      <line x1="40" y1="150" x2="200" y2="150" stroke="#94A3B8" strokeWidth="2" />
      <line x1="40" y1="180" x2="200" y2="180" stroke="#94A3B8" strokeWidth="2" />

      {/* Rim Top Opening */}
      <ellipse cx="120" cy="40" rx="80" ry="24" fill="#F8FAFC" stroke="#059669" strokeWidth="3" />

      {/* Metal Deburring Rotary File / Spoon Tool */}
      <g transform="translate(180, 15)">
        <polygon points="0,20 40,25 60,0 20,0" fill="#64748B" stroke="#334155" strokeWidth="1.5" />
        <rect x="45" y="-30" width="12" height="40" rx="3" fill="#D97706" />
        {/* Orbital smoothing arrow */}
        <circle cx="10" cy="20" r="15" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="5 3" />
      </g>
    </g>

    {showLabels && (
      <g transform="translate(60, 345)">
        <rect width="320" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="12" y="20" fill="#065F46" fontSize="10" fontWeight="700">✓ Burnish rim completely smooth to prevent hand cuts</text>
      </g>
    )}
  </TinCanCanvas>
);

/**
 * STEP 2: Drill 1/8" Mounting Holes
 * Can and central wood block with pencil center marks and drill bit creating 1/8" holes.
 */
export const TinCanStep2DrillingHolesSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <TinCanCanvas title="Step 2: Drill Mounting Holes" badgeText={'ACTION: 1/8" PILOT HOLE DRILLING'} className={className}>
    <g transform="translate(120, 75)" filter="url(#shadow-tc)">
      {/* Tin Can Side View */}
      <rect x="30" y="30" width="130" height="180" rx="8" fill="#E2E8F0" stroke="#475569" strokeWidth="2.5" />
      {/* 1/2" mark from rim */}
      <circle cx="95" cy="55" r="5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />

      {/* Central Timber Spine Block */}
      <rect x="230" y="10" width="120" height="220" rx="8" fill="#D97706" fillOpacity="0.4" stroke="#B45309" strokeWidth="2.5" />
      <circle cx="290" cy="55" r="5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
      <circle cx="290" cy="155" r="5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />

      {/* Drill Bit Punching Hole */}
      <g transform="translate(95, 20)">
        <rect x="-2" y="-30" width="4" height="30" fill="#64748B" />
        <path d="M -2 0 L 2 0 L 0 8 Z" fill="#94A3B8" />
      </g>

      {/* Alignment Guideline */}
      <line x1="95" y1="55" x2="290" y2="55" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 3" />
    </g>

    {showMeasurements && (
      <g transform="translate(420, 160)">
        <rect width="145" height="42" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
        <text x="10" y="18" fill="#1D4ED8" fontSize="10" fontWeight="800">HOLE DIAMETER</text>
        <text x="10" y="32" fill="#2563EB" fontSize="10">Ø 1/8 inch (3 mm)</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(60, 345)">
        <rect width="280" height="32" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
        <text x="12" y="20" fill="#1D4ED8" fontSize="10" fontWeight="700">Drill hole 1/2" below the upper rolled rim</text>
      </g>
    )}
  </TinCanCanvas>
);

/**
 * STEP 3: Mount Cans to Central Wooden Block
 * 6 cans (3 per side) anchored to wood block with pan-head wood screws and screwdriver.
 */
export const TinCanStep3WoodBlockMountingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <TinCanCanvas title="Step 3: Mount Cans to Spine" badgeText="ACTION: SCREW FASTENING TO BLOCK" className={className}>
    <g transform="translate(100, 65)" filter="url(#shadow-tc)">
      {/* Central Wooden Block */}
      <rect x="160" y="10" width="80" height="230" rx="8" fill="#B45309" stroke="#78350F" strokeWidth="3" />
      <text x="175" y="125" fill="#FEF3C7" fontSize="10" fontWeight="800" transform="rotate(-90 175 125)">WOOD SPINE</text>

      {/* Left Pair of Cans */}
      <rect x="40" y="40" width="100" height="85" rx="6" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
      <rect x="40" y="145" width="100" height="85" rx="6" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />

      {/* Right Pair of Cans */}
      <rect x="260" y="40" width="100" height="85" rx="6" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
      <rect x="260" y="145" width="100" height="85" rx="6" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />

      {/* Screws entering through cans into wood */}
      <circle cx="140" cy="65" r="4" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
      <circle cx="140" cy="170" r="4" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
      <circle cx="260" cy="65" r="4" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
      <circle cx="260" cy="170" r="4" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
    </g>

    {showLabels && (
      <g transform="translate(80, 345)">
        <rect width="440" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="14" y="20" fill="#065F46" fontSize="10" fontWeight="700">✓ 1/2" Pan-head wood screws anchor cans flush and vibration-resistant</text>
      </g>
    )}
  </TinCanCanvas>
);

/**
 * STEP 4: Attach Leather Handle & Completed Caddy
 * Finished 6-can organizer filled with gardening tools/cutlery, leather carry strap on top.
 */
export const TinCanStep4LeatherHandleSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <TinCanCanvas title="Step 4: Completed Desktop & Picnic Caddy" badgeText="ACTION: COMPLETED PORTABLE CADDY" className={className}>
    <g transform="translate(130, 45)" filter="url(#shadow-tc)">
      {/* Leather Carrying Handle Strap */}
      <path d="M 120 70 C 120 15 220 15 220 70" fill="none" stroke="#78350F" strokeWidth="12" strokeLinecap="round" />
      {/* Brass Screws on Handle */}
      <circle cx="120" cy="70" r="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
      <circle cx="220" cy="70" r="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />

      {/* Central Wood Block */}
      <rect x="135" y="70" width="70" height="190" rx="8" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />

      {/* Left Cans with Tools / Cutlery */}
      <g transform="translate(15, 90)">
        <rect width="110" height="75" rx="6" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
        {/* Paint brushes & cutlery sticking out */}
        <line x1="30" y1="90" x2="20" y2="20" stroke="#DC2626" strokeWidth="4" />
        <line x1="50" y1="90" x2="50" y2="15" stroke="#2563EB" strokeWidth="4" />
        <line x1="70" y1="90" x2="80" y2="20" stroke="#059669" strokeWidth="4" />
      </g>
      <rect x="15" y="175" width="110" height="75" rx="6" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />

      {/* Right Cans */}
      <rect x="215" y="90" width="110" height="75" rx="6" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
      <rect x="215" y="175" width="110" height="75" rx="6" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
    </g>

    {showLabels && (
      <g transform="translate(40, 345)">
        <rect width="230" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="12" y="20" fill="#065F46" fontSize="10" fontWeight="700">✓ Portable 6-Can Tool & Utensil Caddy</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(370, 345)">
        <rect width="190" height="32" rx="6" fill="#FEFCE8" stroke="#EAB308" strokeWidth="1.5" />
        <text x="12" y="20" fill="#854D0E" fontSize="10" fontWeight="700">Reclaimed Belt Leather Handle</text>
      </g>
    )}
  </TinCanCanvas>
);
