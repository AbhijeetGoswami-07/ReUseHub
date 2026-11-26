import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-brand-text"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-brand-muted pointer-events-none flex items-center shrink-0">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full rounded-xl border border-brand-border bg-white px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/60',
              'transition-all duration-200 ease-out',
              'focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20',
              'disabled:bg-forest-50/60 disabled:text-brand-muted disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              (rightIcon || error) && 'pr-10',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
              className
            )}
            {...props}
          />
          {error ? (
            <div className="absolute right-3.5 text-red-500 pointer-events-none flex items-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          ) : (
            rightIcon && (
              <div className="absolute right-3.5 text-brand-muted pointer-events-none flex items-center shrink-0">
                {rightIcon}
              </div>
            )
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-brand-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
