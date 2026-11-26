import React from 'react';
import { DIYInstructionStep } from '@/types';
import {
  Wrench,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export interface InstructionStepProps {
  step: DIYInstructionStep;
  totalSteps: number;
  isCompleted: boolean;
  onToggleCompleted: (stepNumber: number) => void;
  className?: string;
}

export const InstructionStep: React.FC<InstructionStepProps> = ({
  step,
  totalSteps,
  isCompleted,
  onToggleCompleted,
  className = '',
}) => {
  return (
    <div className={`flex flex-col justify-between space-y-4 ${className}`}>
      <div className="space-y-4">
        {/* Step Header Badge & Step Number */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-50 border border-forest-100 text-brand-primary text-xs font-bold">
            <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[11px] font-extrabold flex items-center justify-center">
              {step.stepNumber}
            </span>
            <span>STEP {step.stepNumber} OF {totalSteps}</span>
          </div>

          {/* Mark Complete Checkbox in Header */}
          <button
            type="button"
            onClick={() => onToggleCompleted(step.stepNumber)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              isCompleted
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                : 'bg-white border-brand-border text-brand-muted hover:border-brand-secondary hover:text-brand-text'
            }`}
            aria-label={isCompleted ? 'Mark step as incomplete' : 'Mark step as completed'}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                isCompleted ? 'text-emerald-600 fill-emerald-100' : 'text-brand-muted'
              }`}
            />
            <span>{isCompleted ? 'Step Completed' : 'Mark as Done'}</span>
          </button>
        </div>

        {/* Step Title */}
        <h3 className="text-xl sm:text-2xl font-display font-bold text-brand-primary leading-snug">
          {step.title || `Step ${step.stepNumber}: Physical Action`}
        </h3>

        {/* Step Explanation Text */}
        <div className="text-sm text-brand-text leading-relaxed p-4 rounded-xl bg-white border border-brand-border shadow-soft-xs">
          <p className="font-medium text-brand-text leading-relaxed">
            {step.instruction}
          </p>
        </div>

        {/* Diagram Reference Note if available */}
        {step.diagramNote && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900">
            <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Diagram Guide:</strong> {step.diagramNote}
            </p>
          </div>
        )}

        {/* Tools and Materials Required for THIS step */}
        {((step.requiredTools && step.requiredTools.length > 0) ||
          (step.requiredMaterials && step.requiredMaterials.length > 0)) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {step.requiredTools && step.requiredTools.length > 0 && (
              <div className="p-3 rounded-xl bg-forest-50/50 border border-forest-100/80 space-y-1.5">
                <span className="text-[11px] font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-brand-secondary" />
                  Tools for this step
                </span>
                <div className="flex flex-wrap gap-1">
                  {step.requiredTools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white border border-forest-200 text-[11px] font-medium text-brand-text"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {step.requiredMaterials && step.requiredMaterials.length > 0 && (
              <div className="p-3 rounded-xl bg-forest-50/50 border border-forest-100/80 space-y-1.5">
                <span className="text-[11px] font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-secondary" />
                  Materials for this step
                </span>
                <div className="flex flex-wrap gap-1">
                  {step.requiredMaterials.map((mat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white border border-forest-200 text-[11px] font-medium text-brand-text"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pro Tip */}
        {step.tip && (
          <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Pro Tip:</strong> {step.tip}
            </p>
          </div>
        )}

        {/* Safety Warning */}
        {step.safetyWarning && (
          <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Safety Notice:</strong> {step.safetyWarning}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
