import React from 'react';
import { Check } from 'lucide-react';

export interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  onSelectStep: (stepNumber: number) => void;
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
  onSelectStep,
  className = '',
}) => {
  const percent = Math.round((completedSteps.length / totalSteps) * 100);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Top Counter & Percentage Header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-brand-primary">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Step {currentStep} of {totalSteps}</span>
        </div>
        <span className="text-[11px] font-semibold text-brand-muted">
          {completedSteps.length}/{totalSteps} Completed ({percent}%)
        </span>
      </div>

      {/* Segmented Clickable Stepper Bar */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => {
          const isActive = stepNum === currentStep;
          const isDone = completedSteps.includes(stepNum);

          return (
            <button
              key={stepNum}
              type="button"
              onClick={() => onSelectStep(stepNum)}
              className={`flex-1 h-3 rounded-full transition-all duration-200 relative group focus:outline-none focus:ring-2 focus:ring-brand-primary/40 ${
                isActive
                  ? 'bg-brand-primary ring-2 ring-brand-primary/20 scale-y-110 shadow-soft-xs'
                  : isDone
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'bg-brand-border/80 hover:bg-forest-100'
              }`}
              title={`Jump to Step ${stepNum}`}
              aria-label={`Jump to Step ${stepNum}`}
            >
              {isDone && !isActive && (
                <span className="absolute inset-0 flex items-center justify-center text-white">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
