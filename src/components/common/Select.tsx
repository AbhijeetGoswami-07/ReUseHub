import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      leftIcon,
      placeholder,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full appearance-none rounded-xl border border-brand-border bg-white px-3.5 py-2.5 text-sm text-brand-text',
              'transition-all duration-200 ease-out cursor-pointer',
              'focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20',
              'disabled:bg-forest-50/60 disabled:text-brand-muted disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              'pr-10',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-brand-muted flex items-center">
            {error ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-brand-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
