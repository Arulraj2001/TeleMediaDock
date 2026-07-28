'use client';

import React from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { FileSize } from './FileSize';
import { DateTime } from './DateTime';
import { CopyCheck, FileText } from 'lucide-react';


export interface DuplicatePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string;
  size?: number;
  existingTimestamp?: number | string;
  onSkip: () => void;
  onRename: () => void;
  onRedownload: () => void;
}

export const DuplicatePromptModal: React.FC<DuplicatePromptModalProps> = ({
  isOpen,
  onClose,
  filename,
  size,
  existingTimestamp,
  onSkip,
  onRename,
  onRedownload,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Duplicate Media File Detected">
      <div className="space-y-4 py-2 select-none">
        <div className="flex items-center gap-3 p-3 rounded-[12px] bg-[#EEF2FF] dark:bg-[#1E1B4B]/40 border border-[#C7D2FE] dark:border-[#3730A3]">
          <CopyCheck className="w-6 h-6 text-[#4F46E5] shrink-0" />
          <div className="text-xs text-[#3730A3] dark:text-[#A5B4FC]">
            <p className="font-semibold">Already Saved to Device</p>
            <p className="mt-0.5">
              An identical media item has already been downloaded previously.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-[12px] bg-[#F8FAFC] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#243047] space-y-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
            <FileText className="w-4 h-4 text-[#4F46E5]" />
            <span className="truncate">{filename}</span>
          </div>
          <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8] pt-1 border-t border-[#E2E8F0] dark:border-[#243047]">
            <span>File Size:</span>
            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              <FileSize bytes={size} />
            </span>
          </div>
          {existingTimestamp && (
            <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
              <span>Previously Downloaded:</span>
              <DateTime timestamp={existingTimestamp} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button variant="primary" size="sm" onClick={onSkip} className="w-full">
            Skip Duplicate (Recommended)
          </Button>
          <Button variant="outline" size="sm" onClick={onRename} className="w-full">
            Save with Number (e.g. filename (1).png)
          </Button>
          <Button variant="ghost" size="sm" onClick={onRedownload} className="w-full text-[#64748B]">
            Download Duplicate Again
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
