import React, { useRef, useState, useCallback } from 'react';

export type SpotlightShape = 'circle' | 'beam';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  spotlightColor?: string;
  intensity?: number;
  spotlightSize?: number;
  softness?: number;
  shape?: SpotlightShape;
  borderGlow?: number;
  proximity?: number;
  smoothing?: number;
  ambient?: boolean;
  flare?: boolean;
  grain?: number;
  theme?: 'light' | 'dark';
}

const THEMES = {
  light: {
    color: 'rgba(35, 75, 53, 0.12)',
    border: 'rgba(35, 75, 53, 0.18)',
    surface: '#ffffff',
    shadow: '0 4px 20px -2px rgba(35, 75, 53, 0.05)',
  },
  dark: {
    color: 'rgba(169, 190, 160, 0.18)',
    border: 'rgba(169, 190, 160, 0.22)',
    surface: '#18241D',
    shadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
  },
};

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  style,
  spotlightColor,
  intensity = 0.25,
  spotlightSize = 320,
  shape = 'circle',
  borderGlow = 0.6,
  theme = 'light',
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const palette = THEMES[theme] ?? THEMES.light;
  const activeColor = spotlightColor ?? palette.color;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    onMouseMove?.(e);
  }, [onMouseMove]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    onMouseEnter?.(e);
  }, [onMouseEnter]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  }, [onMouseLeave]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative isolate overflow-hidden rounded-2xl transition-all duration-300 ${className}`}
      style={{
        backgroundColor: palette.surface,
        boxShadow: palette.shadow,
        ...style,
      }}
      {...rest}
    >
      {/* Interactive Spotlight Radial Gradient Layer */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? intensity * 2.2 : 0,
          background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${activeColor}, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Subtle Border Glow on Hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl border transition-opacity duration-300 z-10"
        style={{
          borderColor: palette.border,
          opacity: isHovered ? borderGlow : 0.6,
        }}
        aria-hidden="true"
      />

      {/* Card Content */}
      <div className="relative z-20 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
