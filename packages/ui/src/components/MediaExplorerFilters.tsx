'use client';

import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Checkbox } from './Checkbox';
import { Select } from './Select';
import { PlanBadge } from './PlanBadge';
import type { UserPlanTier } from '@mediadock/shared';

export interface FilterState {
  startDate?: string;
  endDate?: string;
  minSizeMb?: number;
  extension?: string;
  downloadedStatus?: 'all' | 'downloaded' | 'not_downloaded';
  duplicatesOnly?: boolean;
}

export interface MediaExplorerFiltersProps {
  tier?: UserPlanTier;
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  onUpgradeTrigger?: () => void;
}

export const MediaExplorerFilters: React.FC<MediaExplorerFiltersProps> = ({
  tier = 'free',
  filters,
  onFilterChange,
  onReset,
  onUpgradeTrigger,
}) => {
  const isPro = tier === 'pro';

  return (
    <Card className="p-3.5 space-y-3 bg-[#F8FAFC] dark:bg-[#172033]/60 select-none border-b border-[#E2E8F0] dark:border-[#243047]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">Advanced Filters</span>
          {!isPro && <PlanBadge tier="pro" />}
        </div>
        <button
          onClick={onReset}
          className="text-xs text-[#4F46E5] dark:text-[#818CF8] hover:underline font-medium"
        >
          Reset All
        </button>
      </div>

      {!isPro ? (
        <div className="p-3 rounded-[10px] bg-[#EEF2FF] dark:bg-[#1E1B4B]/40 border border-[#C7D2FE] dark:border-[#3730A3] text-center space-y-2">
          <p className="text-xs text-[#3730A3] dark:text-[#A5B4FC] font-medium">
            Date range, file extension, downloaded status, and duplicate detection filters require Pro.
          </p>
          <Button variant="primary" size="sm" onClick={onUpgradeTrigger}>
            Upgrade to Pro
          </Button>
        </div>
      ) : (
        <div className="space-y-3 pt-1 text-xs">
          {/* Extension Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[#64748B] dark:text-[#94A3B8] font-medium">File Extension</label>
            <Input
              value={filters.extension || ''}
              onChange={(e) => onFilterChange({ extension: e.target.value })}
              placeholder="e.g. pdf, mp4, png"
            />
          </div>

          {/* Downloaded Status */}
          <div className="flex flex-col gap-1">
            <label className="text-[#64748B] dark:text-[#94A3B8] font-medium">Download Status</label>
            <Select
              value={filters.downloadedStatus || 'all'}
              onChange={(e) => onFilterChange({ downloadedStatus: e.target.value as 'all' | 'downloaded' | 'not_downloaded' })}

              options={[
                { value: 'all', label: 'All Media Items' },
                { value: 'downloaded', label: 'Downloaded Only' },
                { value: 'not_downloaded', label: 'Not Downloaded Only' },
              ]}
            />
          </div>

          {/* Duplicates Checkbox */}
          <Checkbox
            label="Show Duplicates Only"
            checked={filters.duplicatesOnly || false}
            onChange={(e) => onFilterChange({ duplicatesOnly: e.target.checked })}
          />

        </div>
      )}
    </Card>
  );
};
