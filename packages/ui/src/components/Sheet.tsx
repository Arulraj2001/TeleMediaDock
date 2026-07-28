'use client';

import React, { useEffect } from 'react';

import { X } from 'lucide-react';
import { cn } from '../lib/utils';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  side?: 'right' | 'bottom';
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  side = 'right',
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positions = {
    right: 'right-0 top-0 bottom-0 w-full max-w-md border-l',
    bottom: 'bottom-0 left-0 right-0 max-h-[85vh] border-t rounded-t-[14px]',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={cn(
          'fixed z-50 bg-[#FFFFFF] dark:bg-[#111827] border-[#E2E8F0] dark:border-[#243047] text-[#0F172A] dark:text-[#F8FAFC] shadow-2xl flex flex-col',
          positions[side]
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] dark:border-[#243047]">
          <h2 className="text-sm font-semibold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close sheet"
            className="p-1 rounded-[8px] text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
};
