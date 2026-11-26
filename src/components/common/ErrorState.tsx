import React from 'react';
import { cn } from '@/utils/cn';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message = 'An unexpected error occurred while retrieving circular product records. Please try again.',
  onRetry,
  onBack,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-md mx-auto',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 border border-red-200">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="font-display font-bold text-lg text-brand-text mb-1.5">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-6">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            variant="primary"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Retry Request
          </Button>
        )}
        {onBack && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Go Back
          </Button>
        )}
      </div>
    </div>
  );
};
