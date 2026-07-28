'use client';

import React, { useEffect } from 'react';

import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../lib/utils';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  variant = 'info',
  durationMs = 4000,
  onDismiss,
}) => {
  useEffect(() => {
    if (durationMs > 0) {
      const timer = setTimeout(() => onDismiss(id), durationMs);
      return () => clearTimeout(timer);
    }
  }, [id, durationMs, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#16A34A]" aria-hidden="true" />,
    warning: <AlertTriangle className="w-4 h-4 text-[#D97706]" aria-hidden="true" />,
    error: <AlertCircle className="w-4 h-4 text-[#DC2626]" aria-hidden="true" />,
    info: <Info className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />,
  };

  return (
    <div
      role="status"
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-[10px] border border-[#E2E8F0] dark:border-[#243047] bg-[#FFFFFF] dark:bg-[#111827] text-[#0F172A] dark:text-[#F8FAFC] shadow-lg text-xs font-medium animate-in slide-in-from-bottom-2 duration-150 motion-reduce:transition-none'
      )}
    >
      {icons[variant]}
      <span className="flex-1">{message}</span>
      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss toast notification"
        className="p-1 rounded-[4px] text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
