// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DuplicateDetector } from './DuplicateDetector';
import { HistoryManager } from './HistoryManager';

vi.mock('../db/downloadDatabase', () => ({
  db: {
    addJob: vi.fn().mockResolvedValue(undefined),
    updateJobStatus: vi.fn().mockResolvedValue(undefined),
    getAllJobs: vi.fn().mockResolvedValue([
      {
        id: '1',
        filename: 'report.pdf',
        mediaType: 'document',
        size: 500000,
        chatFingerprint: 'tech_chat',
        duplicateSignature: 'document:report.pdf:500000:tech_chat',
        status: 'completed',
        createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000, // 40 days old
      },
    ]),
    getByDuplicateSignature: vi.fn().mockResolvedValue([
      {
        id: '1',
        filename: 'report.pdf',
        mediaType: 'document',
        size: 500000,
        chatFingerprint: 'tech_chat',
        duplicateSignature: 'document:report.pdf:500000:tech_chat',
        status: 'completed',
      },
    ]),
    deleteJob: vi.fn().mockResolvedValue(undefined),
    clearAllJobs: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('DuplicateDetector & HistoryManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate deterministic duplicate signature', () => {
    const sig = DuplicateDetector.generateSignature({
      filename: 'Photo 2026.PNG',
      mediaType: 'image',
      size: 1024,
      chatFingerprint: 'Tech Community',
    });

    expect(sig).toBe('image:photo 2026.png:1024:tech_community');
  });


  it('should detect existing duplicate records in IndexedDB', async () => {
    const result = await DuplicateDetector.checkDuplicate({
      filename: 'report.pdf',
      mediaType: 'document',
      size: 500000,
      chatFingerprint: 'tech_chat',
    });

    expect(result.isDuplicate).toBe(true);
    expect(result.existingRecord?.filename).toBe('report.pdf');
  });

  it('should export sanitized history JSON string', async () => {
    const jsonStr = await HistoryManager.exportHistoryJson();
    const parsed = JSON.parse(jsonStr);

    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].filename).toBe('report.pdf');
    expect(parsed[0].blobUrl).toBeUndefined(); // Verify raw Blob URL privacy safety
  });

  it('should purge records older than 30 days retention policy', async () => {
    const purgedCount = await HistoryManager.purgeExpiredRecords('30_days');
    expect(purgedCount).toBe(1);
  });
});
