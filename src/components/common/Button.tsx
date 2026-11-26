import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = [
    'inline-flex flex-row flex-nowrap items-center justify-center font-medium rounded-xl',
    'transition-all duration-200 ease-out select-none whitespace-nowrap',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'active:scale-[0.98]',
  ].join(' ');

  const variants = {
    // Primary: Forest green (#234B35) with crisp white text
    primary:
      'bg-brand-primary text-white hover:bg-[#1a3827] shadow-soft-xs hover:shadow-soft-sm border border-transparent',
    // Secondary: Light background with green border and green text
    secondary:
      'bg-[#F0F5F2] text-brand-primary border border-brand-secondary/40 hover:bg-[#E3EFE7] hover:border-brand-secondary shadow-soft-xs',
    // Outline: Neutral white/surface with subtle border and dark text
    outline:
      'border border-brand-border bg-white text-brand-text hover:bg-forest-50 hover:border-brand-secondary/50',
    // Ghost: Clean hover without persistent background
    ghost:
      'text-brand-text hover:text-brand-primary hover:bg-forest-100/60',
    // Danger: Subtle warning red
    danger:
      'bg-red-600 text-white hover:bg-red-700 shadow-soft-xs focus:ring-red-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-6 py-3 gap-2.5 h-12 font-semibold',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};
