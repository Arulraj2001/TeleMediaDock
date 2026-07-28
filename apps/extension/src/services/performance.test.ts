// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PerformanceOptimizer } from './PerformanceOptimizer';
import { db } from '../db/downloadDatabase';

describe('Phase 18 — Performance & UX Optimization Engine', () => {
  beforeEach(async () => {
    localStorage.clear();
    await db.clearAllJobs();
  });

  it('should safely revoke Blob URLs without throwing errors', () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const urls = ['blob:https://web.telegram.org/123', 'blob:https://web.telegram.org/456', undefined];

    PerformanceOptimizer.revokeBlobUrls(urls);
    expect(revokeSpy).toHaveBeenCalledTimes(2);
    revokeSpy.mockRestore();
  });

  it('should support history item deletion with undo restoration', async () => {
    await db.addJob({
      id: 'job_test_1',
      mediaId: 'msg_test_1',
      filename: 'document.pdf',
      mimeType: 'application/pdf',
      size: 204800,
      blobUrl: 'blob:https://web.telegram.org/pdf',
      targetPath: 'MediaDock/document.pdf',
      status: 'completed',
      progress: 100,
      userInitiated: true,
      mediaType: 'document',
      chatFingerprint: 'Chat_101',
      duplicateSignature: 'doc_204800',
    });

    let records = await db.getAllJobs();
    expect(records.length).toBe(1);

    // Delete with undo
    const deleted = await PerformanceOptimizer.deleteHistoryWithUndo('job_test_1');
    expect(deleted?.filename).toBe('document.pdf');

    records = await db.getAllJobs();
    expect(records.length).toBe(0);

    // Restore from undo
    const restored = await PerformanceOptimizer.restoreLastDeletedHistory();
    expect(restored?.filename).toBe('document.pdf');

    records = await db.getAllJobs();
    expect(records.length).toBe(1);
  });

  it('should track version changelog "What\'s New" modal display state', async () => {
    let seen = await PerformanceOptimizer.hasSeenChangelog('1.0.0');
    expect(seen).toBe(false);

    await PerformanceOptimizer.markChangelogSeen('1.0.0');
    seen = await PerformanceOptimizer.hasSeenChangelog('1.0.0');
    expect(seen).toBe(true);
  });
});
