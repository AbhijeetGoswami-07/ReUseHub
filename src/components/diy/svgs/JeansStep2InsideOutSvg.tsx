import React from 'react';
import { DiagramSvgProps } from './JeansStep1CuttingSvg';

/**
 * Step 2: Turn Inside Out and Align Hems
 * Dual panel showing original cropped jeans turning inside-out,
 * bottom hem aligned and secured with sewing pins.
 */
export const JeansStep2InsideOutSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements: _showMeasurements = true,
  showLabels = true,
  className = 'w-full h-auto',
}) => {
  return (
    <svg
      viewBox="0 0 600 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Step 2: Turn cropped jeans inside out and pin the bottom hem"
    >
      {/* Background canvas */}
      <rect width="600" height="420" rx="16" fill="#FDFBF7" />
      <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />

      {/* Grid watermark */}
      <defs>
        <pattern id="craft-grid-2" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
        </pattern>
        <marker id="turn-arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
        </marker>
        <marker id="align-arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
        </marker>
      </defs>
      <rect width="600" height="420" rx="16" fill="url(#craft-grid-2)" />

      {/* Top action badge */}
      <g transform="translate(24, 20)">
        <rect width="200" height="26" rx="6" fill="#234B35" />
        <text x="12" y="17" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="0.05em">
          ACTION: INVERT & PIN HEM
        </text>
      </g>

      {/* PANEL 1: CROPPED JEANS BEFORE INVERTING */}
      <g transform="translate(40, 70)">
        <rect width="220" height="280" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="16" y="28" fill="#64748B" fontSize="11" fontWeight="700">
          A. RIGHT SIDE OUT
        </text>

        {/* Cropped body right side out */}
        <g transform="translate(25, 45)">
          <path
            d="M 15 20 C 50 15, 120 15, 155 20 L 150 150 L 20 150 Z"
            fill="#93C5FD"
            fillOpacity="0.5"
            stroke="#1E3A8A"
            strokeWidth="2"
          />
          {/* Waistband */}
          <path d="M 15 20 C 50 16, 120 16, 155 20 L 154 36 C 120 32, 50 32, 16 36 Z" fill="#60A5FA" fillOpacity="0.4" stroke="#1E3A8A" strokeWidth="1.5" />
          <circle cx="85" cy="27" r="3.5" fill="#F59E0B" />
          {/* Front pockets */}
          <path d="M 18 38 C 40 40, 52 65, 52 75" fill="none" stroke="#1E3A8A" strokeWidth="1.5" />
          <path d="M 152 38 C 130 40, 118 65, 118 75" fill="none" stroke="#1E3A8A" strokeWidth="1.5" />
          {/* Raw cut edge */}
          <line x1="20" y1="150" x2="150" y2="150" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
        </g>
      </g>

      {/* TURNING ARROW IN BETWEEN PANELS */}
      <g transform="translate(270, 180)">
        {/* Large curved rotation motion arrow */}
        <path
          d="M 0 30 C 25 0, 35 0, 60 30"
          fill="none"
          stroke="#2563EB"
          strokeWidth="3.5"
          markerEnd="url(#turn-arrow-blue)"
        />
        <path
          d="M 60 40 C 35 70, 25 70, 0 40"
          fill="none"
          stroke="#2563EB"
          strokeWidth="3.5"
          markerEnd="url(#turn-arrow-blue)"
        />
        <rect x="5" y="24" width="50" height="22" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
        <text x="13" y="39" fill="#1D4ED8" fontSize="10" fontWeight="800">
          FLIP
        </text>
      </g>

      {/* PANEL 2: INSIDE OUT WITH ALIGNED AND PINNED HEM */}
      <g transform="translate(340, 70)">
        <rect width="220" height="280" rx="12" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
        <text x="16" y="28" fill="#065F46" fontSize="11" fontWeight="800">
          B. INSIDE OUT (READY TO SEW)
        </text>

        {/* Inverted body: lighter denim, exposed white pocket pouches */}
        <g transform="translate(25, 45)">
          {/* Inverted body background */}
          <path
            d="M 15 20 C 50 15, 120 15, 155 20 L 150 150 L 20 150 Z"
            fill="#E0E7FF"
            fillOpacity="0.7"
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Exposed white canvas pocket pouches */}
          <rect x="24" y="42" width="34" height="44" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
          <text x="27" y="66" fill="#94A3B8" fontSize="7" fontWeight="600">POCKET</text>
          <rect x="112" y="42" width="34" height="44" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
          <text x="115" y="66" fill="#94A3B8" fontSize="7" fontWeight="600">POCKET</text>

          {/* Exposed raw side seams */}
          <path d="M 18 36 L 22 150" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />
          <path d="M 152 36 L 148 150" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />

          {/* Aligned bottom edge highlight */}
          <rect x="18" y="146" width="134" height="8" rx="2" fill="#D1FAE5" stroke="#10B981" strokeWidth="1.5" />

          {/* SEWING PINS ALONG BOTTOM EDGE */}
          {/* Pin 1 */}
          <line x1="32" y1="138" x2="32" y2="158" stroke="#64748B" strokeWidth="2" />
          <circle cx="32" cy="136" r="3.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
          {/* Pin 2 */}
          <line x1="56" y1="138" x2="56" y2="158" stroke="#64748B" strokeWidth="2" />
          <circle cx="56" cy="136" r="3.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          {/* Pin 3 */}
          <line x1="85" y1="138" x2="85" y2="158" stroke="#64748B" strokeWidth="2" />
          <circle cx="85" cy="136" r="3.5" fill="#10B981" stroke="#047857" strokeWidth="1" />
          {/* Pin 4 */}
          <line x1="114" y1="138" x2="114" y2="158" stroke="#64748B" strokeWidth="2" />
          <circle cx="114" cy="136" r="3.5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
          {/* Pin 5 */}
          <line x1="138" y1="138" x2="138" y2="158" stroke="#64748B" strokeWidth="2" />
          <circle cx="138" cy="136" r="3.5" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="1" />
        </g>
      </g>

      {/* FOOTER CALLOUT / LABELS */}
      {showLabels && (
        <g transform="translate(140, 368)">
          <rect width="320" height="34" rx="8" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
          <circle cx="20" cy="17" r="6" fill="#10B981" />
          <text x="34" y="16" fill="#065F46" fontSize="11" fontWeight="700">
            PIN FRONT & BACK HEMS TOGETHER
          </text>
          <text x="34" y="28" fill="#047857" fontSize="10">
            Ensure edges line up flat before sewing in Step 3
          </text>
        </g>
      )}
    </svg>
  );
};
