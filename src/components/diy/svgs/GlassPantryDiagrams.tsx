import React from 'react';
import { DiagramSvgProps } from './JeansStep1CuttingSvg';

/**
 * Common SVG Definitions & Background Canvas
 */
const DiagramCanvas: React.FC<{
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
      <pattern id="craft-grid-glass" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
      </pattern>
      <marker id="arrow-blue-glass" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
      </marker>
      <marker id="arrow-green-glass" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
      </marker>
      <filter id="shadow-glass" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.08" />
      </filter>
    </defs>
    <rect width="600" height="420" rx="16" fill="#FDFBF7" />
    <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />
    <rect width="600" height="420" rx="16" fill="url(#craft-grid-glass)" />

    {/* Header Action Badge */}
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
 * STEP 1: Warm Water Adhesive Softening
 * Shows glass jars submerged in a basin of warm soapy water with water bubbles,
 * paper label beginning to peel and soften, with a 20-minute soak timer.
 */
export const GlassStep1SoakingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <DiagramCanvas title="Step 1: Warm Water Soak" badgeText="ACTION: WARM WATER SOAK" className={className}>
    <g filter="url(#shadow-glass)" transform="translate(100, 70)">
      {/* Basin / Sink */}
      <rect x="0" y="80" width="400" height="210" rx="20" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
      {/* Water fill level */}
      <path d="M 2 120 Q 100 115 200 120 T 398 120 L 398 270 Q 398 288 380 288 L 20 288 Q 2 288 2 270 Z" fill="#38BDF8" fillOpacity="0.25" />

      {/* Glass Jar in basin */}
      <g transform="translate(130, 40)">
        <rect x="25" y="0" width="90" height="18" rx="4" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
        <rect x="10" y="18" width="120" height="190" rx="16" fill="#FFFFFF" fillOpacity="0.8" stroke="#334155" strokeWidth="2.5" />
        {/* Softening label peeling off */}
        <path d="M 20 70 L 100 70 C 115 70 125 90 115 130 L 20 130 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
        <text x="35" y="105" fill="#B45309" fontSize="11" fontWeight="700">Commercial</text>
        <text x="45" y="120" fill="#D97706" fontSize="9">Paper Label</text>
        {/* Peeling arrow */}
        <path d="M 125 110 C 140 100 145 80 135 65" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="4 3" markerEnd="url(#arrow-blue-glass)" />
      </g>

      {/* Soap bubbles in water */}
      <circle cx="90" cy="160" r="12" fill="#FFFFFF" fillOpacity="0.7" stroke="#38BDF8" strokeWidth="1.5" />
      <circle cx="80" cy="180" r="8" fill="#FFFFFF" fillOpacity="0.7" stroke="#38BDF8" strokeWidth="1.5" />
      <circle cx="310" cy="170" r="14" fill="#FFFFFF" fillOpacity="0.7" stroke="#38BDF8" strokeWidth="1.5" />
      <circle cx="330" cy="150" r="9" fill="#FFFFFF" fillOpacity="0.7" stroke="#38BDF8" strokeWidth="1.5" />
    </g>

    {/* Measurement / Timer Callout */}
    {showMeasurements && (
      <g transform="translate(410, 85)">
        <rect width="150" height="42" rx="8" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
        <text x="14" y="20" fill="#1D4ED8" fontSize="11" fontWeight="800">⏱ SOAK TIME</text>
        <text x="14" y="34" fill="#2563EB" fontSize="10">20 Mins in Warm Water</text>
      </g>
    )}

    {/* Labels */}
    {showLabels && (
      <g transform="translate(40, 350)">
        <rect width="210" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="12" y="20" fill="#065F46" fontSize="10" fontWeight="700">✓ Softens Industrial Adhesive</text>
      </g>
    )}
  </DiagramCanvas>
);

/**
 * STEP 2: Apply Baking Soda & Oil Paste
 * Shows mixing bowl with 1:1 baking soda + vegetable oil,
 * paste being spread over residual sticky glue with a spatula/brush.
 */
export const GlassStep2PasteScrubSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <DiagramCanvas title="Step 2: Apply Baking Soda & Oil Paste" badgeText="ACTION: 1:1 NATURAL DEGREASER" className={className}>
    <g transform="translate(60, 80)">
      {/* Left: Mixing Bowl */}
      <g transform="translate(20, 40)">
        <ellipse cx="80" cy="120" rx="75" ry="35" fill="#F1F5F9" stroke="#64748B" strokeWidth="2" />
        <path d="M 5 120 C 5 180 155 180 155 120 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
        {/* Paste inside */}
        <ellipse cx="80" cy="125" rx="60" ry="25" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
        <text x="45" y="128" fill="#854D0E" fontSize="10" fontWeight="800">1:1 Paste Mix</text>

        {showMeasurements && (
          <g transform="translate(-10, 175)">
            <rect width="180" height="30" rx="6" fill="#FEFCE8" stroke="#EAB308" strokeWidth="1.5" />
            <text x="10" y="19" fill="#713F12" fontSize="10" fontWeight="700">50% Baking Soda + 50% Oil</text>
          </g>
        )}
      </g>

      {/* Transfer Arrow */}
      <path d="M 210 130 C 235 110 245 110 270 130" stroke="#2563EB" strokeWidth="3" strokeDasharray="5 4" markerEnd="url(#arrow-blue-glass)" />

      {/* Right: Glass Jar with Paste Applied */}
      <g transform="translate(290, 20)">
        <rect x="25" y="0" width="90" height="18" rx="4" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
        <rect x="10" y="18" width="120" height="200" rx="16" fill="#FFFFFF" fillOpacity="0.8" stroke="#334155" strokeWidth="2.5" />
        {/* Sticky adhesive spot */}
        <rect x="25" y="70" width="90" height="80" rx="8" fill="#FDE047" fillOpacity="0.6" stroke="#CA8A04" strokeWidth="2" strokeDasharray="4 3" />
        <text x="35" y="105" fill="#854D0E" fontSize="10" fontWeight="800">PASTE COAT</text>
        <text x="32" y="122" fill="#A16207" fontSize="9">Dissolves Gum</text>

        {/* Spatula / finger spreading */}
        <g transform="translate(100, 60)">
          <path d="M 10 0 L 25 35 L 5 45 Z" fill="#64748B" stroke="#334155" strokeWidth="1.5" />
          <rect x="18" y="-40" width="8" height="45" rx="3" fill="#D97706" />
        </g>
      </g>
    </g>

    {showLabels && (
      <g transform="translate(360, 345)">
        <rect width="200" height="32" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
        <text x="12" y="20" fill="#1D4ED8" fontSize="10" fontWeight="700">Let paste sit for 10 minutes</text>
      </g>
    )}
  </DiagramCanvas>
);

/**
 * STEP 3: Wipe Clean & Wash Degreaser
 * Shows sponge wiping off the softened adhesive smoothly,
 * running warm tap water rinsing the crystal-clear glass.
 */
export const GlassStep3WipeCleanSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <DiagramCanvas title="Step 3: Wipe Clean & Degrease" badgeText="ACTION: WIPE RESIDUE CLEAN" className={className}>
    <g transform="translate(120, 80)">
      {/* Running Water Stream */}
      <path d="M 180 0 L 180 50 C 180 70 170 80 170 120" stroke="#38BDF8" strokeWidth="14" strokeLinecap="round" strokeOpacity="0.5" />

      {/* Glass Jar under stream */}
      <g transform="translate(100, 30)">
        <rect x="25" y="0" width="90" height="18" rx="4" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
        <rect x="10" y="18" width="120" height="210" rx="16" fill="#F0FDF4" fillOpacity="0.5" stroke="#059669" strokeWidth="2.5" />

        {/* Clean sparkle shine lines */}
        <path d="M 25 50 L 35 190" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        <path d="M 40 60 L 45 150" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

        {/* Sponge scrubbing */}
        <g transform="translate(75, 100)">
          <rect width="65" height="42" rx="8" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
          <rect y="30" width="65" height="12" rx="3" fill="#15803D" />
          <circle cx="15" cy="15" r="4" fill="#CA8A04" fillOpacity="0.3" />
          <circle cx="40" cy="20" r="5" fill="#CA8A04" fillOpacity="0.3" />
          {/* Motion scrub arrows */}
          <path d="M -15 15 L -2 15" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrow-blue-glass)" />
          <path d="M 80 15 L 67 15" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrow-blue-glass)" />
        </g>
      </g>
    </g>

    {showLabels && (
      <g transform="translate(50, 345)">
        <rect width="250" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="14" y="20" fill="#065F46" fontSize="10" fontWeight="700">Sparkling Clean • Zero Sticky Residue</text>
      </g>
    )}
  </DiagramCanvas>
);

/**
 * STEP 4: Thermal Sterilization
 * Shows stockpot with boiling water bubbles (100°C / 5 min),
 * submerged glass jar and metal lid, tongs lifting jar.
 */
export const GlassStep4SterilizationSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <DiagramCanvas title="Step 4: Thermal Sterilization" badgeText="ACTION: BOILING STERILIZATION" className={className}>
    <g transform="translate(100, 75)">
      {/* Boiling Stockpot */}
      <rect x="20" y="60" width="360" height="190" rx="12" fill="#94A3B8" stroke="#334155" strokeWidth="3" />
      {/* Handles */}
      <path d="M 5 90 L 20 90 L 20 120 L 5 120 Z" fill="#64748B" stroke="#334155" strokeWidth="2" />
      <path d="M 380 90 L 395 90 L 395 120 L 380 120 Z" fill="#64748B" stroke="#334155" strokeWidth="2" />

      {/* Boiling water with rolling bubbles */}
      <rect x="23" y="100" width="354" height="147" rx="8" fill="#38BDF8" fillOpacity="0.4" />
      <circle cx="80" cy="180" r="10" fill="#FFFFFF" fillOpacity="0.8" />
      <circle cx="120" cy="140" r="14" fill="#FFFFFF" fillOpacity="0.8" />
      <circle cx="280" cy="160" r="12" fill="#FFFFFF" fillOpacity="0.8" />
      <circle cx="320" cy="130" r="8" fill="#FFFFFF" fillOpacity="0.8" />

      {/* Submerged Jar */}
      <g transform="translate(150, 110)">
        <rect width="100" height="120" rx="10" fill="#FFFFFF" fillOpacity="0.7" stroke="#0284C7" strokeWidth="2" />
        <rect x="15" y="-12" width="70" height="12" rx="3" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
      </g>

      {/* Submerged Lid */}
      <ellipse cx="100" cy="210" rx="40" ry="12" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />

      {/* Tongs Lifting */}
      <g transform="translate(240, 20)">
        <path d="M 0 0 L 20 100 L 0 110" stroke="#DC2626" strokeWidth="3" fill="none" />
        <path d="M 35 0 L 15 100 L 35 110" stroke="#DC2626" strokeWidth="3" fill="none" />
      </g>
    </g>

    {showMeasurements && (
      <g transform="translate(420, 85)">
        <rect width="150" height="42" rx="8" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5" />
        <text x="14" y="20" fill="#B91C1C" fontSize="11" fontWeight="800">🔥 BOIL 5 MINUTES</text>
        <text x="14" y="34" fill="#DC2626" fontSize="10">Kills 99.9% Bacteria</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(50, 350)">
        <rect width="240" height="32" rx="6" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
        <text x="12" y="20" fill="#1E293B" fontSize="10" fontWeight="700">Tongs recommended for hot glass</text>
      </g>
    )}
  </DiagramCanvas>
);

/**
 * STEP 5: Airtight Sealing & Pantry Labeling
 * Shows completed glass pantry jar with silicone lid seal,
 * chalkboard/kraft label "Organic Rolled Oats", and food fill level.
 */
export const GlassStep5SealingLabelingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <DiagramCanvas title="Step 5: Airtight Pantry Labeling" badgeText="ACTION: AIRTIGHT PANTRY CANISTER" className={className}>
    <g transform="translate(200, 65)">
      {/* Wooden / Metal Lid with Silicone Gasket */}
      <g transform="translate(10, 0)">
        <rect x="0" y="0" width="180" height="22" rx="6" fill="#D97706" stroke="#92400E" strokeWidth="2" />
        {/* Silicone Gasket Ring */}
        <rect x="15" y="22" width="150" height="8" rx="2" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
      </g>

      {/* Clear Glass Jar Body */}
      <rect x="15" y="30" width="170" height="230" rx="20" fill="#FFFFFF" fillOpacity="0.85" stroke="#334155" strokeWidth="3" />

      {/* Pantry contents (e.g. rolled oats / coffee beans texture) */}
      <rect x="25" y="100" width="150" height="150" rx="12" fill="#FEF3C7" fillOpacity="0.7" />
      <circle cx="50" cy="140" r="3" fill="#D97706" />
      <circle cx="80" cy="160" r="3" fill="#D97706" />
      <circle cx="120" cy="150" r="3" fill="#D97706" />
      <circle cx="150" cy="180" r="3" fill="#D97706" />
      <circle cx="70" cy="200" r="3" fill="#D97706" />
      <circle cx="110" cy="220" r="3" fill="#D97706" />

      {/* Chalkboard / Kraft Tape Label */}
      <rect x="35" y="110" width="130" height="48" rx="6" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
      <text x="50" y="132" fill="#F8FAFC" fontSize="11" fontWeight="700">ROLLED OATS</text>
      <text x="58" y="148" fill="#94A3B8" fontSize="9">Zero-Waste Bulk</text>
    </g>

    {showLabels && (
      <g transform="translate(40, 160)">
        {/* Left callout */}
        <rect width="130" height="42" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="10" y="18" fill="#065F46" fontSize="10" fontWeight="800">AIRTIGHT SEAL</text>
        <text x="10" y="32" fill="#047857" fontSize="9">Preserves Freshness</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(420, 160)">
        {/* Right callout */}
        <rect width="140" height="42" rx="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
        <text x="10" y="18" fill="#92400E" fontSize="10" fontWeight="800">100% NON-TOXIC</text>
        <text x="10" y="32" fill="#B45309" fontSize="9">BPA & Lead Free</text>
      </g>
    )}
  </DiagramCanvas>
);
