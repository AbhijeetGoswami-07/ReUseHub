import React from 'react';
import { DiagramSvgProps } from './JeansStep1CuttingSvg';

const CastIronCanvas: React.FC<{
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
      <pattern id="craft-grid-ci" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
      </pattern>
      <marker id="arrow-blue-ci" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
      </marker>
      <filter id="shadow-ci" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.08" />
      </filter>
    </defs>
    <rect width="600" height="420" rx="16" fill="#FDFBF7" />
    <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />
    <rect width="600" height="420" rx="16" fill="url(#craft-grid-ci)" />

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
 * STEP 1: Rust Stripping with Steel Wool & Coarse Salt
 * Skillet with rusted orange-brown patches transitioning into raw grey iron under steel wool scrubbing.
 */
export const CastIronStep1RustStrippingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <CastIronCanvas title="Step 1: Rust Stripping" badgeText="ACTION: STEEL WOOL RUST STRIP" className={className}>
    <g transform="translate(140, 75)" filter="url(#shadow-ci)">
      {/* Skillet Pan Base */}
      <circle cx="140" cy="120" r="115" fill="#475569" stroke="#1E293B" strokeWidth="4" />
      <circle cx="140" cy="120" r="100" fill="#334155" />

      {/* Skillet Cast Handle */}
      <rect x="250" y="105" width="110" height="30" rx="6" fill="#1E293B" />
      <circle cx="340" cy="120" r="8" fill="#FDFBF7" />

      {/* Right half: Rusted Orange Layer */}
      <path d="M 140 20 A 100 100 0 0 1 140 220 Z" fill="#C2410C" fillOpacity="0.85" />
      <circle cx="170" cy="60" r="6" fill="#EA580C" />
      <circle cx="190" cy="140" r="8" fill="#EA580C" />
      <circle cx="160" cy="180" r="5" fill="#EA580C" />

      {/* Left half: Clean Raw Grey Iron (Freshly Scrubbed) */}
      <path d="M 140 20 A 100 100 0 0 0 140 220 Z" fill="#64748B" />

      {/* Steel Wool Scrubbing Pad */}
      <g transform="translate(115, 85)">
        <ellipse cx="25" cy="30" rx="30" ry="22" fill="#94A3B8" stroke="#475569" strokeWidth="2" strokeDasharray="3 2" />
        {/* Circular scrub motion arrows */}
        <circle cx="25" cy="30" r="32" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="6 4" />
      </g>
    </g>

    {showLabels && (
      <g transform="translate(40, 345)">
        <rect width="210" height="32" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5" />
        <text x="12" y="20" fill="#991B1B" fontSize="10" fontWeight="700">Before: Oxidized Surface Rust</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(360, 345)">
        <rect width="200" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="12" y="20" fill="#065F46" fontSize="10" fontWeight="700">After: Raw Silver-Grey Iron</text>
      </g>
    )}
  </CastIronCanvas>
);

/**
 * STEP 2: Thermal Stove Drying
 * Gas burner flame heating skillet on stovetop, steam rising from micro-pores.
 */
export const CastIronStep2ThermalDryingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <CastIronCanvas title="Step 2: Thermal Stove Drying" badgeText="ACTION: 5-MIN BURNER THERMAL DRY" className={className}>
    <g transform="translate(140, 70)" filter="url(#shadow-ci)">
      {/* Blue Gas Burner Flames */}
      <g transform="translate(50, 195)">
        <path d="M 0 35 C 10 10 20 0 25 0 C 30 0 40 10 50 35 Z" fill="#38BDF8" />
        <path d="M 50 35 C 60 10 70 0 75 0 C 80 0 90 10 100 35 Z" fill="#0284C7" />
        <path d="M 100 35 C 110 10 120 0 125 0 C 130 0 140 10 150 35 Z" fill="#38BDF8" />
        <path d="M 150 35 C 160 10 170 0 175 0 C 180 0 190 10 200 35 Z" fill="#0284C7" />
      </g>

      {/* Skillet Side Profile on burner */}
      <path d="M 30 110 L 45 195 L 255 195 L 270 110 Z" fill="#334155" stroke="#1E293B" strokeWidth="3" />
      {/* Handle extending right */}
      <path d="M 270 115 L 370 100 L 370 125 L 270 135 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />

      {/* Evaporating Steam Waves */}
      <path d="M 80 100 C 70 70 90 50 80 20" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="4 3" />
      <path d="M 150 100 C 140 70 160 50 150 15" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" fill="none" strokeDasharray="4 3" />
      <path d="M 220 100 C 210 70 230 50 220 20" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="4 3" />
    </g>

    {showMeasurements && (
      <g transform="translate(420, 80)">
        <rect width="145" height="42" rx="8" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5" />
        <text x="12" y="18" fill="#B91C1C" fontSize="10" fontWeight="800">STOVETOP HEAT</text>
        <text x="12" y="32" fill="#DC2626" fontSize="10">5 Mins on Med-High</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(60, 345)">
        <rect width="360" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="12" y="20" fill="#065F46" fontSize="10" fontWeight="700">Expels 100% of trapped pore water to prevent flash rusting</text>
      </g>
    )}
  </CastIronCanvas>
);

/**
 * STEP 3: Micro-Thin Oil Buffing
 * Oil dropper placing 1/2 tsp flaxseed oil, microfiber cloth buffing until bone dry.
 */
export const CastIronStep3MicroOilBuffingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <CastIronCanvas title="Step 3: Micro-Thin Oil Coating" badgeText="ACTION: MICRO-LAYER OIL BUFF" className={className}>
    <g transform="translate(130, 70)" filter="url(#shadow-ci)">
      {/* Skillet Pan */}
      <circle cx="140" cy="120" r="115" fill="#334155" stroke="#1E293B" strokeWidth="4" />
      <circle cx="140" cy="120" r="100" fill="#1E293B" />

      {/* Skillet Handle */}
      <rect x="250" y="105" width="110" height="30" rx="6" fill="#1E293B" />

      {/* Oil Bottle with Dropper */}
      <g transform="translate(100, 20)">
        <rect x="20" y="0" width="40" height="80" rx="6" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
        <text x="26" y="45" fill="#854D0E" fontSize="8" fontWeight="800">OIL</text>
        {/* Oil Drop */}
        <path d="M 40 85 C 35 95 35 105 40 105 C 45 105 45 95 40 85 Z" fill="#EAB308" />
      </g>

      {/* Buffing Cloth wiping bone-dry */}
      <g transform="translate(160, 100)">
        <rect width="60" height="45" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
        <path d="M -15 22 L 75 22" stroke="#2563EB" strokeWidth="2.5" markerEnd="url(#arrow-blue-ci)" />
      </g>
    </g>

    {showMeasurements && (
      <g transform="translate(420, 160)">
        <rect width="145" height="42" rx="6" fill="#FEFCE8" stroke="#EAB308" strokeWidth="1.5" />
        <text x="10" y="18" fill="#854D0E" fontSize="10" fontWeight="800">PRECISE DOSAGE</text>
        <text x="10" y="32" fill="#A16207" fontSize="10">Only 1/2 Tsp Flaxseed</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(60, 345)">
        <rect width="480" height="32" rx="6" fill="#FEFCE8" stroke="#EAB308" strokeWidth="1.5" />
        <text x="12" y="20" fill="#854D0E" fontSize="10" fontWeight="700">Crucial: Wipe until the pan looks completely dry. Excess oil causes sticky pooling.</text>
      </g>
    )}
  </CastIronCanvas>
);

/**
 * STEP 4: 450°F Oven Polymerization Bake
 * Oven interior, upside-down inverted skillet, foil catch sheet beneath, glassy non-stick mirror patina.
 */
export const CastIronStep4PolymerizationBakeSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <CastIronCanvas title="Step 4: 450°F Polymerization Bake" badgeText="ACTION: COMPLETED POLYMERIZED PATINA" className={className}>
    <g transform="translate(120, 65)" filter="url(#shadow-ci)">
      {/* Oven Cavity Frame */}
      <rect width="360" height="230" rx="12" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />

      {/* Heat Glow */}
      <rect x="15" y="15" width="330" height="200" rx="8" fill="#B91C1C" fillOpacity="0.15" />

      {/* Oven Wire Rack */}
      <line x1="20" y1="120" x2="340" y2="120" stroke="#94A3B8" strokeWidth="3" />
      <line x1="20" y1="190" x2="340" y2="190" stroke="#94A3B8" strokeWidth="3" />

      {/* Inverted Upside-Down Skillet on upper rack */}
      <g transform="translate(80, 75)">
        {/* Inverted pan body */}
        <path d="M 10 45 L 30 0 L 170 0 L 190 45 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
        {/* Handle */}
        <rect x="190" y="30" width="80" height="15" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
        {/* Mirror gloss shine */}
        <line x1="50" y1="10" x2="150" y2="10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Aluminum Foil Drip Sheet on lower rack */}
      <rect x="50" y="185" width="260" height="8" rx="2" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
      <text x="120" y="210" fill="#64748B" fontSize="9">Aluminum Foil Drip Catcher</text>
    </g>

    {showMeasurements && (
      <g transform="translate(420, 80)">
        <rect width="145" height="42" rx="8" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5" />
        <text x="12" y="18" fill="#B91C1C" fontSize="10" fontWeight="800">BAKE TEMP & TIME</text>
        <text x="12" y="32" fill="#DC2626" fontSize="10">450°F (230°C) • 1 Hour</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(40, 345)">
        <rect width="260" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="12" y="20" fill="#065F46" fontSize="10" fontWeight="700">✓ Glass-Hard Non-Stick Polymerized Surface</text>
      </g>
    )}
  </CastIronCanvas>
);
