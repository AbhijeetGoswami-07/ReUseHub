import React, { useEffect } from 'react';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideHeader?: boolean;
  className?: string;
  bodyClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  hideHeader = false,
  className = '',
  bodyClassName = '',
}) => {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-7xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-primary/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={cn(
          'relative w-full rounded-2xl bg-white shadow-soft-lg border border-brand-border z-10 my-4 sm:my-8 text-left overflow-hidden',
          'transition-all transform animate-in zoom-in-95 duration-200',
          sizeClasses[size] || sizeClasses.md,
          className
        )}
      >
        {/* Header */}
        {!hideHeader && (title || description) && (
          <div className="flex items-start justify-between p-5 sm:p-6 border-b border-brand-border bg-white">
            <div className="space-y-1 pr-6">
              {title && (
                <h2 className="text-lg sm:text-xl font-display font-bold text-brand-text leading-snug">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-xs sm:text-sm text-brand-muted">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-forest-100/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div
          className={cn(
            'p-5 sm:p-6 max-h-[80vh] overflow-y-auto',
            hideHeader && 'p-0 max-h-[90vh]',
            bodyClassName
          )}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 sm:p-6 border-t border-brand-border bg-forest-50/40 rounded-b-2xl flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
