import { SelectorHealthReportSchema } from '@mediadock/validation';
import type { TelegramVariant, SelectorHealthReport } from '@mediadock/shared';

export type HealthReportListener = (report: SelectorHealthReport) => void;

export class SelectorHealthChecker {
  private static instance: SelectorHealthChecker;
  private listeners: Set<HealthReportListener> = new Set();
  private reportedFailures: Set<string> = new Set();
  private adapterVersion = '1.0.0';
  private extensionVersion = '1.0.0';

  private constructor() {}

  public static getInstance(): SelectorHealthChecker {
    if (!SelectorHealthChecker.instance) {
      SelectorHealthChecker.instance = new SelectorHealthChecker();
    }
    return SelectorHealthChecker.instance;
  }

  public addListener(listener: HealthReportListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Reports a selector query failure cleanly without attaching DOM node HTML or page text.
   */
  public reportSelectorFailure(telegramVariant: TelegramVariant, selectorId: string): void {
    // Sanitize selector identifier to ensure zero raw text or HTML leaking
    const cleanSelectorId = selectorId.replace(/[^a-zA-Z0-9_.-]/g, '_');

    const failureKey = `${telegramVariant}:${cleanSelectorId}`;

    if (this.reportedFailures.has(failureKey)) {
      return; // Deduplicate to avoid log flooding
    }

    this.reportedFailures.add(failureKey);

    const rawReport = {
      adapterVersion: this.adapterVersion,
      telegramVariant,
      failedSelectorId: cleanSelectorId,
      extensionVersion: this.extensionVersion,
    };

    // Strict validation enforcing schema parameters
    const parseResult = SelectorHealthReportSchema.safeParse(rawReport);
    if (!parseResult.success) {
      console.warn('[MediaDock Health] Report failed validation:', parseResult.error);
      return;
    }

    const validReport = parseResult.data as SelectorHealthReport;

    this.listeners.forEach((listener) => {
      try {
        listener(validReport);
      } catch (err) {
        console.error('[MediaDock Health] Listener error:', err);
      }
    });
  }

  public reset(): void {
    this.reportedFailures.clear();
  }
}
