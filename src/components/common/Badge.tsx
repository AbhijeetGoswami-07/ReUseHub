import React from 'react';
import { cn } from '@/utils/cn';
import { ReuseAction } from '@/types';
import { Repeat, Wrench, Sparkles, HeartHandshake, Recycle } from 'lucide-react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'outline' | 'sage';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-forest-100 text-forest-800 border-forest-200',
    sage: 'bg-sage-100 text-forest-900 border-sage-300',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    info: 'bg-sky-50 text-sky-800 border-sky-200',
    outline: 'bg-transparent text-forest-700 border-forest-300',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

interface ActionBadgeProps {
  action: ReuseAction;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({
  action,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const configs: Record<
    ReuseAction,
    { label: string; icon: React.ComponentType<{ className?: string }>; style: string; iconStyle: string }
  > = {
    reuse: {
      label: 'Reuse',
      icon: Repeat,
      style: 'bg-[#EBF7EE] text-[#1B5E20] border-[#C8E6C9]',
      iconStyle: 'text-[#2E7D32]',
    },
    repair: {
      label: 'Repair',
      icon: Wrench,
      style: 'bg-[#FFF8E1] text-[#B78103] border-[#FFE082]',
      iconStyle: 'text-[#D97706]',
    },
    upcycle: {
      label: 'Upcycle',
      icon: Sparkles,
      style: 'bg-[#F3E8FF] text-[#6B21A8] border-[#DDD6FE]',
      iconStyle: 'text-[#7C3AED]',
    },
    donate: {
      label: 'Donate',
      icon: HeartHandshake,
      style: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
      iconStyle: 'text-[#0284C7]',
    },
    recycle: {
      label: 'Recycle',
      icon: Recycle,
      style: 'bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]',
      iconStyle: 'text-[#0D9488]',
    },
  };

  const normalizedAction = (
    action ? String(action).toLowerCase().trim() : 'reuse'
  ) as ReuseAction;
  const config = configs[normalizedAction] || configs.reuse;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold border transition-colors',
        config.style,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <IconComponent className={cn(iconSizes[size], config.iconStyle)} />}
      <span>{config.label}</span>
    </span>
  );
};
