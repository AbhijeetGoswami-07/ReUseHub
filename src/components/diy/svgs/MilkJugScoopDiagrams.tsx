import React from 'react';
import { DiagramSvgProps } from './JeansStep1CuttingSvg';

const ScoopCanvas: React.FC<{
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
      <pattern id="craft-grid-scoop" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
      </pattern>
      <marker id="arrow-blue-sc" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
      </marker>
      <filter id="shadow-sc" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.08" />
      </filter>
    </defs>
    <rect width="600" height="420" rx="16" fill="#FDFBF7" />
    <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />
    <rect width="600" height="420" rx="16" fill="url(#craft-grid-scoop)" />

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
 * STEP 1: Inspect Translucent HDPE Milk Jug
 * 1-gallon milk jug side view, hollow ergonomic handle, non-toxic food-safe #2 HDPE symbol.
 */
export const MilkJugStep1InspectionSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <ScoopCanvas title="Step 1: Inspect Milk Jug" badgeText="ACTION: HDPE #2 JUG INSPECTION" className={className}>
    <g transform="translate(170, 55)" filter="url(#shadow-sc)">
      {/* Cap & Spout */}
      <rect x="75" y="0" width="40" height="18" rx="4" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
      <rect x="80" y="18" width="30" height="15" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />

      {/* Main Jug Body with Hollow Handle */}
      <path d="M 70 33 L 130 33 L 175 75 L 175 270 C 175 285 160 290 120 290 L 40 290 C 15 290 5 280 5 250 L 5 80 L 40 33 Z" fill="#F1F5F9" stroke="#334155" strokeWidth="3" />

      {/* Hollow Handle Opening cutout */}
      <path d="M 40 90 L 40 180 C 40 190 50 195 60 195 L 60 85 C 50 85 40 85 40 90 Z" fill="#FDFBF7" stroke="#334155" strokeWidth="2.5" />

      {/* HDPE #2 Recycling Symbol on base */}
      <g transform="translate(110, 200)">
        <polygon points="15,0 30,25 0,25" fill="none" stroke="#059669" strokeWidth="2" />
        <text x="11" y="20" fill="#065F46" fontSize="12" fontWeight="900">2</text>
        <text x="-5" y="40" fill="#065F46" fontSize="9" fontWeight="700">HDPE (Food Safe)</text>
      </g>
    </g>

    {showLabels && (
      <g transform="translate(40, 140)">
        <rect width="135" height="42" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
        <text x="10" y="18" fill="#1D4ED8" fontSize="10" fontWeight="800">BUILT-IN HANDLE</text>
        <text x="10" y="32" fill="#2563EB" fontSize="9">Zero-Fatigue Ergonomic</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(60, 345)">
        <rect width="360" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="12" y="20" fill="#065F46" fontSize="10" fontWeight="700">✓ Thoroughly sanitize jug with hot soapy water before cutting</text>
      </g>
    )}
  </ScoopCanvas>
);

/**
 * STEP 2: Apply 45-Degree Diagonal Masking Tape Guide
 * Blue painter's tape guideline running diagonally from under the handle to the base.
 */
export const MilkJugStep2DiagonalTapeGuideSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <ScoopCanvas title="Step 2: 45° Diagonal Tape Line" badgeText="ACTION: 45° SCOOP GUIDELINE" className={className}>
    <g transform="translate(170, 55)" filter="url(#shadow-sc)">
      {/* Jug body */}
      <path d="M 70 33 L 130 33 L 175 75 L 175 270 C 175 285 160 290 120 290 L 40 290 C 15 290 5 280 5 250 L 5 80 L 40 33 Z" fill="#F1F5F9" stroke="#334155" strokeWidth="3" />
      {/* Handle cutout */}
      <path d="M 40 90 L 40 180 C 40 190 50 195 60 195 L 60 85 C 50 85 40 85 40 90 Z" fill="#FDFBF7" stroke="#334155" strokeWidth="2.5" />

      {/* Blue Painter's Tape 45-degree angled strip */}
      <polygon points="55,190 70,180 185,270 170,280" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
      {/* Red dashed cutting line down center of tape */}
      <line x1="62" y1="185" x2="178" y2="275" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 4" />

      {/* Angle Callout arc */}
      <path d="M 140 270 A 30 30 0 0 0 160 250" fill="none" stroke="#2563EB" strokeWidth="2" />
      <text x="125" y="250" fill="#1D4ED8" fontSize="10" fontWeight="800">45°</text>
    </g>

    {showMeasurements && (
      <g transform="translate(420, 180)">
        <rect width="145" height="42" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
        <text x="10" y="18" fill="#1D4ED8" fontSize="10" fontWeight="800">SCOOP CONTOUR</text>
        <text x="10" y="32" fill="#2563EB" fontSize="10">45° Angle from Handle</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(60, 345)">
        <rect width="360" height="32" rx="6" fill="#FEFCE8" stroke="#EAB308" strokeWidth="1.5" />
        <text x="12" y="20" fill="#854D0E" fontSize="10" fontWeight="700">Tape acts as a rigid cutting edge for scissors or utility knife</text>
      </g>
    )}
  </ScoopCanvas>
);

/**
 * STEP 3: Contour Cut & Completed Heavy-Duty Garden Scoop
 * Shears completing cut, discarded base, finished scoop holding rich potting soil / seed feed.
 */
export const MilkJugStep3ContourCuttingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className,
}) => (
  <ScoopCanvas title="Step 3: Completed Heavy-Duty Scoop" badgeText="ACTION: COMPLETED GARDEN SCOOP" className={className}>
    <g transform="translate(150, 65)" filter="url(#shadow-sc)">
      {/* Completed Ergonomic Scoop */}
      <g transform="translate(0, 0)">
        {/* Scoop Body */}
        <path d="M 50 20 L 100 20 L 140 55 L 140 180 L 40 130 C 15 110 5 90 5 60 L 25 20 Z" fill="#E2E8F0" stroke="#334155" strokeWidth="3" />
        {/* Handle */}
        <path d="M 25 60 L 25 100 C 25 110 35 115 45 115 L 45 55 C 35 55 25 55 25 60 Z" fill="#FDFBF7" stroke="#334155" strokeWidth="2.5" />

        {/* Soil inside scoop mouth */}
        <path d="M 65 140 L 138 178 L 138 120 L 65 95 Z" fill="#78350F" />
        <circle cx="100" cy="140" r="3" fill="#D97706" />
        <circle cx="120" cy="150" r="4" fill="#D97706" />

        {/* Smooth rim green indicator */}
        <line x1="40" y1="130" x2="140" y2="180" stroke="#10B981" strokeWidth="3" />
      </g>

      {/* Discarded lower corner base (Recyclable) */}
      <g transform="translate(180, 150)">
        <path d="M 0 50 L 50 90 L 0 90 Z" fill="#CBD5E1" fillOpacity="0.4" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="15" y="115" fill="#64748B" fontSize="9">Discarded Base</text>
      </g>
    </g>

    {showLabels && (
      <g transform="translate(40, 345)">
        <rect width="240" height="32" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="12" y="20" fill="#065F46" fontSize="10" fontWeight="700">✓ Indestructible Soil & Pet Food Scoop</text>
      </g>
    )}

    {showLabels && (
      <g transform="translate(370, 345)">
        <rect width="190" height="32" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
        <text x="12" y="20" fill="#1D4ED8" fontSize="10" fontWeight="700">Recycle leftover scrap in #2 bin</text>
      </g>
    )}
  </ScoopCanvas>
);
