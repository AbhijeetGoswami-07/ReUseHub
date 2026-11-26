import React from 'react';
import { DIYInstructionStep } from '@/types';

export interface GenericDiyDiagramProps {
  step: DIYInstructionStep;
  projectCategory?: string;
  showMeasurements?: boolean;
  showLabels?: boolean;
  className?: string;
}

export const GenericDiyDiagram: React.FC<GenericDiyDiagramProps> = ({
  step,
  projectCategory = 'General Craft',
  showMeasurements = true,
  showLabels = true,
  className = 'w-full h-auto',
}) => {
  const getActionColor = () => {
    switch (step.diagramType) {
      case 'cut':
        return { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B', label: 'CUTTING / SIZING' };
      case 'fold':
        return { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF', label: 'FOLDING / CREASING' };
      case 'stitch':
        return { bg: '#ECFDF5', border: '#10B981', text: '#065F46', label: 'STITCHING / JOINING' };
      case 'assemble':
        return { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E', label: 'ASSEMBLY / SECURING' };
      case 'finish':
        return { bg: '#F5F3FF', border: '#8B5CF6', text: '#5B21B6', label: 'FINISHING / INSPECTION' };
      default:
        return { bg: '#F8FAFC', border: '#234B35', text: '#234B35', label: 'CONSTRUCTION STEP' };
    }
  };

  const action = getActionColor();

  return (
    <svg
      viewBox="0 0 600 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`Step ${step.stepNumber}: ${step.title || 'Instruction Diagram'}`}
    >
      {/* Background canvas */}
      <rect width="600" height="420" rx="16" fill="#FDFBF7" />
      <rect x="1" y="1" width="598" height="418" rx="15" stroke="#E2E8F0" strokeWidth="2" />

      {/* Grid watermark */}
      <defs>
        <pattern id="craft-grid-gen" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="600" height="420" rx="16" fill="url(#craft-grid-gen)" />

      {/* Header bar */}
      <g transform="translate(24, 20)">
        <rect width="220" height="26" rx="6" fill={action.border} />
        <text x="12" y="17" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="0.05em">
          STEP {step.stepNumber}: {action.label}
        </text>
      </g>

      {/* Main Diagram Central Blueprint Frame */}
      <g transform="translate(40, 65)">
        <rect width="520" height="270" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />

        {/* Blueprint watermark lines */}
        <line x1="20" y1="135" x2="500" y2="135" stroke="#F1F5F9" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="260" y1="20" x2="260" y2="250" stroke="#F1F5F9" strokeWidth="2" strokeDasharray="4 4" />

        {/* Center Illustration Glyph based on action type */}
        <g transform="translate(260, 110)">
          {/* Outer circle */}
          <circle cx="0" cy="0" r="50" fill={action.bg} stroke={action.border} strokeWidth="2" />

          {/* Iconography */}
          {step.diagramType === 'cut' && (
            <g transform="translate(-16, -16) scale(0.6)">
              <path d="M 0 28 L 36 24 L 62 10" stroke="#1E293B" strokeWidth="3" fill="#E2E8F0" />
              <path d="M 0 28 L 36 32 L 62 46" stroke="#1E293B" strokeWidth="3" fill="#E2E8F0" />
              <circle cx="28" cy="28" r="4" fill="#94A3B8" stroke="#1E293B" strokeWidth="1.5" />
              <ellipse cx="68" cy="8" rx="14" ry="9" fill="none" stroke="#DC2626" strokeWidth="3.5" />
              <ellipse cx="68" cy="48" rx="14" ry="9" fill="none" stroke="#DC2626" strokeWidth="3.5" />
            </g>
          )}

          {step.diagramType === 'stitch' && (
            <g transform="translate(-15, -15)">
              <path d="M 5 25 L 25 5" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 2" />
              <circle cx="25" cy="5" r="3" fill="#047857" />
              <path d="M 2 15 C 10 5, 20 25, 28 15" stroke="#10B981" strokeWidth="2" fill="none" />
            </g>
          )}

          {step.diagramType === 'fold' && (
            <g transform="translate(-15, -15)">
              <rect x="2" y="6" width="26" height="18" rx="2" fill="none" stroke="#2563EB" strokeWidth="2.5" />
              <path d="M 8 2 C 16 -2, 22 2, 24 8" fill="none" stroke="#2563EB" strokeWidth="2" />
            </g>
          )}

          {(!step.diagramType || step.diagramType === 'assemble' || step.diagramType === 'finish' || step.diagramType === 'custom') && (
            <g transform="translate(-15, -15)">
              <circle cx="15" cy="15" r="14" fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
              <path d="M 9 15 L 13 19 L 21 11" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}
        </g>

        {/* Step Title Display */}
        <text x="260" y="190" textAnchor="middle" fill="#1E293B" fontSize="16" fontWeight="800">
          {step.title || `Instruction Step ${step.stepNumber}`}
        </text>

        {/* Diagram Note / Subtitle */}
        <text x="260" y="210" textAnchor="middle" fill="#64748B" fontSize="11">
          {step.diagramNote || 'Follow the highlighted technical markers below'}
        </text>

        {/* Technical Guidance Indicators */}
        {showMeasurements && step.measurements && step.measurements.length > 0 && (
          <g transform="translate(30, 30)">
            <rect width="180" height="24" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
            <text x="10" y="16" fill="#1D4ED8" fontSize="10" fontWeight="700">
              📏 {step.measurements.join(', ')}
            </text>
          </g>
        )}

        {showLabels && step.labels && step.labels.length > 0 && (
          <g transform="translate(310, 30)">
            <rect width="180" height="24" rx="4" fill="#F0FDF4" stroke="#10B981" strokeWidth="1" />
            <text x="10" y="16" fill="#047857" fontSize="10" fontWeight="700">
              🏷️ {step.labels.join(' • ')}
            </text>
          </g>
        )}
      </g>

      {/* Safety / Verification Notice */}
      <g transform="translate(40, 350)">
        <rect width="520" height="42" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
        <text x="16" y="20" fill="#475569" fontSize="10" fontWeight="700">
          DIAGRAM SPECIFICATION: {projectCategory.toUpperCase()}
        </text>
        <text x="16" y="33" fill="#64748B" fontSize="10">
          {step.safetyWarning || 'Work on a clean, stable surface and double check measurements prior to modification.'}
        </text>
      </g>
    </svg>
  );
};
