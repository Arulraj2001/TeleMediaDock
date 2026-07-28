import {
  ExtensionAnalyticsEventSchema,
  type ExtensionEventType,
  type CoarseErrorCode,
  type ExtensionAnalyticsEvent,
} from '@mediadock/validation';
import { DeviceManager } from './DeviceManager';

export class AnalyticsManagerService {
  private static CONSENT_STORAGE_KEY = 'mediadock_analytics_consent';
  private static LOGS_STORAGE_KEY = 'mediadock_analytics_logs';

  /**
   * Check if telemetry consent is enabled.
   * DISABLED BY DEFAULT (returns false unless explicitly consented).
   */
  public async isConsentGranted(): Promise<boolean> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const stored = await chrome.storage.local.get(AnalyticsManagerService.CONSENT_STORAGE_KEY);
      return stored[AnalyticsManagerService.CONSENT_STORAGE_KEY] === true;
    }
    return localStorage.getItem(AnalyticsManagerService.CONSENT_STORAGE_KEY) === 'true';
  }

  /**
   * Set user consent preference
   */
  public async setConsentGranted(granted: boolean): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [AnalyticsManagerService.CONSENT_STORAGE_KEY]: granted });
    } else {
      localStorage.setItem(AnalyticsManagerService.CONSENT_STORAGE_KEY, String(granted));
    }
  }

  /**
   * Record a privacy-sanitized analytics event.
   * If consent is not granted, event is DROPPED SILENTLY.
   */
  public async trackEvent(
    event: ExtensionEventType,
    userTier: 'free' | 'pro',
    errorCode?: CoarseErrorCode,
    itemCount?: number
  ): Promise<ExtensionAnalyticsEvent | null> {
    const consented = await this.isConsentGranted();
    if (!consented) {
      return null;
    }

    const installationId = await DeviceManager.getInstallationId();

    const candidate: ExtensionAnalyticsEvent = {
      event,
      timestamp: new Date().toISOString(),
      installationId,
      userTier,
      errorCode,
      itemCount,
    };

    // Zod Schema Validation & Sanitization
    const parsed = ExtensionAnalyticsEventSchema.safeParse(candidate);
    if (!parsed.success) {
      return null;
    }

    const sanitizedEvent = parsed.data;

    // Save to local telemetry log
    await this.persistLog(sanitizedEvent);
    return sanitizedEvent;
  }

  /**
   * Get all locally stored telemetry logs
   */
  public async getAnalyticsLogs(): Promise<ExtensionAnalyticsEvent[]> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const stored = await chrome.storage.local.get(AnalyticsManagerService.LOGS_STORAGE_KEY);
      return stored[AnalyticsManagerService.LOGS_STORAGE_KEY] || [];
    }
    const raw = localStorage.getItem(AnalyticsManagerService.LOGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  /**
   * Purge all local analytics telemetry logs (Data Deletion)
   */
  public async clearAnalyticsLogs(): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.remove(AnalyticsManagerService.LOGS_STORAGE_KEY);
    } else {
      localStorage.removeItem(AnalyticsManagerService.LOGS_STORAGE_KEY);
    }
  }

  private async persistLog(log: ExtensionAnalyticsEvent): Promise<void> {
    const current = await this.getAnalyticsLogs();
    current.push(log);
    // Cap at 100 recent entries
    const trimmed = current.slice(-100);

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [AnalyticsManagerService.LOGS_STORAGE_KEY]: trimmed });
    } else {
      localStorage.setItem(AnalyticsManagerService.LOGS_STORAGE_KEY, JSON.stringify(trimmed));
    }
  }
}

export const AnalyticsManager = new AnalyticsManagerService();
