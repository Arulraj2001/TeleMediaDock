'use client';

import React from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { FileSize } from './FileSize';
import { AlertTriangle, HardDrive } from 'lucide-react';

export interface LargeBatchWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemCount: number;
  totalSizeBytes?: number;
}

export const LargeBatchWarningModal: React.FC<LargeBatchWarningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemCount,
  totalSizeBytes,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Confirm Large Batch Download">
      <div className="space-y-4 py-2 select-none">
        <div className="flex items-center gap-3 p-3 rounded-[12px] bg-[#FEF3C7] dark:bg-[#78350F]/40 border border-[#FCD34D] dark:border-[#92400E]">
          <AlertTriangle className="w-6 h-6 text-[#D97706] shrink-0" />
          <div className="text-xs text-[#92400E] dark:text-[#FDE68A]">
            <p className="font-semibold">Large Batch Operation</p>
            <p className="mt-0.5">
              You are about to queue {itemCount} files for download.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-[12px] bg-[#F8FAFC] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#243047] space-y-2 text-xs">
          <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
            <span>Total Items:</span>
            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{itemCount} files</span>
          </div>
          {totalSizeBytes !== undefined && (
            <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
              <span>Estimated Known Size:</span>
              <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                <FileSize bytes={totalSizeBytes} />
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 pt-2 border-t border-[#E2E8F0] dark:border-[#243047] text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            <HardDrive className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Files will download directly to your default browser downloads directory.</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={onConfirm}>
            Proceed with Download
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
