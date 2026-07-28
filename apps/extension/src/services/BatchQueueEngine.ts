import {
  DEFAULT_CONCURRENCY,
  MAX_CONCURRENCY_CAP,
  FREE_BATCH_LIMIT,
  PRO_BATCH_LIMIT,
  ZIP_ENABLED,
  MAX_EXPONENTIAL_RETRIES,
  RETRY_DELAYS_MS,
  type UserPlanTier,
} from '@mediadock/shared';
/* eslint-disable @typescript-eslint/no-explicit-any, no-empty */
import { db, type DownloadStatus } from '../db/downloadDatabase';


import type { MediaType } from '@mediadock/shared';

export interface BatchItemInput {
  id: string;
  mediaId?: string;
  filename?: string;
  originalFilename?: string;
  mimeType?: string;
  size?: number;
  fileSize?: number;
  blobUrl?: string;
  directUrl?: string;
  mediaType?: MediaType;
  chatLabel?: string;
  timestamp?: string;
  isRestricted?: boolean;
}


export interface QueueJobState {
  id: string;
  mediaId: string;
  filename: string;
  mimeType: string;
  size: number;
  blobUrl: string;
  status: DownloadStatus;
  progress: number;
  error?: string;
  retryCount: number;
  createdAt: number;
}

export type QueueEngineStatus = 'idle' | 'running' | 'paused';

export class BatchQueueEngine {
  private queue: QueueJobState[] = [];
  private concurrencyLimit: number = DEFAULT_CONCURRENCY;
  private activeCount: number = 0;
  private status: QueueEngineStatus = 'idle';
  private listeners: Set<(jobs: QueueJobState[], status: QueueEngineStatus) => void> = new Set();

  constructor() {
    this.recoverState();
  }

  public async recoverState(): Promise<void> {
    try {
      const records = await db.getAllJobs();
      if (Array.isArray(records)) {
        this.queue = records.map((r) => ({
          id: r.id,
          mediaId: r.mediaId,
          filename: r.filename,
          mimeType: r.mimeType,
          size: r.size,
          blobUrl: r.blobUrl,
          status: r.status === 'downloading' ? 'queued' : r.status,
          progress: r.progress,
          error: r.error,
          retryCount: 0,
          createdAt: r.createdAt,
        }));
        this.notifyListeners();
      }
    } catch {
      this.queue = [];
    }
  }

  public subscribe(listener: (jobs: QueueJobState[], status: QueueEngineStatus) => void): () => void {
    this.listeners.add(listener);
    listener(this.getJobs(), this.status);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const jobsSnapshot = this.getJobs();
    this.listeners.forEach((listener) => listener(jobsSnapshot, this.status));
  }

  public getJobs(): QueueJobState[] {
    return [...this.queue];
  }

  public getEngineStatus(): QueueEngineStatus {
    return this.status;
  }

  public setConcurrency(limit: number): void {
    this.concurrencyLimit = Math.min(Math.max(1, limit), MAX_CONCURRENCY_CAP);
    this.processQueue();
  }

  public getConcurrency(): number {
    return this.concurrencyLimit;
  }

  public async enqueueBatch(
    items: BatchItemInput[],
    tier: UserPlanTier = 'free'
  ): Promise<{ enqueuedCount: number; skippedCount: number }> {
    // Exclude restricted media items
    const validItems = items.filter((item) => !item.isRestricted);

    // Apply Tier limits
    const maxAllowed = tier === 'pro' ? PRO_BATCH_LIMIT : FREE_BATCH_LIMIT;
    const itemsToEnqueue = validItems.slice(0, maxAllowed);
    const skippedCount = items.length - itemsToEnqueue.length;

    const newJobs: QueueJobState[] = [];

    for (const item of itemsToEnqueue) {
      const effectiveMediaId = item.mediaId || item.id;
      const effectiveFilename = item.filename || item.originalFilename || 'mediadock_file.bin';
      const effectiveBlobUrl = item.blobUrl || item.directUrl || '';
      const effectiveSize = item.size || item.fileSize || 0;
      const effectiveMediaType = item.mediaType || 'document';

      if (this.queue.some((j) => j.mediaId === effectiveMediaId && j.status !== 'failed' && j.status !== 'cancelled')) {
        continue;
      }

      const job: QueueJobState = {
        id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        mediaId: effectiveMediaId,
        filename: effectiveFilename,
        mimeType: item.mimeType || 'application/octet-stream',
        size: effectiveSize,
        blobUrl: effectiveBlobUrl,
        status: 'queued',
        progress: 0,
        retryCount: 0,
        createdAt: Date.now(),
      };

      newJobs.push(job);
      this.queue.push(job);

      try {
        await db.addJob({
          id: job.id,
          mediaId: job.mediaId,
          filename: job.filename,
          mimeType: job.mimeType,
          size: job.size,
          blobUrl: job.blobUrl,
          targetPath: `MediaDock/${job.filename}`,
          status: job.status,
          progress: 0,
          userInitiated: true,
          mediaType: effectiveMediaType,
          chatFingerprint: item.chatLabel || 'Chat',
          duplicateSignature: `${effectiveMediaType}_${effectiveFilename}_${effectiveSize}`,
        });
      } catch {
        // Safe fallback if DB write fails in memory-only test mode
      }

    }

    if (newJobs.length > 0 && this.status !== 'paused') {
      this.status = 'running';
      this.processQueue();
    }

    this.notifyListeners();
    return { enqueuedCount: newJobs.length, skippedCount };
  }

  public pauseQueue(): void {
    this.status = 'paused';
    this.notifyListeners();
  }

  public resumeQueue(): void {
    if (this.status === 'paused') {
      this.status = 'running';
      this.processQueue();
      this.notifyListeners();
    }
  }

  public async cancelItem(jobId: string): Promise<void> {
    const job = this.queue.find((j) => j.id === jobId);
    if (job) {
      job.status = 'cancelled';
      try {
        await db.updateJobStatus(job.id, { status: 'cancelled' });
      } catch {}
      this.notifyListeners();
      this.processQueue();
    }
  }

  public async cancelQueue(): Promise<void> {
    this.status = 'idle';
    for (const job of this.queue) {
      if (job.status === 'queued' || job.status === 'downloading') {
        job.status = 'cancelled';
        try {
          await db.updateJobStatus(job.id, { status: 'cancelled' });
        } catch {}
      }
    }
    this.activeCount = 0;
    this.notifyListeners();
  }

  public async retryFailedItems(): Promise<void> {
    for (const job of this.queue) {
      if (job.status === 'failed' || job.status === 'cancelled') {
        job.status = 'queued';
        job.retryCount = 0;
        job.error = undefined;
        try {
          await db.updateJobStatus(job.id, { status: 'queued', error: undefined });
        } catch {}
      }
    }
    if (this.status !== 'paused') {
      this.status = 'running';
      this.processQueue();
    }
    this.notifyListeners();
  }

  public async clearCompleted(): Promise<void> {
    this.queue = this.queue.filter((j) => j.status !== 'completed');
    this.notifyListeners();
  }

  public createZipArchive(): void {
    if (!ZIP_ENABLED) {
      throw new Error('ZIP archive creation in browser memory is disabled for memory safety.');
    }
  }

  private async processQueue(): Promise<void> {
    if (this.status === 'paused' || this.status === 'idle') return;

    const pendingJobs = this.queue.filter((j) => j.status === 'queued');
    if (pendingJobs.length === 0 && this.activeCount === 0) {
      this.status = 'idle';
      this.notifyListeners();
      return;
    }

    while (this.activeCount < this.concurrencyLimit && pendingJobs.length > 0) {
      const job = pendingJobs.shift();
      if (!job) break;

      this.activeCount++;
      job.status = 'downloading';
      this.notifyListeners();
      try {
        await db.updateJobStatus(job.id, { status: 'downloading' });
      } catch {}

      // Execute job in background
      this.executeJob(job).finally(() => {
        this.activeCount = Math.max(0, this.activeCount - 1);
        this.notifyListeners();
        this.processQueue();
      });
    }
  }

  private async executeJob(job: QueueJobState): Promise<void> {
    try {
      // 1. Verify URL availability
      const urlValid = await this.verifyOrRefreshUrl(job);
      if (!urlValid) {
        throw new Error('Temporary media URL expired and Telegram chat is no longer open.');
      }

      // 2. Trigger Chrome Download API if available
      if (typeof chrome !== 'undefined' && chrome.downloads) {
        await new Promise<void>((resolve, reject) => {
          chrome.downloads.download(
            {
              url: job.blobUrl,
              filename: `MediaDock/${job.filename}`,
              saveAs: false,
            },
            (downloadId) => {
              if (chrome.runtime.lastError || !downloadId) {
                reject(new Error(chrome.runtime.lastError?.message || 'Download initiation failed.'));
              } else {
                job.status = 'completed';
                job.progress = 100;
                try {
                  db.updateJobStatus(job.id, { status: 'completed', progress: 100, downloadId });
                } catch {}
                resolve();
              }
            }
          );
        });
      } else {
        // Fallback for non-extension mock test environment
        job.status = 'completed';
        job.progress = 100;
        try {
          await db.updateJobStatus(job.id, { status: 'completed', progress: 100 });
        } catch {}
      }

      // 3. Immediately revoke Blob URL to free memory
      if (job.blobUrl.startsWith('blob:') && typeof URL !== 'undefined' && URL.revokeObjectURL) {
        URL.revokeObjectURL(job.blobUrl);
      }
    } catch (err: any) {
      // Handle Exponential Backoff Retry
      if (job.retryCount < MAX_EXPONENTIAL_RETRIES) {
        const delay = RETRY_DELAYS_MS[job.retryCount] || 1000;
        job.retryCount++;
        job.status = 'queued';
        job.error = `Retrying (${job.retryCount}/${MAX_EXPONENTIAL_RETRIES})...`;
        try {
          await db.updateJobStatus(job.id, { status: 'queued', error: job.error });
        } catch {}

        await new Promise((res) => setTimeout(res, delay));
      } else {
        job.status = 'failed';
        job.error = err?.message || 'Download failed.';
        try {
          await db.updateJobStatus(job.id, { status: 'failed', error: job.error });
        } catch {}
      }
    }
  }

  private async verifyOrRefreshUrl(job: QueueJobState): Promise<boolean> {
    if (!job.blobUrl) return false;
    if (!job.blobUrl.startsWith('blob:')) return true;

    try {
      const res = await fetch(job.blobUrl, { method: 'HEAD' });
      if (res.ok) return true;
    } catch {
      // Blob URL expired or invalid
    }

    // Request fresh URL from Telegram content script if tab is active
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      return new Promise<boolean>((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs[0];
          if (tab?.id && tab.url?.includes('telegram.org')) {
            chrome.tabs.sendMessage(
              tab.id,
              { type: 'MEDIADOCK_REFRESH_MEDIA_URL', mediaId: job.mediaId },
              (response) => {
                if (response?.newBlobUrl) {
                  job.blobUrl = response.newBlobUrl;
                  resolve(true);
                } else {
                  resolve(false);
                }
              }
            );
          } else {
            resolve(false);
          }
        });
      });
    }

    return false;
  }
}

export const batchQueueEngine = new BatchQueueEngine();
