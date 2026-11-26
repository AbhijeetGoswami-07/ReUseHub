import React from 'react';

export interface DiagramSvgProps {
  showMeasurements?: boolean;
  showLabels?: boolean;
  className?: string;
}

/**
 * Step 1: Cutting Jeans
 * Shows front of jeans, horizontal cutting line 2" below back pockets,
 * scissors icon, measurements, and bag body vs strap remnants.
 */
export const JeansStep1CuttingSvg: React.FC<DiagramSvgProps> = ({
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
      aria-label="Step 1: Cutting the jeans horizontally 2 inches below pockets"
    >
      {/* Background canvas */}
      <rect width="600" height="420" rx="16" fill="#FDFBF7" />
      <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />

      {/* Grid subtle watermark */}
      <defs>
        <pattern id="craft-grid-1" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
        </pattern>
        <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
        </marker>
        <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
        </marker>
        <filter id="shadow-drop" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.08" />
        </filter>
      </defs>
      <rect width="600" height="420" rx="16" fill="url(#craft-grid-1)" />

      {/* Title banner in diagram */}
      <g transform="translate(24, 20)">
        <rect width="185" height="26" rx="6" fill="#234B35" />
        <text x="12" y="17" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="0.05em">
          ACTION: HORIZONTAL CUT
        </text>
      </g>

      {/* MAIN JEANS ILLUSTRATION */}
      <g filter="url(#shadow-drop)">
        {/* UPPER BODY: Bag Body Section (Keep) */}
        <path
          d="M 170 80
             C 170 70, 230 65, 300 65
             C 370 65, 430 70, 430 80
             L 424 200
             L 176 200
             Z"
          fill="#93C5FD"
          fillOpacity="0.45"
          stroke="#1E3A8A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* LOWER LEGS: Remnants Section */}
        <path
          d="M 176 200
             L 182 350
             L 242 350
             L 285 240
             L 300 240
             L 315 240
             L 358 350
             L 418 350
             L 424 200
             Z"
          fill="#DBEAFE"
          fillOpacity="0.3"
          stroke="#64748B"
          strokeWidth="2"
          strokeDasharray="4 3"
          strokeLinejoin="round"
        />

        {/* Waistband */}
        <path
          d="M 170 80 C 230 72, 370 72, 430 80 L 428 102 C 370 96, 230 96, 172 102 Z"
          fill="#60A5FA"
          fillOpacity="0.4"
          stroke="#1E3A8A"
          strokeWidth="2"
        />
        {/* Waistband top stitch */}
        <path d="M 172 84 C 230 78, 370 78, 428 84" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2" />
        <path d="M 174 98 C 230 92, 370 92, 426 98" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2" />

        {/* Belt loops */}
        <rect x="200" y="75" width="8" height="26" rx="2" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="1.5" />
        <rect x="260" y="72" width="8" height="28" rx="2" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="1.5" />
        <rect x="332" y="72" width="8" height="28" rx="2" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="1.5" />
        <rect x="392" y="75" width="8" height="26" rx="2" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="1.5" />

        {/* Metal Button & Center Fly */}
        <circle cx="300" cy="88" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
        <path d="M 300 95 L 300 150 C 300 162, 312 165, 312 150" fill="none" stroke="#1E3A8A" strokeWidth="2" />
        {/* Fly topstitch */}
        <path d="M 296 102 L 296 146 C 296 168, 316 168, 316 146" fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2" />

        {/* Front pockets */}
        <path d="M 175 106 C 210 110, 230 140, 230 158" fill="none" stroke="#1E3A8A" strokeWidth="2" />
        <path d="M 425 106 C 390 110, 370 140, 370 158" fill="none" stroke="#1E3A8A" strokeWidth="2" />

        {/* Back pocket outline visible in ghosted projection */}
        <path d="M 200 135 L 245 135 L 240 175 L 222 188 L 205 175 Z" fill="#93C5FD" fillOpacity="0.5" stroke="#1E40AF" strokeWidth="1.5" strokeDasharray="3 2" />
        <path d="M 355 135 L 400 135 L 395 175 L 378 188 L 360 175 Z" fill="#93C5FD" fillOpacity="0.5" stroke="#1E40AF" strokeWidth="1.5" strokeDasharray="3 2" />
      </g>

      {/* CUT LINE (RED DASHED) */}
      <g>
        <line x1="120" y1="200" x2="480" y2="200" stroke="#EF4444" strokeWidth="3" strokeDasharray="8 6" />
        <circle cx="120" cy="200" r="4" fill="#EF4444" />
        <circle cx="480" cy="200" r="4" fill="#EF4444" />
      </g>

      {/* FABRIC SHEARS / SCISSORS CUTTING ICON */}
      <g transform="translate(470, 172)">
        {/* Top Blade */}
        <path d="M 0 28 L 36 24 L 62 10" stroke="#334155" strokeWidth="3" fill="#E2E8F0" />
        {/* Bottom Blade */}
        <path d="M 0 28 L 36 32 L 62 46" stroke="#334155" strokeWidth="3" fill="#E2E8F0" />
        {/* Pivot screw */}
        <circle cx="28" cy="28" r="3.5" fill="#94A3B8" stroke="#1E293B" strokeWidth="1.5" />
        {/* Handles */}
        <ellipse cx="68" cy="8" rx="14" ry="9" transform="rotate(-20 68 8)" fill="none" stroke="#DC2626" strokeWidth="3.5" />
        <ellipse cx="68" cy="48" rx="14" ry="9" transform="rotate(20 68 48)" fill="none" stroke="#DC2626" strokeWidth="3.5" />
      </g>

      {/* MEASUREMENT CALLOUT: ~2" (5 cm) below back pockets */}
      {showMeasurements && (
        <g>
          {/* Vertical dimension guide */}
          <line x1="260" y1="188" x2="260" y2="200" stroke="#2563EB" strokeWidth="1.5" />
          <line x1="254" y1="188" x2="266" y2="188" stroke="#2563EB" strokeWidth="1.5" />
          <line x1="254" y1="200" x2="266" y2="200" stroke="#2563EB" strokeWidth="1.5" />

          {/* Dimension pill */}
          <rect x="272" y="174" width="134" height="24" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
          <text x="280" y="190" fill="#1D4ED8" fontSize="11" fontWeight="700">
            ↕ ~2 inches (5 cm)
          </text>
        </g>
      )}

      {/* LABELS */}
      {showLabels && (
        <>
          {/* Top Bag Body Tag */}
          <g transform="translate(48, 120)">
            <rect width="115" height="42" rx="8" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
            <text x="12" y="20" fill="#065F46" fontSize="11" fontWeight="800">
              BAG BODY
            </text>
            <text x="12" y="34" fill="#047857" fontSize="10" fontWeight="500">
              Main Tote Shell
            </text>
          </g>

          {/* Cut Line Label */}
          <g transform="translate(44, 212)">
            <rect width="138" height="24" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5" />
            <text x="10" y="16" fill="#991B1B" fontSize="10" fontWeight="700">
              ✂ CUT HORIZONTALLY
            </text>
          </g>

          {/* Bottom Remnants Tag */}
          <g transform="translate(180, 366)">
            <rect width="240" height="36" rx="8" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
            <text x="12" y="16" fill="#1E293B" fontSize="11" fontWeight="700">
              LEFTOVER DENIM LEGS
            </text>
            <text x="12" y="28" fill="#64748B" fontSize="10">
              Save fabric for straps in Step 4
            </text>
          </g>
        </>
      )}
    </svg>
  );
};
