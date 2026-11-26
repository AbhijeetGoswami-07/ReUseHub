import React from 'react';
import { cn } from '@/utils/cn';
import { RecommendationPlan } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { Clock, Leaf, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface RecommendationCardProps {
  plan: RecommendationPlan;
  isPreferred?: boolean;
  onSelect?: (plan: RecommendationPlan) => void;
  className?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  plan,
  isPreferred = false,
  onSelect,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative flex flex-col justify-between rounded-xl border bg-white p-5 sm:p-6',
        'transition-all duration-200 ease-out hover:shadow-soft-sm text-left',
        isPreferred
          ? 'border-brand-primary ring-1 ring-brand-primary/40 bg-gradient-to-b from-[#F9FAF8] to-white'
          : 'border-brand-border hover:border-brand-secondary/50',
        className
      )}
    >
      {isPreferred && (
        <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-brand-primary text-white text-[10px] font-bold uppercase tracking-wider shadow-soft-xs">
          Highest Circular Value
        </div>
      )}

      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={plan.action} size="md" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-brand-muted bg-forest-50 px-2.5 py-0.5 rounded-full border border-brand-border/60 capitalize">
              {plan.difficulty}
            </span>
            <span className="text-[11px] font-medium text-brand-muted flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-secondary" />
              {plan.estimatedTimeMinutes} min
            </span>
          </div>
        </div>

        {/* Title & Summary */}
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-display font-bold text-brand-text leading-snug">
            {plan.title}
          </h3>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            {plan.summary}
          </p>
        </div>

        {/* Ecological Impact Metric Box */}
        <div className="p-3 rounded-lg bg-forest-50/70 border border-forest-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-forest-100 flex items-center justify-center text-brand-primary">
              <Leaf className="w-4 h-4 text-brand-secondary" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-text">
                {plan.environmentalImpact.co2KgSaved} kg CO2e Avoided
              </div>
              <div className="text-[10px] text-brand-muted">
                {plan.environmentalImpact.wasteKgDiverted} kg landfill diversion
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold text-brand-secondary">
            Verified LCA
          </span>
        </div>

        {/* Steps Snippet */}
        {plan.steps && plan.steps.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
              First Step
            </span>
            <div className="text-xs text-brand-text flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary mt-0.5 shrink-0" />
              <span className="line-clamp-2">{plan.steps[0].instruction}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="pt-5 mt-5 border-t border-brand-border flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-brand-muted">
          {plan.steps?.length || 0} implementation steps
        </span>
        <Button
          variant={isPreferred ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onSelect?.(plan)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Select Pathway
        </Button>
      </div>
    </div>
  );
};
