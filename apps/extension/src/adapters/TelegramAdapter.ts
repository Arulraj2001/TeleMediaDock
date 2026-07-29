import type {
  TelegramVariant,
  ChatMetadata,
  DiscoveredMedia,
  DownloadPayload,
} from '@mediadock/shared';

export interface TelegramAdapter {
  /** Returns the detected Telegram Web variant */
  detectVariant(): TelegramVariant;

  /** Gets current active chat metadata (label, type) without message content */
  getCurrentChat(): ChatMetadata | null;

  /** Observes active chat changes using debounced MutationObserver */
  observeCurrentChat(callback: (chat: ChatMetadata | null) => void): () => void;

  /** Scans currently visible DOM subtree for authorized media items */
  findVisibleMedia(): DiscoveredMedia[];

  /** Observes media changes (new visible media, viewer modals) with debouncing */
  observeMediaChanges(callback: (media: DiscoveredMedia[]) => void): () => void;

  /** Retrieves metadata for a specific discovered media ID */
  getMediaMetadata(mediaId: string): DiscoveredMedia | null;

  /** Stores scan results so later user-initiated downloads can resolve their IDs */
  rememberDiscoveredMedia(media: DiscoveredMedia[]): void;

  /** Requests local blob download for authorized media item */
  requestAuthorizedDownload(mediaId: string): Promise<DownloadPayload>;

  /** Returns true if media is restricted (self-destructing, protected, no-copy) */
  detectRestrictedMedia(element: Element): boolean;

  /** Cleanly disconnects observers and disposes resources */
  dispose(): void;
}
