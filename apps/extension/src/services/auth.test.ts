// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest';
import { DeviceManager } from './DeviceManager';
import { SettingsSyncManager } from './SettingsSyncManager';
import { AuthManager } from './AuthManager';

describe('Phase 11 — Auth & Settings Sync Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('DeviceManager', () => {
    it('should generate a valid UUID v4 installation ID without hardware fingerprinting', async () => {
      const id1 = await DeviceManager.getInstallationId();
      expect(id1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

      const id2 = await DeviceManager.getInstallationId();
      expect(id2).toBe(id1);
    });

    it('should register and remove devices correctly', async () => {
      const dev = await DeviceManager.registerDevice('Test Chrome Browser');
      expect(dev.deviceName).toBe('Test Chrome Browser');

      let list = await DeviceManager.getRegisteredDevices();
      expect(list.length).toBe(1);

      await DeviceManager.removeDevice(dev.installationId);
      list = await DeviceManager.getRegisteredDevices();
      expect(list.length).toBe(0);
    });
  });

  describe('SettingsSyncManager', () => {
    it('should sanitize preferences and strip forbidden sensitive data', () => {
      const rawWithForbiddenData = {
        theme: 'dark',
        namingTemplate: '{chat}_{date}',
        folderTemplate: 'MediaDock/',
        duplicateStrategy: 'rename',
        maxConcurrency: 3,
        // FORBIDDEN SENSITIVE FIELDS THAT MUST BE STRIPPED:
        chatTitle: 'Secret Private Group',
        mediaUrl: 'https://cdn.telegram.org/secret_photo.jpg',
        filename: 'secret_file.pdf',
        downloadHistory: [{ id: 1, name: 'stolen.pdf' }],
      };

      const clean = SettingsSyncManager.sanitizePreferences(rawWithForbiddenData);

      expect(clean.theme).toBe('dark');
      expect(clean.namingTemplate).toBe('{chat}_{date}');
      expect(clean.maxConcurrency).toBe(3);

      // Verify forbidden properties were stripped
      expect((clean as Record<string, unknown>).chatTitle).toBeUndefined();
      expect((clean as Record<string, unknown>).mediaUrl).toBeUndefined();
      expect((clean as Record<string, unknown>).filename).toBeUndefined();
      expect((clean as Record<string, unknown>).downloadHistory).toBeUndefined();
    });

  });

  describe('AuthManager', () => {
    it('should validate invalid emails on magic link login', async () => {
      const result = await AuthManager.signInWithMagicLink('invalid-email');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should return unauthenticated free tier by default', async () => {
      const state = await AuthManager.getAuthState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.tier).toBe('free');
    });
  });
});
