import React from 'react';
import { DiagramSvgProps } from './JeansStep1CuttingSvg';

const BottleCanvas: React.FC<{
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
      <pattern id="craft-grid-bottle" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
      </pattern>
      <marker id="arrow-blue-bottle" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
      </marker>
      <marker id="arrow-green-bottle" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
      </marker>
      <filter id="shadow-bottle" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.08" />
      </filter>
    </defs>
    <rect width="600" height="420" rx="16" fill="#FDFBF7" />
    <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />
    <rect width="600" height="420" rx="16" fill="url(#craft-grid-bottle)" />

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
 * STEP 1: Cut Bottle into Funnel and Reservoir
 * Full 2-liter bottle with circumference red cut line 4" from base, fabric/utility shears.
 */
export const BottleStep1CuttingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <BottleCanvas title="Step 1: Cut Plastic Bottle" badgeText="ACTION: HORIZONTAL BOTTLE CUT" className={className}>
    <g transform="translate(180, 50)" filter="url(#shadow-bottle)">
      {/* 2L Bottle Silhouette */}
      <rect x="75" y="0" width="30" height="20" rx="4" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
      <path d="M 70 20 L 110 20 L 130 65 L 145 90 L 145 280 C 145 295 130 300 90 300 C 50 300 35 295 35 280 L 35 90 L 50 65 Z" fill="#E0F2FE" fillOpacity="0.6" stroke="#0284C7" strokeWidth="2.5" />

      {/* Red dashed cut line at ~4" (10cm) from base */}
      <line x1="15" y1="200" x2="165" y2="200" stroke="#EF4444" strokeWidth="3" strokeDasharray="8 6" />
      <circle cx="15" cy="200" r="4" fill="#EF4444" />
      <circle cx="165" cy="200" r="4" fill="#EF4444" />

      {/* Scissors cutting */}
      <g transform="translate(165, 175)">
        <path d="M 0 24 L 32 20 L 55 8" stroke="#334155" strokeWidth="2.5" fill="#E2E8F0" />
        <path d="M 0 24 L 32 28 L 55 40" stroke="#334155" strokeWidth="2.5" fill="#E2E8F0" />
        <ellipse cx="60" cy="8" rx="12" ry="7" fill="none" stroke="#DC2626" strokeWidth="3" />
        <ellipse cx="60" cy="40" rx="12" ry="7" fill="none" stroke="#DC2626" strokeWidth="3" />
      </g>

      {/* Upper Funnel Label */}
      {showLabels && (
        <g transform="translate(-140, 70)">
          <rect width="130" height="38" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
          <text x="10" y="16" fill="#1D4ED8" fontSize="10" fontWeight="800">TOP SECTION</text>
          <text x="10" y="30" fill="#2563EB" fontSize="9">Becomes Soil Funnel</text>
        </g>
      )}

      {/* Lower Reservoir Label */}
      {showLabels && (
        <g transform="translate(-140, 230)">
          <rect width="130" height="38" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
          <text x="10" y="16" fill="#065F46" fontSize="10" fontWeight="800">BASE SECTION</text>
          <text x="10" y="30" fill="#047857" fontSize="9">Becomes Water Reservoir</text>
        </g>
      )}

      {/* Measurement dimension */}
      {showMeasurements && (
        <g transform="translate(240, 200)">
          <line x1="0" y1="0" x2="0" y2="100" stroke="#2563EB" strokeWidth="1.5" />
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#2563EB" strokeWidth="1.5" />
          <line x1="-5" y1="100" x2="5" y2="100" stroke="#2563EB" strokeWidth="1.5" />
          <rect x="10" y="38" width="125" height="24" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
          <text x="16" y="54" fill="#1D4ED8" fontSize="10" fontWeight="700">↕ ~4 inches (10 cm)</text>
        </g>
      )}
    </g>
  </BottleCanvas>
);

/**
 * STEP 2: Smooth Cut Edges
 * Shows close-up of jagged raw edge being smoothed with 120-grit sandpaper block or taped.
 */
export const BottleStep2SmoothingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <BottleCanvas title="Step 2: Smooth Cut Edges" badgeText="ACTION: SMOOTH SHARP EDGES" className={className}>
    <g transform="translate(100, 75)">
      {/* Panel: Cut Edge Close-up */}
      <rect width="400" height="240" rx="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" filter="url(#shadow-bottle)" />

      {/* Plastic wall section */}
      <path d="M 60 210 L 60 90 Q 60 70 80 70 L 320 70 Q 340 70 340 90 L 340 210" fill="none" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" />

      {/* Sandpaper block in action */}
      <g transform="translate(150, 45)">
        <rect width="100" height="45" rx="6" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
        <rect y="35" width="100" height="10" fill="#78350F" />
        <text x="22" y="24" fill="#FFFFFF" fontSize="11" fontWeight="800">120-GRIT</text>
        <text x="18" y="36" fill="#FEF3C7" fontSize="9">Sandpaper Block</text>

        {/* Back and forth arrows */}
        <path d="M -25 22 L -8 22" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrow-blue-bottle)" />
        <path d="M 125 22 L 108 22" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrow-blue-bottle)" />
      </g>

      {/* Safe Smooth Edge Callout */}
      <g transform="translate(120, 140)">
        <rect width="160" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="14" y="20" fill="#065F46" fontSize="10" fontWeight="700">✓ Removes Sharp Burrs</text>
      </g>
    </g>

    {showLabels && (
      <g transform="translate(120, 345)">
        <rect width="360" height="32" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
        <text x="14" y="20" fill="#1D4ED8" fontSize="10" fontWeight="700">Alternative: Apply a thin strip of paper tape over the cut rim</text>
      </g>
    )}
  </BottleCanvas>
);

/**
 * STEP 3: Pierce Cap for Capillary Wick
 * Plastic cap shown with drill bit / heated nail creating 1/4" center hole.
 */
export const BottleStep3CapPiercingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <BottleCanvas title="Step 3: Pierce Bottle Cap" badgeText={'ACTION: 1/4" WICK HOLE PIERCE'} className={className}>
    <g transform="translate(180, 70)">
      {/* Cap body */}
      <g transform="translate(40, 80)">
        <rect x="0" y="40" width="160" height="80" rx="10" fill="#0284C7" stroke="#0369A1" strokeWidth="3" />
        {/* Ridge grips */}
        <line x1="25" y1="50" x2="25" y2="110" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
        <line x1="55" y1="50" x2="55" y2="110" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
        <line x1="80" y1="50" x2="80" y2="110" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
        <line x1="105" y1="50" x2="105" y2="110" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
        <line x1="135" y1="50" x2="135" y2="110" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />

        {/* Center Hole being pierced */}
        <circle cx="80" cy="40" r="16" fill="#0F172A" stroke="#DC2626" strokeWidth="2.5" strokeDasharray="3 2" />

        {/* Drill bit / punch needle coming down */}
        <g transform="translate(74, -50)">
          <rect x="4" y="0" width="4" height="60" fill="#64748B" />
          <path d="M 0 60 L 6 90 L 12 60 Z" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
          {/* Downward force arrows */}
          <path d="M -20 20 L -20 45" stroke="#DC2626" strokeWidth="2.5" markerEnd="url(#arrow-blue-bottle)" />
          <path d="M 32 20 L 32 45" stroke="#DC2626" strokeWidth="2.5" markerEnd="url(#arrow-blue-bottle)" />
        </g>
      </g>

      {/* Measurement pill */}
      {showMeasurements && (
        <g transform="translate(195, 120)">
          <rect width="145" height="38" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
          <text x="10" y="16" fill="#1D4ED8" fontSize="10" fontWeight="800">HOLE DIAMETER</text>
          <text x="10" y="30" fill="#2563EB" fontSize="10">Ø ~1/4 inch (6 mm)</text>
        </g>
      )}
    </g>

    {showLabels && (
      <g transform="translate(80, 345)">
        <rect width="440" height="32" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5" />
        <text x="14" y="20" fill="#991B1B" fontSize="10" fontWeight="700">⚠️ Safety: Place cap on a block of scrap wood before drilling or punching</text>
      </g>
    )}
  </BottleCanvas>
);

/**
 * STEP 4: Thread Wick and Nest Funnel
 * Shows 8" cotton cord passed through the cap hole, knotted inside,
 * top funnel inverted into the base reservoir.
 */
export const BottleStep4WickAssemblySvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <BottleCanvas title="Step 4: Thread Wick & Nest Funnel" badgeText="ACTION: WICK ASSEMBLY & NESTING" className={className}>
    <g transform="translate(160, 60)" filter="url(#shadow-bottle)">
      {/* Lower Base Reservoir */}
      <rect x="40" y="140" width="180" height="150" rx="16" fill="#E0F2FE" fillOpacity="0.4" stroke="#0284C7" strokeWidth="2.5" />

      {/* Top Inverted Funnel nesting inside */}
      <path d="M 45 60 L 215 60 L 160 170 L 100 170 Z" fill="#F0FDF4" stroke="#059669" strokeWidth="2.5" />
      {/* Cap at neck */}
      <rect x="105" y="170" width="50" height="20" rx="4" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />

      {/* Capillary Cotton Wick */}
      <path d="M 130 90 L 130 250" stroke="#F59E0B" strokeWidth="4" strokeDasharray="5 3" />
      {/* Knot inside funnel */}
      <circle cx="130" cy="165" r="6" fill="#D97706" />
      <circle cx="130" cy="250" r="4" fill="#D97706" />

      {/* Inversion movement arrow */}
      <path d="M 235 90 C 255 110 255 150 235 170" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrow-blue-bottle)" />
    </g>

    {showMeasurements && (
      <g transform="translate(380, 160)">
        <rect width="160" height="42" rx="8" fill="#FEFCE8" stroke="#EAB308" strokeWidth="1.5" />
        <text x="12" y="18" fill="#854D0E" fontSize="10" fontWeight="800">COTTON WICK LENGTH</text>
        <text x="12" y="32" fill="#A16207" fontSize="10">~8 inches (20 cm) Cord</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(40, 120)">
        <rect width="130" height="42" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="10" y="18" fill="#065F46" fontSize="10" fontWeight="800">NESTED FUNNEL</text>
        <text x="10" y="32" fill="#047857" fontSize="9">Locks into Reservoir</text>
      </g>
    )}
  </BottleCanvas>
);

/**
 * STEP 5: Add Soil, Seeds, and Fill Reservoir
 * Finished planter: soil & plant in top funnel, water in base, capillary arrows.
 */
export const BottleStep5PlantingReservoirSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <BottleCanvas title="Step 5: Plant Herbs & Fill Water" badgeText="ACTION: COMPLETED SELF-WATERING PLANTER" className={className}>
    <g transform="translate(180, 50)" filter="url(#shadow-bottle)">
      {/* Base Reservoir with water */}
      <rect x="40" y="150" width="180" height="150" rx="16" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
      {/* Water Fill Line */}
      <rect x="42" y="210" width="176" height="88" rx="8" fill="#38BDF8" fillOpacity="0.6" />
      <text x="85" y="255" fill="#0369A1" fontSize="11" fontWeight="800">WATER LEVEL</text>

      {/* Top Funnel with Potting Soil */}
      <path d="M 45 70 L 215 70 L 160 170 L 100 170 Z" fill="#78350F" fillOpacity="0.25" stroke="#059669" strokeWidth="2.5" />
      {/* Soil Body */}
      <path d="M 52 75 L 208 75 L 155 165 L 105 165 Z" fill="#582F0E" />

      {/* Capillary Wick Drawing Water */}
      <path d="M 130 90 L 130 270" stroke="#F59E0B" strokeWidth="4" strokeDasharray="4 2" />
      {/* Upward capillary action arrows */}
      <path d="M 115 240 L 115 200" stroke="#0284C7" strokeWidth="2" markerEnd="url(#arrow-blue-bottle)" />
      <path d="M 145 240 L 145 200" stroke="#0284C7" strokeWidth="2" markerEnd="url(#arrow-blue-bottle)" />

      {/* Thriving Herb Plant / Sprout */}
      <g transform="translate(130, 70)">
        <path d="M 0 0 C 0 -25 -25 -40 -25 -40 C -25 -40 5 -40 0 0" fill="#10B981" stroke="#047857" strokeWidth="2" />
        <path d="M 0 0 C 0 -35 30 -50 30 -50 C 30 -50 0 -45 0 0" fill="#34D399" stroke="#047857" strokeWidth="2" />
        <path d="M 0 -15 C -15 -35 -5 -60 -5 -60 C -5 -60 15 -35 0 -15" fill="#059669" stroke="#065F46" strokeWidth="2" />
      </g>
    </g>

    {showLabels && (
      <g transform="translate(40, 160)">
        <rect width="130" height="42" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="10" y="18" fill="#065F46" fontSize="10" fontWeight="800">SUB-IRRIGATION</text>
        <text x="10" y="32" fill="#047857" fontSize="9">Roots sip as needed</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(410, 160)">
        <rect width="140" height="42" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
        <text x="10" y="18" fill="#1D4ED8" fontSize="10" fontWeight="800">ZERO ROOT ROT</text>
        <text x="10" y="32" fill="#2563EB" fontSize="9">Never over-watered</text>
      </g>
    )}
  </BottleCanvas>
);
