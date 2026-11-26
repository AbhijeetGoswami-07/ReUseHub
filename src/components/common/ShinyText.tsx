import React, { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

type Easing = 'smooth' | 'linear' | 'snappy';
type Trigger = 'loop' | 'hover' | 'view';

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
  easing?: Easing;
  trigger?: Trigger;
  yoyo?: boolean;
  followPointer?: boolean;
  pauseOnHover?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface Settings {
  color: string;
  shineColor: string;
  speed: number;
  delay: number;
  angle: number;
  shineWidth: number;
  softness: number;
  bands: number;
  glow: number;
  sign: number;
  ease: (t: number) => number;
  trigger: Trigger;
  yoyo: boolean;
  followPointer: boolean;
  pauseOnHover: boolean;
  disabled: boolean;
}

const EASINGS: Record<Easing, (t: number) => number> = {
  linear: t => t,
  smooth: t => 0.5 - Math.cos(Math.PI * t) / 2,
  snappy: t => (t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2)
};
const TRIGGERS: Trigger[] = ['loop', 'hover', 'view'];
const FALLOFF = [0, 0.2, 0.4, 0.6, 0.8, 1];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

let paint: CanvasRenderingContext2D | null = null;

const parseColor = (value: string): number[] | null => {
  if (typeof document === 'undefined') return null;
  if (!paint) paint = document.createElement('canvas').getContext('2d');
  if (!paint) return null;
  paint.fillStyle = '#000000';
  paint.fillStyle = value;
  const resolved = String(paint.fillStyle);
  if (resolved.startsWith('#')) {
    return [1, 3, 5].map(i => parseInt(resolved.slice(i, i + 2), 16)).concat(1);
  }
  const parts = resolved.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return null;
  return [Number(parts[0]), Number(parts[1]), Number(parts[2]), parts.length > 3 ? Number(parts[3]) : 1];
};

const blend = (from: number[], to: number[], amount: number) => {
  const channel = (a: number, b: number) =>
    Math.round(Math.pow(Math.pow(a / 255, 2.2) * (1 - amount) + Math.pow(b / 255, 2.2) * amount, 1 / 2.2) * 255);
  const alpha = from[3] * (1 - amount) + to[3] * amount;
  if (alpha <= 0) return 'rgba(0, 0, 0, 0)';
  const weigh = (a: number, b: number) => (a * from[3] * (1 - amount) + b * to[3] * amount) / alpha;
  const r = from[3] === to[3] ? channel(from[0], to[0]) : Math.round(weigh(from[0], to[0]));
  const g = from[3] === to[3] ? channel(from[1], to[1]) : Math.round(weigh(from[1], to[1]));
  const b = from[3] === to[3] ? channel(from[2], to[2]) : Math.round(weigh(from[2], to[2]));
  return `rgba(${r}, ${g}, ${b}, ${Math.round(alpha * 1000) / 1000})`;
};

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  children,
  color,
  shineColor,
  speed = 2.4,
  delay = 0.5,
  angle = 120,
  shineWidth = 40,
  softness = 0.8,
  bands = 1,
  glow = 0,
  direction = 'left',
  easing = 'smooth',
  trigger = 'loop',
  yoyo = false,
  followPointer = false,
  pauseOnHover = false,
  disabled = false,
  className = '',
  style
}) => {
  const isDarkTarget = className.includes('text-white') || className.includes('text-cream') || className.includes('text-emerald-100');
  const resolvedColor = color ?? (isDarkTarget ? '#ffffff' : '#234B35');
  const resolvedShineColor = shineColor ?? (isDarkTarget ? '#a7f3d0' : '#34D399');

  const rootRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const settingsRef = useRef<Settings | null>(null);
  const syncRef = useRef<(() => void) | null>(null);
  const content = children ?? text;

  settingsRef.current = {
    color: resolvedColor,
    shineColor: resolvedShineColor,
    speed: Math.max(0.1, speed),
    delay: Math.max(0, delay),
    angle,
    shineWidth: clamp(shineWidth, 2, 200),
    softness: clamp(softness, 0, 1),
    bands: clamp(Math.round(bands), 1, 3),
    glow: clamp(glow, 0, 1),
    sign: direction === 'right' ? 1 : -1,
    ease: EASINGS[easing as Easing] ?? EASINGS.smooth,
    trigger: TRIGGERS.includes(trigger as Trigger) ? (trigger as Trigger) : 'loop',
    yoyo,
    followPointer,
    pauseOnHover,
    disabled
  };

  useEffect(() => {
    syncRef.current?.();
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = {
      pos: null as number | null,
      vel: 0,
      phase: 'idle',
      from: 0,
      to: 0,
      start: 0,
      duration: 1,
      resume: 0,
      flip: false,
      inside: false,
      target: 0,
      visible: true,
      seen: false,
      colors: ''
    };
    let base: number[] | null = null;
    let shine: number[] | null = null;
    let clear: number[] | null = null;
    let raf = 0;
    let timer = 0;
    let last = 0;
    let alive = true;

    const extent = () => {
      const s = settingsRef.current!;
      const rad = (s.angle * Math.PI) / 180;
      const span = Math.abs(Math.sin(rad)) + Math.abs(Math.cos(rad));
      return (span * 100) / 2 + s.shineWidth;
    };
    const entry = () => -extent() * settingsRef.current!.sign;
    const exit = () => extent() * settingsRef.current!.sign;

    const sweep = (from: number, to: number, now: number) => {
      state.phase = 'sweep';
      state.from = from;
      state.to = to;
      state.start = now;
      state.duration = settingsRef.current!.speed * 1000;
    };

    const draw = () => {
      const s = settingsRef.current;
      if (!s || !alive) return;
      const key = `${s.color}-${s.shineColor}-${s.softness}`;
      if (key !== state.colors) {
        base = parseColor(s.color);
        shine = parseColor(s.shineColor);
        clear = shine ? [shine[0], shine[1], shine[2], 0] : null;
        state.colors = key;
      }
      if (!base || !shine || !clear) return;
      if (s.disabled || state.pos === null) {
        root.style.backgroundImage = `linear-gradient(${s.color}, ${s.color})`;
        if (glowRef.current) glowRef.current.style.backgroundImage = 'none';
        return;
      }

      const rad = (s.angle * Math.PI) / 180;
      const deg = (s.angle % 360 + 360) % 360;
      const span = Math.abs(Math.sin(rad)) + Math.abs(Math.cos(rad));
      const width = s.shineWidth;
      const stops: string[] = [`${s.color} 0%`];

      for (let i = 0; i < s.bands; i++) {
        const spread = (s.bands - 1) * width * 1.5;
        const center = state.pos - spread / 2 + i * width * 1.5;
        const low = center - width / 2;
        const high = center + width / 2;
        if (high < -50 || low > 150) continue;
        const start = ((low + 50) / 100) * span;
        const end = ((high + 50) / 100) * span;
        FALLOFF.forEach((step, idx) => {
          const at = start + (end - start) * (idx / (FALLOFF.length - 1));
          const colorVal = blend(base!, shine!, step * s.softness);
          stops.push(`${colorVal} ${(at * 100).toFixed(2)}%`);
        });
      }
      stops.push(`${s.color} 100%`);
      const grad = `linear-gradient(${deg}deg, ${stops.join(', ')})`;
      root.style.backgroundImage = grad;
      if (glowRef.current && s.glow > 0) {
        glowRef.current.style.backgroundImage = grad;
        glowRef.current.style.opacity = String(s.glow);
      }
    };

    const tick = (now: number) => {
      if (!alive) return;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0.016;
      last = now;
      const s = settingsRef.current!;

      if (s.disabled) {
        draw();
        return;
      }

      if (s.followPointer && state.inside) {
        if (state.pos === null) state.pos = state.target;
        const stiffness = 220;
        state.vel += ((state.target - state.pos) * stiffness - state.vel * 2 * Math.sqrt(stiffness)) * dt;
        state.pos += state.vel * dt;
        state.phase = 'follow';
        draw();
        raf = requestAnimationFrame(tick);
        return;
      }

      if (state.phase === 'sweep') {
        const t = clamp((now - state.start) / state.duration, 0, 1);
        state.pos = state.from + (state.to - state.from) * s.ease(t);
        draw();
        if (t < 1) {
          raf = requestAnimationFrame(tick);
          return;
        }
        if (s.trigger !== 'loop' || reduce) {
          state.phase = 'idle';
          state.pos = null;
          draw();
          return;
        }
        state.phase = 'wait';
        state.resume = now + s.delay * 1000;
      }

      if (state.phase === 'wait') {
        if (!state.visible) return;
        if (now < state.resume) {
          window.clearTimeout(timer);
          timer = window.setTimeout(wake, state.resume - now);
          return;
        }
        sweep(entry(), exit(), now);
        raf = requestAnimationFrame(tick);
        return;
      }

      if (state.phase === 'idle' && s.trigger === 'loop' && !reduce && state.visible) {
        sweep(entry(), exit(), now);
        raf = requestAnimationFrame(tick);
      }
    };

    const wake = () => {
      if (raf || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      state.inside = true;
      if (!settingsRef.current?.disabled && state.phase === 'idle' && !reduce) {
        sweep(entry(), exit(), performance.now());
      }
      wake();
    };

    const onLeave = () => {
      state.inside = false;
      wake();
    };

    const observer = new IntersectionObserver(entries => {
      const visible = entries.some(item => item.isIntersecting);
      state.visible = visible;
      if (visible) wake();
    });
    observer.observe(root);

    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);

    draw();
    wake();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      observer.disconnect();
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <span
      ref={rootRef}
      className={`relative inline-block bg-no-repeat [background-size:100%_100%] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] ${className}`}
      style={{ backgroundImage: `linear-gradient(${resolvedColor}, ${resolvedColor})`, ...style }}
    >
      {content}
      {glow > 0 ? (
        <span
          ref={glowRef}
          className="absolute inset-0 bg-no-repeat [background-size:100%_100%] bg-clip-text [-webkit-background-clip:text] [filter:blur(0.14em)] pointer-events-none select-none"
          aria-hidden="true"
        >
          {content}
        </span>
      ) : null}
    </span>
  );
};

export default ShinyText;
