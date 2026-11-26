import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { cn } from '@/utils/cn';

export interface NavLinkItemProps extends Omit<NavLinkProps, 'className'> {
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  highlight?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const NavLinkItem: React.FC<NavLinkItemProps> = ({
  to,
  icon: Icon,
  badge,
  highlight = false,
  className,
  children,
  ...props
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'group relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium',
          'transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-brand-primary/40',
          isActive
            ? 'text-brand-primary font-semibold bg-forest-100/80 shadow-soft-xs'
            : 'text-brand-muted hover:text-brand-primary hover:bg-forest-100/40',
          highlight && !isActive && 'text-brand-primary font-semibold',
          className
        )
      }
      {...props}
    >
      {({ isActive }) => (
        <>
          {Icon && (
            <Icon
              className={cn(
                'w-4 h-4 transition-colors',
                isActive
                  ? 'text-brand-secondary'
                  : 'text-brand-muted group-hover:text-brand-secondary'
              )}
            />
          )}
          <span>{children}</span>
          {badge !== undefined && (
            <span
              className={cn(
                'ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none',
                isActive
                  ? 'bg-brand-primary text-white'
                  : 'bg-forest-200 text-brand-primary'
              )}
            >
              {badge}
            </span>
          )}
          {/* Subtle active pill indicator on bottom */}
          {isActive && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-primary rounded-full transition-all" />
          )}
        </>
      )}
    </NavLink>
  );
};
