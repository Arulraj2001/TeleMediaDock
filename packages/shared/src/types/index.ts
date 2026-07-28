export type UserPlanTier = 'free' | 'pro';

export type MediaType = 'image' | 'video' | 'audio' | 'voice' | 'gif' | 'sticker' | 'document';

export type TelegramVariant = 'webk' | 'webz' | 'webA' | 'unknown';

export interface ChatMetadata {
  id: string;
  label: string;
  isGroup: boolean;
  isChannel: boolean;
}

export interface MediaItemMetadata {
  id: string;
  chatId: string;
  chatTitle: string;
  mediaType: MediaType;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  blobUrl?: string;
  timestamp: number;
  authorName?: string;
}

export interface DiscoveredMedia {
  id: string;
  type: MediaType;
  element?: HTMLElement;
  srcUrl?: string;
  mimeType?: string;
  fileSize?: number;
  timestamp?: string;
  senderLabel?: string;
  originalFilename?: string;
  isRestricted: boolean;
}

export interface DownloadPayload {
  mediaId: string;
  blobUrl: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface SelectorHealthReport {
  adapterVersion: string;
  telegramVariant: TelegramVariant;
  failedSelectorId: string;
  extensionVersion: string;
}

export interface DownloadQueueItem {
  id: string;
  mediaItem: MediaItemMetadata;
  targetPath: string;
  status: 'queued' | 'downloading' | 'completed' | 'failed' | 'paused';
  progress: number;
  error?: string;
  downloadId?: number;
}
