import React from 'react';
import type { CSSProperties, ReactNode } from 'react';

export interface ShinyTextProps {
  text?: string;
  children?: ReactNode;
  color?: string;
  shineColor?: string;
  speed?: number;
  delay?: number;
  angle?: number;
  shineWidth?: number;
  softness?: number;
  bands?: number;
  glow?: number;
  direction?: 'left' | 'right';
  easing?: 'smooth' | 'linear' | 'snappy';
  trigger?: 'loop' | 'hover' | 'view';
  yoyo?: boolean;
  followPointer?: boolean;
  pauseOnHover?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  children,
  color = '#1b4332',
  shineColor = '#10b981',
  speed = 3,
  className = '',
  style,
  disabled = false,
}) => {
  const content = text || children;

  if (disabled) {
    return <span className={className} style={{ color, ...style }}>{content}</span>;
  }

  return (
    <span
      className={`inline-block relative overflow-hidden bg-clip-text text-transparent animate-shine ${className}`}
      style={{
        backgroundImage: `linear-gradient(115deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
        backgroundSize: '250% 100%',
        animation: `shine ${speed}s ease-in-out infinite`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        ...style,
      }}
    >
      {content}
    </span>
  );
};

export default ShinyText;
