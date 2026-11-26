import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'elevated' | 'bordered';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'bordered',
  hoverEffect = false,
  className,
  children,
  ...props
}) => {
  const variants = {
    flat: 'bg-white/80 backdrop-blur-sm',
    elevated: 'bg-white shadow-soft-md',
    bordered: 'bg-white border border-forest-100/80 shadow-soft-sm',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-200',
        variants[variant],
        hoverEffect && 'hover:border-forest-300 hover:shadow-soft-md hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
