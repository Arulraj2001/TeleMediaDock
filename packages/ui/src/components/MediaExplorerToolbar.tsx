'use client';

import React from 'react';
import { SearchInput } from './SearchInput';
import { Tabs } from './Tabs';
import { Select } from './Select';
import { LayoutGrid, List, SlidersHorizontal, RefreshCw, CheckSquare, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

export type ViewMode = 'grid' | 'list' | 'adaptive';
export type SortOption = 'date_desc' | 'date_asc' | 'size_desc' | 'size_asc' | 'name_asc';

export interface MediaExplorerToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isMultiSelect: boolean;
  onToggleMultiSelect: () => void;
  onRefresh: () => void;
  onToggleFilters?: () => void;
  categoryCounts?: Record<string, number>;
}

export const MediaExplorerToolbar: React.FC<MediaExplorerToolbarProps> = ({
  searchValue,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  isMultiSelect,
  onToggleMultiSelect,
  onRefresh,
  onToggleFilters,
  categoryCounts = {},
}) => {
  const categoryTabs = [
    { id: 'all', label: 'All', count: categoryCounts.all },
    { id: 'image', label: 'Images', count: categoryCounts.image },
    { id: 'video', label: 'Videos', count: categoryCounts.video },
    { id: 'audio', label: 'Audio', count: categoryCounts.audio },
    { id: 'document', label: 'Docs', count: categoryCounts.document },
  ];

  return (
    <div className="flex min-w-0 flex-col gap-2.5 border-b border-[#E2E8F0] bg-[#FFFFFF] p-3 dark:border-[#243047] dark:bg-[#111827] shrink-0 select-none">
      {/* Search & Top Action Controls */}
      <div className="flex min-w-0 items-center gap-2">
        <SearchInput
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          placeholder="Search media by filename..."
          className="min-w-0 flex-1"
        />

        <button
          onClick={onRefresh}
          aria-label="Refresh media scan"
          title="Refresh media scan"
          className="p-2 rounded-[10px] border border-[#E2E8F0] dark:border-[#243047] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172033] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {onToggleFilters && (
          <button
            onClick={onToggleFilters}
            aria-label="Filter options"
            title="Filter options"
            className="p-2 rounded-[10px] border border-[#E2E8F0] dark:border-[#243047] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172033] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Media Type Tabs */}
      <Tabs
        tabs={categoryTabs}
        activeTab={activeCategory}
        onChange={onCategoryChange}
        variant="pills"
      />

      {/* Sort & Layout View Controls */}
      <div className="flex min-w-0 items-center justify-between gap-2 pt-0.5">
        <div className="min-w-0 flex-1 max-w-44">
          <Select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            options={[
              { value: 'date_desc', label: 'Date (Newest)' },
              { value: 'date_asc', label: 'Date (Oldest)' },
              { value: 'size_desc', label: 'Size (Largest)' },
              { value: 'size_asc', label: 'Size (Smallest)' },
              { value: 'name_asc', label: 'Name (A-Z)' },
            ]}
          />
        </div>

        <div className="flex items-center gap-1">
          {/* Multi-select toggle */}
          <button
            onClick={onToggleMultiSelect}
            aria-label="Multi-select items"
            title="Multi-select items"
            className={cn(
              'p-2 rounded-[10px] border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]',
              isMultiSelect
                ? 'border-[#4F46E5] bg-[#4F46E5] text-white'
                : 'border-[#E2E8F0] dark:border-[#243047] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#172033]'
            )}
          >
            <CheckSquare className="w-4 h-4" />
          </button>

          {/* View mode toggle */}
          <div className="flex items-center border border-[#E2E8F0] dark:border-[#243047] rounded-[10px] overflow-hidden p-0.5 bg-[#F8FAFC] dark:bg-[#090E1A]">
            <button
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
              title="Grid view"
              className={cn(
                'p-1.5 rounded-[8px] transition-colors',
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#172033] text-[#4F46E5] shadow-xs'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
              title="List view"
              className={cn(
                'p-1.5 rounded-[8px] transition-colors',
                viewMode === 'list'
                  ? 'bg-white dark:bg-[#172033] text-[#4F46E5] shadow-xs'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
              )}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('adaptive')}
              aria-label="Adaptive view"
              title="Adaptive view"
              className={cn(
                'p-1.5 rounded-[8px] transition-colors',
                viewMode === 'adaptive'
                  ? 'bg-white dark:bg-[#172033] text-[#4F46E5] shadow-xs'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
              )}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
