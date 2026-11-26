import React from 'react';
import { DiagramSvgProps } from './JeansStep1CuttingSvg';

const TshirtCanvas: React.FC<{
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
      <pattern id="craft-grid-tshirt" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
      </pattern>
      <marker id="arrow-blue-ts" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
      </marker>
      <filter id="shadow-ts" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.08" />
      </filter>
    </defs>
    <rect width="600" height="420" rx="16" fill="#FDFBF7" />
    <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />
    <rect width="600" height="420" rx="16" fill="url(#craft-grid-tshirt)" />

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
 * STEP 1: Deconstruct T-Shirt & Cut Horizontal Strips
 * T-shirt flat view, red cut lines removing sleeves & collar, parallel horizontal 1" strips.
 */
export const TshirtStep1DeconstructSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <TshirtCanvas title="Step 1: Cut T-Shirt Strips" badgeText={'ACTION: SLICE 1" PARALLEL STRIPS'} className={className}>
    <g transform="translate(150, 60)" filter="url(#shadow-ts)">
      {/* T-Shirt Silhouette */}
      <path d="M 90 20 Q 150 50 210 20 L 280 60 L 250 110 L 220 95 L 220 270 L 80 270 L 80 95 L 50 110 L 20 60 Z" fill="#059669" fillOpacity="0.15" stroke="#047857" strokeWidth="2.5" />

      {/* Red Cut Lines for Sleeves & Collar */}
      <path d="M 75 40 Q 150 70 225 40" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="5 3" />
      <line x1="80" y1="95" x2="40" y2="70" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="5 3" />
      <line x1="220" y1="95" x2="260" y2="70" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="5 3" />

      {/* Parallel Horizontal Strips (stopping 1" from right edge) */}
      <line x1="85" y1="130" x2="200" y2="130" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
      <line x1="85" y1="160" x2="200" y2="160" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
      <line x1="85" y1="190" x2="200" y2="190" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
      <line x1="85" y1="220" x2="200" y2="220" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
      <line x1="85" y1="250" x2="200" y2="250" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />

      {/* Uncut seam buffer margin line */}
      <line x1="200" y1="115" x2="200" y2="265" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="2 2" />

      {/* Scissors Icon */}
      <g transform="translate(190, 145)">
        <path d="M 0 16 L 24 14 L 40 4" stroke="#334155" strokeWidth="2" fill="#E2E8F0" />
        <path d="M 0 16 L 24 18 L 40 28" stroke="#334155" strokeWidth="2" fill="#E2E8F0" />
        <ellipse cx="44" cy="4" rx="9" ry="5" fill="none" stroke="#DC2626" strokeWidth="2" />
        <ellipse cx="44" cy="28" rx="9" ry="5" fill="none" stroke="#DC2626" strokeWidth="2" />
      </g>
    </g>

    {showMeasurements && (
      <g transform="translate(420, 160)">
        <rect width="145" height="42" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
        <text x="10" y="18" fill="#1D4ED8" fontSize="10" fontWeight="800">STRIP SPACING</text>
        <text x="10" y="32" fill="#2563EB" fontSize="10">↕ ~1 inch (2.5 cm)</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(40, 160)">
        <rect width="135" height="42" rx="6" fill="#FEFCE8" stroke="#EAB308" strokeWidth="1.5" />
        <text x="10" y="18" fill="#854D0E" fontSize="10" fontWeight="800">STOP CUTTING</text>
        <text x="10" y="32" fill="#A16207" fontSize="9">Leave 1" edge uncut</text>
      </g>
    )}
  </TshirtCanvas>
);

/**
 * STEP 2: Diagonal Continuous Cuts
 * Close-up of side seam showing diagonal cuts connecting strips into one continuous ribbon.
 */
export const TshirtStep2RibbonCuttingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <TshirtCanvas title="Step 2: Diagonal Continuous Cuts" badgeText="ACTION: CONTINUOUS YARN CUTTING" className={className}>
    <g transform="translate(120, 75)" filter="url(#shadow-ts)">
      {/* Side Seam Buffer Zone */}
      <rect width="360" height="230" rx="12" fill="#ECFDF5" stroke="#059669" strokeWidth="2.5" />
      <text x="110" y="35" fill="#065F46" fontSize="11" fontWeight="800">UNCUT SEAM CONNECTION ZONE</text>

      {/* Horizontal Strip Openings */}
      <g transform="translate(30, 40)">
        {/* Slits */}
        <line x1="0" y1="40" x2="80" y2="40" stroke="#047857" strokeWidth="3" />
        <line x1="0" y1="80" x2="80" y2="80" stroke="#047857" strokeWidth="3" />
        <line x1="0" y1="120" x2="80" y2="120" stroke="#047857" strokeWidth="3" />
        <line x1="0" y1="160" x2="80" y2="160" stroke="#047857" strokeWidth="3" />

        {/* Diagonal cut lines connecting strip n to strip n+1 */}
        <line x1="80" y1="40" x2="220" y2="80" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 4" />
        <line x1="80" y1="80" x2="220" y2="120" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 4" />
        <line x1="80" y1="120" x2="220" y2="160" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 4" />

        {/* Opposite side strip exits */}
        <line x1="220" y1="80" x2="300" y2="80" stroke="#047857" strokeWidth="3" />
        <line x1="220" y1="120" x2="300" y2="120" stroke="#047857" strokeWidth="3" />
        <line x1="220" y1="160" x2="300" y2="160" stroke="#047857" strokeWidth="3" />

        {/* Direction Arrows */}
        <path d="M 125 50 L 155 60" stroke="#2563EB" strokeWidth="2.5" markerEnd="url(#arrow-blue-ts)" />
        <path d="M 125 90 L 155 100" stroke="#2563EB" strokeWidth="2.5" markerEnd="url(#arrow-blue-ts)" />
      </g>
    </g>

    {showLabels && (
      <g transform="translate(60, 345)">
        <rect width="480" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="14" y="20" fill="#065F46" fontSize="10" fontWeight="700">✓ Diagonal cuts transform flat shirt into one unbroken 100-foot yarn skein</text>
      </g>
    )}
  </TshirtCanvas>
);

/**
 * STEP 3: Tension Stretch & Edge Curling
 * Hands pulling jersey ribbon firmly, arrows showing fabric curling into soft tubular rope.
 */
export const TshirtStep3TensionStretchingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <TshirtCanvas title="Step 3: Tension Stretch & Curl" badgeText="ACTION: TENSION YARN CURLING" className={className}>
    <g transform="translate(80, 85)" filter="url(#shadow-ts)">
      {/* Before: Flat Jersey Ribbon */}
      <g transform="translate(20, 20)">
        <rect width="180" height="35" rx="3" fill="#A7F3D0" stroke="#059669" strokeWidth="2" />
        <text x="25" y="22" fill="#065F46" fontSize="10" fontWeight="800">BEFORE: Flat Ribbon</text>
      </g>

      {/* Stretch Transition Wave with hands */}
      <g transform="translate(220, 30)">
        <path d="M 0 5 C 40 -15 80 25 120 5 L 180 5" stroke="#059669" strokeWidth="8" strokeLinecap="round" />
        {/* Curled Edge Arrows */}
        <path d="M 40 -8 C 30 -20 50 -20 45 -5" stroke="#2563EB" strokeWidth="2" markerEnd="url(#arrow-blue-ts)" />
        <path d="M 80 20 C 70 30 90 30 85 15" stroke="#2563EB" strokeWidth="2" markerEnd="url(#arrow-blue-ts)" />
      </g>

      {/* Tension Pull Force Arrows */}
      <g transform="translate(10, 110)">
        <path d="M 80 0 L 20 0" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrow-blue-ts)" />
        <text x="20" y="-10" fill="#1D4ED8" fontSize="10" fontWeight="800">← PULL FIRMLY</text>

        <path d="M 340 0 L 400 0" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrow-blue-ts)" />
        <text x="330" y="-10" fill="#1D4ED8" fontSize="10" fontWeight="800">PULL FIRMLY →</text>
      </g>

      {/* After: Soft Round Macramé Cord Ball */}
      <g transform="translate(140, 140)">
        <circle cx="80" cy="40" r="35" fill="#10B981" stroke="#047857" strokeWidth="2" />
        <path d="M 55 30 C 65 15 95 15 105 30 C 115 45 85 55 75 40" stroke="#065F46" strokeWidth="3" fill="none" />
        <path d="M 60 45 C 75 60 100 50 95 35" stroke="#065F46" strokeWidth="3" fill="none" />
        <text x="140" y="35" fill="#065F46" fontSize="11" fontWeight="800">FINISHED YARN BALL</text>
        <text x="140" y="50" fill="#047857" fontSize="10">Tubular, Lint-Free, Non-Fraying</text>
      </g>
    </g>

    {showLabels && (
      <g transform="translate(80, 345)">
        <rect width="440" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="14" y="20" fill="#065F46" fontSize="10" fontWeight="700">Jersey cotton naturally rolls inward when stretched along the grain</text>
      </g>
    )}
  </TshirtCanvas>
);

/**
 * STEP 4: Square Knot Mesh Basket / Plant Hanger
 * Completed macramé plant hanger holding terracotta pot, wooden top ring, square knots.
 */
export const TshirtStep4KnotBasketSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <TshirtCanvas title="Step 4: Braided Plant Hanger" badgeText="ACTION: COMPLETED MACRAMÉ BASKET" className={className}>
    <g transform="translate(200, 45)" filter="url(#shadow-ts)">
      {/* Top Wooden / Metal Ring */}
      <ellipse cx="100" cy="20" rx="20" ry="10" fill="#CBD5E1" stroke="#475569" strokeWidth="3" />

      {/* 8 Hanging Strands */}
      <g stroke="#059669" strokeWidth="2.5">
        <line x1="85" y1="25" x2="60" y2="90" />
        <line x1="90" y1="25" x2="70" y2="90" />
        <line x1="95" y1="25" x2="85" y2="90" />
        <line x1="100" y1="25" x2="95" y2="90" />
        <line x1="105" y1="25" x2="105" y2="90" />
        <line x1="110" y1="25" x2="115" y2="90" />
        <line x1="115" y1="25" x2="130" y2="90" />
        <line x1="120" y1="25" x2="140" y2="90" />
      </g>

      {/* Row 1 Square Knots */}
      <rect x="55" y="90" width="18" height="12" rx="3" fill="#047857" />
      <rect x="85" y="90" width="18" height="12" rx="3" fill="#047857" />
      <rect x="115" y="90" width="18" height="12" rx="3" fill="#047857" />

      {/* Diamond Mesh Netting */}
      <g stroke="#059669" strokeWidth="2">
        <line x1="64" y1="102" x2="80" y2="150" />
        <line x1="94" y1="102" x2="80" y2="150" />
        <line x1="94" y1="102" x2="110" y2="150" />
        <line x1="124" y1="102" x2="110" y2="150" />
      </g>

      {/* Row 2 Interlocking Knots */}
      <rect x="72" y="150" width="16" height="10" rx="2" fill="#047857" />
      <rect x="102" y="150" width="16" height="10" rx="2" fill="#047857" />

      {/* Terracotta Plant Pot in cradle */}
      <polygon points="50,140 150,140 135,210 65,210" fill="#EA580C" stroke="#C2410C" strokeWidth="2" />
      {/* Plant foliage spilling out */}
      <path d="M 80 140 C 60 110 50 80 50 80 C 50 80 75 100 85 140" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
      <path d="M 120 140 C 140 110 150 80 150 80 C 150 80 125 100 115 140" fill="#34D399" stroke="#047857" strokeWidth="1.5" />

      {/* Bottom Gathering Tassel Knot */}
      <rect x="90" y="215" width="20" height="18" rx="4" fill="#047857" />
      {/* Fringe */}
      <line x1="93" y1="233" x2="90" y2="280" stroke="#059669" strokeWidth="2" />
      <line x1="97" y1="233" x2="96" y2="280" stroke="#059669" strokeWidth="2" />
      <line x1="101" y1="233" x2="102" y2="280" stroke="#059669" strokeWidth="2" />
      <line x1="107" y1="233" x2="109" y2="280" stroke="#059669" strokeWidth="2" />
    </g>

    {showLabels && (
      <g transform="translate(40, 160)">
        <rect width="130" height="42" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="10" y="18" fill="#065F46" fontSize="10" fontWeight="800">NO-SEW CRAFT</text>
        <text x="10" y="32" fill="#047857" fontSize="9">100% Upcycled T-Shirt</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(420, 160)">
        <rect width="140" height="42" rx="6" fill="#FEFCE8" stroke="#EAB308" strokeWidth="1.5" />
        <text x="10" y="18" fill="#854D0E" fontSize="10" fontWeight="800">HOLDS 15+ LBS</text>
        <text x="10" y="32" fill="#A16207" fontSize="9">Durable Elastic Mesh</text>
      </g>
    )}
  </TshirtCanvas>
);
