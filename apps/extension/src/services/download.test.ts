// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DownloadManager } from './DownloadManager';

describe('DownloadManager Service Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects automated downloads without user initiation', async () => {
    const manager = DownloadManager.getInstance();
    const mockPayload = {
      mediaId: 'm1',
      blobUrl: 'blob:https://web.telegram.org/123',
      filename: 'sample.mp4',
      mimeType: 'video/mp4',
      size: 1024,
    };

    await expect(manager.handleUserDownloadRequest(mockPayload, false)).rejects.toThrow(
      'Automated downloads without explicit user action are strictly prohibited.'
    );
  });
});
