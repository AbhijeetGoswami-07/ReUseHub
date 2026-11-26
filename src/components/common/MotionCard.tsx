import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface MotionCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
}

export const MotionCard: React.FC<MotionCardProps> = ({
  children,
  className = '',
  hoverScale = 1.015,
  ...rest
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ y: -4, scale: hoverScale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default MotionCard;
