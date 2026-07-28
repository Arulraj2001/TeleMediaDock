'use client';

import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { Input } from './Input';
import { PlanBadge } from './PlanBadge';
import { NamingTemplateBuilder } from './NamingTemplateBuilder';
import { RetentionSettingsCard } from './RetentionSettingsCard';
import { SponsorCard } from './SponsorCard';
import {
  Settings,
  Download,
  FileText,
  ShieldCheck,
  Heart,
  User,
  Info,
  ExternalLink,
  FileJson,
  CheckCircle2,
} from 'lucide-react';

import { PRODUCT_NAME, type UserPlanTier } from '@mediadock/shared';


export interface SettingsScreenProps {
  tier?: UserPlanTier;
  onClearLocalData?: () => void;
  onExportSettingsJson?: () => void;
  onUpgradeTrigger?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  tier = 'free',
  onClearLocalData,
  onExportSettingsJson,
  onUpgradeTrigger,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'general' | 'downloads' | 'naming' | 'privacy' | 'sponsors' | 'account' | 'about'
  >('general');

  // Form states
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
  const [language, setLanguage] = useState('en');
  const [autoOpenSidePanel, setAutoOpenSidePanel] = useState(true);
  const [showOverlayControl, setShowOverlayControl] = useState(true);

  const [baseFolder, setBaseFolder] = useState('MediaDock');
  const [concurrency, setConcurrency] = useState(2);
  const [confirmLargeBatches, setConfirmLargeBatches] = useState(true);
  const [duplicateStrategy, setDuplicateStrategy] = useState('ask');

  const [template, setTemplate] = useState('{chat}_{date}_{index}');
  const [folderTemplate, setFolderTemplate] = useState('MediaDock/');

  const [retentionPolicy, setRetentionPolicy] = useState<'indefinite' | '30_days' | '90_days' | 'clear_on_exit'>('indefinite');
  const [anonymousReporting, setAnonymousReporting] = useState(false);

  const [hideSponsors, setHideSponsors] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const subTabs = [
    { id: 'general', label: 'General', icon: <Settings className="w-4 h-4" /> },
    { id: 'downloads', label: 'Downloads', icon: <Download className="w-4 h-4" /> },
    { id: 'naming', label: 'Naming', icon: <FileText className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'sponsors', label: 'Sponsors', icon: <Heart className="w-4 h-4" /> },
    { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full space-y-4 p-4 select-none">
      {/* Sub-panel navigation tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#E2E8F0] dark:border-[#243047]">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as 'general' | 'downloads' | 'naming' | 'privacy' | 'sponsors' | 'account' | 'about')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-colors ${

              activeSubTab === tab.id
                ? 'bg-[#4F46E5] text-white'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] dark:hover:bg-[#172033]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* 1. General Settings */}
        {activeSubTab === 'general' && (
          <Card className="p-4 space-y-4 bg-white dark:bg-[#111827]">
            <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">General Preferences</h3>
            <div className="space-y-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#64748B]">Appearance Theme</label>
                <Select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'system' | 'light' | 'dark')}

                  options={[
                    { value: 'system', label: 'System Default' },
                    { value: 'light', label: 'Light Mode' },
                    { value: 'dark', label: 'Dark Mode' },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#64748B]">Display Language</label>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  options={[{ value: 'en', label: 'English (United States)' }]}
                />
              </div>

              <Checkbox
                label="Auto-open SidePanel when visiting Telegram Web"
                checked={autoOpenSidePanel}
                onChange={(e) => setAutoOpenSidePanel(e.target.checked)}
              />

              <Checkbox
                label="Display floating MediaDock Quick Save overlay button"
                checked={showOverlayControl}
                onChange={(e) => setShowOverlayControl(e.target.checked)}
              />
            </div>
          </Card>
        )}

        {/* 2. Downloads Settings */}
        {activeSubTab === 'downloads' && (
          <Card className="p-4 space-y-4 bg-white dark:bg-[#111827]">
            <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">Download Controls</h3>
            <div className="space-y-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#64748B]">Base Folder Name</label>
                <Input value={baseFolder} onChange={(e) => setBaseFolder(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <label className="font-semibold text-[#64748B]">Maximum Concurrency</label>
                  <span className="font-bold text-[#4F46E5]">{concurrency} Simultaneous</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={concurrency}
                  onChange={(e) => setConcurrency(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-[11px] text-[#64748B]">Default: 2 (Max browser safety cap: 4)</span>
              </div>

              <Checkbox
                label="Confirm before initiating large batch downloads (>10 files or >100 MB)"
                checked={confirmLargeBatches}
                onChange={(e) => setConfirmLargeBatches(e.target.checked)}
              />

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#64748B]">Default Duplicate File Behavior</label>
                <Select
                  value={duplicateStrategy}
                  onChange={(e) => setDuplicateStrategy(e.target.value)}
                  options={[
                    { value: 'ask', label: 'Ask Me Each Time (Recommended)' },
                    { value: 'skip', label: 'Skip Duplicate Files' },
                    { value: 'rename', label: 'Save with Number (e.g. file (1).png)' },
                  ]}
                />
              </div>
            </div>
          </Card>
        )}

        {/* 3. Naming Builder */}
        {activeSubTab === 'naming' && (
          <NamingTemplateBuilder
            tier={tier}
            template={template}
            folderTemplate={folderTemplate}
            onChange={(t, f) => {
              setTemplate(t);
              setFolderTemplate(f);
            }}
            onUpgradeTrigger={onUpgradeTrigger}
          />
        )}

        {/* 4. Privacy & Retention */}
        {activeSubTab === 'privacy' && (
          <div className="space-y-4">
            <RetentionSettingsCard
              policy={retentionPolicy}
              onChangePolicy={setRetentionPolicy}
              onClearNow={() => onClearLocalData?.()}
            />

            <Card className="p-4 space-y-3 bg-white dark:bg-[#111827] text-xs">
              <h4 className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Telemetry & Backup</h4>
              <Checkbox
                label="Send optional anonymous crash reports (No Telegram data or URLs)"
                checked={anonymousReporting}
                onChange={(e) => setAnonymousReporting(e.target.checked)}
              />
              <div className="pt-2 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<FileJson className="w-3.5 h-3.5" />}
                  onClick={onExportSettingsJson}
                >
                  Export Settings Backup JSON
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* 5. Sponsors */}
        {activeSubTab === 'sponsors' && (
          <div className="space-y-4">
            <Card className="p-4 space-y-3 bg-white dark:bg-[#111827] text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Sponsor Cards</span>
                {tier === 'free' && <PlanBadge tier="free" />}
              </div>
              <p className="text-[#64748B]">
                Sponsor cards support independent development of MediaDock. Sponsor requests do not transmit Telegram messages or user data.
              </p>
              <Checkbox
                label="Hide Sponsor Cards (Pro feature)"
                checked={hideSponsors}
                disabled={tier !== 'pro'}
                onChange={(e) => setHideSponsors(e.target.checked)}
              />
            </Card>

            <SponsorCard
              data={{
                id: 'sp_1',
                label: 'Sponsored',
                title: 'Antigravity Developer Tools',
                description: 'High-performance browser extension suite for modern web engineers.',
                imageUrl: 'https://cdn.mediadock.app/sponsor.png',
                destinationUrl: 'https://mediadock.app',
                campaignStart: '2026-01-01T00:00:00Z',
                campaignEnd: '2026-12-31T23:59:59Z',
              }}
            />


          </div>
        )}

        {/* 6. Account */}
        {activeSubTab === 'account' && (
          <Card className="p-4 space-y-4 bg-white dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#4F46E5]" />
                <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">Account & Entitlements</h3>
              </div>
              <PlanBadge tier={tier} />
            </div>

            {isSignedIn ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-[10px] bg-[#EEF2FF] dark:bg-[#1E1B4B]/40 text-[#4F46E5] flex items-center justify-between">
                  <span>Signed in as <strong>user@example.com</strong></span>
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                </div>
                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => setIsSignedIn(false)}>
                    Sign Out
                  </Button>
                  <Button variant="danger" size="sm">
                    Delete Account Data
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-center p-4 bg-[#F8FAFC] dark:bg-[#172033] rounded-[12px]">
                <p className="text-[#64748B]">
                  Account sign-in is optional and used solely to synchronize Pro subscription entitlements.
                </p>
                <Button variant="primary" size="md" className="mx-auto" onClick={() => setIsSignedIn(true)}>
                  Sign In to MediaDock
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* 7. About & Telegram Non-Affiliation Disclosure */}
        {activeSubTab === 'about' && (
          <Card className="p-4 space-y-4 bg-white dark:bg-[#111827] text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#4F46E5]" />
                <div>
                  <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{PRODUCT_NAME}</h3>
                  <p className="text-[11px] text-[#64748B]">Version 1.0.0 (Production Build)</p>
                </div>
              </div>
            </div>

            {/* Mandatory Non-Affiliation Disclosure */}
            <div className="p-3 rounded-[10px] bg-[#EEF2FF] dark:bg-[#1E1B4B]/40 border border-[#C7D2FE] text-[#3730A3] dark:text-[#A5B4FC] text-[11px] font-medium leading-relaxed">
              {PRODUCT_NAME} is an independent browser extension project and is not affiliated with, endorsed by, or sponsored by Telegram Messenger Inc.
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E2E8F0] dark:border-[#243047] text-[#64748B]">
              <div className="flex items-center justify-between">
                <span>Privacy Policy</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center justify-between">
                <span>Terms of Service</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center justify-between">
                <span>Open Source Licenses</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
