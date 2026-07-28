'use client';

import React from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { PlanBadge } from './PlanBadge';
import { FREE_BATCH_LIMIT } from '@mediadock/shared';
import { Zap, CheckCircle2 } from 'lucide-react';

export interface BatchLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadFirst20: () => void;
  onUpgrade: () => void;
  selectedCount: number;
}

export const BatchLimitModal: React.FC<BatchLimitModalProps> = ({
  isOpen,
  onClose,
  onDownloadFirst20,
  onUpgrade,
  selectedCount,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Free Tier Batch Limit Reached">
      <div className="space-y-4 py-2 select-none">
        <div className="flex items-center gap-3 p-3.5 rounded-[12px] bg-[#EEF2FF] dark:bg-[#1E1B4B]/40 border border-[#C7D2FE] dark:border-[#3730A3]">
          <div className="w-10 h-10 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                {selectedCount} Items Selected
              </span>
              <PlanBadge tier="free" />
            </div>
            <p className="text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Free plans support up to {FREE_BATCH_LIMIT} items per batch download. Individual one-click downloading remains completely unlimited.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-[12px] bg-[#F8FAFC] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#243047] space-y-2 text-xs">
          <div className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] flex items-center justify-between">
            <span>Pro Tier Batch Benefits</span>
            <PlanBadge tier="pro" />
          </div>
          <ul className="space-y-1.5 text-[#64748B] dark:text-[#94A3B8]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Download up to 100 items per batch operation</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Advanced date range & size range filters</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>File extension & duplicate media detection</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button variant="primary" size="md" className="w-full" onClick={onUpgrade}>
            Upgrade to Pro for Larger Batches
          </Button>
          <Button variant="outline" size="sm" className="w-full" onClick={onDownloadFirst20}>
            Download First {FREE_BATCH_LIMIT} Items
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
