'use client';

import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Input,
  SearchInput,
  Select,
  Checkbox,
  Switch,
  RadioGroup,
  Tabs,
  Badge,
  Tooltip,
  Dialog,
  Sheet,
  Drawer,
  Alert,
  Skeleton,
  Progress,
  CircularProgress,
  MediaTypeIcon,
  FileSize,
  DateTime,
  PlanBadge,
  SponsorCard,
  UpgradeCard,
  SidePanelShell,
  ThemeProvider,
  useTheme,
} from '@mediadock/ui';
import { Settings, Trash2 } from 'lucide-react';


function ComponentGalleryContent() {
  const { resolvedTheme, setTheme } = useTheme();

  // Interactive Component States
  const [searchValue, setSearchValue] = useState('');
  const [selectValue, setSelectValue] = useState('date_desc');
  const [checkboxValue, setCheckboxValue] = useState(true);
  const [switchValue, setSwitchValue] = useState(true);
  const [radioValue, setRadioValue] = useState('chat');
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [progressVal, setProgressVal] = useState(65);
  const [sidePanelTab, setSidePanelTab] = useState<'media' | 'downloads' | 'history' | 'rules' | 'settings'>('media');

  const sponsorSample = {
    id: 'sp_1',
    label: 'Sponsored' as const,
    title: 'Cloud Tools for Telegram Creators',
    description: 'Manage, convert, and archive authorized attachments securely in local storage.',
    imageUrl: 'https://cdn.mediadock.app/banner.webp',
    destinationUrl: 'https://mediadock.app/pro',
    campaignStart: '2026-01-01T00:00:00Z',
    campaignEnd: '2026-12-31T23:59:59Z',
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#243047] pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MediaDock Component Gallery</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Interactive design system showcase matching WCAG AA contrast and shape language standards.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          Theme: {resolvedTheme.toUpperCase()}
        </Button>
      </div>

      {/* Buttons & Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-slate-200 dark:border-slate-800 pb-2">
          Buttons & Icon Buttons
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button variant="primary" isLoading>
            Loading State
          </Button>
          <IconButton icon={<Settings className="w-5 h-5" />} ariaLabel="Settings" variant="outline" />
          <IconButton icon={<Trash2 className="w-5 h-5" />} ariaLabel="Delete" variant="danger" />
        </div>
      </section>

      {/* Inputs & Form Controls */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-slate-200 dark:border-slate-800 pb-2">
          Inputs & Selection Controls
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input placeholder="Standard text input..." />
            <SearchInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue('')}
            />
            <Select
              label="Sort By"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              options={[
                { label: 'Date (Newest First)', value: 'date_desc' },
                { label: 'Date (Oldest First)', value: 'date_asc' },
                { label: 'File Size (Largest)', value: 'size_desc' },
              ]}
            />
          </div>
          <div className="space-y-4 bg-slate-100 dark:bg-slate-900 p-4 rounded-[12px]">
            <Checkbox
              label="Automatically skip duplicate downloads"
              checked={checkboxValue}
              onChange={(e) => setCheckboxValue(e.target.checked)}
            />
            <Switch
              label="Enable Encrypted Sync"
              checked={switchValue}
              onCheckedChange={setSwitchValue}
            />
            <RadioGroup
              name="routing"
              value={radioValue}
              onChange={setRadioValue}
              options={[
                { label: 'Route by Chat Name', value: 'chat', description: 'Downloads/Telegram/{ChatName}/' },
                { label: 'Route by Media Type', value: 'type', description: 'Downloads/Telegram/{Type}/' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Badges, Tabs & Tooltips */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-slate-200 dark:border-slate-800 pb-2">
          Badges, Tabs & Badging
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <PlanBadge tier="free" />
          <PlanBadge tier="pro" />
          <Badge variant="sponsored">Sponsored</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Tooltip content="Custom Filename Template Token">
            <Badge variant="default" className="cursor-help">{`{chat_name}`}</Badge>
          </Tooltip>
        </div>
        <Tabs
          tabs={[
            { id: 'all', label: 'All Items', count: 142 },
            { id: 'images', label: 'Images', count: 80 },
            { id: 'videos', label: 'Videos', count: 20 },
            { id: 'docs', label: 'Documents', count: 42 },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </section>

      {/* Progress & Formatting */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-slate-200 dark:border-slate-800 pb-2">
          Progress Bars & Formatting
        </h2>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <Progress value={progressVal} showLabel />
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" onClick={() => setProgressVal(Math.max(0, progressVal - 15))}>
                -15%
              </Button>
              <Button size="sm" variant="outline" onClick={() => setProgressVal(Math.min(100, progressVal + 15))}>
                +15%
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-around">
            <CircularProgress value={progressVal} />
            <div className="flex flex-col text-sm space-y-1">
              <div className="flex items-center gap-2">
                <MediaTypeIcon type="video" />
                <FileSize bytes={52428800} />
              </div>
              <div className="text-xs text-slate-500">
                Created: <DateTime timestamp={Date.now() - 3600000} format="relative" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals, Sheets & Alerts */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-slate-200 dark:border-slate-800 pb-2">
          Modals, Sheets & Feedback States
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setIsDialogOpen(true)}>Open Dialog Modal</Button>
          <Button variant="secondary" onClick={() => setIsSheetOpen(true)}>
            Open Side Sheet
          </Button>
        </div>

        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Confirm Download Batch"
          description="You are about to save 20 files (142 MB) to your local disk."
        >
          <p className="text-sm text-slate-400">
            Files will be saved into <code className="bg-slate-800 px-1 py-0.5 rounded">Downloads/Telegram/Design/</code> using template <code className="bg-slate-800 px-1 py-0.5 rounded">{`{chat}_{date}_{index}`}</code>.
          </p>
        </Dialog>

        <Sheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title="Filename Template Builder"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-400">Drag and drop tokens to build dynamic path routes.</p>
            <Input defaultValue="{chat}/{type}/{date}_{index}.{ext}" />
          </div>
        </Sheet>

        <div className="grid md:grid-cols-2 gap-4">
          <Alert variant="info" title="Privacy Standard Enforced">
            No media data leaves your browser. All file streams route locally.
          </Alert>
          <Alert variant="warning" title="Batch Limit Reached (Free)">
            Free tier is capped at 20 items per batch. Upgrade to Pro for unlimited batching.
          </Alert>
        </div>
      </section>

      {/* Cards & States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-slate-200 dark:border-slate-800 pb-2">
          Sponsor & Upgrade Cards
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <SponsorCard data={sponsorSample} onDismiss={() => {}} />
          <UpgradeCard />
        </div>
      </section>

      {/* Extension Side Panel Shell Preview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-slate-200 dark:border-slate-800 pb-2">
          Extension Side Panel Layout Shell
        </h2>
        <div className="border border-slate-300 dark:border-slate-800 rounded-[14px] overflow-hidden max-w-[420px] mx-auto shadow-2xl h-[500px] relative">
          <SidePanelShell activeTab={sidePanelTab} onTabChange={setSidePanelTab} queueCount={2}>
            <div className="p-4 space-y-4">
              <SearchInput placeholder="Search 142 items in chat..." />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
              <Alert variant="info" title="Chat Connected">
                Telegram Web chat detected.
              </Alert>
            </div>
            <Drawer
              isOpen={isDrawerOpen}
              onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
              items={[
                { id: '1', fileName: 'design_spec.pdf', fileSize: '12.4 MB', progress: 75, status: 'downloading', speed: '4.2 MB/s' },
              ]}
            />
          </SidePanelShell>
        </div>
      </section>
    </div>
  );
}

export default function ComponentGalleryPage() {
  return (
    <ThemeProvider>
      <ComponentGalleryContent />
    </ThemeProvider>
  );
}
