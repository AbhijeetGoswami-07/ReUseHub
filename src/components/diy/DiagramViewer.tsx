import React, { useState } from 'react';
import { DIYInstructionStep, DIYInstructionIdea } from '@/types';
import { StepIllustration } from './StepIllustration';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Tag,
  Ruler,
  HelpCircle,
  Eye,
} from 'lucide-react';

export interface DiagramViewerProps {
  step: DIYInstructionStep;
  idea?: DIYInstructionIdea;
  isCompletedView?: boolean;
  onEnlargeModal?: () => void;
  className?: string;
}

export const DiagramViewer: React.FC<DiagramViewerProps> = ({
  step,
  idea,
  isCompletedView = false,
  onEnlargeModal,
  className = '',
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showLegend, setShowLegend] = useState(false);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.2, 2.0));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.2, 0.8));
  const handleZoomReset = () => setZoomLevel(1);

  return (
    <div className={`relative flex flex-col rounded-2xl bg-[#FDFBF7] border border-brand-border/80 shadow-soft-xs overflow-hidden ${className}`}>
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-white/90 backdrop-blur-sm border-b border-brand-border/60 text-xs z-10">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-brand-primary flex items-center gap-1 text-[11px] uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5 text-brand-secondary" />
            2D Technical Diagram
          </span>
          <span className="text-brand-muted hidden sm:inline">•</span>
          <span className="text-[11px] text-brand-muted hidden sm:inline">
            Step {step.stepNumber} of {idea?.stepByStepInstructions?.length || 5}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Toggle Measurements */}
          <button
            type="button"
            onClick={() => setShowMeasurements(!showMeasurements)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              showMeasurements
                ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                : 'bg-white border-brand-border text-brand-muted hover:text-brand-text'
            }`}
            title="Toggle measurement callouts"
            aria-label="Toggle measurement indicators"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[10px]">Measurements</span>
          </button>

          {/* Toggle Labels */}
          <button
            type="button"
            onClick={() => setShowLabels(!showLabels)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              showLabels
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium'
                : 'bg-white border-brand-border text-brand-muted hover:text-brand-text'
            }`}
            title="Toggle component labels"
            aria-label="Toggle labels"
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[10px]">Labels</span>
          </button>

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 2.0}
            className="p-1.5 rounded-lg border border-brand-border bg-white text-brand-text hover:bg-forest-50 disabled:opacity-40 transition-colors"
            title="Zoom in diagram"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.8}
            className="p-1.5 rounded-lg border border-brand-border bg-white text-brand-text hover:bg-forest-50 disabled:opacity-40 transition-colors"
            title="Zoom out diagram"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Reset Zoom */}
          {zoomLevel !== 1 && (
            <button
              type="button"
              onClick={handleZoomReset}
              className="p-1.5 rounded-lg border border-brand-border bg-white text-brand-text hover:bg-forest-50 transition-colors text-[10px] font-bold"
              title="Reset zoom to 100%"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}

          {/* Enlarge in Modal Button */}
          {onEnlargeModal && (
            <button
              type="button"
              onClick={onEnlargeModal}
              className="p-1.5 rounded-lg border border-brand-border bg-white text-brand-primary hover:bg-forest-100 transition-colors ml-0.5"
              title="Open enlarged diagram"
              aria-label="Enlarge diagram modal"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Diagram Canvas Area with Smooth Zoom Transform */}
      <div className="relative flex-1 min-h-[300px] sm:min-h-[360px] lg:min-h-[400px] flex items-center justify-center p-3 sm:p-5 overflow-hidden">
        <div
          className="w-full max-w-[560px] transition-transform duration-200 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <StepIllustration
            step={step}
            idea={idea}
            showMeasurements={showMeasurements}
            showLabels={showLabels}
            isCompletedView={isCompletedView}
          />
        </div>

        {/* Legend Overlay Toggle Pill */}
        <div className="absolute bottom-3 left-3 z-10">
          <button
            type="button"
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 hover:bg-white text-brand-muted hover:text-brand-primary border border-brand-border text-[11px] font-medium shadow-soft-xs backdrop-blur-sm transition-all"
          >
            <HelpCircle className="w-3 h-3 text-brand-secondary" />
            <span>{showLegend ? 'Hide Legend' : 'Symbol Legend'}</span>
          </button>

          {showLegend && (
            <div className="mt-1.5 p-2.5 rounded-xl bg-white border border-brand-border shadow-soft-md text-[11px] space-y-1.5 w-60 animate-in fade-in slide-in-from-bottom-2">
              <div className="font-bold text-brand-primary text-[11px] pb-1 border-b border-brand-border/60">
                Pattern Markings Key
              </div>
              <div className="flex items-center gap-2 text-brand-text">
                <span className="w-5 h-0.5 border-t-2 border-dashed border-red-500 shrink-0" />
                <span><strong>Red dashed line:</strong> Cutting path</span>
              </div>
              <div className="flex items-center gap-2 text-brand-text">
                <span className="w-5 h-0.5 bg-emerald-600 shrink-0" />
                <span><strong>Green line:</strong> Stitching / Attachment</span>
              </div>
              <div className="flex items-center gap-2 text-brand-text">
                <span className="w-5 h-0.5 bg-blue-600 shrink-0" />
                <span><strong>Blue arrow:</strong> Movement / Fold direction</span>
              </div>
              <div className="flex items-center gap-2 text-brand-text">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span><strong>Pin icon:</strong> Fabric pinning alignment</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
