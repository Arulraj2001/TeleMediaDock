'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { Card } from './Card';
import type { TelegramVariant } from '@mediadock/shared';

export interface UnsupportedStateScreenProps {
  variant: TelegramVariant;
  adapterVersion: string;
  extensionVersion: string;
  onRetry?: () => void;
}

export const UnsupportedStateScreen: React.FC<UnsupportedStateScreenProps> = ({
  variant,
  adapterVersion,
  extensionVersion,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-[#FEF3C7] dark:bg-[#78350F]/40 flex items-center justify-center text-[#D97706] dark:text-[#FBBF24] mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <h2 className="text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
        Unsupported Telegram Layout
      </h2>

      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-sm mt-1 mb-6 leading-relaxed">
        Telegram Web may have updated its DOM layout structure. MediaDock has gracefully paused automatic media discovery to protect your session and privacy.
      </p>

      <Card className="w-full max-w-sm text-left mb-6 space-y-3 bg-[#F8FAFC] dark:bg-[#172033]/60">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#64748B] dark:text-[#94A3B8]">Detected Variant:</span>
          <Badge variant="warning">{variant.toUpperCase()}</Badge>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#64748B] dark:text-[#94A3B8]">Adapter Version:</span>
          <span className="font-mono text-[#0F172A] dark:text-[#F8FAFC]">v{adapterVersion}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#64748B] dark:text-[#94A3B8]">Extension Version:</span>
          <span className="font-mono text-[#0F172A] dark:text-[#F8FAFC]">v{extensionVersion}</span>
        </div>
      </Card>

      <div className="w-full max-w-sm space-y-3">
        {onRetry && (
          <Button
            variant="primary"
            size="md"
            className="w-full"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={onRetry}
          >
            Re-scan Page Layout
          </Button>
        )}

        <a
          href="https://mediadock.app/status"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-1.5 text-xs text-[#4F46E5] dark:text-[#818CF8] hover:underline font-medium pt-1"
        >
          <span>Check Adapter Updates</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="mt-8 flex items-center gap-1.5 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
        <span>100% Local Processing • No Page Text Recorded</span>
      </div>
    </div>
  );
};
