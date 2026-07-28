// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest';
import { batchQueueEngine } from './BatchQueueEngine';
import { SettingsSyncManager } from './SettingsSyncManager';
import { HistoryManager } from './HistoryManager';
import { EntitlementManager } from './EntitlementManager';
import { db } from '../db/downloadDatabase';

describe('Phase 17 — End-to-End Integration Tests', () => {
  beforeEach(async () => {
    localStorage.clear();
    await db.clearAllJobs();
  });

  it('Integration 1: SidePanel -> BatchQueueEngine lifecycle', async () => {
    let updatedQueueCount = 0;

    const unsubscribe = batchQueueEngine.subscribe((jobs) => {
      updatedQueueCount = jobs.length;
    });

    const items = [
      {
        id: 'msg_101',
        mediaId: 'msg_101',
        chatLabel: 'General Chat',
        mediaType: 'image' as const,
        originalFilename: 'vacation.jpg',
        fileSize: 2048576,
        timestamp: new Date().toISOString(),
        directUrl: 'https://web.telegram.org/blob/demo1',
      },
      {
        id: 'msg_102',
        mediaId: 'msg_102',
        chatLabel: 'General Chat',
        mediaType: 'video' as const,
        originalFilename: 'demo.mp4',
        fileSize: 10485760,
        timestamp: new Date().toISOString(),
        directUrl: 'https://web.telegram.org/blob/demo2',
      },
    ];

    batchQueueEngine.enqueueBatch(items, 'free');
    expect(updatedQueueCount).toBe(2);

    const snapshot = batchQueueEngine.getJobs();
    expect(snapshot.length).toBe(2);
    unsubscribe();
  });

  it('Integration 2: Service Worker Suspension Recovery', async () => {
    batchQueueEngine.enqueueBatch([
      {
        id: 'msg_201',
        mediaId: 'msg_201',
        chatLabel: 'Project Alpha',
        mediaType: 'document' as const,
        originalFilename: 'report.pdf',
        fileSize: 512000,
        timestamp: new Date().toISOString(),
        directUrl: 'https://web.telegram.org/blob/demo3',
      },
    ], 'free');

    const savedState = batchQueueEngine.getJobs();
    expect(savedState.length).toBe(1);
    expect(savedState[0]?.filename).toBe('report.pdf');
  });

  it('Integration 3: Privacy-Filtered Settings Sync & Entitlement Verification', async () => {
    const rawPreferences = {
      theme: 'dark' as const,
      naming_template: '{chat}_{date}_{index}',
      folder_template: 'MediaDock/{chat}/',
      duplicate_strategy: 'rename' as const,
      // Forbidden fields injected by mistake
      chatName: 'Private Confidentials',
      mediaUrl: 'https://web.telegram.org/blob/secret',
      filename: 'financial_report.xlsx',
    };

    const sanitized = SettingsSyncManager.sanitizePreferences(rawPreferences);
    expect(sanitized).not.toHaveProperty('chatName');
    expect(sanitized).not.toHaveProperty('mediaUrl');
    expect(sanitized).not.toHaveProperty('filename');
    expect(sanitized.theme).toBe('dark');

    const entitlement = await EntitlementManager.getEntitlement();
    expect(entitlement.plan).toBe('free');
  });

  it('Integration 4: Local History Storage Retention', async () => {
    await db.addJob({
      id: 'dl_999',
      mediaId: 'msg_999',
      filename: 'sample_photo.jpg',
      mimeType: 'image/jpeg',
      size: 102400,
      blobUrl: 'blob:https://web.telegram.org/demo',
      targetPath: 'MediaDock/sample_photo.jpg',
      status: 'completed',
      progress: 100,
      userInitiated: true,
      mediaType: 'image',
      chatFingerprint: 'Chat_Fingerprint_01',
      duplicateSignature: 'image_sample_photo.jpg_102400',
      namingPresetUsed: '{original}',
    });

    const records = await HistoryManager.getHistory();
    expect(records.length).toBe(1);
    expect(records[0]?.filename).toBe('sample_photo.jpg');
  });
});
