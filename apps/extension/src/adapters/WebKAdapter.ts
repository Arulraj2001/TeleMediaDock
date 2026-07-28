import type {
  TelegramVariant,
  ChatMetadata,
  DiscoveredMedia,
  DownloadPayload,
  MediaType,
} from '@mediadock/shared';
import { BaseTelegramAdapter } from './BaseTelegramAdapter';

export class WebKAdapter extends BaseTelegramAdapter {
  public detectVariant(): TelegramVariant {
    return 'webk';
  }

  public getCurrentChat(): ChatMetadata | null {
    const chatTitleEl =
      this.safeQuery<HTMLElement>(document, '.chat-info .peer-title', 'chat_title_webk') ||
      this.safeQuery<HTMLElement>(document, '.top-bar .peer-title', 'top_bar_title_webk');

    if (!chatTitleEl) return null;

    const label = chatTitleEl.textContent?.trim() || 'Unknown Chat';
    const isGroup = document.querySelector('.chat-info .peer-subtitle')?.textContent?.includes('member') ?? false;
    const isChannel = document.querySelector('.chat-info .peer-subtitle')?.textContent?.includes('subscriber') ?? false;

    return {
      id: `webk_${label.toLowerCase().replace(/\s+/g, '_')}`,
      label,
      isGroup,
      isChannel,
    };
  }

  public findVisibleMedia(): DiscoveredMedia[] {
    const results: DiscoveredMedia[] = [];

    // 1. Scan open full-screen Media Viewer modal if active
    const viewerModal = document.querySelector('.media-viewer, .popup-media-viewer');
    if (viewerModal) {
      const viewerMedia = this.extractViewerMedia(viewerModal);
      if (viewerMedia) {
        results.push(viewerMedia);
      }
    }

    // 2. Scan visible chat message bubbles
    const mediaElements = this.safeQueryAll<HTMLElement>(
      document,
      '.message-media, .bubble-media, .media-container',
      'media_containers_webk'
    );

    mediaElements.forEach((el, index) => {
      // Check restricted / disappearing media filter first
      if (this.detectRestrictedMedia(el)) {
        return;
      }

      const mediaItem = this.parseMediaElement(el, index);
      if (mediaItem) {
        results.push(mediaItem);
      }
    });

    return results;
  }

  private extractViewerMedia(viewerModal: Element): DiscoveredMedia | null {
    if (this.detectRestrictedMedia(viewerModal)) {
      return null;
    }

    const imgEl = viewerModal.querySelector<HTMLImageElement>('img.full-media, img.media-viewer-image, img');
    const videoEl = viewerModal.querySelector<HTMLVideoElement>('video.full-media, video');

    if (videoEl && videoEl.src) {
      return {
        id: `webk_viewer_video_${Date.now()}`,
        type: 'video',
        element: videoEl as HTMLElement,
        srcUrl: videoEl.src,
        mimeType: 'video/mp4',
        isRestricted: false,
      };
    }

    if (imgEl && imgEl.src) {
      return {
        id: `webk_viewer_photo_${Date.now()}`,
        type: 'image',
        element: imgEl as HTMLElement,
        srcUrl: imgEl.src,
        mimeType: 'image/jpeg',
        isRestricted: false,
      };
    }

    return null;
  }

  private parseMediaElement(el: HTMLElement, index: number): DiscoveredMedia | null {
    const imgEl = el.querySelector<HTMLImageElement>('img');
    const videoEl = el.querySelector<HTMLVideoElement>('video');
    const docNameEl = el.querySelector<HTMLElement>('.document-name, .file-name');
    const docSizeEl = el.querySelector<HTMLElement>('.document-size, .file-size');
    const senderEl = el.closest('.message, .bubble')?.querySelector<HTMLElement>('.sender-name, .peer-title');
    const timeEl = el.closest('.message, .bubble')?.querySelector<HTMLElement>('.message-time, time');

    const senderLabel = senderEl?.textContent?.trim();
    const timestamp = timeEl?.textContent?.trim();
    const originalFilename = docNameEl?.textContent?.trim();

    let fileSize: number | undefined;
    if (docSizeEl?.textContent) {
      fileSize = this.parseSizeString(docSizeEl.textContent);
    }

    if (videoEl && (videoEl.src || videoEl.currentSrc)) {
      return {
        id: `webk_video_${index}_${Date.now()}`,
        type: 'video',
        element: el,
        srcUrl: videoEl.src || videoEl.currentSrc,
        mimeType: 'video/mp4',
        fileSize,
        timestamp,
        senderLabel,
        originalFilename,
        isRestricted: false,
      };
    }

    if (imgEl && imgEl.src) {
      const type: MediaType = imgEl.src.endsWith('.gif') ? 'gif' : 'image';
      return {
        id: `webk_photo_${index}_${Date.now()}`,
        type,
        element: el,
        srcUrl: imgEl.src,
        mimeType: 'image/jpeg',
        fileSize,
        timestamp,
        senderLabel,
        originalFilename,
        isRestricted: false,
      };
    }

    if (docNameEl) {
      return {
        id: `webk_doc_${index}_${Date.now()}`,
        type: 'document',
        element: el,
        mimeType: 'application/octet-stream',
        fileSize,
        timestamp,
        senderLabel,
        originalFilename,
        isRestricted: false,
      };
    }

    return null;
  }

  public async requestAuthorizedDownload(mediaId: string): Promise<DownloadPayload> {
    const media = this.getMediaMetadata(mediaId);
    if (!media) {
      throw new Error(`Media with ID ${mediaId} not found or no longer visible.`);
    }

    if (media.isRestricted) {
      throw new Error('Cannot download restricted or disappearing media.');
    }

    if (media.srcUrl && media.srcUrl.startsWith('blob:')) {
      const response = await fetch(media.srcUrl);
      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      return {
        mediaId,
        blobUrl: localUrl,
        filename: media.originalFilename || `mediadock_${media.type}_${Date.now()}`,
        mimeType: blob.type || media.mimeType || 'application/octet-stream',
        size: blob.size,
      };
    }

    if (media.srcUrl) {
      const response = await fetch(media.srcUrl, { mode: 'cors', credentials: 'omit' });
      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      return {
        mediaId,
        blobUrl: localUrl,
        filename: media.originalFilename || `mediadock_${media.type}_${Date.now()}`,
        mimeType: blob.type || media.mimeType || 'application/octet-stream',
        size: blob.size,
      };
    }

    throw new Error('Authorized media source URL unavailable in current DOM session.');
  }

  private parseSizeString(sizeStr: string): number | undefined {
    const match = sizeStr.match(/([\d.]+)\s*(KB|MB|GB|B)/i);
    if (!match || !match[1] || !match[2]) return undefined;
    const num = parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    if (unit === 'KB') return Math.round(num * 1024);
    if (unit === 'MB') return Math.round(num * 1024 * 1024);
    if (unit === 'GB') return Math.round(num * 1024 * 1024 * 1024);
    return Math.round(num);
  }
}
