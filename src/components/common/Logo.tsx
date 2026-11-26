import React from 'react';
import { cn } from '@/utils/cn';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
}

/**
 * ReUseHub Official Brand Logo
 * Combines circular renewal arrows with a central living leaf.
 * Optimized for crisp rendering from 16px micro-icon to full display sizes.
 */
export const LogoMark: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 transition-transform duration-300', className)}
      aria-label="ReUseHub Mark"
    >
      {/* Outer subtle circular track */}
      <circle cx="20" cy="20" r="18" className="stroke-forest-100" strokeWidth="1.5" strokeDasharray="3 3" />
      
      {/* Circular Arrow 1 - Top/Right Clockwise */}
      <path
        d="M20 5C27.18 5 33 10.82 33 18C33 19.8 32.63 21.52 31.96 23.08"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      {/* Arrowhead 1 */}
      <path
        d="M29.5 24.5L32.2 23.2L34.5 25.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Circular Arrow 2 - Bottom/Left Return Loop */}
      <path
        d="M20 35C12.82 35 7 29.18 7 22C7 20.2 7.37 18.48 8.04 16.92"
        stroke="#A9BEA0"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      {/* Arrowhead 2 */}
      <path
        d="M10.5 15.5L7.8 16.8L5.5 14.5"
        stroke="#A9BEA0"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Sprouting Leaf (The ReUse Core) */}
      <path
        d="M20 27C20 27 26 23.5 26 16.5C26 13 23.5 13 20 13C16.5 13 14 13 14 16.5C14 23.5 20 27 20 27Z"
        fill="#3F7955"
      />
      {/* Center vein */}
      <path
        d="M20 14V26"
        stroke="#F7F6EF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Leaf lateral vein */}
      <path
        d="M20 19L23 16.5"
        stroke="#F7F6EF"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  showTagline = true,
  className,
  theme = 'auto',
}) => {
  const pixelSizes = {
    sm: 24,
    md: 36,
    lg: 44,
    xl: 56,
  };

  const textStyles = {
    sm: { title: 'text-lg', sub: 'text-[9px]' },
    md: { title: 'text-2xl', sub: 'text-[11px]' },
    lg: { title: 'text-3xl', sub: 'text-xs' },
    xl: { title: 'text-4xl', sub: 'text-sm' },
  };

  const currentTheme =
    theme === 'light'
      ? { text: 'text-white', sub: 'text-sage-200', markText: 'text-white' }
      : { text: 'text-brand-primary', sub: 'text-brand-muted', markText: 'text-brand-primary' };

  if (variant === 'icon') {
    return (
      <div className={cn('inline-flex items-center justify-center text-brand-primary', className)}>
        <LogoMark size={pixelSizes[size]} className={currentTheme.markText} />
      </div>
    );
  }

  return (
    <div className={cn('inline-flex items-center gap-3 select-none', className)}>
      <div className="relative flex items-center justify-center p-1 rounded-2xl bg-white shadow-soft-xs border border-brand-border">
        <LogoMark size={pixelSizes[size]} className={currentTheme.markText} />
      </div>

      <div className="flex flex-col">
        <span
          className={cn(
            'font-display font-extrabold tracking-tight leading-none',
            textStyles[size].title,
            currentTheme.text
          )}
        >
          ReUse<span className="text-brand-secondary">Hub</span>
        </span>
        {variant === 'full' && showTagline && (
          <span
            className={cn(
              'font-medium tracking-wide mt-0.5',
              textStyles[size].sub,
              currentTheme.sub
            )}
          >
            Give Every Product a Second Life
          </span>
        )}
      </div>
    </div>
  );
};
