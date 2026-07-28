import Dexie, { type Table } from 'dexie';
import type { MediaType } from '@mediadock/shared';

export type DownloadStatus = 'queued' | 'downloading' | 'completed' | 'failed' | 'cancelled';

export interface PersistentDownloadRecord {
  id: string;
  mediaId: string;
  filename: string;
  mimeType: string;
  size: number;
  blobUrl: string;
  targetPath: string;
  status: DownloadStatus;
  progress: number;
  error?: string;
  downloadId?: number;
  userInitiated: boolean;
  mediaType: MediaType;
  chatFingerprint: string;
  duplicateSignature: string;
  namingPresetUsed?: string;
  createdAt: number;
  updatedAt: number;
}

export class MediaDockDownloadDB extends Dexie {
  downloads!: Table<PersistentDownloadRecord, string>;

  constructor() {
    super('MediaDockDownloadDB');
    this.version(2).stores({
      downloads: 'id, status, createdAt, downloadId, duplicateSignature, chatFingerprint, mediaType',
    });
  }

  public async addJob(record: Omit<PersistentDownloadRecord, 'createdAt' | 'updatedAt'>): Promise<void> {
    const now = Date.now();
    await this.downloads.put({
      ...record,
      createdAt: now,
      updatedAt: now,
    });
  }

  public async updateJobStatus(
    id: string,
    updates: Partial<Pick<PersistentDownloadRecord, 'status' | 'progress' | 'error' | 'downloadId'>>
  ): Promise<void> {
    await this.downloads.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  public async getPendingJobs(): Promise<PersistentDownloadRecord[]> {
    return this.downloads
      .where('status')
      .equals('queued')
      .or('status')
      .equals('downloading')
      .toArray();
  }

  public async getJobByDownloadId(downloadId: number): Promise<PersistentDownloadRecord | undefined> {
    return this.downloads.where('downloadId').equals(downloadId).first();
  }

  public async getByDuplicateSignature(signature: string): Promise<PersistentDownloadRecord[]> {
    return this.downloads.where('duplicateSignature').equals(signature).toArray();
  }

  public async getAllJobs(): Promise<PersistentDownloadRecord[]> {
    return this.downloads.orderBy('createdAt').reverse().toArray();
  }

  public async deleteJob(id: string): Promise<void> {
    await this.downloads.delete(id);
  }

  public async clearAllJobs(): Promise<void> {
    await this.downloads.clear();
  }
}

export const db = new MediaDockDownloadDB();
