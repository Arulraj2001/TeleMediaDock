'use client';

import React from 'react';
import { MessageSquareText, Settings } from 'lucide-react';

import type { UserPlanTier } from '@mediadock/shared';
import { cn } from '../lib/utils';

export interface MediaExplorerHeaderProps {
  chatLabel?: string;
  connectionStatus: 'connected' | 'disconnected' | 'scanning';
  tier?: UserPlanTier;
  queueCount?: number;
  onOpenSettings?: () => void;
}

export const MediaExplorerHeader: React.FC<MediaExplorerHeaderProps> = ({
  chatLabel = 'No Active Chat',
  connectionStatus,
  queueCount = 0,
  onOpenSettings,
}) => {
  const statusColors = {
    connected: 'bg-[#10B981] text-[#10B981]',
    disconnected: 'bg-[#EF4444] text-[#EF4444]',
    scanning: 'bg-[#F59E0B] text-[#F59E0B] animate-pulse',
  };

  const statusLabels = {
    connected: 'Connected',
    disconnected: 'Disconnected',
    scanning: 'Scanning DOM...',
  };

  return (
    <header className="flex min-w-0 items-center justify-between gap-3 border-b border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2.5 dark:border-[#243047] dark:bg-[#111827] shrink-0 select-none">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#EEF2FF] text-[#4F46E5] dark:bg-[#1E1B4B]">
          <MessageSquareText className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-[#64748B] dark:text-[#94A3B8]">
            Active chat
          </span>
          <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">
            {chatLabel}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <div className="flex items-center gap-1.5 rounded-full bg-[#F8FAFC] px-2 py-1 text-[10px] dark:bg-[#090E1A]">
          <span className={cn('w-2 h-2 rounded-full', statusColors[connectionStatus].split(' ')[0])} />
          <span className="hidden font-medium text-[#64748B] dark:text-[#94A3B8] min-[360px]:inline">
            {statusLabels[connectionStatus]}
          </span>
        </div>
        {queueCount > 0 && (
          <span className="rounded-full bg-[#4F46E5] px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {queueCount}
          </span>
        )}
        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="rounded-[8px] p-2 text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] dark:hover:bg-[#172033] dark:hover:text-[#F8FAFC]"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
