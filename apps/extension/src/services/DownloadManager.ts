import type { DownloadPayload } from '@mediadock/shared';
import { generateCollisionSafeFilename, parseNamingTemplate } from '@mediadock/shared';
import { db } from '../db/downloadDatabase';


export class DownloadManager {
  private static instance: DownloadManager;
  private existingFilenames: Set<string> = new Set();
  private template = '{chat}_{date}_{index}';
  private folderTemplate = 'MediaDock/';

  private constructor() {
    this.initDownloadListeners();
  }

  public static getInstance(): DownloadManager {
    if (!DownloadManager.instance) {
      DownloadManager.instance = new DownloadManager();
    }
    return DownloadManager.instance;
  }

  public setNamingTemplate(template: string, folderTemplate: string): void {
    this.template = template;
    this.folderTemplate = folderTemplate;
  }

  /**
   * Primary user-initiated one-click download action.
   */
  public async handleUserDownloadRequest(payload: DownloadPayload, userInitiated = true): Promise<string> {
    if (!userInitiated) {
      throw new Error('Automated downloads without explicit user action are strictly prohibited.');
    }

    const jobId = `dl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const parsedPath = parseNamingTemplate(this.template, this.folderTemplate, {
      chatLabel: 'Chat',
      originalFilename: payload.filename,
      mediaType: 'document',
      mimeType: payload.mimeType,
    });

    const finalFilename = generateCollisionSafeFilename(parsedPath, this.existingFilenames);
    this.existingFilenames.add(finalFilename);

    const targetPath = finalFilename;


    // 1. Transactionally record queued job in Dexie IndexedDB
    await db.addJob({
      id: jobId,
      mediaId: payload.mediaId,
      filename: finalFilename,
      mimeType: payload.mimeType,
      size: payload.size,
      blobUrl: payload.blobUrl,
      targetPath,
      status: 'queued',
      progress: 0,
      userInitiated,
      mediaType: 'document',
      chatFingerprint: 'Chat',
      duplicateSignature: `document_${finalFilename}_${payload.size}`,
    });


    // 2. Invoke Chrome downloads API
    try {
      await db.updateJobStatus(jobId, { status: 'downloading', progress: 5 });

      const downloadId = await new Promise<number>((resolve, reject) => {
        chrome.downloads.download(
          {
            url: payload.blobUrl,
            filename: targetPath,
            saveAs: false,
            conflictAction: 'uniquify',
          },
          (id) => {
            if (chrome.runtime.lastError || id === undefined) {
              reject(new Error(chrome.runtime.lastError?.message || 'Download launch failed'));
            } else {
              resolve(id);
            }
          }
        );
      });

      await db.updateJobStatus(jobId, { downloadId });

      // 3. Immediately revoke Blob URL after Chrome downloads accepts job
      if (payload.blobUrl.startsWith('blob:')) {
        setTimeout(() => URL.revokeObjectURL(payload.blobUrl), 1000);
      }

      return jobId;
    } catch (err: unknown) {
      const actionableError = this.translateErrorMessage((err as Error)?.message || 'Download launch error');
      await db.updateJobStatus(jobId, { status: 'failed', error: actionableError });

      if (userInitiated) {
        this.showNotification('Download Failed', `${finalFilename}: ${actionableError}`);
      }
      throw new Error(actionableError);
    }
  }

  /**
   * Service Worker Restart Recovery. Re-checks pending IndexedDB tasks upon boot.
   */
  public async recoverPendingDownloads(): Promise<void> {
    try {
      const pendingJobs = await db.getPendingJobs();
      for (const job of pendingJobs) {
        if (job.downloadId) {
          chrome.downloads.search({ id: job.downloadId }, (results) => {
            if (!results || results.length === 0) {
              db.updateJobStatus(job.id, {
                status: 'failed',
                error: 'Download interrupted during Service Worker restart.',
              });
              return;
            }

            const firstResult = results[0];
            if (!firstResult) return;
            const state = firstResult.state;
            if (state === 'complete') {
              db.updateJobStatus(job.id, { status: 'completed', progress: 100 });
            } else if (state === 'interrupted') {
              db.updateJobStatus(job.id, {
                status: 'failed',
                error: this.translateErrorMessage(firstResult.error || 'INTERRUPTED'),
              });
            }

          });
        } else if (job.status === 'queued') {
          // Re-attempt queued task
          db.updateJobStatus(job.id, {
            status: 'failed',
            error: 'Session expired before download started. Please retry.',
          });
        }
      }
    } catch (err) {
      console.error('[MediaDock DownloadManager] Recovery error:', err);
    }
  }

  private initDownloadListeners(): void {
    if (typeof chrome === 'undefined' || !chrome.downloads) return;

    chrome.downloads.onChanged.addListener((delta) => {
      db.getJobByDownloadId(delta.id).then((job) => {
        if (!job) return;

        if (delta.state) {
          if (delta.state.current === 'complete') {
            db.updateJobStatus(job.id, { status: 'completed', progress: 100 });
            if (job.userInitiated) {
              this.showNotification('Download Complete', `${job.filename} saved to MediaDock/`);
            }

          } else if (delta.state.current === 'interrupted') {
            const errorMsg = this.translateErrorMessage(delta.error?.current || 'INTERRUPTED');
            const newStatus = delta.error?.current === 'USER_CANCELED' ? 'cancelled' : 'failed';
            db.updateJobStatus(job.id, { status: newStatus, error: errorMsg });

            if (job.userInitiated) {
              this.showNotification(
                newStatus === 'cancelled' ? 'Download Cancelled' : 'Download Failed',
                `${job.filename}: ${errorMsg}`
              );
            }
          }
        }

        if (delta.state && delta.state.current === 'in_progress') {
          db.updateJobStatus(job.id, { status: 'downloading', progress: 50 });
        }

      });
    });
  }

  private translateErrorMessage(rawError: string): string {
    const err = rawError.toUpperCase();
    if (err.includes('USER_CANCELED') || err.includes('CANCELLED')) {
      return 'Download cancelled by user.';
    }
    if (err.includes('SERVER_BAD_CONTENT') || err.includes('EXPIRED')) {
      return 'Telegram session link expired. Please refresh the web page.';
    }
    if (err.includes('FILE_ACCESS_DENIED') || err.includes('PERMISSION')) {
      return 'Storage permission denied by OS or browser settings.';
    }
    if (err.includes('NETWORK_FAILED') || err.includes('NETWORK')) {
      return 'Network connection lost during download.';
    }
    return `Download error (${rawError})`;
  }

  private showNotification(title: string, message: string): void {
    if (typeof chrome !== 'undefined' && chrome.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/icon-128.png',
        title: `MediaDock: ${title}`,
        message,
      });
    }
  }
}
