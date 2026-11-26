import React from 'react';
import { DiagramSvgProps } from './JeansStep1CuttingSvg';

/**
 * Completed Project: Finished Upcycled Denim Tote Bag
 * Shows the fully constructed bag with dual top handles,
 * reinforced bottom seam, functional exterior jean pockets,
 * and circular sustainability achievement badge.
 */
export const JeansCompletedToteSvg: React.FC<DiagramSvgProps> = ({
  showLabels = true,
  className = 'w-full h-auto',
}) => {
  return (
    <svg
      viewBox="0 0 600 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Finished Project: Completed Upcycled Denim Market Tote Bag"
    >
      {/* Background canvas */}
      <rect width="600" height="420" rx="16" fill="#FDFBF7" />
      <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />

      {/* Grid watermark */}
      <defs>
        <pattern id="craft-grid-done" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
        </pattern>
        <filter id="tote-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.12" />
        </filter>
        <linearGradient id="denim-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <rect width="600" height="420" rx="16" fill="url(#craft-grid-done)" />

      {/* Top action badge */}
      {showLabels && (
        <g transform="translate(360, 20)">
          <rect width="210" height="26" rx="6" fill="#047857" />
          <text x="12" y="17" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="0.05em">
            ★ PROJECT FINISHED TOTE
          </text>
        </g>
      )}

      {/* MAIN COMPLETED TOTE BAG ILLUSTRATION */}
      <g transform="translate(160, 50)" filter="url(#tote-shadow)">
        {/* BACK HANDLE LOOP */}
        <path
          d="M 65 70 C 65 5, 95 -10, 140 -10 C 185 -10, 215 5, 215 70"
          fill="none"
          stroke="#1E3A8A"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 65 70 C 65 5, 95 -10, 140 -10 C 185 -10, 215 5, 215 70"
          fill="none"
          stroke="#2563EB"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* MAIN TOTE SHELL */}
        <path
          d="M 30 70
             C 90 62, 190 62, 250 70
             L 240 290
             C 190 298, 90 298, 40 290
             Z"
          fill="url(#denim-grad)"
          stroke="#1E3A8A"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Waistband top trim */}
        <path
          d="M 30 70 C 90 62, 190 62, 250 70 L 248 95 C 190 87, 90 87, 32 95 Z"
          fill="#1E40AF"
          stroke="#172554"
          strokeWidth="2"
        />
        {/* Double topstitch on waistband */}
        <path d="M 34 76 C 90 68, 190 68, 246 76" stroke="#FEF08A" strokeWidth="1.8" strokeDasharray="4 2" />
        <path d="M 36 90 C 90 82, 190 82, 244 90" stroke="#FEF08A" strokeWidth="1.8" strokeDasharray="4 2" />

        {/* Belt Loops */}
        <rect x="60" y="68" width="7" height="28" rx="1.5" fill="#1E3A8A" stroke="#172554" strokeWidth="1.5" />
        <rect x="115" y="66" width="7" height="30" rx="1.5" fill="#1E3A8A" stroke="#172554" strokeWidth="1.5" />
        <rect x="160" y="66" width="7" height="30" rx="1.5" fill="#1E3A8A" stroke="#172554" strokeWidth="1.5" />
        <rect x="215" y="68" width="7" height="28" rx="1.5" fill="#1E3A8A" stroke="#172554" strokeWidth="1.5" />

        {/* Brass Button & Center Fly Details */}
        <circle cx="138" cy="81" r="5" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
        <path d="M 138 90 L 138 145 C 138 160, 150 162, 150 145" fill="none" stroke="#172554" strokeWidth="2" />

        {/* EXTERIOR JEAN POCKETS (Super functional for phone/keys) */}
        {/* Left Pocket */}
        <path
          d="M 55 125 L 115 125 L 110 185 L 85 205 L 60 185 Z"
          fill="#1E40AF"
          stroke="#172554"
          strokeWidth="2"
        />
        {/* Decorative pocket V-stitch */}
        <path d="M 62 145 L 85 170 L 108 145" fill="none" stroke="#FEF08A" strokeWidth="1.5" />

        {/* Right Pocket */}
        <path
          d="M 165 125 L 225 125 L 220 185 L 195 205 L 170 185 Z"
          fill="#1E40AF"
          stroke="#172554"
          strokeWidth="2"
        />
        <path d="M 172 145 L 195 170 L 218 145" fill="none" stroke="#FEF08A" strokeWidth="1.5" />

        {/* REINFORCED BOTTOM SEAM */}
        <path d="M 40 290 C 90 298, 190 298, 240 290" stroke="#059669" strokeWidth="3" strokeDasharray="5 2" />

        {/* FRONT HANDLE LOOP (Overlapping) */}
        <path
          d="M 85 78 C 85 15, 115 0, 140 0 C 165 0, 195 15, 195 78"
          fill="none"
          stroke="#172554"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 85 78 C 85 15, 115 0, 140 0 C 165 0, 195 15, 195 78"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Strap Box-X Stitch Attachments */}
        <rect x="80" y="74" width="10" height="12" fill="#047857" stroke="#FEF08A" strokeWidth="1.2" />
        <rect x="190" y="74" width="10" height="12" fill="#047857" stroke="#FEF08A" strokeWidth="1.2" />
      </g>

      {/* CIRCULAR SUSTAINABILITY BADGE */}
      <g transform="translate(435, 100)">
        <circle cx="50" cy="50" r="46" fill="#ECFDF5" stroke="#10B981" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="41" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="4 2" />
        <text x="50" y="38" textAnchor="middle" fill="#065F46" fontSize="10" fontWeight="800">
          100% UPCYCLED
        </text>
        <text x="50" y="54" textAnchor="middle" fill="#047857" fontSize="13" fontWeight="900">
          11.5 kg
        </text>
        <text x="50" y="68" textAnchor="middle" fill="#065F46" fontSize="9" fontWeight="700">
          CO2e AVOIDED
        </text>
      </g>

      {/* LABELS & FEATURES */}
      {showLabels && (
        <>
          <g transform="translate(24, 120)">
            <rect width="124" height="48" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <text x="10" y="20" fill="#1E293B" fontSize="10" fontWeight="700">
              REUSED POCKETS
            </text>
            <text x="10" y="34" fill="#64748B" fontSize="9">
              Quick access phone &
            </text>
            <text x="10" y="44" fill="#64748B" fontSize="9">
              keys storage
            </text>
          </g>

          <g transform="translate(24, 230)">
            <rect width="124" height="48" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <text x="10" y="20" fill="#1E293B" fontSize="10" fontWeight="700">
              SEAM STRENGTH
            </text>
            <text x="10" y="34" fill="#64748B" fontSize="9">
              Supports 25+ lbs of
            </text>
            <text x="10" y="44" fill="#64748B" fontSize="9">
              market produce
            </text>
          </g>

          {/* Bottom disclaimer note as required */}
          <g transform="translate(30, 372)">
            <rect width="540" height="28" rx="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
            <text x="12" y="18" fill="#92400E" fontSize="9.5" fontWeight="600">
              ⚠️ Note: Check jeans measurements and fabric before cutting; denim weights and seam allowances vary.
            </text>
          </g>
        </>
      )}
    </svg>
  );
};
