import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom' | 'left' | 'right';
  duration?: number;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 0.06,
  className = '',
  animateBy = 'words',
  direction = 'top',
  duration = 0.55,
}) => {
  const elements = useMemo(() => {
    return animateBy === 'words' ? text.split(' ') : text.split('');
  }, [text, animateBy]);

  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const yOffset = direction === 'top' ? -18 : direction === 'bottom' ? 18 : 0;
  const xOffset = direction === 'left' ? -18 : direction === 'right' ? 18 : 0;

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {elements.map((segment, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: yOffset, x: xOffset }}
          animate={inView ? { filter: 'blur(0px)', opacity: 1, y: 0, x: 0 } : {}}
          transition={{
            duration,
            delay: i * delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block whitespace-pre"
        >
          {segment}
          {animateBy === 'words' && i < elements.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </span>
  );
};

export default BlurText;
