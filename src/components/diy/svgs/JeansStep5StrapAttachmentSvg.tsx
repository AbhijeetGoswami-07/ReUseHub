import React from 'react';
import { DiagramSvgProps } from './JeansStep1CuttingSvg';

/**
 * Step 5: Strap Attachment & Box-Stitch Reinforcement
 * Shows bag opening with both straps placed inside waistband,
 * spacing measurements, and high-tensile box stitch with 'X' cross-section.
 */
export const JeansStep5StrapAttachmentSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels = true,
  className = 'w-full h-auto',
}) => {
  return (
    <svg
      viewBox="0 0 600 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Step 5: Attach handles to waistband with reinforced box-X stitch"
    >
      {/* Background canvas */}
      <rect width="600" height="420" rx="16" fill="#FDFBF7" />
      <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />

      {/* Grid watermark */}
      <defs>
        <pattern id="craft-grid-5" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
        </pattern>
        <marker id="insert-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
        </marker>
        <filter id="box-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.1" />
        </filter>
      </defs>
      <rect width="600" height="420" rx="16" fill="url(#craft-grid-5)" />

      {/* Top action badge */}
      <g transform="translate(24, 20)">
        <rect width="240" height="26" rx="6" fill="#234B35" />
        <text x="12" y="17" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="0.05em">
          ACTION: BOX-STITCH ATTACHMENT
        </text>
      </g>

      {/* LEFT SIDE: BAG OPENING OVERVIEW WITH STRAPS */}
      <g transform="translate(30, 65)">
        <rect width="280" height="315" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="16" y="24" fill="#64748B" fontSize="11" fontWeight="700">
          A. WAISTBAND ATTACHMENT POSITION
        </text>

        {/* Upper Bag Body with waistband */}
        <g transform="translate(25, 60)" filter="url(#box-shadow)">
          {/* Main bag body upper shell */}
          <path
            d="M 10 40 C 60 30, 170 30, 220 40 L 210 190 L 20 190 Z"
            fill="#93C5FD"
            fillOpacity="0.6"
            stroke="#1E3A8A"
            strokeWidth="2"
          />

          {/* Waistband rim */}
          <path
            d="M 10 40 C 60 30, 170 30, 220 40 L 218 64 C 170 54, 60 54, 12 64 Z"
            fill="#60A5FA"
            stroke="#1E3A8A"
            strokeWidth="2"
          />

          {/* STRAP 1 (Left handle loop arching up) */}
          <path
            d="M 50 70 L 50 -20 C 50 -45, 95 -45, 95 -20 L 95 70"
            fill="none"
            stroke="#1E40AF"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 50 70 L 50 -20 C 50 -45, 95 -45, 95 -20 L 95 70"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* STRAP 2 (Right handle loop arching up) */}
          <path
            d="M 135 70 L 135 -20 C 135 -45, 180 -45, 180 -20 L 180 70"
            fill="none"
            stroke="#1E40AF"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 135 70 L 135 -20 C 135 -45, 180 -45, 180 -20 L 180 70"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Insertion Indicator Arrows (Insert 1.5" inside waistband) */}
          <path d="M 50 20 L 50 48" stroke="#2563EB" strokeWidth="2.5" markerEnd="url(#insert-arrow)" />
          <path d="M 95 20 L 95 48" stroke="#2563EB" strokeWidth="2.5" markerEnd="url(#insert-arrow)" />

          {/* Attachment Highlight Points (Glowing rings) */}
          <circle cx="50" cy="58" r="8" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="95" cy="58" r="8" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="135" cy="58" r="8" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="180" cy="58" r="8" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 2" />

          {/* Belt loop & button for realism */}
          <circle cx="115" cy="50" r="4" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
        </g>

        {/* Spacing measurement */}
        {showMeasurements && (
          <g transform="translate(45, 175)">
            <line x1="28" y1="0" x2="162" y2="0" stroke="#2563EB" strokeWidth="1.5" />
            <line x1="28" y1="-4" x2="28" y2="4" stroke="#2563EB" strokeWidth="1.5" />
            <line x1="162" y1="-4" x2="162" y2="4" stroke="#2563EB" strokeWidth="1.5" />
            <rect x="52" y="-12" width="86" height="20" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
            <text x="58" y="2" fill="#1D4ED8" fontSize="9" fontWeight="700">
              Spacing: ~6" (15cm)
            </text>
          </g>
        )}
      </g>

      {/* RIGHT SIDE: CLOSE-UP ZOOM OF THE BOX-STITCH WITH "X" */}
      <g transform="translate(330, 65)">
        <rect width="240" height="315" rx="12" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
        <text x="16" y="24" fill="#065F46" fontSize="11" fontWeight="800">
          B. REINFORCED "BOX-X" PATTERN
        </text>

        {/* Technical zoom circular window */}
        <g transform="translate(25, 45)">
          {/* Zoom circle background */}
          <circle cx="95" cy="95" r="85" fill="#F0FDF4" stroke="#10B981" strokeWidth="2" />

          {/* Waistband fabric background inside circle */}
          <path d="M 20 50 L 170 50 L 170 140 L 20 140 Z" fill="#BFDBFE" opacity="0.6" />
          {/* Strap end overlapping waistband */}
          <rect x="65" y="30" width="60" height="130" rx="4" fill="#60A5FA" stroke="#1E40AF" strokeWidth="2" />

          {/* THE CRITICAL BOX-STITCH WITH "X" (Green Emerald Heavy Stitch) */}
          {/* Outer Square box */}
          <rect
            x="75"
            y="65"
            width="40"
            height="40"
            fill="none"
            stroke="#059669"
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeDasharray="6 2"
          />

          {/* Diagonal Cross 'X' stitches inside */}
          <line x1="75" y1="65" x2="115" y2="105" stroke="#059669" strokeWidth="3" strokeDasharray="6 2" />
          <line x1="115" y1="65" x2="75" y2="105" stroke="#059669" strokeWidth="3" strokeDasharray="6 2" />

          {/* Stitch corner rivets/dots */}
          <circle cx="75" cy="65" r="2.5" fill="#047857" />
          <circle cx="115" cy="65" r="2.5" fill="#047857" />
          <circle cx="115" cy="105" r="2.5" fill="#047857" />
          <circle cx="75" cy="105" r="2.5" fill="#047857" />
        </g>

        {/* Feature bullets */}
        {showLabels && (
          <g transform="translate(16, 240)">
            <rect width="208" height="58" rx="8" fill="#ECFDF5" stroke="#10B981" strokeWidth="1" />
            <text x="12" y="18" fill="#065F46" fontSize="10" fontWeight="800">
              WHY THE BOX-X STITCH?
            </text>
            <text x="12" y="32" fill="#047857" fontSize="9">
              • Distributes weight across all corners
            </text>
            <text x="12" y="46" fill="#047857" fontSize="9">
              • Safely supports 25+ lbs of groceries
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
