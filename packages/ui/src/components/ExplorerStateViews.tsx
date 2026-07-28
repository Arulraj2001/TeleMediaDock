'use client';

import React from 'react';
import {
  FolderDown,
  MessageSquare,
  Layers,
  ShieldAlert,
  KeyRound,
  ArrowUpCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { Skeleton } from './Skeleton';

export const NoTelegramTabState: React.FC<{ onOpenTab?: () => void }> = ({ onOpenTab }) => (
  <div className="flex flex-col items-center justify-center min-h-[350px] p-6 text-center">
    <div className="w-12 h-12 rounded-full bg-[#EEF2FF] dark:bg-[#1E1B4B] flex items-center justify-center text-[#4F46E5] mb-3">
      <FolderDown className="w-6 h-6" />
    </div>
    <h2 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Telegram Web Not Open</h2>
    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-xs mt-1 mb-5">
      Please open Telegram Web in an active browser tab to organize and download media.
    </p>
    <Button
      variant="primary"
      size="md"
      leftIcon={<ExternalLink className="w-4 h-4" />}
      onClick={onOpenTab}
    >
      Open Telegram Web
    </Button>
  </div>
);

export const NoChatSelectedState: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[350px] p-6 text-center">
    <div className="w-12 h-12 rounded-full bg-[#F1F5F9] dark:bg-[#172033] flex items-center justify-center text-[#64748B] dark:text-[#94A3B8] mb-3">
      <MessageSquare className="w-6 h-6" />
    </div>
    <h2 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">No Chat Selected</h2>
    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-xs mt-1">
      Open a conversation or channel inside Telegram Web to scan visible media.
    </p>
  </div>
);

export const EmptyMediaState: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
    <div className="w-12 h-12 rounded-full bg-[#F1F5F9] dark:bg-[#172033] flex items-center justify-center text-[#64748B] dark:text-[#94A3B8] mb-3">
      <Layers className="w-6 h-6" />
    </div>
    <h2 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">No Media Loaded</h2>
    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-xs mt-1 mb-4">
      No media files are currently loaded in the active chat view.
    </p>
    {onRefresh && (
      <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRefresh}>
        Re-scan View
      </Button>
    )}
  </div>
);

export const LoadingMediaState: React.FC = () => (
  <div className="p-4 space-y-3">
    <div className="grid grid-cols-2 gap-3">
      <Skeleton className="h-36 rounded-[12px]" />
      <Skeleton className="h-36 rounded-[12px]" />
      <Skeleton className="h-36 rounded-[12px]" />
      <Skeleton className="h-36 rounded-[12px]" />
    </div>
  </div>
);

export const RestrictedMediaState: React.FC = () => (
  <Card className="p-4 bg-[#FEF2F2] dark:bg-[#451A1A]/40 border-[#FCA5A5] dark:border-[#991B1B] text-center space-y-2">
    <div className="flex items-center justify-center gap-1.5 text-[#DC2626] font-semibold text-xs">
      <ShieldAlert className="w-4 h-4" />
      <span>Protected / Disappearing Media Ignored</span>
    </div>
    <p className="text-[11px] text-[#991B1B] dark:text-[#FCA5A5]">
      MediaDock respects privacy rules and skips disappearing timers, protected channel content, and restricted media.
    </p>
  </Card>
);

export const PermissionMissingState: React.FC<{ onRequest?: () => void }> = ({ onRequest }) => (
  <div className="flex flex-col items-center justify-center min-h-[350px] p-6 text-center">
    <div className="w-12 h-12 rounded-full bg-[#FEF3C7] dark:bg-[#78350F]/40 flex items-center justify-center text-[#D97706] mb-3">
      <KeyRound className="w-6 h-6" />
    </div>
    <h2 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Permissions Required</h2>
    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-xs mt-1 mb-5">
      MediaDock requires browser download permissions to save media directly to your device.
    </p>

    <Button variant="primary" size="md" onClick={onRequest}>
      Grant Permissions
    </Button>
  </div>
);

export const UpdateRequiredState: React.FC<{ onUpdate?: () => void }> = ({ onUpdate }) => (
  <div className="flex flex-col items-center justify-center min-h-[350px] p-6 text-center">
    <div className="w-12 h-12 rounded-full bg-[#EEF2FF] dark:bg-[#1E1B4B] flex items-center justify-center text-[#4F46E5] mb-3">
      <ArrowUpCircle className="w-6 h-6" />
    </div>
    <h2 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Extension Update Required</h2>
    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-xs mt-1 mb-5">
      Please update MediaDock to the latest version to ensure compatibility with recent Telegram Web updates.
    </p>
    <Button variant="primary" size="md" onClick={onUpdate}>
      Update MediaDock
    </Button>
  </div>
);
