import type {
  TelegramVariant,
  ChatMetadata,
  DiscoveredMedia,
  DownloadPayload,
} from '@mediadock/shared';
import type { TelegramAdapter } from './TelegramAdapter';
import { SelectorHealthChecker } from './SelectorHealthChecker';

export abstract class BaseTelegramAdapter implements TelegramAdapter {
  protected healthChecker = SelectorHealthChecker.getInstance();
  protected observer: MutationObserver | null = null;
  protected chatObserver: MutationObserver | null = null;
  protected debounceTimer: ReturnType<typeof setTimeout> | null = null;
  protected chatDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  protected discoveredMap: Map<string, DiscoveredMedia> = new Map();

  abstract detectVariant(): TelegramVariant;
  abstract getCurrentChat(): ChatMetadata | null;
  abstract findVisibleMedia(): DiscoveredMedia[];
  abstract requestAuthorizedDownload(mediaId: string): Promise<DownloadPayload>;

  /**
   * Evaluates elements for disappearing timers, protected channel attributes, or self-destructing indicators.
   */
  public detectRestrictedMedia(element: Element): boolean {
    if (!element) return false;

    // Check direct or ancestor elements for protection flags
    const isProtected =
      element.closest('.protected-content') !== null ||
      element.closest('.no-copy') !== null ||
      element.closest('[data-protected="true"]') !== null ||
      element.closest('.user-select-none') !== null;

    if (isProtected) return true;

    // Check for self-destructing / disappearing TTL timer badges
    const hasTtlTimer =
      element.querySelector('.ttl-icon, .timer-icon, .self-destruct-timer, [data-ttl]') !== null ||
      element.closest('.message-ttl') !== null ||
      element.getAttribute('data-ttl') !== null;

    return hasTtlTimer;
  }

  public observeCurrentChat(callback: (chat: ChatMetadata | null) => void): () => void {
    const handleCheck = () => {
      if (this.chatDebounceTimer) clearTimeout(this.chatDebounceTimer);
      this.chatDebounceTimer = setTimeout(() => {
        const currentChat = this.getCurrentChat();
        callback(currentChat);
      }, 250);
    };

    // Initial check
    handleCheck();

    this.chatObserver = new MutationObserver(() => {
      handleCheck();
    });

    const targetNode = document.body || document.documentElement;
    if (targetNode) {
      this.chatObserver.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'id'],
      });
    }

    return () => {
      if (this.chatDebounceTimer) clearTimeout(this.chatDebounceTimer);
      this.chatObserver?.disconnect();
    };
  }

  public observeMediaChanges(callback: (media: DiscoveredMedia[]) => void): () => void {
    const handleScan = () => {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        const visibleMedia = this.findVisibleMedia();
        // Update local map cache
        visibleMedia.forEach((item) => {
          this.discoveredMap.set(item.id, item);
        });
        callback(visibleMedia);
      }, 250);
    };

    // Initial scan
    handleScan();

    this.observer = new MutationObserver((mutations) => {
      let shouldScan = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
          shouldScan = true;
          break;
        }
      }
      if (shouldScan) {
        handleScan();
      }
    });

    const targetNode = document.body || document.documentElement;
    if (targetNode) {
      this.observer.observe(targetNode, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.observer?.disconnect();
    };
  }

  public getMediaMetadata(mediaId: string): DiscoveredMedia | null {
    return this.discoveredMap.get(mediaId) || null;
  }

  public rememberDiscoveredMedia(media: DiscoveredMedia[]): void {
    media.forEach((item) => this.discoveredMap.set(item.id, item));
  }

  protected safeQuery<T extends Element>(
    parent: ParentNode,
    selector: string,
    selectorId: string
  ): T | null {
    try {
      const el = parent.querySelector<T>(selector);
      if (!el && parent === document) {
        this.healthChecker.reportSelectorFailure(this.detectVariant(), selectorId);
      }
      return el;
    } catch {
      this.healthChecker.reportSelectorFailure(this.detectVariant(), selectorId);
      return null;
    }
  }

  protected safeQueryAll<T extends Element>(
    parent: ParentNode,
    selector: string,
    selectorId: string
  ): T[] {
    try {
      const nodes = parent.querySelectorAll<T>(selector);
      if (nodes.length === 0 && parent === document) {
        this.healthChecker.reportSelectorFailure(this.detectVariant(), selectorId);
      }
      return Array.from(nodes);
    } catch {
      this.healthChecker.reportSelectorFailure(this.detectVariant(), selectorId);
      return [];
    }
  }

  public dispose(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (this.chatDebounceTimer) clearTimeout(this.chatDebounceTimer);
    this.observer?.disconnect();
    this.chatObserver?.disconnect();
    this.discoveredMap.clear();
  }
}
