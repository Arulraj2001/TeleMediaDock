'use client';

import React from 'react';
import { Card } from './Card';
import { Select } from './Select';
import { Button } from './Button';
import { ShieldCheck, Trash2 } from 'lucide-react';

export type RetentionPolicyOption = 'indefinite' | '30_days' | '90_days' | 'clear_on_exit';

export interface RetentionSettingsCardProps {
  policy: RetentionPolicyOption;
  onChangePolicy: (policy: RetentionPolicyOption) => void;
  onClearNow: () => void;
}

export const RetentionSettingsCard: React.FC<RetentionSettingsCardProps> = ({
  policy,
  onChangePolicy,
  onClearNow,
}) => {
  return (
    <Card className="p-4 space-y-3 bg-[#FFFFFF] dark:bg-[#111827] select-none border border-[#E2E8F0] dark:border-[#243047]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">Data Retention & Local History</h3>
        </div>
      </div>

      <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
        MediaDock processes all downloads locally. No messages, media URLs, or downloaded file contents leave your browser.
      </p>

      <div className="space-y-1 text-xs">
        <label className="font-semibold text-[#64748B] dark:text-[#94A3B8]">Auto-Purge History</label>
        <Select
          value={policy}
          onChange={(e) => onChangePolicy(e.target.value as RetentionPolicyOption)}
          options={[
            { value: 'indefinite', label: 'Keep History Indefinitely' },
            { value: '30_days', label: 'Auto-purge after 30 Days' },
            { value: '90_days', label: 'Auto-purge after 90 Days' },
            { value: 'clear_on_exit', label: 'Clear History on Browser Exit' },
          ]}
        />
      </div>

      <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#243047] flex justify-end">
        <Button
          variant="danger"
          size="sm"
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          onClick={onClearNow}
        >
          Clear History Now
        </Button>
      </div>
    </Card>
  );
};
