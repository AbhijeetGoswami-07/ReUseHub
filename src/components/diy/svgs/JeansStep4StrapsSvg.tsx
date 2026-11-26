import React from 'react';
import { DiagramSvgProps } from './JeansStep1CuttingSvg';

/**
 * Step 4: Making the Straps
 * Three-part visual:
 * 1. Cutting 3" strips from denim leg remnants.
 * 2. Cross-section showing double inward edge folding.
 * 3. Finished topstitched sturdy strap.
 */
export const JeansStep4StrapsSvg: React.FC<DiagramSvgProps> = ({
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
      aria-label="Step 4: Cut 3-inch denim strips and fold edges inward to construct straps"
    >
      {/* Background canvas */}
      <rect width="600" height="420" rx="16" fill="#FDFBF7" />
      <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />

      {/* Grid watermark */}
      <defs>
        <pattern id="craft-grid-4" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
        </pattern>
        <marker id="fold-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
        </marker>
      </defs>
      <rect width="600" height="420" rx="16" fill="url(#craft-grid-4)" />

      {/* Top action badge */}
      <g transform="translate(24, 20)">
        <rect width="230" height="26" rx="6" fill="#234B35" />
        <text x="12" y="17" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="0.05em">
          ACTION: CUT & FOLD STRAPS
        </text>
      </g>

      {/* PART 1: CUTTING STRIPS FROM LEG REMNANTS */}
      <g transform="translate(30, 60)">
        <rect width="260" height="180" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="16" y="24" fill="#64748B" fontSize="11" fontWeight="700">
          A. CUT STRIPS FROM LEG REMNANTS
        </text>

        {/* Denim pant leg silhouette */}
        <path
          d="M 20 40 L 150 40 L 175 160 L 20 160 Z"
          fill="#DBEAFE"
          stroke="#475569"
          strokeWidth="1.5"
        />

        {/* Strip 1 marked with red dashed line */}
        <rect x="35" y="50" width="105" height="42" fill="#93C5FD" fillOpacity="0.4" stroke="#EF4444" strokeWidth="2" strokeDasharray="5 3" />
        <text x="45" y="75" fill="#1E3A8A" fontSize="10" fontWeight="700">STRAP STRIP 1</text>

        {/* Strip 2 marked with red dashed line */}
        <rect x="35" y="105" width="105" height="42" fill="#93C5FD" fillOpacity="0.4" stroke="#EF4444" strokeWidth="2" strokeDasharray="5 3" />
        <text x="45" y="130" fill="#1E3A8A" fontSize="10" fontWeight="700">STRAP STRIP 2</text>

        {/* Fabric scissors icon */}
        <g transform="translate(135, 60) scale(0.65)">
          <path d="M 0 28 L 36 24 L 62 10" stroke="#334155" strokeWidth="3" fill="#E2E8F0" />
          <path d="M 0 28 L 36 32 L 62 46" stroke="#334155" strokeWidth="3" fill="#E2E8F0" />
          <circle cx="28" cy="28" r="3.5" fill="#94A3B8" stroke="#1E293B" strokeWidth="1.5" />
          <ellipse cx="68" cy="8" rx="14" ry="9" fill="none" stroke="#DC2626" strokeWidth="3.5" />
          <ellipse cx="68" cy="48" rx="14" ry="9" fill="none" stroke="#DC2626" strokeWidth="3.5" />
        </g>

        {/* Measurement callout */}
        {showMeasurements && (
          <g transform="translate(150, 48)">
            <rect x="0" y="0" width="95" height="22" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
            <text x="8" y="15" fill="#1D4ED8" fontSize="10" fontWeight="700">
              Width: ~3" (7.5cm)
            </text>
          </g>
        )}
      </g>

      {/* PART 2: FOLDING SEQUENCE (CROSS-SECTION DIAGRAM) */}
      <g transform="translate(310, 60)">
        <rect width="260" height="180" rx="12" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
        <text x="16" y="24" fill="#065F46" fontSize="11" fontWeight="800">
          B. FOLDING & PRESSING EDGES
        </text>

        {/* Step 1: Flat strip with fold lines */}
        <g transform="translate(20, 36)">
          <text x="0" y="12" fill="#64748B" fontSize="9" fontWeight="600">1. Raw 3" Flat Strip</text>
          <rect x="0" y="16" width="220" height="14" rx="2" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1.2" />
          <line x1="55" y1="16" x2="55" y2="30" stroke="#EF4444" strokeWidth="1" strokeDasharray="3 2" />
          <line x1="165" y1="16" x2="165" y2="30" stroke="#EF4444" strokeWidth="1" strokeDasharray="3 2" />
        </g>

        {/* Step 2: Fold both edges inward to center */}
        <g transform="translate(20, 80)">
          <text x="0" y="12" fill="#64748B" fontSize="9" fontWeight="600">2. Fold Both Outer Edges Inward</text>
          {/* Base */}
          <rect x="40" y="16" width="140" height="14" rx="2" fill="#93C5FD" stroke="#1E40AF" strokeWidth="1.2" />
          {/* Folded wings */}
          <rect x="40" y="22" width="60" height="8" rx="1" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="1" />
          <rect x="120" y="22" width="60" height="8" rx="1" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="1" />
          {/* Folding blue arrows */}
          <path d="M 25 10 C 35 6, 45 10, 48 18" fill="none" stroke="#2563EB" strokeWidth="2" markerEnd="url(#fold-arrow)" />
          <path d="M 195 10 C 185 6, 175 10, 172 18" fill="none" stroke="#2563EB" strokeWidth="2" markerEnd="url(#fold-arrow)" />
        </g>

        {/* Step 3: Fold in half and iron press */}
        <g transform="translate(20, 126)">
          <text x="0" y="12" fill="#047857" fontSize="9" fontWeight="700">3. Fold in Half (Iron Press Flat)</text>
          <rect x="65" y="16" width="90" height="16" rx="3" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="1.5" />
          <line x1="68" y1="24" x2="152" y2="24" stroke="#059669" strokeWidth="1" strokeDasharray="2 1" />
          <text x="165" y="28" fill="#D97706" fontSize="10" fontWeight="700">🔥 Press with Iron</text>
        </g>
      </g>

      {/* PART 3: FINISHED TOPSTITCHED STRAP (FULL-WIDTH PREVIEW) */}
      <g transform="translate(30, 260)">
        <rect width="540" height="135" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="18" y="24" fill="#1E293B" fontSize="11" fontWeight="800">
          C. FINISHED STITCHED STRAP (DUAL EDGE TOPSTITCH)
        </text>

        {/* Full-width 1" finished strap illustration */}
        <g transform="translate(25, 38)">
          {/* Main heavy denim strap body */}
          <rect x="0" y="0" width="490" height="36" rx="4" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2.5" />

          {/* Top stitch line (green dashed) */}
          <line x1="8" y1="7" x2="482" y2="7" stroke="#10B981" strokeWidth="2.5" strokeDasharray="6 3" strokeLinecap="round" />
          {/* Bottom stitch line (green dashed) */}
          <line x1="8" y1="29" x2="482" y2="29" stroke="#10B981" strokeWidth="2.5" strokeDasharray="6 3" strokeLinecap="round" />

          {/* Stitch label pointer */}
          {showLabels && (
            <g transform="translate(200, 42)">
              <rect x="0" y="0" width="180" height="24" rx="4" fill="#ECFDF5" stroke="#10B981" strokeWidth="1" />
              <text x="10" y="16" fill="#065F46" fontSize="10" fontWeight="700">
                🧵 1/8" Dual Edge Topstitch
              </text>
            </g>
          )}

          {/* Dimension indicator: Finished width ~1 inch */}
          {showMeasurements && (
            <g transform="translate(420, 42)">
              <rect x="0" y="0" width="85" height="24" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
              <text x="8" y="16" fill="#1D4ED8" fontSize="10" fontWeight="700">
                Finished: ~1" (2.5cm)
              </text>
            </g>
          )}
        </g>

        {/* Instruction note */}
        <text x="25" y="118" fill="#64748B" fontSize="10">
          Repeat this exact sequence for both straps. Each finished strap should be approximately 22-26 inches long.
        </text>
      </g>
    </svg>
  );
};
