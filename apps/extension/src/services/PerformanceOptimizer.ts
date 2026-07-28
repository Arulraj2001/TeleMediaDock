import { db, type PersistentDownloadRecord } from '../db/downloadDatabase';

export class PerformanceOptimizerService {
  private static CHANGELOG_SEEN_KEY = 'mediadock_seen_changelog_version';
  private static UNDO_BUFFER: PersistentDownloadRecord[] = [];

  /**
   * Memory Cleanup: Safely revokes temporary Blob URLs to prevent memory leaks.
   */
  public revokeBlobUrls(urls: (string | undefined)[]): void {
    if (typeof URL === 'undefined' || typeof URL.revokeObjectURL !== 'function') {
      return;
    }
    for (const url of urls) {
      if (url && url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignore invalid URL revocation errors
        }
      }
    }
  }

  /**
   * History Deletion Undo: Pushes a record to undo buffer before deletion.
   */
  public async deleteHistoryWithUndo(id: string): Promise<PersistentDownloadRecord | null> {
    const records = await db.getAllJobs();
    const target = records.find((r) => r.id === id);
    if (target) {
      PerformanceOptimizerService.UNDO_BUFFER.push(target);
      await db.deleteJob(id);
      return target;
    }
    return null;
  }

  /**
   * History Deletion Undo: Restores the last deleted history item from undo buffer.
   */
  public async restoreLastDeletedHistory(): Promise<PersistentDownloadRecord | null> {
    const last = PerformanceOptimizerService.UNDO_BUFFER.pop();
    if (last) {
      await db.downloads.put(last);
      return last;
    }
    return null;
  }

  /**
   * Version Changelog: Check if user has already seen the specified version's "What's New" modal.
   */
  public async hasSeenChangelog(version: string): Promise<boolean> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const stored = await chrome.storage.local.get(PerformanceOptimizerService.CHANGELOG_SEEN_KEY);
      return stored[PerformanceOptimizerService.CHANGELOG_SEEN_KEY] === version;
    }
    return localStorage.getItem(PerformanceOptimizerService.CHANGELOG_SEEN_KEY) === version;
  }

  /**
   * Version Changelog: Mark the specified version's "What's New" modal as seen.
   */
  public async markChangelogSeen(version: string): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [PerformanceOptimizerService.CHANGELOG_SEEN_KEY]: version });
    } else {
      localStorage.setItem(PerformanceOptimizerService.CHANGELOG_SEEN_KEY, version);
    }
  }
}

export const PerformanceOptimizer = new PerformanceOptimizerService();
