import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'loading' | 'error';
}

let toastListener: ((toast: ToastData) => void) | null = null;
let removeListener: ((id: string) => void) | null = null;

export function showToast(message: string, type: 'success' | 'loading' | 'error' = 'success', duration = 3000): string {
  const id = Math.random().toString(36).slice(2);
  toastListener?.({ id, message, type });
  if (type !== 'loading') {
    setTimeout(() => removeListener?.(id), duration);
  }
  return id;
}

export function dismissToast(id: string) {
  removeListener?.(id);
}

export const ToastProvider: React.FC = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    toastListener = (toast) => setToasts((prev) => [...prev, toast]);
    removeListener = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
    return () => {
      toastListener = null;
      removeListener = null;
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 20 }}
            className="flex items-center gap-3 bg-bg-surface rounded-xl shadow-lg border border-border-subtle px-4 py-3 min-w-[260px]"
          >
            {t.type === 'success' && <CheckCircle2 size={18} className="text-accent-primary shrink-0" />}
            {t.type === 'error' && <AlertTriangle size={18} className="text-accent-red shrink-0" />}
            {t.type === 'loading' && (
              <div className="w-4 h-4 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin shrink-0" />
            )}
            <span className="text-sm text-text-primary flex-1">{t.message}</span>
            <button onClick={() => removeListener?.(t.id)} className="text-text-tertiary hover:text-text-primary">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
