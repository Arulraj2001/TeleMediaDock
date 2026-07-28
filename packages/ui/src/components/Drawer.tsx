'use client';

import React from 'react';

import { ChevronDown, Pause, Play, X, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { Progress } from './Progress';

export interface QueueItem {
  id: string;
  fileName: string;
  fileSize: string;
  progress: number;
  status: 'queued' | 'downloading' | 'completed' | 'failed' | 'paused';
  speed?: string;
  error?: string;
}

export interface DrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  items: QueueItem[];
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onCancel?: (id: string) => void;
  onRetry?: (id: string) => void;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onToggle,
  items,
  onPause,
  onResume,
  onCancel,
  onRetry,
}) => {
  const activeCount = items.filter((i) => i.status === 'downloading' || i.status === 'queued').length;

  return (
    <div
      className={cn(
        'fixed bottom-14 left-0 right-0 z-40 bg-[#FFFFFF] dark:bg-[#111827] border-t border-[#E2E8F0] dark:border-[#243047] shadow-xl transition-all duration-200 motion-reduce:transition-none',
        isOpen ? 'max-h-72' : 'max-h-11'
      )}
    >
      {/* Header Bar */}
      <button
        onClick={onToggle}
        className="w-full h-11 px-4 flex items-center justify-between bg-[#F1F5F9] dark:bg-[#172033] text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
      >
        <div className="flex items-center gap-2">
          <span>Download Queue</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#4F46E5] text-white">
              {activeCount} active
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-200 motion-reduce:transition-none',
            isOpen ? 'rotate-0' : 'rotate-180'
          )}
        />
      </button>

      {/* Item List */}
      {isOpen && (
        <div className="overflow-y-auto max-h-60 p-3 space-y-3">
          {items.length === 0 ? (
            <p className="text-xs text-center text-[#64748B] dark:text-[#94A3B8] py-4">
              No downloads in queue.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-[10px] border border-[#E2E8F0] dark:border-[#243047] bg-[#F8FAFC] dark:bg-[#090E1A] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="truncate max-w-[200px] text-[#0F172A] dark:text-[#F8FAFC]">
                    {item.fileName}
                  </span>
                  <span className="text-[#64748B] dark:text-[#94A3B8]">{item.fileSize}</span>
                </div>

                <Progress value={item.progress} size="sm" />

                <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                  <span>{item.speed ? `${item.speed} • ${item.status}` : item.status}</span>
                  <div className="flex items-center gap-1">
                    {item.status === 'downloading' && onPause && (
                      <button onClick={() => onPause(item.id)} aria-label="Pause download">
                        <Pause className="w-3.5 h-3.5 hover:text-[#0F172A] dark:hover:text-[#F8FAFC]" />
                      </button>
                    )}
                    {item.status === 'paused' && onResume && (
                      <button onClick={() => onResume(item.id)} aria-label="Resume download">
                        <Play className="w-3.5 h-3.5 hover:text-[#0F172A] dark:hover:text-[#F8FAFC]" />
                      </button>
                    )}
                    {item.status === 'failed' && onRetry && (
                      <button onClick={() => onRetry(item.id)} aria-label="Retry download">
                        <RefreshCw className="w-3.5 h-3.5 hover:text-[#0F172A] dark:hover:text-[#F8FAFC]" />
                      </button>
                    )}
                    {onCancel && (
                      <button onClick={() => onCancel(item.id)} aria-label="Cancel download">
                        <X className="w-3.5 h-3.5 hover:text-[#DC2626]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Mandatory UI Privacy Statement */}
      <div className="px-4 py-2 border-t border-[#E2E8F0] dark:border-[#243047] bg-[#F8FAFC] dark:bg-[#090E1A] text-[11px] text-[#64748B] dark:text-[#94A3B8] flex items-center justify-between">
        <span>Media downloads directly to your device and is not uploaded to MediaDock.</span>
        <span className="font-semibold text-[#10B981]">100% Local</span>
      </div>
    </div>
  );
};

