import React, { useEffect, useRef } from 'react';

export type SpotlightShape = 'circle' | 'beam';

export type SpotlightCardProps = React.HTMLAttributes<HTMLDivElement> & {
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
  theme?: 'dark' | 'light';
};

type Palette = { surface: string; border: string; shadow: string; light: string; fill: number; edge: number };

type Settings = {
  shape: SpotlightShape;
  fill: string;
  edge: string;
  size: number;
  intensity: number;
  borderGlow: number;
  proximity: number;
  smoothing: number;
  ambient: boolean;
  flare: boolean;
  grain: number;
};

const THEMES: Record<'dark' | 'light', Palette> = {
  dark: {
    surface: '#1B2E23',
    border: 'rgba(255, 255, 255, 0.12)',
    shadow: '0 24px 48px -24px rgba(0, 0, 0, 0.6)',
    light: '#52A372',
    fill: 1,
    edge: 1
  },
  light: {
    surface: '#ffffff',
    border: 'rgba(35, 75, 53, 0.12)',
    shadow: '0 1px 3px rgba(35, 75, 53, 0.05), 0 16px 36px -16px rgba(35, 75, 53, 0.12)',
    light: '#234B35',
    fill: 0.35,
    edge: 0.8
  }
};

const SHAPES: SpotlightShape[] = ['circle', 'beam'];

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const falloff = (color: string, softness: number) => {
  const soft = clamp(softness, 0, 1);
  const core = (1 - soft) ** 1.5 * 0.85;
  const stop = (alpha: number, at: number) =>
    `color-mix(in srgb, ${color} ${(alpha * 100).toFixed(2)}%, transparent) ${(at * 100).toFixed(2)}%`;
  const list = [stop(1, 0)];
  for (let i = 0; i <= 14; i++) {
    const t = core + ((1 - core) * i) / 14;
    const g = (t - core) / (1 - core);
    const smooth = 1 - g * g * (3 - 2 * g);
    const glow = Math.exp(-4.6 * g * g) * (1 - g ** 6);
    list.push(stop(smooth + (glow - smooth) * soft, t));
  }
  return list.join(', ');
};

const CARD =
  'relative isolate overflow-hidden rounded-2xl p-6 border border-[var(--spotlight-card-border)] [background-color:var(--spotlight-card-surface)] [box-shadow:var(--spotlight-card-shadow)] transition-all duration-300';

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  style,
  spotlightColor,
  intensity = 0.22,
  spotlightSize = 280,
  softness = 0.7,
  shape = 'circle',
  borderGlow = 0.8,
  proximity = 80,
  smoothing = 0.3,
  ambient = false,
  flare = true,
  grain = 0,
  theme = 'light',
  ...rest
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLSpanElement>(null);
  const grainRef = useRef<HTMLSpanElement>(null);
  const edgeRef = useRef<HTMLSpanElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const palette = THEMES[theme] ?? THEMES.light;
  const color = spotlightColor ?? palette.light;
  const form = SHAPES.includes(shape) ? shape : 'circle';
  const settings: Settings = {
    shape: form,
    fill: falloff(color, softness),
    edge: falloff(color, 1),
    size: Math.max(20, spotlightSize),
    intensity: clamp(intensity, 0, 1) * palette.fill,
    borderGlow: clamp(borderGlow, 0, 1) * palette.edge,
    proximity: Math.max(0, proximity),
    smoothing: clamp(smoothing, 0, 1),
    ambient,
    flare,
    grain: clamp(grain, 0, 1)
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    wakeRef.current?.();
  });

  useEffect(() => {
    const root = rootRef.current;
    const light = lightRef.current;
    const noise = grainRef.current;
    const edge = edgeRef.current;
    if (!root || !light || !noise || !edge) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = { x: 0, y: 0, presence: 0, flare: 0, time: Math.random() * 60, pressed: false, visible: true };
    const pointer = { x: 0, y: 0, active: false };
    const drawn = { light: '', edge: '', noise: '' };
    let raf = 0;
    let last = 0;
    let alive = true;

    const gradient = (s: Settings, size: number, x: number, y: number, stops: string) => {
      if (s.shape === 'beam') {
        const reach = Math.max(size * 0.6, y + size * 0.55);
        return `radial-gradient(${(size * 0.55).toFixed(1)}px ${reach.toFixed(1)}px at ${x.toFixed(1)}px 0px, ${stops})`;
      }
      return `radial-gradient(circle ${size.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, ${stops})`;
    };

    const paint = (s: Settings) => {
      const alpha = state.presence * (1 + state.flare * 0.35);
      const size = s.size * (1 + state.flare * 0.15);
      const inner = gradient(s, size, state.x, state.y, s.fill);
      const outer = gradient(s, size, state.x, state.y, s.edge);
      const showLight = alpha > 0 && s.intensity > 0;
      const showEdge = alpha > 0 && s.borderGlow > 0;
      const showNoise = showLight && s.grain > 0;

      if (showLight && (inner !== drawn.light || alpha !== Number(light.style.opacity))) {
        light.style.background = inner;
        light.style.opacity = (alpha * s.intensity).toFixed(3);
        drawn.light = inner;
      } else if (!showLight && drawn.light) {
        light.style.opacity = '0';
        drawn.light = '';
      }

      if (showEdge && (outer !== drawn.edge || alpha !== Number(edge.style.opacity))) {
        edge.style.background = outer;
        edge.style.opacity = (alpha * s.borderGlow).toFixed(3);
        drawn.edge = outer;
      } else if (!showEdge && drawn.edge) {
        edge.style.opacity = '0';
        drawn.edge = '';
      }

      if (showNoise && (inner !== drawn.noise || alpha !== Number(noise.style.opacity))) {
        noise.style.maskImage = inner;
        noise.style.opacity = (alpha * s.grain).toFixed(3);
        drawn.noise = inner;
      } else if (!showNoise && drawn.noise) {
        noise.style.opacity = '0';
        drawn.noise = '';
      }
    };

    const tick = (now: number) => {
      if (!alive) return;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0.016;
      last = now;
      const s = settingsRef.current;
      const rect = root.getBoundingClientRect();
      const px = pointer.x - rect.left;
      const py = pointer.y - rect.top;
      const inside = pointer.active && px >= -s.proximity && px <= rect.width + s.proximity && py >= -s.proximity && py <= rect.height + s.proximity;
      const target = inside ? 1 : 0;
      const tx = clamp(px, -s.size, rect.width + s.size);
      const ty = clamp(py, -s.size, rect.height + s.size);
      const rate = 1 - Math.exp(-dt / (s.smoothing * 0.3 + 0.02));

      state.x += (tx - state.x) * rate;
      state.y += (ty - state.y) * rate;
      const fade = 1 - Math.exp(-dt / (target > state.presence ? 0.1 : 0.32));
      state.presence += (target - state.presence) * fade;
      if (Math.abs(target - state.presence) < 0.002) state.presence = target;
      const press = state.pressed && s.flare && !reduce ? 1 : 0;
      state.flare += (press - state.flare) * (1 - Math.exp(-dt / (press ? 0.05 : 0.28)));
      if (Math.abs(press - state.flare) < 0.002) state.flare = press;

      paint(s);
      const moving = Math.abs(tx - state.x) > 0.1 || Math.abs(ty - state.y) > 0.1;
      const settled = !moving && state.presence === target && state.flare === press;
      if (!settled || (s.ambient && state.visible && !reduce)) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    wakeRef.current = wake;

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      if (state.presence > 0 || settingsRef.current.proximity > 0 || root.contains(event.target as Node | null)) wake();
    };
    const onOut = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      pointer.active = false;
      wake();
    };
    const onDown = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      state.pressed = true;
      wake();
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') pointer.active = false;
      if (!state.pressed && event.pointerType === 'mouse') return;
      state.pressed = false;
      wake();
    };

    const observer = new IntersectionObserver(entries => {
      state.visible = entries.some(entry => entry.isIntersecting);
      if (state.visible) wake();
    });
    observer.observe(root);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    document.addEventListener('pointerout', onOut);
    root.addEventListener('pointerdown', onDown);
    wake();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.removeEventListener('pointerout', onOut);
      root.removeEventListener('pointerdown', onDown);
      wakeRef.current = null;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${CARD}${className ? ` ${className}` : ''}`}
      style={
        {
          '--spotlight-card-surface': palette.surface,
          '--spotlight-card-border': palette.border,
          '--spotlight-card-shadow': palette.shadow,
          ...style
        } as React.CSSProperties
      }
      {...rest}
    >
      <span
        ref={lightRef}
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0"
        aria-hidden="true"
      />
      <span
        ref={grainRef}
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-[length:160px_160px] opacity-0 mix-blend-overlay"
        style={{ backgroundImage: NOISE }}
        aria-hidden="true"
      />
      {children}
      <span
        ref={edgeRef}
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] p-px opacity-0 [-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [-webkit-mask-composite:xor] [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]"
        aria-hidden="true"
      />
    </div>
  );
};

export default SpotlightCard;
