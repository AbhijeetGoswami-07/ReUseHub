import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/utils/cn';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, title?: string, duration: number = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((message: string, title?: string) => addToast('success', message, title), [addToast]);
  const error = useCallback((message: string, title?: string) => addToast('error', message, title), [addToast]);
  const warning = useCallback((message: string, title?: string) => addToast('warning', message, title), [addToast]);
  const info = useCallback((message: string, title?: string) => addToast('info', message, title), [addToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      {/* Toast Render Container */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const typeConfigs = {
            success: {
              icon: CheckCircle2,
              style: 'border-emerald-200 bg-white text-brand-text',
              iconStyle: 'text-emerald-600',
              accent: 'bg-emerald-600',
            },
            error: {
              icon: AlertCircle,
              style: 'border-red-200 bg-white text-brand-text',
              iconStyle: 'text-red-600',
              accent: 'bg-red-600',
            },
            warning: {
              icon: AlertTriangle,
              style: 'border-amber-200 bg-white text-brand-text',
              iconStyle: 'text-amber-600',
              accent: 'bg-amber-600',
            },
            info: {
              icon: Info,
              style: 'border-sky-200 bg-white text-brand-text',
              iconStyle: 'text-sky-600',
              accent: 'bg-sky-600',
            },
          };

          const config = typeConfigs[toast.type];
          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto relative overflow-hidden rounded-xl border p-4 shadow-soft-md',
                'animate-in slide-in-from-right-5 fade-in duration-200 flex items-start gap-3',
                config.style
              )}
            >
              <div className={cn('w-2 absolute left-0 top-0 bottom-0', config.accent)} />
              <Icon className={cn('w-5 h-5 shrink-0 mt-0.5 ml-1', config.iconStyle)} />
              <div className="flex-1 space-y-0.5 text-left">
                {toast.title && (
                  <h4 className="text-xs font-bold text-brand-text">
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs text-brand-muted leading-relaxed">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-brand-muted hover:text-brand-text p-1 rounded transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
