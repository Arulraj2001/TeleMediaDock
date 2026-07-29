'use client';

import React from 'react';
import { Download, MoreVertical, ExternalLink, Copy } from 'lucide-react';
import { Checkbox } from './Checkbox';
import { MediaTypeIcon } from './MediaTypeIcon';
import { FileSize } from './FileSize';
import { DateTime } from './DateTime';
import { DropdownMenu } from './DropdownMenu';
import { IconButton } from './IconButton';
import type { MediaType } from '@mediadock/shared';
import { cn } from '../lib/utils';

export interface MediaItemCardData {
  id: string;
  type: MediaType;
  filename: string;
  size?: number;
  timestamp?: string | number;
  srcUrl?: string;
  senderLabel?: string;
  isRestricted?: boolean;
}

export interface MediaItemCardProps {
  item: MediaItemCardData;
  viewMode?: 'grid' | 'list' | 'adaptive';
  isSelected?: boolean;
  isMultiSelect?: boolean;
  onSelectToggle?: (id: string) => void;
  onDownload?: (item: MediaItemCardData) => void;
  onInspect?: (item: MediaItemCardData) => void;
}

export const MediaItemCard: React.FC<MediaItemCardProps> = ({
  item,
  viewMode = 'grid',
  isSelected = false,
  isMultiSelect = false,
  onSelectToggle,
  onDownload,
  onInspect,
}) => {
  const isImageOrVideo = item.type === 'image' || item.type === 'video' || item.type === 'gif';
  const effectiveMode = viewMode === 'adaptive' ? (isImageOrVideo ? 'grid' : 'list') : viewMode;

  const menuItems = [
    {
      id: 'download',
      label: 'Download File',
      icon: <Download className="w-3.5 h-3.5" />,
      onClick: () => onDownload?.(item),
    },
    {
      id: 'copy',
      label: 'Copy Filename',
      icon: <Copy className="w-3.5 h-3.5" />,
      onClick: () => {
        if (typeof navigator !== 'undefined') {
          navigator.clipboard.writeText(item.filename);
        }
      },
    },
    ...(onInspect
      ? [
          {
            id: 'inspect',
            label: 'Inspect Element',
            icon: <ExternalLink className="w-3.5 h-3.5" />,
            onClick: () => onInspect(item),
          },
        ]
      : []),
  ];

  if (effectiveMode === 'list') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-2.5 rounded-[12px] border bg-[#FFFFFF] dark:bg-[#111827] transition-all hover:border-[#4F46E5] select-none',
          isSelected
            ? 'border-[#4F46E5] ring-1 ring-[#4F46E5] bg-[#4F46E5]/5 dark:bg-[#4F46E5]/10'
            : 'border-[#E2E8F0] dark:border-[#243047]'
        )}
      >
        {isMultiSelect && (
          <Checkbox
            checked={isSelected}
            onChange={() => onSelectToggle?.(item.id)}
            aria-label={`Select ${item.filename}`}
          />
        )}

        <div className="w-9 h-9 rounded-[8px] bg-[#F1F5F9] dark:bg-[#172033] flex items-center justify-center shrink-0">
          <MediaTypeIcon type={item.type} className="w-4 h-4 text-[#4F46E5]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">
            {item.filename}
          </p>
          <div className="flex min-w-0 items-center gap-2 overflow-hidden text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            <FileSize bytes={item.size} />
            {item.timestamp && (
              <>
                <span>•</span>
                <DateTime timestamp={item.timestamp} />
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <IconButton
            icon={<Download className="w-4 h-4" />}
            size="sm"
            variant="ghost"
            ariaLabel="Download media"
            onClick={() => onDownload?.(item)}
          />

          <DropdownMenu
            trigger={
              <IconButton
                icon={<MoreVertical className="w-4 h-4" />}
                size="sm"
                variant="ghost"
                ariaLabel="More options"
              />
            }
            items={menuItems}
          />
        </div>
      </div>
    );
  }

  // Grid Mode Layout
  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-[12px] border bg-[#FFFFFF] dark:bg-[#111827] overflow-hidden transition-all hover:shadow-md select-none',
        isSelected
          ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]'
          : 'border-[#E2E8F0] dark:border-[#243047]'
      )}
    >
      {/* Thumbnail or Fallback Media Preview */}
      <div className="relative aspect-4/3 bg-[#F1F5F9] dark:bg-[#172033] flex items-center justify-center overflow-hidden">
        {item.srcUrl && isImageOrVideo ? (
          <img
            src={item.srcUrl}
            alt={item.filename}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-[#64748B] dark:text-[#94A3B8]">
            <MediaTypeIcon type={item.type} className="w-8 h-8 text-[#4F46E5]" />
            <span className="text-[10px] uppercase font-bold tracking-wider">{item.type}</span>
          </div>
        )}

        {/* Top Overlay Badge & Checkbox */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {isMultiSelect ? (
            <div className="pointer-events-auto bg-white/90 dark:bg-black/90 p-1 rounded-[6px]">
              <Checkbox
                checked={isSelected}
                onChange={() => onSelectToggle?.(item.id)}
                aria-label={`Select ${item.filename}`}
              />
            </div>
          ) : (
            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-[6px] bg-black/60 text-white backdrop-blur-xs">
              {item.type}
            </span>
          )}
        </div>

        {/* Hover Quick Action Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <IconButton
            icon={<Download className="w-4 h-4" />}
            variant="primary"
            size="sm"
            ariaLabel="Download file"
            onClick={() => onDownload?.(item)}
          />
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="flex min-w-0 items-center justify-between gap-2 p-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] truncate">
            {item.filename}
          </p>
          <div className="flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            <FileSize bytes={item.size} />
            {item.timestamp && (
              <>
                <span>•</span>
                <DateTime timestamp={item.timestamp} />
              </>
            )}
          </div>
        </div>

        <DropdownMenu
          trigger={
            <IconButton
              icon={<MoreVertical className="w-3.5 h-3.5" />}
              size="sm"
              variant="ghost"
              ariaLabel="More options"
            />
          }
          items={menuItems}
        />
      </div>
    </div>
  );
};
