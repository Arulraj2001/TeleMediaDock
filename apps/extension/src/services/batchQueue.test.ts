// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BatchQueueEngine, type BatchItemInput } from './BatchQueueEngine';
import { FREE_BATCH_LIMIT, MAX_CONCURRENCY_CAP } from '@mediadock/shared';

vi.mock('../db/downloadDatabase', () => ({
  db: {
    addJob: vi.fn().mockResolvedValue(undefined),
    updateJobStatus: vi.fn().mockResolvedValue(undefined),
    getAllJobs: vi.fn().mockResolvedValue([]),
  },
}));

describe('BatchQueueEngine', () => {
  let engine: BatchQueueEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new BatchQueueEngine();
  });

  it('should enforce concurrency limits and process queued items', async () => {
    engine.setConcurrency(2);
    expect(engine.getConcurrency()).toBe(2);

    const items: BatchItemInput[] = [
      { id: '1', mediaId: 'm1', filename: 'file1.jpg', blobUrl: 'https://example.com/1.jpg' },
      { id: '2', mediaId: 'm2', filename: 'file2.jpg', blobUrl: 'https://example.com/2.jpg' },
      { id: '3', mediaId: 'm3', filename: 'file3.jpg', blobUrl: 'https://example.com/3.jpg' },
    ];

    const result = await engine.enqueueBatch(items, 'free');
    expect(result.enqueuedCount).toBe(3);
    expect(result.skippedCount).toBe(0);

    const jobs = engine.getJobs();
    expect(jobs).toHaveLength(3);
  });

  it('should clamp maximum concurrency cap to 4', () => {
    engine.setConcurrency(10);
    expect(engine.getConcurrency()).toBe(MAX_CONCURRENCY_CAP);
  });

  it('should enforce Free tier batch limit of 20 items', async () => {
    const manyItems: BatchItemInput[] = Array.from({ length: 30 }, (_, i) => ({
      id: `item_${i}`,
      mediaId: `media_${i}`,
      filename: `image_${i}.png`,
      blobUrl: `https://example.com/image_${i}.png`,
    }));

    const result = await engine.enqueueBatch(manyItems, 'free');
    expect(result.enqueuedCount).toBe(FREE_BATCH_LIMIT);
    expect(result.skippedCount).toBe(10);
    expect(engine.getJobs()).toHaveLength(FREE_BATCH_LIMIT);
  });

  it('should allow larger batches for Pro users up to Pro limit', async () => {
    const manyItems: BatchItemInput[] = Array.from({ length: 25 }, (_, i) => ({
      id: `item_${i}`,
      mediaId: `media_${i}`,
      filename: `doc_${i}.pdf`,
      blobUrl: `https://example.com/doc_${i}.pdf`,
    }));

    const result = await engine.enqueueBatch(manyItems, 'pro');
    expect(result.enqueuedCount).toBe(25);
    expect(result.skippedCount).toBe(0);
  });

  it('should handle pause and resume queue controls', async () => {
    engine.pauseQueue();
    expect(engine.getEngineStatus()).toBe('paused');

    engine.resumeQueue();
    // After processing remaining empty queue, status becomes idle
    expect(engine.getEngineStatus()).toBe('idle');
  });

  it('should cancel queue and mark jobs cancelled', async () => {
    engine.pauseQueue();

    const items: BatchItemInput[] = [
      { id: '1', mediaId: 'm1', filename: 'file1.jpg', blobUrl: 'https://example.com/1.jpg' },
    ];

    await engine.enqueueBatch(items, 'free');
    await engine.cancelQueue();

    const jobs = engine.getJobs();
    expect(jobs[0]?.status).toBe('cancelled');
  });


  it('should throw error when attempting to create ZIP in browser memory', () => {
    expect(() => engine.createZipArchive()).toThrowError(
      'ZIP archive creation in browser memory is disabled for memory safety.'
    );
  });
});
