'use client';

import React from 'react';
import { FolderDown, Settings } from 'lucide-react';

import { PRODUCT_NAME, type UserPlanTier } from '@mediadock/shared';
import { PlanBadge } from './PlanBadge';
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
  tier = 'free',
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
    <header className="flex flex-col border-b border-[#E2E8F0] dark:border-[#243047] bg-[#FFFFFF] dark:bg-[#111827] px-3.5 py-2.5 shrink-0 select-none">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[8px] bg-[#4F46E5] flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
            <FolderDown className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            {PRODUCT_NAME}
          </span>
          <PlanBadge tier={tier} />
        </div>

        <div className="flex items-center gap-1.5">
          {queueCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#4F46E5] text-white">
              {queueCount} in queue
            </span>
          )}

          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="p-1.5 rounded-[8px] text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172033] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F1F5F9] dark:border-[#172033] text-xs">
        <div className="flex items-center gap-1.5 min-w-0 pr-2">
          <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px] font-medium shrink-0">Chat:</span>
          <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">
            {chatLabel}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
          <span className={cn('w-2 h-2 rounded-full', statusColors[connectionStatus].split(' ')[0])} />
          <span className="text-[#64748B] dark:text-[#94A3B8] font-medium">
            {statusLabels[connectionStatus]}
          </span>
        </div>
      </div>
    </header>
  );
};
