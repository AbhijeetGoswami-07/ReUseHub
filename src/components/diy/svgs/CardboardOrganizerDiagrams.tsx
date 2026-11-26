import React from 'react';
import { DiagramSvgProps } from './JeansStep1CuttingSvg';

const CardboardCanvas: React.FC<{
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
      <pattern id="craft-grid-cardboard" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
      </pattern>
      <marker id="arrow-blue-cb" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
      </marker>
      <filter id="shadow-cb" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.08" />
      </filter>
    </defs>
    <rect width="600" height="420" rx="16" fill="#FDFBF7" />
    <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />
    <rect width="600" height="420" rx="16" fill="url(#craft-grid-cardboard)" />

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
 * STEP 1: Measuring Drawer & Box Dimensions
 * Top-down view of desk drawer, metal tape/ruler measuring depth & width, pencil lines.
 */
export const CardboardStep1MeasuringSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <CardboardCanvas title="Step 1: Drawer Measurement" badgeText="ACTION: DRAWER MEASUREMENT" className={className}>
    <g transform="translate(100, 65)" filter="url(#shadow-cb)">
      {/* Desk Drawer Frame */}
      <rect width="400" height="250" rx="12" fill="#E2E8F0" stroke="#475569" strokeWidth="3" />
      <rect x="12" y="12" width="376" height="226" rx="8" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />

      {/* Width Measurement Arrow */}
      {showMeasurements && (
        <g transform="translate(20, 30)">
          <line x1="0" y1="0" x2="360" y2="0" stroke="#2563EB" strokeWidth="2" />
          <line x1="0" y1="-6" x2="0" y2="6" stroke="#2563EB" strokeWidth="2" />
          <line x1="360" y1="-6" x2="360" y2="6" stroke="#2563EB" strokeWidth="2" />
          <rect x="125" y="-14" width="110" height="24" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
          <text x="135" y="2" fill="#1D4ED8" fontSize="10" fontWeight="700">↔ DRAWER WIDTH</text>
        </g>
      )}

      {/* Depth Measurement Arrow */}
      {showMeasurements && (
        <g transform="translate(40, 50)">
          <line x1="0" y1="0" x2="0" y2="170" stroke="#2563EB" strokeWidth="2" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#2563EB" strokeWidth="2" />
          <line x1="-6" y1="170" x2="6" y2="170" stroke="#2563EB" strokeWidth="2" />
          <rect x="10" y="70" width="110" height="24" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
          <text x="18" y="86" fill="#1D4ED8" fontSize="10" fontWeight="700">↕ DRAWER DEPTH</text>
        </g>
      )}

      {/* Carpenter Pencil */}
      <g transform="translate(260, 140) rotate(-45)">
        <polygon points="0,0 120,0 135,10 120,20 0,20" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
        <polygon points="120,0 145,10 120,20" fill="#FED7AA" />
        <polygon points="135,7 145,10 135,13" fill="#0F172A" />
      </g>
    </g>

    {showLabels && (
      <g transform="translate(60, 345)">
        <rect width="280" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="14" y="20" fill="#065F46" fontSize="10" fontWeight="700">Measure depth, width, and clearance height</text>
      </g>
    )}
  </CardboardCanvas>
);

/**
 * STEP 2: Cutting Strips with Straightedge Guide
 * Corrugated cardboard sheet, metal steel ruler, utility craft knife cutting along red dashed line.
 */
export const CardboardStep2CuttingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <CardboardCanvas title="Step 2: Cut Cardboard Panels" badgeText="ACTION: PRECISION STRIP CUTTING" className={className}>
    <g transform="translate(100, 75)" filter="url(#shadow-cb)">
      {/* Corrugated Cardboard Base Sheet */}
      <rect width="400" height="240" rx="10" fill="#D97706" fillOpacity="0.25" stroke="#B45309" strokeWidth="2.5" />

      {/* Flute texture lines */}
      <line x1="20" y1="40" x2="380" y2="40" stroke="#B45309" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="20" y1="120" x2="380" y2="120" stroke="#B45309" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="20" y1="200" x2="380" y2="200" stroke="#B45309" strokeWidth="1" strokeDasharray="3 3" />

      {/* Red Dashed Cut Line */}
      <line x1="30" y1="120" x2="370" y2="120" stroke="#EF4444" strokeWidth="3" strokeDasharray="8 6" />

      {/* Steel Ruler Straightedge */}
      <rect x="30" y="85" width="340" height="32" rx="3" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
      {/* Millimeter hash marks */}
      <line x1="60" y1="110" x2="60" y2="117" stroke="#334155" strokeWidth="1.5" />
      <line x1="100" y1="105" x2="100" y2="117" stroke="#334155" strokeWidth="2" />
      <line x1="140" y1="110" x2="140" y2="117" stroke="#334155" strokeWidth="1.5" />
      <line x1="180" y1="105" x2="180" y2="117" stroke="#334155" strokeWidth="2" />
      <line x1="220" y1="110" x2="220" y2="117" stroke="#334155" strokeWidth="1.5" />
      <line x1="260" y1="105" x2="260" y2="117" stroke="#334155" strokeWidth="2" />
      <line x1="300" y1="110" x2="300" y2="117" stroke="#334155" strokeWidth="1.5" />

      {/* Utility Craft Knife */}
      <g transform="translate(280, 105)">
        <polygon points="0,15 25,15 35,5 0,5" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
        <rect x="-80" y="3" width="80" height="18" rx="4" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
        {/* Direction of cut arrow */}
        <path d="M 45 10 L 85 10" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrow-blue-cb)" />
      </g>
    </g>

    {showLabels && (
      <g transform="translate(60, 345)">
        <rect width="260" height="32" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5" />
        <text x="12" y="20" fill="#991B1B" fontSize="10" fontWeight="700">✂ Always use a metal ruler as cutting guide</text>
      </g>
    )}
  </CardboardCanvas>
);

/**
 * STEP 3: Cutting Interlocking 1/2-Depth Slots
 * Two cardboard strips showing 1/2-height notched slots and interlocking downward arrows.
 */
export const CardboardStep3InterlockingSlotsSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <CardboardCanvas title="Step 3: Interlocking Slots" badgeText="ACTION: 1/2 DEPTH NOTCH SLOTS" className={className}>
    <g transform="translate(80, 70)" filter="url(#shadow-cb)">
      {/* Strip A: Top-notched (horizontal strip) */}
      <g transform="translate(20, 140)">
        <path d="M 0 0 L 100 0 L 100 35 L 110 35 L 110 0 L 250 0 L 250 35 L 260 35 L 260 0 L 380 0 L 380 70 L 0 70 Z" fill="#D97706" fillOpacity="0.3" stroke="#B45309" strokeWidth="2.5" />
        <text x="20" y="55" fill="#78350F" fontSize="11" fontWeight="800">STRIP A (Horizontal Divider)</text>
      </g>

      {/* Strip B: Bottom-notched (vertical cross strip sliding in) */}
      <g transform="translate(145, 10)">
        <path d="M 0 0 L 70 0 L 70 70 L 40 70 L 40 35 L 30 35 L 30 70 L 0 70 Z" fill="#D97706" fillOpacity="0.4" stroke="#B45309" strokeWidth="2.5" />
        {/* Downward slide arrow */}
        <path d="M 35 75 L 35 125" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrow-blue-cb)" />
      </g>

      {showMeasurements && (
        <g transform="translate(280, 30)">
          <rect width="135" height="38" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
          <text x="10" y="16" fill="#1D4ED8" fontSize="10" fontWeight="800">SLOT DEPTH</text>
          <text x="10" y="30" fill="#2563EB" fontSize="10">Exactly 1/2 of Strip Height</text>
        </g>
      )}
    </g>

    {showLabels && (
      <g transform="translate(60, 345)">
        <rect width="320" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="12" y="20" fill="#065F46" fontSize="10" fontWeight="700">✓ Friction-fit slots hold firm without nails or staples</text>
      </g>
    )}
  </CardboardCanvas>
);

/**
 * STEP 4: Wrap Edges & Completed Grid Organizer
 * Completed 6-compartment desk organizer with pens, sticky notes, paperclips, kraft paper edges.
 */
export const CardboardStep4GridAssemblySvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <CardboardCanvas title="Step 4: Assembled Modular Grid" badgeText="ACTION: COMPLETED DESK ORGANIZER" className={className}>
    <g transform="translate(120, 60)" filter="url(#shadow-cb)">
      {/* Outer Organizer Box */}
      <rect width="360" height="240" rx="12" fill="#FEF3C7" stroke="#B45309" strokeWidth="3" />

      {/* Internal Grid Dividers */}
      {/* Vertical divider */}
      <line x1="180" y1="0" x2="180" y2="240" stroke="#78350F" strokeWidth="5" />
      {/* Horizontal dividers */}
      <line x1="0" y1="80" x2="360" y2="80" stroke="#78350F" strokeWidth="5" />
      <line x1="0" y1="160" x2="360" y2="160" stroke="#78350F" strokeWidth="5" />

      {/* Compartment 1: Pens & Pencils */}
      <g transform="translate(30, 20)">
        <rect width="12" height="50" rx="2" fill="#2563EB" />
        <rect x="20" width="10" height="52" rx="2" fill="#DC2626" />
        <rect x="40" width="10" height="48" rx="2" fill="#059669" />
      </g>

      {/* Compartment 2: Sticky Notes */}
      <rect x="210" y="15" width="55" height="55" rx="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />

      {/* Compartment 3: Paperclips */}
      <g transform="translate(40, 105)">
        <ellipse cx="20" cy="15" rx="15" ry="6" fill="none" stroke="#64748B" strokeWidth="2" />
        <ellipse cx="40" cy="25" rx="15" ry="6" fill="none" stroke="#64748B" strokeWidth="2" />
        <ellipse cx="70" cy="18" rx="15" ry="6" fill="none" stroke="#64748B" strokeWidth="2" />
      </g>

      {/* Compartment 4: Phone / Cable dock */}
      <rect x="210" y="100" width="120" height="45" rx="6" fill="#1E293B" />
      <rect x="240" y="180" width="80" height="40" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
    </g>

    {showLabels && (
      <g transform="translate(40, 345)">
        <rect width="210" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="12" y="20" fill="#065F46" fontSize="10" fontWeight="700">✓ 6 Modular Custom Compartments</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(370, 345)">
        <rect width="180" height="32" rx="6" fill="#FEFCE8" stroke="#EAB308" strokeWidth="1.5" />
        <text x="12" y="20" fill="#854D0E" fontSize="10" fontWeight="700">Kraft Tape Bound Edges</text>
      </g>
    )}
  </CardboardCanvas>
);
