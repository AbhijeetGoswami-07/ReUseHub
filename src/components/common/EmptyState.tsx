import React from 'react';
import { cn } from '@/utils/cn';
import { Inbox, LucideIcon } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-md mx-auto',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-forest-100/80 text-brand-primary flex items-center justify-center mb-4 shadow-soft-xs">
        <Icon className="w-7 h-7 text-brand-secondary" />
      </div>

      <h3 className="font-display font-bold text-lg text-brand-text mb-1.5">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-6">
        {description}
      </p>

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {primaryAction && (
            <Button
              variant="primary"
              size="sm"
              onClick={primaryAction.onClick}
              leftIcon={primaryAction.icon}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
