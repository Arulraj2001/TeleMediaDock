import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Toast,
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
import { HistoryManager, type RetentionPolicy } from '../../src/services/HistoryManager';
import { Info, Download, CheckSquare, XSquare } from 'lucide-react';

interface TelegramResponse {
  success: boolean;
  error?: string;
  chat?: { label?: string } | null;
  discoveredMedia?: Array<{
    id?: string;
    type?: MediaItemCardData['type'];
    originalFilename?: string;
    filename?: string;
    fileSize?: number;
    size?: number;
    timestamp?: string | number;
    srcUrl?: string;
    directUrl?: string;
    senderLabel?: string;
    isRestricted?: boolean;
  }>;
}

function mapDiscoveredMedia(discoveredMedia: TelegramResponse['discoveredMedia']): MediaItemCardData[] {
  if (!Array.isArray(discoveredMedia)) return [];

  return discoveredMedia.map((item, index) => ({
    id: item.id || `media_${index}`,
    type: item.type || 'document',
    filename: item.originalFilename || item.filename || `telegram_media_${index + 1}`,
    size: item.fileSize || item.size,
    timestamp: item.timestamp || Date.now(),
    srcUrl: item.srcUrl || item.directUrl,
    senderLabel: item.senderLabel,
    isRestricted: !!item.isRestricted,
  }));
}

async function getActiveTelegramTab(): Promise<chrome.tabs.Tab> {
  const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const tab = tabs[0];
  if (!tab?.id || !tab.url?.toLowerCase().includes('telegram.org')) {
    throw new Error('Open a Telegram Web tab and select a conversation first.');
  }
  return tab;
}

async function sendToTelegram(message: unknown): Promise<TelegramResponse> {
  const tab = await getActiveTelegramTab();

  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id!, message, (response: TelegramResponse | undefined) => {
      if (chrome.runtime.lastError) {
        reject(new Error('Reload Telegram Web once so MediaDock can connect to the page.'));
        return;
      }
      if (!response) {
        reject(new Error('Telegram Web did not respond. Reload the tab and try again.'));
        return;
      }
      resolve(response);
    });
  });
}

export default function App() {
  const [activeTabNav, setActiveTabNav] = useState<ExtensionTab>('media');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'scanning'>('scanning');
  const [chatLabel, setChatLabel] = useState<string>('No chat selected');
  const [tier, setTier] = useState<UserPlanTier>('free');

  // Active view state machine
  const [viewState, setViewState] = useState<
    'no_tab' | 'no_chat' | 'empty' | 'loading' | 'unsupported' | 'restricted' | 'permission_missing' | 'update_required' | 'ready'
  >('ready');

  // Discovered Media state
  const [mediaItems, setMediaItems] = useState<MediaItemCardData[]>([]);

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
  const [toast, setToast] = useState<{ id: string; message: string; variant: 'success' | 'error' | 'info' } | null>(null);

  const scanTelegram = useCallback(async () => {
    setConnectionStatus('scanning');
    setViewState('loading');
    try {
      const response = await sendToTelegram({ type: 'MEDIADOCK_REQUEST_SCAN' });
      const items = mapDiscoveredMedia(response.discoveredMedia);
      setMediaItems(items);
      setChatLabel(response.chat?.label || 'No chat selected');
      setConnectionStatus('connected');
      setViewState(response.chat ? (items.length > 0 ? 'ready' : 'empty') : 'no_chat');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to connect to Telegram Web.';
      setConnectionStatus('disconnected');
      setViewState(message.includes('Open a Telegram') ? 'no_tab' : 'empty');
      setToast({ id: `scan_${Date.now()}`, message, variant: 'error' });
    }
  }, []);

  useEffect(() => {
    void scanTelegram();
  }, [scanTelegram]);


  // Listen for discovered media from Telegram Web content script
  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.runtime) return;

    const messageListener = (message: any) => {
      if (message.type === 'MEDIADOCK_MEDIA_DISCOVERED') {
        const { chat, discoveredMedia } = message.payload || {};
        if (chat?.label) {
          setChatLabel(chat.label);
        }
        const mapped = mapDiscoveredMedia(discoveredMedia);
        setMediaItems(mapped);
        setViewState(chat ? (mapped.length > 0 ? 'ready' : 'empty') : 'no_chat');
        setConnectionStatus('connected');
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
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

  const handleDownloadItem = async (item: MediaItemCardData) => {
    const queueId = `download_${item.id}_${Date.now()}`;
    const fileSize = item.size ? `${(item.size / 1024 / 1024).toFixed(1)} MB` : 'Unknown size';
    setQueueItems((current) => [
      ...current,
      { id: queueId, fileName: item.filename, fileSize, progress: 10, status: 'downloading' },
    ]);
    setQueueDrawerOpen(true);

    try {
      const response = await sendToTelegram({
        type: 'MEDIADOCK_DOWNLOAD_MEDIA',
        mediaId: item.id,
      });
      if (!response.success) throw new Error(response.error || 'Download failed.');
      setQueueItems((current) =>
        current.map((entry) =>
          entry.id === queueId ? { ...entry, progress: 100, status: 'completed' } : entry
        )
      );
      setToast({
        id: `download_${Date.now()}`,
        message: `${item.filename} was sent to your Downloads folder.`,
        variant: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Download failed.';
      setQueueItems((current) =>
        current.map((entry) =>
          entry.id === queueId ? { ...entry, progress: 0, status: 'failed', error: message } : entry
        )
      );
      setToast({ id: `download_error_${Date.now()}`, message, variant: 'error' });
    }
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
    setIsMultiSelect(false);
    setSelectedIds(new Set());
    setQueueDrawerOpen(true);
    void (async () => {
      for (const item of items) {
        await handleDownloadItem(item);
      }
    })();
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
    if (activeTabNav === 'downloads') {
      return (
        <section className="space-y-3 p-3">
          <div>
            <h1 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">Downloads</h1>
            <p className="mt-0.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
              Files requested during this sidebar session.
            </p>
          </div>
          {queueItems.length === 0 ? (
            <Card className="p-5 text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
              Your download queue is empty.
            </Card>
          ) : (
            <div className="space-y-2">
              {queueItems.map((item) => (
                <Card key={item.id} className="flex min-w-0 items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">{item.fileName}</p>
                    <p className="mt-0.5 text-[10px] capitalize text-[#64748B] dark:text-[#94A3B8]">
                      {item.fileSize} · {item.status}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-[#4F46E5]">{item.progress}%</span>
                </Card>
              ))}
            </div>
          )}
        </section>
      );
    }

    if (activeTabNav === 'history') {
      return (
        <div className="p-3 space-y-3">
          <div>
            <h1 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">Download history</h1>
            <p className="mt-0.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
              Review and manage locally stored download records.
            </p>
          </div>
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
          <div>
            <h1 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">Settings</h1>
            <p className="mt-0.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
              Configure filenames, folders, and local history.
            </p>
          </div>
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

    if (activeTabNav === 'rules') {
      return (
        <section className="space-y-3 p-3">
          <div>
            <h1 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">Rules</h1>
            <p className="mt-0.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
              Naming and folder rules are managed from Settings.
            </p>
          </div>
          <Card className="p-4">
            <Button variant="primary" size="sm" onClick={() => setActiveTabNav('settings')}>
              Open Settings
            </Button>
          </Card>
        </section>
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
        return <EmptyMediaState onRefresh={() => void scanTelegram()} />;
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
                    ? 'grid grid-cols-1 gap-3 min-[360px]:grid-cols-2'
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
      {activeTabNav === 'media' && (
        <>
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
            onRefresh={() => void scanTelegram()}
            onToggleFilters={() => setShowFilters(!showFilters)}
            categoryCounts={categoryCounts}
          />
        </>
      )}

      <div className="min-w-0 pb-4">{renderMainContent()}</div>

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
        onCancel={(id) => setQueueItems((current) => current.filter((item) => item.id !== id))}
      />

      {toast && (
        <div className="fixed bottom-28 left-3 right-3 z-50">
          <Toast
            id={toast.id}
            message={toast.message}
            variant={toast.variant}
            onDismiss={() => setToast(null)}
          />
        </div>
      )}
    </SidePanelShell>
  );
}
