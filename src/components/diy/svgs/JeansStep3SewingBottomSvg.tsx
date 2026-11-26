import React from 'react';
import { DiagramSvgProps } from './JeansStep1CuttingSvg';

/**
 * Step 3: Sewing the Bottom Hem
 * Technical close-up view of the aligned raw denim layers,
 * green straight stitch line, green zigzag reinforcement stitch,
 * sewing machine needle, and directional seam allowance.
 */
export const JeansStep3SewingBottomSvg: React.FC<DiagramSvgProps> = ({
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
      aria-label="Step 3: Sew bottom hem with straight and zigzag stitches"
    >
      {/* Background canvas */}
      <rect width="600" height="420" rx="16" fill="#FDFBF7" />
      <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />

      {/* Grid watermark */}
      <defs>
        <pattern id="craft-grid-3" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
        </pattern>
        <marker id="sew-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
        </marker>
      </defs>
      <rect width="600" height="420" rx="16" fill="url(#craft-grid-3)" />

      {/* Top action badge */}
      <g transform="translate(24, 20)">
        <rect width="210" height="26" rx="6" fill="#234B35" />
        <text x="12" y="17" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="0.05em">
          ACTION: REINFORCED SEAM
        </text>
      </g>

      {/* CLOSE-UP TECHNICAL FABRIC BED */}
      <g transform="translate(40, 60)">
        {/* Upper Bag Body Fabric (Inside Out) */}
        <path
          d="M 10 0 L 510 0 L 510 190 L 10 190 Z"
          fill="#E0E7FF"
          fillOpacity="0.85"
          stroke="#64748B"
          strokeWidth="2"
        />

        {/* Denim twill texture lines (subtle) */}
        <g opacity="0.15" stroke="#4338CA" strokeWidth="1">
          <line x1="20" y1="20" x2="60" y2="0" />
          <line x1="80" y1="20" x2="120" y2="0" />
          <line x1="140" y1="20" x2="180" y2="0" />
          <line x1="200" y1="20" x2="240" y2="0" />
          <line x1="260" y1="20" x2="300" y2="0" />
          <line x1="320" y1="20" x2="360" y2="0" />
          <line x1="380" y1="20" x2="420" y2="0" />
          <line x1="440" y1="20" x2="480" y2="0" />
        </g>

        {/* Raw Bottom Edge (Frayed Fibers effect) */}
        <line x1="10" y1="190" x2="510" y2="190" stroke="#94A3B8" strokeWidth="2.5" />
        {/* Subtle fiber frays along bottom edge */}
        <g stroke="#94A3B8" strokeWidth="1.2">
          <line x1="30" y1="190" x2="30" y2="196" />
          <line x1="70" y1="190" x2="70" y2="198" />
          <line x1="110" y1="190" x2="110" y2="195" />
          <line x1="150" y1="190" x2="150" y2="199" />
          <line x1="190" y1="190" x2="190" y2="197" />
          <line x1="230" y1="190" x2="230" y2="196" />
          <line x1="270" y1="190" x2="270" y2="198" />
          <line x1="310" y1="190" x2="310" y2="195" />
          <line x1="350" y1="190" x2="350" y2="199" />
          <line x1="390" y1="190" x2="390" y2="197" />
          <line x1="430" y1="190" x2="430" y2="196" />
          <line x1="470" y1="190" x2="470" y2="198" />
        </g>

        {/* STITCH LINE 1: STRAIGHT STITCH (1/2" from edge) */}
        <g>
          {/* Green Straight Stitch Line */}
          <line
            x1="30"
            y1="140"
            x2="490"
            y2="140"
            stroke="#059669"
            strokeWidth="3.5"
            strokeDasharray="9 4"
            strokeLinecap="round"
          />
        </g>

        {/* STITCH LINE 2: ZIGZAG STITCH (Right on the allowance edge) */}
        <g>
          {/* Continuous Zigzag wave path */}
          <path
            d="M 30 168
               L 40 178 L 50 168 L 60 178 L 70 168 L 80 178 L 90 168 L 100 178
               L 110 168 L 120 178 L 130 168 L 140 178 L 150 168 L 160 178 L 170 168
               L 180 178 L 190 168 L 200 178 L 210 168 L 220 178 L 230 168 L 240 178
               L 250 168 L 260 178 L 270 168 L 280 178 L 290 168 L 300 178 L 310 168
               L 320 178 L 330 168 L 340 178 L 350 168 L 360 178 L 370 168 L 380 178
               L 390 168 L 400 178 L 410 168 L 420 178 L 430 168 L 440 178 L 450 168
               L 460 178 L 470 168 L 480 178 L 490 168"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>

        {/* SEWING DIRECTION INDICATOR */}
        <g transform="translate(180, 75)">
          <line x1="0" y1="0" x2="160" y2="0" stroke="#2563EB" strokeWidth="3" markerEnd="url(#sew-arrow)" />
          <rect x="25" y="-18" width="110" height="20" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
          <text x="32" y="-4" fill="#1D4ED8" fontSize="10" fontWeight="700">
            SEWING DIRECTION
          </text>
        </g>

        {/* SEWING MACHINE NEEDLE & PRESSER FOOT AT WORK */}
        <g transform="translate(380, 90)">
          {/* Needle Bar */}
          <rect x="18" y="0" width="4" height="42" fill="#64748B" />
          {/* Needle Eye & Thread */}
          <path d="M 20 42 L 20 54" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="20" cy="50" r="1.5" fill="#EF4444" />
          <path d="M 15 48 C 20 52, 22 55, 20 62" stroke="#059669" strokeWidth="1.5" fill="none" />
          {/* Presser Foot */}
          <path d="M 6 42 L 34 42 L 38 48 L 2 48 Z" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
        </g>

        {/* MEASUREMENT DIMENSION: 1/2" (1.3 cm) Seam Allowance */}
        {showMeasurements && (
          <g transform="translate(485, 140)">
            <line x1="0" y1="0" x2="0" y2="50" stroke="#2563EB" strokeWidth="1.5" />
            <line x1="-5" y1="0" x2="5" y2="0" stroke="#2563EB" strokeWidth="1.5" />
            <line x1="-5" y1="50" x2="5" y2="50" stroke="#2563EB" strokeWidth="1.5" />
            <rect x="8" y="14" width="85" height="22" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
            <text x="14" y="29" fill="#1D4ED8" fontSize="10" fontWeight="700">
              1/2" (1.3 cm)
            </text>
          </g>
        )}
      </g>

      {/* LABELS & CALLOUTS */}
      {showLabels && (
        <g transform="translate(40, 275)">
          {/* Stitch 1 Callout */}
          <g transform="translate(10, 0)">
            <rect width="240" height="52" rx="8" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" />
            <line x1="15" y1="18" x2="55" y2="18" stroke="#059669" strokeWidth="3" strokeDasharray="5 3" />
            <text x="65" y="21" fill="#065F46" fontSize="11" fontWeight="800">
              1. STRAIGHT STITCH
            </text>
            <text x="15" y="38" fill="#047857" fontSize="10">
              Main weight-bearing seam, 1/2" from edge
            </text>
          </g>

          {/* Stitch 2 Callout */}
          <g transform="translate(270, 0)">
            <rect width="240" height="52" rx="8" fill="#F0FDF4" stroke="#10B981" strokeWidth="1.5" />
            <path d="M 15 21 L 22 14 L 30 21 L 38 14 L 46 21 L 54 14" fill="none" stroke="#10B981" strokeWidth="2.5" />
            <text x="65" y="21" fill="#065F46" fontSize="11" fontWeight="800">
              2. ZIGZAG REINFORCEMENT
            </text>
            <text x="15" y="38" fill="#047857" fontSize="10">
              Locks raw fabric fibers to prevent fraying
            </text>
          </g>

          {/* Summary Banner */}
          <g transform="translate(10, 64)">
            <rect width="500" height="26" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
            <text x="14" y="17" fill="#475569" fontSize="10">
              💡 <strong>Technique Tip:</strong> Backstitch 3-4 stitches at each end of the seam to lock the thread permanently.
            </text>
          </g>
        </g>
      )}
    </svg>
  );
};
