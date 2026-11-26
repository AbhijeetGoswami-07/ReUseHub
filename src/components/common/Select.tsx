import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, AlertCircle, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      leftIcon,
      placeholder = 'Select an option...',
      className,
      id,
      name,
      value,
      onChange,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    // Find currently selected option
    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (optValue: string) => {
      if (disabled) return;
      if (onChange) {
        onChange({ target: { value: optValue, name } });
      }
      setIsOpen(false);
    };

    return (
      <div className="w-full space-y-1.5 text-left" ref={containerRef}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-brand-text"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* Custom Trigger Button — No native browser arrow duplicate */}
          <button
            type="button"
            id={selectId}
            disabled={disabled}
            onClick={() => setIsOpen((open) => !open)}
            className={cn(
              'w-full rounded-xl border border-brand-border bg-white px-3.5 py-2.5 text-sm text-left',
              'flex items-center justify-between transition-all duration-200 ease-out cursor-pointer select-none',
              'focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20',
              disabled && 'bg-forest-50/60 text-brand-muted cursor-not-allowed opacity-60',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
              isOpen && 'border-brand-primary ring-2 ring-brand-primary/20',
              className
            )}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <div className="flex items-center gap-2.5 truncate">
              {leftIcon && (
                <div className="text-brand-muted flex items-center shrink-0">
                  {leftIcon}
                </div>
              )}
              <span className={cn('truncate', !selectedOption && 'text-brand-muted')}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>

            {/* Exactly ONE clean chevron arrow */}
            <div className="text-brand-muted flex items-center shrink-0 ml-2">
              {error ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : (
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform duration-200',
                    isOpen && 'rotate-180 text-brand-primary'
                  )}
                />
              )}
            </div>
          </button>

          {/* Hidden native select to preserve form refs & accessibility */}
          <select
            ref={ref}
            name={name}
            value={value || ''}
            onChange={() => {}}
            disabled={disabled}
            className="sr-only pointer-events-none"
            tabIndex={-1}
            aria-hidden="true"
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom Animated Dropdown Popover */}
          {isOpen && (
            <div
              className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-white border border-brand-border shadow-soft-lg max-h-60 overflow-y-auto py-1"
              role="listbox"
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      'w-full px-3.5 py-2 text-xs sm:text-sm text-left flex items-center justify-between transition-colors',
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'bg-forest-50 text-brand-primary font-bold'
                        : 'text-brand-text hover:bg-forest-50/70 hover:text-brand-primary cursor-pointer'
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-brand-secondary shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
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
