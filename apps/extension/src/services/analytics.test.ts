// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsManager } from './AnalyticsManager';

describe('Phase 15 — Analytics Engine & Opt-In Telemetry', () => {
  beforeEach(async () => {
    localStorage.clear();
    await AnalyticsManager.clearAnalyticsLogs();
  });

  it('should have analytics DISABLED BY DEFAULT', async () => {
    const isConsent = await AnalyticsManager.isConsentGranted();
    expect(isConsent).toBe(false);
  });

  it('should drop analytics events silently when consent is not granted', async () => {
    const tracked = await AnalyticsManager.trackEvent('download_started', 'free');
    expect(tracked).toBeNull();

    const logs = await AnalyticsManager.getAnalyticsLogs();
    expect(logs.length).toBe(0);
  });

  it('should record sanitized analytics events when opt-in consent is granted', async () => {
    await AnalyticsManager.setConsentGranted(true);
    const isConsent = await AnalyticsManager.isConsentGranted();
    expect(isConsent).toBe(true);

    const tracked = await AnalyticsManager.trackEvent(
      'download_failed',
      'free',
      'ERR_BLOB_TIMEOUT',
      5
    );

    expect(tracked).not.toBeNull();
    expect(tracked?.event).toBe('download_failed');
    expect(tracked?.errorCode).toBe('ERR_BLOB_TIMEOUT');
    expect(tracked?.itemCount).toBe(5);
    expect(tracked?.installationId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );

    const logs = await AnalyticsManager.getAnalyticsLogs();
    expect(logs.length).toBe(1);
  });

  it('should purge all local analytics logs on clear AnalyticsLogs call', async () => {
    await AnalyticsManager.setConsentGranted(true);
    await AnalyticsManager.trackEvent('feature_opened', 'pro');

    let logs = await AnalyticsManager.getAnalyticsLogs();
    expect(logs.length).toBe(1);

    await AnalyticsManager.clearAnalyticsLogs();
    logs = await AnalyticsManager.getAnalyticsLogs();
    expect(logs.length).toBe(0);
  });
});
