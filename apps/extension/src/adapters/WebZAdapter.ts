import type {
  TelegramVariant,
  ChatMetadata,
  DiscoveredMedia,
  DownloadPayload,
  MediaType,
} from '@mediadock/shared';
import { BaseTelegramAdapter } from './BaseTelegramAdapter';

export class WebZAdapter extends BaseTelegramAdapter {
  public detectVariant(): TelegramVariant {
    return 'webz';
  }

  public getCurrentChat(): ChatMetadata | null {
    const chatTitleEl =
      this.safeQuery<HTMLElement>(document, '.ChatInfo .title', 'chat_title_webz') ||
      this.safeQuery<HTMLElement>(document, '.top-header .title', 'top_header_title_webz');

    if (!chatTitleEl) return null;

    const label = chatTitleEl.textContent?.trim() || 'Unknown Chat';
    const isGroup = document.querySelector('.ChatInfo .status')?.textContent?.includes('member') ?? false;
    const isChannel = document.querySelector('.ChatInfo .status')?.textContent?.includes('subscriber') ?? false;

    return {
      id: `webz_${label.toLowerCase().replace(/\s+/g, '_')}`,
      label,
      isGroup,
      isChannel,
    };
  }

  public findVisibleMedia(): DiscoveredMedia[] {
    const results: DiscoveredMedia[] = [];

    // 1. Scan active MediaViewer modal in Web Z
    const viewerModal = document.querySelector('.MediaViewer, .media-viewer-content');
    if (viewerModal) {
      const viewerMedia = this.extractViewerMedia(viewerModal);
      if (viewerMedia) {
        results.push(viewerMedia);
      }
    }

    // 2. Scan visible chat message bubbles
    const mediaElements = this.safeQueryAll<HTMLElement>(
      document,
      '.Media, .media-inner, .Message .media',
      'media_containers_webz'
    );

    mediaElements.forEach((el, index) => {
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

    const imgEl = viewerModal.querySelector<HTMLImageElement>('img.media-photo, img');
    const videoEl = viewerModal.querySelector<HTMLVideoElement>('video.media-video, video');

    if (videoEl && videoEl.src) {
      return {
        id: `webz_viewer_video_${Date.now()}`,
        type: 'video',
        element: videoEl as HTMLElement,
        srcUrl: videoEl.src,
        mimeType: 'video/mp4',
        isRestricted: false,
      };
    }

    if (imgEl && imgEl.src) {
      return {
        id: `webz_viewer_photo_${Date.now()}`,
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
    const docNameEl = el.querySelector<HTMLElement>('.document-title, .file-title');
    const docSizeEl = el.querySelector<HTMLElement>('.document-size, .file-size');
    const senderEl = el.closest('.Message, .message-select')?.querySelector<HTMLElement>('.message-title, .sender-title');
    const timeEl = el.closest('.Message, .message-select')?.querySelector<HTMLElement>('.message-date, .date');

    const senderLabel = senderEl?.textContent?.trim();
    const timestamp = timeEl?.textContent?.trim();
    const originalFilename = docNameEl?.textContent?.trim();

    let fileSize: number | undefined;
    if (docSizeEl?.textContent) {
      fileSize = this.parseSizeString(docSizeEl.textContent);
    }

    if (videoEl && (videoEl.src || videoEl.currentSrc)) {
      return {
        id: `webz_video_${index}_${Date.now()}`,
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
        id: `webz_photo_${index}_${Date.now()}`,
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
        id: `webz_doc_${index}_${Date.now()}`,
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
