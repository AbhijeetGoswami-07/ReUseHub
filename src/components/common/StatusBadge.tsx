import React from 'react';
import { cn } from '@/utils/cn';
import { ReuseAction } from '@/types';
import {
  CheckCircle2,
  Clock,
  Lock,
  FileEdit,
  ShieldCheck,
  Repeat,
  Wrench,
  Sparkles,
  HeartHandshake,
  Recycle,
} from 'lucide-react';

export type GeneralStatus = 'active' | 'pending' | 'completed' | 'reserved' | 'draft' | 'verified';

export interface StatusBadgeProps {
  status: GeneralStatus | ReuseAction;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const configs: Record<
    GeneralStatus | ReuseAction,
    {
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      style: string;
      iconColor: string;
    }
  > = {
    // Actions
    reuse: {
      label: 'Reuse',
      icon: Repeat,
      style: 'bg-[#EBF7EE] text-[#1B5E20] border-[#C8E6C9]',
      iconColor: 'text-[#2E7D32]',
    },
    repair: {
      label: 'Repair',
      icon: Wrench,
      style: 'bg-[#FFF8E1] text-[#92400E] border-[#FDE68A]',
      iconColor: 'text-[#D97706]',
    },
    upcycle: {
      label: 'Upcycle',
      icon: Sparkles,
      style: 'bg-[#F3E8FF] text-[#6B21A8] border-[#DDD6FE]',
      iconColor: 'text-[#7C3AED]',
    },
    donate: {
      label: 'Donate',
      icon: HeartHandshake,
      style: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
      iconColor: 'text-[#0284C7]',
    },
    recycle: {
      label: 'Recycle',
      icon: Recycle,
      style: 'bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]',
      iconColor: 'text-[#0D9488]',
    },
    // General Statuses
    active: {
      label: 'Active Available',
      icon: CheckCircle2,
      style: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconColor: 'text-emerald-600',
    },
    pending: {
      label: 'In Evaluation',
      icon: Clock,
      style: 'bg-amber-50 text-amber-800 border-amber-200',
      iconColor: 'text-amber-600',
    },
    reserved: {
      label: 'Reserved',
      icon: Lock,
      style: 'bg-blue-50 text-blue-800 border-blue-200',
      iconColor: 'text-blue-600',
    },
    completed: {
      label: 'Diverted & Rehomed',
      icon: CheckCircle2,
      style: 'bg-forest-100 text-forest-800 border-forest-200',
      iconColor: 'text-forest-600',
    },
    draft: {
      label: 'Draft',
      icon: FileEdit,
      style: 'bg-slate-100 text-slate-700 border-slate-200',
      iconColor: 'text-slate-500',
    },
    verified: {
      label: 'Eco Verified',
      icon: ShieldCheck,
      style: 'bg-sage-100 text-forest-900 border-sage-300',
      iconColor: 'text-forest-700',
    },
  };

  const config = configs[status] || configs.active;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-colors select-none',
        config.style,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <IconComponent className={cn(iconSizes[size], config.iconColor, 'shrink-0')} />}
      <span className="truncate">{config.label}</span>
    </span>
  );
};
