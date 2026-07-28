import React, { useState, useEffect, useMemo } from 'react';
import {
  SidePanelShell,
  MediaExplorerHeader,
  MediaExplorerToolbar,
  MediaItemCard,
  MediaExplorerFilters,
  BatchLimitModal,
  LargeBatchWarningModal,
  NamingTemplateBuilder,
  HistoryExplorer,
  RetentionSettingsCard,
  Drawer,
  Button,
  Card,
  NoTelegramTabState,
  NoChatSelectedState,
  EmptyMediaState,
  LoadingMediaState,
  UnsupportedStateScreen,
  RestrictedMediaState,
  PermissionMissingState,
  UpdateRequiredState,
  type ViewMode,
  type SortOption,
  type FilterState,
  type MediaItemCardData,
  type QueueItem,
  type ExtensionTab,
  type LocalHistoryItem,
} from '@mediadock/ui';


import { FREE_BATCH_LIMIT, type UserPlanTier } from '@mediadock/shared';
import { batchQueueEngine } from '../../src/services/BatchQueueEngine';
import { HistoryManager, type RetentionPolicy } from '../../src/services/HistoryManager';
import { Info, Download, CheckSquare, XSquare } from 'lucide-react';


export default function App() {
  const [activeTabNav, setActiveTabNav] = useState<ExtensionTab>('media');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'scanning'>('scanning');
  const [chatLabel] = useState<string>('Tech Community');
  const [tier, setTier] = useState<UserPlanTier>('free');

  // Active view state machine
  const [viewState, setViewState] = useState<
    'no_tab' | 'no_chat' | 'empty' | 'loading' | 'unsupported' | 'restricted' | 'permission_missing' | 'update_required' | 'ready'
  >('ready');

  // Discovered Media state
  const [mediaItems] = useState<MediaItemCardData[]>([


    {
      id: 'demo_photo_1',
      type: 'image',
      filename: 'architecture_diagram_2026.png',
      size: 1548576,
      timestamp: Date.now() - 3600000,
      srcUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'demo_video_1',
      type: 'video',
      filename: 'demo_walkthrough.mp4',
      size: 14500000,
      timestamp: Date.now() - 7200000,
    },
    {
      id: 'demo_doc_1',
      type: 'document',
      filename: 'product_requirements.pdf',
      size: 345000,
      timestamp: Date.now() - 86400000,
    },
    {
      id: 'demo_audio_1',
      type: 'audio',
      filename: 'voice_note_update.ogg',
      size: 890000,
      timestamp: Date.now() - 172800000,
    },
  ]);

  // Toolbar & Filter state
  const [searchValue, setSearchValue] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOption, setSortOption] = useState<SortOption>('date_desc');
  const [viewMode, setViewMode] = useState<ViewMode>('adaptive');
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});

  // Naming & Folder settings state
  const [namingTemplate, setNamingTemplate] = useState('{chat}_{date}_{index}');
  const [folderTemplate, setFolderTemplate] = useState('MediaDock/');

  // Modals state
  const [isBatchLimitModalOpen, setIsBatchLimitModalOpen] = useState(false);
  const [isLargeBatchModalOpen, setIsLargeBatchModalOpen] = useState(false);
  const [pendingBatchItems, setPendingBatchItems] = useState<MediaItemCardData[]>([]);

  // Download Queue state
  const [queueDrawerOpen, setQueueDrawerOpen] = useState(false);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);


  // Subscribe to BatchQueueEngine
  useEffect(() => {
    const unsubscribe = batchQueueEngine.subscribe((jobs) => {
      const mapped: QueueItem[] = jobs.map((job) => ({
        id: job.id,
        fileName: job.filename,
        fileSize: job.size ? `${(job.size / 1024 / 1024).toFixed(1)} MB` : '1.5 MB',
        progress: job.progress,
        status: job.status === 'cancelled' ? 'failed' : (job.status as 'queued' | 'downloading' | 'completed' | 'failed' | 'paused'),


        error: job.error,
      }));
      setQueueItems(mapped);
    });
    return () => unsubscribe();
  }, []);

  // Inspect active tab URL on load
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab || !activeTab.url) return;
        const url = activeTab.url.toLowerCase();
        if (!url.includes('telegram.org')) {
          setViewState('no_tab');
          setConnectionStatus('disconnected');
        } else {
          setConnectionStatus('connected');
        }
      });
    }
  }, []);

  // Filter & Sort Calculations
  const filteredItems = useMemo(() => {
    return mediaItems
      .filter((item) => {
        if (activeCategory !== 'all' && item.type !== activeCategory) {
          return false;
        }
        if (searchValue.trim()) {
          const query = searchValue.toLowerCase();
          if (!item.filename.toLowerCase().includes(query)) {
            return false;
          }
        }
        if (filters.extension && tier === 'pro') {
          const ext = filters.extension.toLowerCase().replace(/^\./, '');
          if (!item.filename.toLowerCase().endsWith(`.${ext}`)) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'date_desc') return (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0);
        if (sortOption === 'date_asc') return (Number(a.timestamp) || 0) - (Number(b.timestamp) || 0);
        if (sortOption === 'size_desc') return (b.size || 0) - (a.size || 0);
        if (sortOption === 'size_asc') return (a.size || 0) - (b.size || 0);
        if (sortOption === 'name_asc') return a.filename.localeCompare(b.filename);
        return 0;
      });
  }, [mediaItems, activeCategory, searchValue, sortOption, filters, tier]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: mediaItems.length,
      image: mediaItems.filter((i) => i.type === 'image' || i.type === 'gif').length,
      video: mediaItems.filter((i) => i.type === 'video').length,
      audio: mediaItems.filter((i) => i.type === 'audio' || i.type === 'voice').length,
      document: mediaItems.filter((i) => i.type === 'document').length,
    };
  }, [mediaItems]);

  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map((i) => i.id)));
    }
  };

  const handleDownloadItem = (item: MediaItemCardData) => {
    batchQueueEngine.enqueueBatch(
      [
        {
          id: item.id,
          mediaId: item.id,
          filename: item.filename,
          size: item.size,
          blobUrl: item.srcUrl || 'https://web.telegram.org/demo.jpg',
        },
      ],
      tier
    );
    setQueueDrawerOpen(true);
  };

  const handleBatchDownloadTrigger = () => {
    const selectedItems = filteredItems.filter((i) => selectedIds.has(i.id));
    if (selectedItems.length === 0) return;

    if (tier === 'free' && selectedItems.length > FREE_BATCH_LIMIT) {
      setPendingBatchItems(selectedItems);
      setIsBatchLimitModalOpen(true);
    } else if (selectedItems.length > 10) {
      setPendingBatchItems(selectedItems);
      setIsLargeBatchModalOpen(true);
    } else {
      executeBatch(selectedItems);
    }
  };

  const executeBatch = (items: MediaItemCardData[]) => {
    const inputs = items.map((item) => ({
      id: item.id,
      mediaId: item.id,
      filename: item.filename,
      size: item.size,
      blobUrl: item.srcUrl || 'https://web.telegram.org/demo.jpg',
    }));

    batchQueueEngine.enqueueBatch(inputs, tier);
    setIsMultiSelect(false);
    setSelectedIds(new Set());
    setQueueDrawerOpen(true);
  };

  // History & Retention state
  const [retentionPolicy, setRetentionPolicy] = useState<RetentionPolicy>('indefinite');
  const [historyItems, setHistoryItems] = useState<LocalHistoryItem[]>([]);


  // Load history on tab switch
  useEffect(() => {
    if (activeTabNav === 'history') {
      HistoryManager.getHistory().then(setHistoryItems);
    }
  }, [activeTabNav]);

  const renderMainContent = () => {
    if (activeTabNav === 'history') {
      return (
        <div className="p-3 space-y-3">
          <HistoryExplorer
            items={historyItems}
            onDeleteRecord={async (id) => {
              await HistoryManager.deleteRecord(id);
              const updated = await HistoryManager.getHistory();
              setHistoryItems(updated);
            }}
            onClearAll={async () => {
              await HistoryManager.clearAllHistory();
              setHistoryItems([]);
            }}
            onExportJson={async () => {
              const jsonStr = await HistoryManager.exportHistoryJson();
              const blob = new Blob([jsonStr], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `mediadock_history_${Date.now()}.json`;
              a.click();
            }}
            onOpenDownloadsFolder={() => {
              if (typeof chrome !== 'undefined' && chrome.downloads) {
                chrome.downloads.showDefaultFolder();
              }
            }}
          />
        </div>
      );
    }

    if (activeTabNav === 'settings') {
      return (
        <div className="p-3 space-y-3">
          <NamingTemplateBuilder
            tier={tier}
            template={namingTemplate}
            folderTemplate={folderTemplate}
            onChange={(tmpl, folder) => {
              setNamingTemplate(tmpl);
              setFolderTemplate(folder);
            }}
            onUpgradeTrigger={() => setTier('pro')}
          />

          <RetentionSettingsCard
            policy={retentionPolicy}
            onChangePolicy={(pol) => {
              setRetentionPolicy(pol);
              HistoryManager.purgeExpiredRecords(pol);
            }}
            onClearNow={async () => {
              await HistoryManager.clearAllHistory();
              setHistoryItems([]);
            }}
          />
        </div>
      );
    }

    switch (viewState) {


      case 'no_tab':
        return <NoTelegramTabState onOpenTab={() => window.open('https://web.telegram.org', '_blank')} />;
      case 'no_chat':
        return <NoChatSelectedState />;
      case 'loading':
        return <LoadingMediaState />;
      case 'unsupported':
        return <UnsupportedStateScreen variant="webk" adapterVersion="1.0.0" extensionVersion="1.0.0" />;
      case 'restricted':
        return <RestrictedMediaState />;
      case 'permission_missing':
        return <PermissionMissingState />;
      case 'update_required':
        return <UpdateRequiredState />;
      case 'empty':
        return <EmptyMediaState onRefresh={() => setViewState('ready')} />;
      case 'ready':
      default:
        return (
          <div className="p-3 space-y-3">
            {/* Explicit Loaded-View Disclaimer Notice */}
            <Card className="p-2.5 bg-[#EEF2FF] dark:bg-[#1E1B4B]/40 border-[#C7D2FE] dark:border-[#3730A3] flex items-start gap-2 text-xs text-[#3730A3] dark:text-[#A5B4FC]">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                MediaDock displays media currently loaded in your active conversation view. Telegram Web history is not automatically scrolled.
              </span>
            </Card>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <MediaExplorerFilters
                tier={tier}
                filters={filters}
                onFilterChange={(up) => setFilters((prev: FilterState) => ({ ...prev, ...up }))}

                onReset={() => setFilters({})}
                onUpgradeTrigger={() => setTier('pro')}
              />
            )}

            {/* Multi-Select Batch Header Action */}
            {isMultiSelect && (
              <div className="flex items-center justify-between p-2.5 rounded-[12px] bg-[#4F46E5] text-white text-xs font-semibold shadow-md">
                <div className="flex items-center gap-2">
                  <button onClick={handleSelectAll} className="flex items-center gap-1 hover:underline">
                    {selectedIds.size === filteredItems.length ? (
                      <XSquare className="w-4 h-4" />
                    ) : (
                      <CheckSquare className="w-4 h-4" />
                    )}
                    <span>{selectedIds.size} Selected</span>
                  </button>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  disabled={selectedIds.size === 0}
                  onClick={handleBatchDownloadTrigger}
                >
                  Download Selected
                </Button>
              </div>
            )}

            {/* Media Items Grid / List */}
            {filteredItems.length === 0 ? (
              <EmptyMediaState onRefresh={() => setSearchValue('')} />
            ) : (
              <div
                className={
                  viewMode === 'grid' || (viewMode === 'adaptive' && activeCategory === 'image')
                    ? 'grid grid-cols-2 gap-3'
                    : 'flex flex-col gap-2'
                }
              >
                {filteredItems.map((item) => (
                  <MediaItemCard
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    isSelected={selectedIds.has(item.id)}
                    isMultiSelect={isMultiSelect}
                    onSelectToggle={handleToggleSelect}
                    onDownload={handleDownloadItem}
                  />
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <SidePanelShell
      activeTab={activeTabNav}
      onTabChange={setActiveTabNav}
      tier={tier}
      queueCount={queueItems.length}
    >
      <MediaExplorerHeader
        chatLabel={chatLabel}
        connectionStatus={connectionStatus}
        tier={tier}
        queueCount={queueItems.length}
        onOpenSettings={() => setActiveTabNav('settings')}
      />

      <MediaExplorerToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        sortOption={sortOption}
        onSortChange={setSortOption}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isMultiSelect={isMultiSelect}
        onToggleMultiSelect={() => setIsMultiSelect(!isMultiSelect)}
        onRefresh={() => setConnectionStatus('scanning')}
        onToggleFilters={() => setShowFilters(!showFilters)}
        categoryCounts={categoryCounts}
      />

      <div className="pb-16">{renderMainContent()}</div>

      {/* Free Tier Batch Limit Modal */}
      <BatchLimitModal
        isOpen={isBatchLimitModalOpen}
        onClose={() => setIsBatchLimitModalOpen(false)}
        selectedCount={pendingBatchItems.length}
        onDownloadFirst20={() => {
          setIsBatchLimitModalOpen(false);
          executeBatch(pendingBatchItems.slice(0, FREE_BATCH_LIMIT));
        }}
        onUpgrade={() => {
          setIsBatchLimitModalOpen(false);
          setTier('pro');
          executeBatch(pendingBatchItems);
        }}
      />

      {/* Large Batch Warning Modal */}
      <LargeBatchWarningModal
        isOpen={isLargeBatchModalOpen}
        onClose={() => setIsLargeBatchModalOpen(false)}
        itemCount={pendingBatchItems.length}
        totalSizeBytes={pendingBatchItems.reduce((sum, item) => sum + (item.size || 0), 0)}
        onConfirm={() => {
          setIsLargeBatchModalOpen(false);
          executeBatch(pendingBatchItems);
        }}
      />

      {/* Persistent Download Queue Drawer */}
      <Drawer
        isOpen={queueDrawerOpen}
        onToggle={() => setQueueDrawerOpen(!queueDrawerOpen)}
        items={queueItems}
        onCancel={(id) => batchQueueEngine.cancelItem(id)}
      />
    </SidePanelShell>
  );
}
