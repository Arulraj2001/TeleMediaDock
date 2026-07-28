'use client';

import React, { useState } from 'react';

import { X, ExternalLink } from 'lucide-react';
import { SponsorCardSchema, type SponsorCard as SponsorCardType } from '@mediadock/validation';
import { Badge } from './Badge';
import { Card } from './Card';

export interface SponsorCardProps {
  data: SponsorCardType;
  onDismiss?: (id: string) => void;
}

export const SponsorCard: React.FC<SponsorCardProps> = ({ data, onDismiss }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Validate payload with Zod
  const parsed = SponsorCardSchema.safeParse(data);
  if (!parsed.success || isDismissed) {
    return null;
  }

  const sponsor = parsed.data;

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss(sponsor.id);
  };

  return (
    <Card className="p-3.5 bg-[#FFFFFF] dark:bg-[#111827] border-amber-200 dark:border-amber-900/50 shadow-sm relative space-y-2.5 group">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <Badge variant="sponsored">Sponsored</Badge>
        {onDismiss && (
          <button
            onClick={handleDismiss}
            aria-label="Dismiss sponsor card"
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Body Content */}
      <div className="flex items-start gap-3">
        {sponsor.imageUrl && (
          <img
            src={sponsor.imageUrl}
            alt={sponsor.title}
            className="w-12 h-12 rounded-[8px] object-cover shrink-0 border border-slate-200 dark:border-slate-800"
          />
        )}
        <div className="flex-1 space-y-1">
          <h4 className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] leading-snug">
            {sponsor.title}
          </h4>
          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
            {sponsor.description}
          </p>
        </div>
      </div>

      {/* Footer Link */}
      <a
        href={sponsor.destinationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-between w-full px-3 py-1.5 rounded-[8px] bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-[#4F46E5] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
      >
        <span>Learn More</span>
        <ExternalLink className="w-3 h-3" aria-hidden="true" />
      </a>
    </Card>
  );
};
