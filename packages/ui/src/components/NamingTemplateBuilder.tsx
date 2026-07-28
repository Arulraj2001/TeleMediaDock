'use client';

import React, { useMemo, useRef } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Select } from './Select';
import { PlanBadge } from './PlanBadge';
import {
  AVAILABLE_TOKENS,
  FREE_NAMING_PRESETS,
  PRO_NAMING_PRESETS,
  parseNamingTemplate,
  type UserPlanTier,
} from '@mediadock/shared';
import { Folder, FileText, Eye, Sparkles } from 'lucide-react';

export interface NamingTemplateBuilderProps {
  tier?: UserPlanTier;
  template: string;
  folderTemplate: string;
  onChange: (template: string, folderTemplate: string) => void;
  onUpgradeTrigger?: () => void;
}

export const NamingTemplateBuilder: React.FC<NamingTemplateBuilderProps> = ({
  tier = 'free',
  template,
  folderTemplate,
  onChange,
  onUpgradeTrigger: _onUpgradeTrigger,
}) => {
  const isPro = tier === 'pro';
  const inputRef = useRef<HTMLInputElement>(null);

  const presets = useMemo(() => {
    return [...FREE_NAMING_PRESETS, ...(isPro ? PRO_NAMING_PRESETS : [])];
  }, [isPro]);

  // Fictional sample context for real-time live preview
  const fictionalSampleContext = useMemo(
    () => ({
      chatLabel: 'Tech_Community',
      senderLabel: 'Alex_Dev',
      originalFilename: 'architecture_diagram.png',
      mediaType: 'image' as const,
      timestamp: '2026-07-28T14:30:00Z',
      index: 1,
    }),
    []
  );

  // Compute live preview output path
  const livePreviewPath = useMemo(() => {
    try {
      return parseNamingTemplate(template, folderTemplate, fictionalSampleContext);
    } catch {
      return 'MediaDock/sample_output.png';
    }
  }, [template, folderTemplate, fictionalSampleContext]);


  const handleInsertToken = (token: string) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || template.length;
      const end = inputRef.current.selectionEnd || template.length;
      const updated = template.slice(0, start) + token + template.slice(end);
      onChange(updated, folderTemplate);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(start + token.length, start + token.length);
        }
      }, 0);
    } else {
      onChange(template + token, folderTemplate);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      onChange(preset.template, preset.folderTemplate);
    }
  };

  return (
    <Card className="p-4 space-y-4 bg-[#FFFFFF] dark:bg-[#111827] select-none border border-[#E2E8F0] dark:border-[#243047]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#4F46E5]" />
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">Smart File Naming & Folders</h3>
        </div>
        <PlanBadge tier={tier} />
      </div>

      {/* Preset Selector */}
      <div className="space-y-1 text-xs">
        <label className="font-semibold text-[#64748B] dark:text-[#94A3B8]">Template Presets</label>
        <Select
          value={presets.find((p) => p.template === template && p.folderTemplate === folderTemplate)?.id || 'custom'}
          onChange={(e) => handleSelectPreset(e.target.value)}
          options={[
            ...presets.map((p) => ({ value: p.id, label: `${p.label} (${p.template})` })),
            { value: 'custom', label: 'Custom Template...' },
          ]}
        />
      </div>

      {/* Folder Subpath Template */}
      <div className="space-y-1 text-xs">
        <label className="font-semibold text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
          <Folder className="w-3.5 h-3.5 text-[#4F46E5]" />
          <span>Folder Structure</span>
        </label>
        <Input
          value={folderTemplate}
          onChange={(e) => onChange(template, e.target.value)}
          placeholder="e.g. MediaDock/{chat}/{type}/"
          disabled={!isPro && folderTemplate !== 'MediaDock/'}
        />
        {!isPro && (
          <p className="text-[11px] text-[#D97706] mt-0.5">
            Custom folder subpaths ({'{chat}'}, {'{type}'}, {'{year}'}) require Pro.
          </p>
        )}
      </div>

      {/* Filename Template Input */}
      <div className="space-y-1 text-xs">
        <label className="font-semibold text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#4F46E5]" />
          <span>Filename Pattern</span>
        </label>
        <Input
          ref={inputRef}
          value={template}
          onChange={(e) => onChange(e.target.value, folderTemplate)}
          placeholder="e.g. {chat}_{date}_{index}"
        />
      </div>

      {/* Token Click-to-Insert Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
          Click to Insert Variable Token:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_TOKENS.map((t) => (
            <button
              key={t.token}
              type="button"
              onClick={() => handleInsertToken(t.token)}
              title={t.description}
              className="px-2 py-1 rounded-[6px] text-xs font-mono font-medium bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#4F46E5] dark:text-[#818CF8] hover:bg-[#4F46E5] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              {t.token}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Live Preview Bar */}
      <div className="p-3 rounded-[10px] bg-[#F8FAFC] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#243047] space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
          <span className="font-semibold flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Live Output Preview</span>
          </span>
          <span className="text-[10px] italic">Sample Data</span>
        </div>
        <div className="p-2 rounded-[6px] bg-white dark:bg-[#090E1A] border border-[#E2E8F0] dark:border-[#243047] text-xs font-mono font-semibold text-[#10B981] break-all select-all">
          {livePreviewPath}
        </div>
      </div>
    </Card>
  );
};
