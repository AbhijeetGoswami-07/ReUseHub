import React from 'react';
import { DiagramSvgProps } from './JeansStep1CuttingSvg';

export const BottlePlanterCuttingSvg: React.FC<DiagramSvgProps> = ({
  showMeasurements = true,
  showLabels: _showLabels = true,
  className = 'w-full h-auto',
}) => {
  return (
    <svg
      viewBox="0 0 600 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Plastic Bottle Planter cutting and wick assembly diagram"
    >
      <rect width="600" height="420" rx="16" fill="#FDFBF7" />
      <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />

      {/* Title */}
      <g transform="translate(24, 20)">
        <rect width="240" height="26" rx="6" fill="#234B35" />
        <text x="12" y="17" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="0.05em">
          ACTION: SUB-IRRIGATED PLANTER
        </text>
      </g>

      {/* PANEL 1: CUTTING 2L BOTTLE */}
      <g transform="translate(40, 65)">
        <rect width="240" height="300" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="16" y="24" fill="#64748B" fontSize="11" fontWeight="700">
          A. HORIZONTAL CUT (4" FROM BASE)
        </text>

        {/* 2-Liter Bottle */}
        <g transform="translate(50, 45)">
          {/* Bottle body */}
          <rect x="30" y="70" width="80" height="150" rx="10" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
          {/* Neck & Cap */}
          <path d="M 40 70 C 40 40, 60 20, 60 10 L 80 10 C 80 20, 100 40, 100 70 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
          <rect x="62" y="0" width="16" height="12" rx="2" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />

          {/* Red dashed cut line */}
          <line x1="10" y1="130" x2="130" y2="130" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="6 3" />
          {/* Scissors */}
          <g transform="translate(115, 115) scale(0.55)">
            <path d="M 0 28 L 36 24 L 62 10" stroke="#334155" strokeWidth="3" fill="#E2E8F0" />
            <path d="M 0 28 L 36 32 L 62 46" stroke="#334155" strokeWidth="3" fill="#E2E8F0" />
            <circle cx="28" cy="28" r="3.5" fill="#94A3B8" stroke="#1E293B" strokeWidth="1.5" />
            <ellipse cx="68" cy="8" rx="14" ry="9" fill="none" stroke="#DC2626" strokeWidth="3.5" />
            <ellipse cx="68" cy="48" rx="14" ry="9" fill="none" stroke="#DC2626" strokeWidth="3.5" />
          </g>

          {showMeasurements && (
            <g transform="translate(10, 150)">
              <rect x="0" y="0" width="120" height="22" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
              <text x="8" y="15" fill="#1D4ED8" fontSize="10" fontWeight="700">
                Cut ~4" (10cm) from base
              </text>
            </g>
          )}
        </g>
      </g>

      {/* PANEL 2: ASSEMBLED SUB-IRRIGATED SYSTEM */}
      <g transform="translate(310, 65)">
        <rect width="250" height="300" rx="12" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
        <text x="16" y="24" fill="#065F46" fontSize="11" fontWeight="800">
          B. INVERTED FUNNEL & WICK
        </text>

        <g transform="translate(45, 45)">
          {/* Base Reservoir */}
          <rect x="25" y="110" width="110" height="110" rx="8" fill="#E0F2FE" fillOpacity="0.4" stroke="#0284C7" strokeWidth="2" />
          {/* Water level in base */}
          <rect x="27" y="170" width="106" height="48" rx="6" fill="#38BDF8" fillOpacity="0.5" />
          <text x="50" y="198" fill="#0369A1" fontSize="10" fontWeight="700">WATER RESERVOIR</text>

          {/* Inverted Top Funnel */}
          <path d="M 28 80 L 132 80 L 95 150 L 65 150 Z" fill="#F0FDF4" stroke="#059669" strokeWidth="2" />
          {/* Soil in top funnel */}
          <path d="M 32 85 L 128 85 L 95 145 L 65 145 Z" fill="#78350F" fillOpacity="0.35" stroke="#78350F" strokeWidth="1" />
          {/* Small herb plant sprout */}
          <path d="M 80 85 C 80 65, 90 55, 90 55 C 90 55, 100 65, 80 85" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
          <path d="M 80 75 C 65 70, 60 55, 60 55 C 60 55, 75 65, 80 75" fill="#34D399" stroke="#047857" strokeWidth="1.5" />

          {/* Capillary cotton wick */}
          <path d="M 80 100 L 80 195" stroke="#F59E0B" strokeWidth="3" strokeDasharray="3 2" />
          <circle cx="80" cy="195" r="3" fill="#D97706" />

          {/* Wick callout */}
          <rect x="15" y="235" width="130" height="20" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
          <text x="22" y="249" fill="#92400E" fontSize="9" fontWeight="700">
            Capillary Cotton Wick
          </text>
        </g>
      </g>

      {/* Bottom technique note */}
      <g transform="translate(40, 375)">
        <text x="0" y="16" fill="#64748B" fontSize="11">
          💡 <strong>Capillary Action:</strong> The cotton cord draws water upward from the reservoir into the potting soil as the plant roots absorb moisture.
        </text>
      </g>
    </svg>
  );
};
