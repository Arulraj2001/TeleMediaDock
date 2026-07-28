'use client';

import React, { useState } from 'react';
import { SearchInput } from './SearchInput';
import { Tabs } from './Tabs';
import { Select } from './Select';
import { Button } from './Button';
import { MediaTypeIcon } from './MediaTypeIcon';
import { FileSize } from './FileSize';
import { DateTime } from './DateTime';
import { Card } from './Card';
import {
  Download,
  Trash2,
  FileJson,
  FolderOpen,
  History,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import type { MediaType } from '@mediadock/shared';


export interface LocalHistoryItem {
  id: string;
  filename: string;
  mediaType: MediaType;
  size: number;
  status: 'completed' | 'failed' | 'cancelled' | 'queued' | 'downloading';
  createdAt: number;
  error?: string;
}

export interface HistoryExplorerProps {
  items: LocalHistoryItem[];
  onDeleteRecord?: (id: string) => void;
  onClearAll?: () => void;
  onExportJson?: () => void;
  onOpenDownloadsFolder?: () => void;
  onRedownload?: (item: LocalHistoryItem) => void;
}

export const HistoryExplorer: React.FC<HistoryExplorerProps> = ({
  items,
  onDeleteRecord,
  onClearAll,
  onExportJson,
  onOpenDownloadsFolder,
  onRedownload,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const categoryTabs = [
    { id: 'all', label: 'All' },
    { id: 'image', label: 'Images' },
    { id: 'video', label: 'Videos' },
    { id: 'audio', label: 'Audio' },
    { id: 'document', label: 'Docs' },
  ];

  const filteredItems = items.filter((item) => {
    if (activeCategory !== 'all' && item.mediaType !== activeCategory) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchValue.trim()) {
      if (!item.filename.toLowerCase().includes(searchValue.toLowerCase())) return false;
    }
    return true;
  });

  const getStatusBadge = (status: LocalHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#16A34A]">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#DC2626]">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#64748B]">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return <span className="text-[10px] font-semibold text-[#4F46E5] capitalize">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3 p-3 select-none">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#4F46E5]" />
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">Local Download History</h2>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FolderOpen className="w-3.5 h-3.5" />}
            onClick={onOpenDownloadsFolder}
            title="Open Browser Downloads Page"
          >
            Folder
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileJson className="w-3.5 h-3.5" />}
            onClick={onExportJson}
            title="Export History JSON"
          >
            Export
          </Button>

          {onClearAll && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />}
              onClick={onClearAll}
              title="Clear History"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <SearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue('')}
            placeholder="Search history by filename..."
            className="flex-1"
          />

          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'completed', label: 'Completed' },
                { value: 'failed', label: 'Failed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
          </div>
        </div>

        <Tabs
          tabs={categoryTabs}
          activeTab={activeCategory}
          onChange={setActiveCategory}
          variant="pills"
        />
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredItems.length === 0 ? (
          <Card className="p-8 flex flex-col items-center justify-center text-center text-[#64748B] space-y-2">
            <History className="w-8 h-8 opacity-50" />
            <p className="text-xs font-semibold">No Local History Found</p>
            <p className="text-[11px]">Download records will appear here automatically.</p>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2.5 rounded-[12px] border border-[#E2E8F0] dark:border-[#243047] bg-white dark:bg-[#111827] hover:border-[#4F46E5] transition-all"
            >
              <div className="w-9 h-9 rounded-[8px] bg-[#F1F5F9] dark:bg-[#172033] flex items-center justify-center shrink-0">
                <MediaTypeIcon type={item.mediaType} className="w-4 h-4 text-[#4F46E5]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                  {item.filename}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                  <FileSize bytes={item.size} />
                  <span>•</span>
                  <DateTime timestamp={item.createdAt} />
                  <span>•</span>
                  {getStatusBadge(item.status)}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {onRedownload && (
                  <button
                    onClick={() => onRedownload(item)}
                    title="Download File Again"
                    className="p-1.5 rounded-[6px] text-[#64748B] hover:text-[#4F46E5] hover:bg-[#F1F5F9] dark:hover:bg-[#172033] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}

                {onDeleteRecord && (
                  <button
                    onClick={() => onDeleteRecord(item.id)}
                    title="Delete History Entry"
                    className="p-1.5 rounded-[6px] text-[#64748B] hover:text-[#DC2626] hover:bg-[#F1F5F9] dark:hover:bg-[#172033] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
