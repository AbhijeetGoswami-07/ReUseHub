import React from 'react';
import { DiagramSvgProps } from './JeansStep1CuttingSvg';

const PalletCanvas: React.FC<{
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
      <pattern id="craft-grid-pallet" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
      </pattern>
      <marker id="arrow-blue-pl" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
      </marker>
      <filter id="shadow-pl" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.08" />
      </filter>
    </defs>
    <rect width="600" height="420" rx="16" fill="#FDFBF7" />
    <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />
    <rect width="600" height="420" rx="16" fill="url(#craft-grid-pallet)" />

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
 * STEP 1: Verify Pallet Safety Stamp (HT vs MB)
 * Wood grain pallet stringer showing green checkmark on "HT" (Heat Treated)
 * and red cross on "MB" (Methyl Bromide).
 */
export const PalletStep1StampInspectionSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <PalletCanvas title="Step 1: Inspect Pallet Stamp" badgeText="ACTION: IPPC STAMP VERIFICATION" className={className}>
    <g transform="translate(80, 75)" filter="url(#shadow-pl)">
      {/* Wooden Pallet Plank */}
      <rect width="440" height="230" rx="12" fill="#D97706" fillOpacity="0.25" stroke="#B45309" strokeWidth="3" />
      <line x1="0" y1="75" x2="440" y2="75" stroke="#B45309" strokeWidth="2" />
      <line x1="0" y1="150" x2="440" y2="150" stroke="#B45309" strokeWidth="2" />

      {/* APPROVED HT STAMP */}
      <g transform="translate(40, 45)">
        <rect width="160" height="130" rx="10" fill="#ECFDF5" stroke="#059669" strokeWidth="2.5" />
        <circle cx="80" cy="35" r="16" fill="#059669" />
        <text x="73" y="41" fill="#FFFFFF" fontSize="16" fontWeight="900">✓</text>
        <text x="65" y="80" fill="#065F46" fontSize="22" fontWeight="900">HT</text>
        <text x="25" y="105" fill="#047857" fontSize="10" fontWeight="700">HEAT TREATED (SAFE)</text>
        <text x="35" y="120" fill="#059669" fontSize="9">Non-Toxic Kiln Dried</text>
      </g>

      {/* REJECTED MB STAMP */}
      <g transform="translate(240, 45)">
        <rect width="160" height="130" rx="10" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2.5" strokeDasharray="5 3" />
        <circle cx="80" cy="35" r="16" fill="#DC2626" />
        <text x="73" y="41" fill="#FFFFFF" fontSize="16" fontWeight="900">✕</text>
        <text x="60" y="80" fill="#991B1B" fontSize="22" fontWeight="900">MB</text>
        <text x="20" y="105" fill="#B91C1C" fontSize="10" fontWeight="700">METHYL BROMIDE (TOXIC)</text>
        <text x="40" y="120" fill="#DC2626" fontSize="9">Chemical Pesticide</text>
      </g>
    </g>

    {showLabels && (
      <g transform="translate(60, 345)">
        <rect width="480" height="32" rx="6" fill="#FEFCE8" stroke="#EAB308" strokeWidth="1.5" />
        <text x="14" y="20" fill="#854D0E" fontSize="10" fontWeight="700">⚠️ Critical Safety: Only build with HT pallets. Never burn or sand MB pallets.</text>
      </g>
    )}
  </PalletCanvas>
);

/**
 * STEP 2: Nail & Staple Extraction
 * Wood timber plank, rusty nail being pulled out with claw hammer / pry bar.
 */
export const PalletStep2NailExtractionSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <PalletCanvas title="Step 2: Pull Nails & Staples" badgeText="ACTION: FASTENER EXTRACTION" className={className}>
    <g transform="translate(100, 75)" filter="url(#shadow-pl)">
      {/* Wood plank horizontal cross section */}
      <rect width="400" height="160" rx="12" fill="#D97706" fillOpacity="0.3" stroke="#B45309" strokeWidth="3" />

      {/* Exposed protruding rusty nails */}
      <g transform="translate(90, 80)">
        <rect x="0" y="-30" width="6" height="30" fill="#64748B" />
        <rect x="-4" y="-35" width="14" height="6" fill="#475569" />
        <circle cx="3" cy="-15" r="8" fill="#EF4444" fillOpacity="0.2" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 2" />
      </g>

      {/* Claw Hammer in action pulling nail */}
      <g transform="translate(220, 60)">
        {/* Steel Claw Head gripping nail */}
        <path d="M 0 0 C 15 -15 35 -15 50 0 L 40 15 C 30 5 15 5 10 15 Z" fill="#64748B" stroke="#334155" strokeWidth="2" />
        {/* Hammer Handle */}
        <polygon points="40,5 140,-50 148,-36 48,15" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
        {/* Leverage rotation arrow */}
        <path d="M 155 -30 C 165 -10 155 15 135 25" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrow-blue-pl)" />
      </g>

      {/* Clean nail holes */}
      <circle cx="340" cy="80" r="5" fill="#475569" />
      <circle cx="370" cy="80" r="5" fill="#475569" />
    </g>

    {showLabels && (
      <g transform="translate(60, 310)">
        <rect width="240" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="12" y="20" fill="#065F46" fontSize="10" fontWeight="700">✓ Removes Puncture Hazards</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(320, 310)">
        <rect width="220" height="32" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
        <text x="12" y="20" fill="#1D4ED8" fontSize="10" fontWeight="700">Use pry bar or claw hammer</text>
      </g>
    )}
  </PalletCanvas>
);

/**
 * STEP 3: Surface Sanding (80-grit & 120-grit)
 * Rough splintered pallet plank transitioning into silky smooth finish with electric / block sander.
 */
export const PalletStep3SandingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <PalletCanvas title="Step 3: Sand Timber Smooth" badgeText="ACTION: 2-STAGE TIMBER SANDING" className={className}>
    <g transform="translate(80, 80)" filter="url(#shadow-pl)">
      {/* Left Half: Rough Unsanded (Splinters) */}
      <rect x="0" y="40" width="210" height="180" rx="8" fill="#D97706" fillOpacity="0.4" stroke="#B45309" strokeWidth="2.5" />
      {/* Splinter lines */}
      <line x1="20" y1="80" x2="180" y2="85" stroke="#78350F" strokeWidth="2" strokeDasharray="6 4" />
      <line x1="40" y1="120" x2="160" y2="125" stroke="#78350F" strokeWidth="2" strokeDasharray="6 4" />
      <line x1="10" y1="160" x2="190" y2="165" stroke="#78350F" strokeWidth="2" strokeDasharray="6 4" />

      {/* Right Half: Smooth Silky Sanded */}
      <rect x="220" y="40" width="220" height="180" rx="8" fill="#FED7AA" stroke="#B45309" strokeWidth="2.5" />
      {/* Smooth grain lines */}
      <path d="M 240 80 Q 320 85 420 80" stroke="#CA8A04" strokeWidth="1.5" />
      <path d="M 240 120 Q 340 125 420 120" stroke="#CA8A04" strokeWidth="1.5" />
      <path d="M 240 160 Q 310 165 420 160" stroke="#CA8A04" strokeWidth="1.5" />

      {/* Sanding Block at divider */}
      <g transform="translate(180, 20)">
        <rect width="80" height="50" rx="6" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
        <text x="18" y="24" fill="#FFFFFF" fontSize="10" fontWeight="900">80-GRIT</text>
        <text x="10" y="38" fill="#FEF3C7" fontSize="9">→ 120-GRIT</text>
        {/* Orbital motion arrows */}
        <circle cx="40" cy="70" r="15" fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
      </g>
    </g>

    {showLabels && (
      <g transform="translate(60, 345)">
        <rect width="180" height="32" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5" />
        <text x="10" y="20" fill="#991B1B" fontSize="10" fontWeight="700">Before: Splinters & Rough</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(360, 345)">
        <rect width="180" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="10" y="20" fill="#065F46" fontSize="10" fontWeight="700">After: Silky Smooth & Safe</text>
      </g>
    )}
  </PalletCanvas>
);

/**
 * STEP 4: Stack & Anchor Pallet Frame
 * 2 pallets stacked for seat base, 1 pallet mounted vertically at 95° angle, deck screws & bolts.
 */
export const PalletStep4AssemblyBoltingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <PalletCanvas title="Step 4: Assemble Frame & Bolting" badgeText="ACTION: STRUCTURAL FRAME ASSEMBLY" className={className}>
    <g transform="translate(120, 60)" filter="url(#shadow-pl)">
      {/* Pallet 1: Ground Base */}
      <g transform="translate(40, 160)">
        <rect width="300" height="40" rx="4" fill="#D97706" fillOpacity="0.35" stroke="#B45309" strokeWidth="2" />
        <rect x="20" y="40" width="30" height="30" fill="#B45309" />
        <rect x="135" y="40" width="30" height="30" fill="#B45309" />
        <rect x="250" y="40" width="30" height="30" fill="#B45309" />
        <rect y="70" width="300" height="20" fill="#D97706" fillOpacity="0.35" stroke="#B45309" strokeWidth="2" />
      </g>

      {/* Pallet 2: Seat Height (Stacked on top) */}
      <g transform="translate(40, 80)">
        <rect width="300" height="40" rx="4" fill="#D97706" fillOpacity="0.35" stroke="#B45309" strokeWidth="2" />
        <rect x="20" y="40" width="30" height="30" fill="#B45309" />
        <rect x="135" y="40" width="30" height="30" fill="#B45309" />
        <rect x="250" y="40" width="30" height="30" fill="#B45309" />
        <rect y="70" width="300" height="15" fill="#D97706" fillOpacity="0.35" stroke="#B45309" strokeWidth="2" />
      </g>

      {/* Pallet 3: Vertical Backrest (Anchored behind) */}
      <g transform="translate(0, -10) rotate(-4)">
        <rect width="45" height="240" rx="4" fill="#D97706" fillOpacity="0.45" stroke="#B45309" strokeWidth="2.5" />
      </g>

      {/* Heavy-duty Screw / Carriage Bolt Points */}
      <circle cx="48" cy="95" r="5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
      <circle cx="48" cy="175" r="5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />

      {/* Screw fasteners callout */}
      <g transform="translate(60, 20)">
        <line x1="0" y1="20" x2="-8" y2="70" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 2" />
        <rect x="-10" y="0" width="130" height="24" rx="4" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1" />
        <text x="-4" y="16" fill="#B91C1C" fontSize="9" fontWeight="800">4" DECK BOLTS (X4)</text>
      </g>

      {/* Seat Height Measurement */}
      {showMeasurements && (
        <g transform="translate(360, 80)">
          <line x1="0" y1="0" x2="0" y2="170" stroke="#2563EB" strokeWidth="1.5" />
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#2563EB" strokeWidth="1.5" />
          <line x1="-5" y1="170" x2="5" y2="170" stroke="#2563EB" strokeWidth="1.5" />
          <rect x="10" y="70" width="125" height="24" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
          <text x="16" y="86" fill="#1D4ED8" fontSize="10" fontWeight="700">↕ ~18" Seat Height</text>
        </g>
      )}
    </g>

    {showLabels && (
      <g transform="translate(60, 355)">
        <rect width="320" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="12" y="20" fill="#065F46" fontSize="10" fontWeight="700">✓ Stack 2 for seat, anchor 1 for ergonomic backrest</text>
      </g>
    )}
  </PalletCanvas>
);

/**
 * STEP 5: Linseed Oil Finish & Weatherproof Cushions
 * Finished outdoor garden pallet lounge bench with weatherproof seat cushions, wood oil brush.
 */
export const PalletStep5WeatherproofCushionSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <PalletCanvas title="Step 5: Sealed Pallet Lounge Bench" badgeText="ACTION: COMPLETED PATIO LOUNGE" className={className}>
    <g transform="translate(100, 70)" filter="url(#shadow-pl)">
      {/* Finished Rich Stained Pallet Bench Base */}
      <g transform="translate(50, 110)">
        <rect width="310" height="110" rx="6" fill="#92400E" stroke="#78350F" strokeWidth="2.5" />
        <rect x="15" y="110" width="35" height="35" fill="#78350F" />
        <rect x="140" y="110" width="35" height="35" fill="#78350F" />
        <rect x="260" y="110" width="35" height="35" fill="#78350F" />
      </g>

      {/* Finished Stained Backrest */}
      <rect x="15" y="0" width="45" height="220" rx="6" fill="#92400E" stroke="#78350F" strokeWidth="2.5" />

      {/* Thick Weatherproof Seat Cushion */}
      <rect x="60" y="70" width="295" height="42" rx="8" fill="#059669" stroke="#047857" strokeWidth="2" />
      <text x="140" y="96" fill="#FFFFFF" fontSize="11" fontWeight="800">FOAM SEAT CUSHION</text>

      {/* Backrest Cushion */}
      <g transform="translate(25, 20)">
        <rect width="32" height="150" rx="8" fill="#10B981" stroke="#059669" strokeWidth="2" />
      </g>

      {/* Weatherproof Oil Brush */}
      <g transform="translate(365, 30)">
        <rect width="35" height="40" rx="4" fill="#D97706" />
        <rect y="40" width="35" height="25" fill="#475569" />
        <rect x="12" y="-30" width="10" height="30" rx="3" fill="#B45309" />
        <text x="-15" y="80" fill="#92400E" fontSize="9" fontWeight="700">Linseed Oil</text>
      </g>
    </g>

    {showLabels && (
      <g transform="translate(40, 350)">
        <rect width="210" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="12" y="20" fill="#065F46" fontSize="10" fontWeight="700">✓ 100% Weatherproof Exterior Patio</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(370, 350)">
        <rect width="190" height="32" rx="6" fill="#FEFCE8" stroke="#EAB308" strokeWidth="1.5" />
        <text x="12" y="20" fill="#854D0E" fontSize="10" fontWeight="700">Avoids ~32 kg CO2e Timber</text>
      </g>
    )}
  </PalletCanvas>
);
