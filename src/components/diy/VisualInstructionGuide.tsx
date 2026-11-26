import React, { useState, useEffect } from 'react';
import { DIYInstructionIdea, DIYInstructionStep } from '@/types';
import { InstructionStep } from './InstructionStep';
import { DiagramViewer } from './DiagramViewer';
import { StepProgress } from './StepProgress';
import { StepIllustration } from './StepIllustration';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ListOrdered,
  Sparkles,
  BookOpen,
  X,
  RotateCcw,
} from 'lucide-react';

export interface VisualInstructionGuideProps {
  idea: DIYInstructionIdea;
  onClose?: () => void;
  className?: string;
}

export const VisualInstructionGuide: React.FC<VisualInstructionGuideProps> = ({
  idea,
  onClose,
  className = '',
}) => {
  const steps: DIYInstructionStep[] = idea.stepByStepInstructions || [];
  const totalSteps = steps.length;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'interactive' | 'all'>('interactive');
  const [enlargedModalOpen, setEnlargedModalOpen] = useState(false);
  const [showFinishedView, setShowFinishedView] = useState(false);

  const currentStep = steps[currentStepIndex] || {
    stepNumber: 1,
    title: 'Assemble Materials',
    instruction: 'Prepare your workspace and lay out materials.',
  };

  // Keyboard navigation support (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (enlargedModalOpen) return;
      if (e.key === 'ArrowRight' && currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex((prev) => prev + 1);
        setShowFinishedView(false);
      } else if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
        setCurrentStepIndex((prev) => prev - 1);
        setShowFinishedView(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, totalSteps, enlargedModalOpen]);

  // Toggle step completion status
  const handleToggleCompleted = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      // Auto-mark completed when advancing
      if (!completedSteps.includes(currentStep.stepNumber)) {
        setCompletedSteps((prev) => [...prev, currentStep.stepNumber]);
      }
      setCurrentStepIndex((prev) => prev + 1);
      setShowFinishedView(false);
    } else {
      // Finished all steps
      if (!completedSteps.includes(currentStep.stepNumber)) {
        setCompletedSteps((prev) => [...prev, currentStep.stepNumber]);
      }
      setShowFinishedView(true);
    }
  };

  const handlePrevStep = () => {
    if (showFinishedView) {
      setShowFinishedView(false);
      return;
    }
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className={`flex flex-col bg-brand-bg rounded-2xl overflow-hidden ${className}`}>
      {/* GUIDE HEADER */}
      <div className="p-4 sm:p-6 bg-white border-b border-brand-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-forest-100 text-brand-primary font-bold uppercase tracking-wider text-[10px]">
              Visual DIY Blueprint
            </span>
            <span className="text-brand-muted">•</span>
            <span className="text-brand-text font-semibold">{idea.category}</span>
            <span className="text-brand-muted">•</span>
            <span className="text-emerald-700 font-semibold">Avoids {idea.co2SavedKg} kg CO2e</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-primary leading-tight">
            {idea.projectTitle}
          </h2>

          <p className="text-xs sm:text-sm text-brand-muted line-clamp-1">
            {idea.description}
          </p>
        </div>

        {/* View Switcher: Interactive vs All Steps & Close */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex rounded-xl bg-forest-100/60 p-1 border border-brand-border/60">
            <button
              type="button"
              onClick={() => {
                setViewMode('interactive');
                setShowFinishedView(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'interactive'
                  ? 'bg-white text-brand-primary shadow-soft-xs'
                  : 'text-brand-muted hover:text-brand-primary'
              }`}
            >
              Step-by-Step
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                viewMode === 'all'
                  ? 'bg-white text-brand-primary shadow-soft-xs'
                  : 'text-brand-muted hover:text-brand-primary'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>View All ({totalSteps})</span>
            </button>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-forest-100 transition-colors ml-1 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              aria-label="Close guide"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE STEP-BY-STEP (SPLIT VIEW) */}
      {viewMode === 'interactive' && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Progress Bar & Jump Bar */}
          <StepProgress
            currentStep={showFinishedView ? totalSteps : currentStep.stepNumber}
            totalSteps={totalSteps}
            completedSteps={completedSteps}
            onSelectStep={(num) => {
              setCurrentStepIndex(num - 1);
              setShowFinishedView(false);
            }}
          />

          {/* MAIN SPLIT CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* LEFT SIDE: STEP INSTRUCTION & CHECKLIST */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              {showFinishedView ? (
                <div className="p-6 rounded-2xl bg-white border border-brand-border shadow-soft-xs space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-brand-primary">
                    Project Completed!
                  </h3>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    You have successfully transformed your <strong>{idea.beforeProduct}</strong> into a durable <strong>{idea.finalProduct}</strong>!
                  </p>
                  <div className="p-4 rounded-xl bg-forest-50 border border-forest-100 text-xs text-brand-primary font-medium text-left space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Environmental Impact Verified
                    </div>
                    <p className="text-forest-700">
                      Diverted ~0.6 kg of solid fabric waste from landfill and prevented approximately {idea.co2SavedKg} kg of lifecycle carbon emissions.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowFinishedView(false);
                      setCurrentStepIndex(0);
                    }}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                    className="w-full text-xs"
                  >
                    Review From Step 1
                  </Button>
                </div>
              ) : (
                <InstructionStep
                  step={currentStep}
                  totalSteps={totalSteps}
                  isCompleted={completedSteps.includes(currentStep.stepNumber)}
                  onToggleCompleted={handleToggleCompleted}
                />
              )}
            </div>

            {/* RIGHT SIDE: CORRESPONDING 2D TECHNICAL DIAGRAM */}
            <div className="lg:col-span-7 flex flex-col">
              <DiagramViewer
                step={currentStep}
                idea={idea}
                isCompletedView={showFinishedView}
                onEnlargeModal={() => setEnlargedModalOpen(true)}
                className="h-full min-h-[380px]"
              />
            </div>
          </div>

          {/* BOTTOM STEP CONTROLS BAR */}
          <div className="pt-4 border-t border-brand-border/80 flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0 && !showFinishedView}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="border-brand-border bg-white text-xs sm:text-sm font-semibold"
            >
              Previous Step
            </Button>

            <div className="text-xs text-brand-muted hidden sm:block">
              Use <kbd className="px-1.5 py-0.5 rounded bg-white border border-brand-border text-[10px] font-mono">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-white border border-brand-border text-[10px] font-mono">→</kbd> keys to navigate
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleNextStep}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="text-xs sm:text-sm font-semibold px-6 shadow-soft-xs"
            >
              {currentStepIndex === totalSteps - 1 ? (showFinishedView ? 'Finished' : 'Complete Project') : 'Next Step'}
            </Button>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: "VIEW ALL STEPS" SEQUENCE (CONTINUOUS CRAFT MANUAL) */}
      {viewMode === 'all' && (
        <div className="p-4 sm:p-6 space-y-10">
          <div className="p-4 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-between text-xs text-brand-primary">
            <span className="font-semibold flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-brand-secondary" />
              Full Craft Manual: All {totalSteps} Illustrated Steps
            </span>
            <span className="text-brand-muted">Follow sequentially from Step 1 to {totalSteps}</span>
          </div>

          <div className="space-y-12">
            {steps.map((step) => {
              const isDone = completedSteps.includes(step.stepNumber);
              return (
                <div
                  key={step.stepNumber}
                  className="p-5 sm:p-7 rounded-2xl bg-white border border-brand-border shadow-soft-xs space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Left: Step details */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-forest-100 text-brand-primary text-xs font-bold">
                          STEP {step.stepNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleCompleted(step.stepNumber)}
                          className={`text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full border ${
                            isDone
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-white border-brand-border text-brand-muted hover:text-brand-text'
                          }`}
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-600 fill-emerald-100' : ''}`} />
                          <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                        </button>
                      </div>

                      <h3 className="text-xl font-display font-bold text-brand-primary">
                        {step.title || `Step ${step.stepNumber}`}
                      </h3>

                      <p className="text-sm text-brand-text leading-relaxed">
                        {step.instruction}
                      </p>

                      {step.diagramNote && (
                        <p className="text-xs text-blue-800 bg-blue-50/80 p-2.5 rounded-lg border border-blue-200">
                          <strong>Diagram:</strong> {step.diagramNote}
                        </p>
                      )}

                      {step.tip && (
                        <p className="text-xs text-emerald-800 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200">
                          <strong>Pro Tip:</strong> {step.tip}
                        </p>
                      )}
                    </div>

                    {/* Right: Diagram */}
                    <div className="lg:col-span-7 bg-[#FDFBF7] rounded-xl border border-brand-border/80 p-3 sm:p-4">
                      <StepIllustration
                        step={step}
                        idea={idea}
                        showMeasurements={true}
                        showLabels={true}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Final Completed View at bottom of manual */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-emerald-300 shadow-soft-sm space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide">
                    Finished Masterpiece
                  </span>
                  <h3 className="text-2xl font-display font-bold text-brand-primary">
                    Completed {idea.finalProduct}
                  </h3>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    Review your completed project against the final assembly illustration. Ensure all weight-bearing joints and reinforced seams are secure before putting into daily use.
                  </p>
                </div>
                <div className="lg:col-span-7 bg-[#FDFBF7] rounded-xl border border-brand-border/80 p-3 sm:p-4">
                  <StepIllustration
                    step={steps[steps.length - 1]}
                    idea={idea}
                    isCompletedView={true}
                    showLabels={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN / ENLARGED DIAGRAM MODAL */}
      {enlargedModalOpen && (
        <Modal
          isOpen={enlargedModalOpen}
          onClose={() => setEnlargedModalOpen(false)}
          title={`Step ${currentStep.stepNumber}: ${currentStep.title || 'Technical Diagram'}`}
          size="xl"
        >
          <div className="space-y-4">
            <div className="bg-[#FDFBF7] rounded-2xl p-4 sm:p-6 border border-brand-border">
              <StepIllustration
                step={currentStep}
                idea={idea}
                showMeasurements={true}
                showLabels={true}
                isCompletedView={showFinishedView}
              />
            </div>
            <div className="p-4 rounded-xl bg-white border border-brand-border text-xs text-brand-text space-y-1">
              <span className="font-bold text-brand-primary block text-sm">
                Step {currentStep.stepNumber} Instruction
              </span>
              <p className="leading-relaxed">{currentStep.instruction}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
