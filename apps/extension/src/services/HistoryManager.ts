/* eslint-disable no-empty */
import { db, type PersistentDownloadRecord } from '../db/downloadDatabase';


export type RetentionPolicy = 'indefinite' | '30_days' | '90_days' | 'clear_on_exit';

export interface HistoryFilterOptions {
  query?: string;
  mediaType?: string;
  status?: string;
}

export class HistoryManager {
  public static async getHistory(options: HistoryFilterOptions = {}): Promise<PersistentDownloadRecord[]> {
    try {
      let records = await db.getAllJobs();

      if (options.query?.trim()) {
        const q = options.query.toLowerCase();
        records = records.filter((r) => r.filename.toLowerCase().includes(q));
      }

      if (options.mediaType && options.mediaType !== 'all') {
        records = records.filter((r) => r.mediaType === options.mediaType);
      }

      if (options.status && options.status !== 'all') {
        records = records.filter((r) => r.status === options.status);
      }

      return records;
    } catch {
      return [];
    }
  }

  public static async deleteRecord(id: string): Promise<void> {
    try {
      await db.deleteJob(id);
    } catch {}
  }

  public static async clearAllHistory(): Promise<void> {
    try {
      await db.clearAllJobs();
    } catch {}
  }

  public static async exportHistoryJson(): Promise<string> {
    const records = await HistoryManager.getHistory();
    // Exclude blob URLs or sensitive metadata for export
    const sanitizedExport = records.map((r) => ({
      id: r.id,
      filename: r.filename,
      mediaType: r.mediaType,
      size: r.size,
      chatFingerprint: r.chatFingerprint,
      status: r.status,
      downloadedAt: new Date(r.createdAt).toISOString(),
    }));

    return JSON.stringify(sanitizedExport, null, 2);
  }

  public static async purgeExpiredRecords(policy: RetentionPolicy): Promise<number> {
    if (policy === 'indefinite') return 0;

    let maxAgeMs = 0;
    if (policy === '30_days') maxAgeMs = 30 * 24 * 60 * 60 * 1000;
    else if (policy === '90_days') maxAgeMs = 90 * 24 * 60 * 60 * 1000;
    else if (policy === 'clear_on_exit') maxAgeMs = 0;

    const cutoff = Date.now() - maxAgeMs;
    const records = await db.getAllJobs();

    let purgedCount = 0;
    for (const r of records) {
      if (policy === 'clear_on_exit' || r.createdAt < cutoff) {
        await db.deleteJob(r.id);
        purgedCount++;
      }
    }

    return purgedCount;
  }
}
