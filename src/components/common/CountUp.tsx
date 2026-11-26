import React, { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

export interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  separator?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 2,
  delay = 0,
  decimals = 0,
  separator = ',',
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(from, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setValue(latest);
      },
    });

    return () => controls.stop();
  }, [isInView, from, to, duration, delay]);

  const formattedNumber = value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};

export default CountUp;
