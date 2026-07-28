import type {
  TelegramVariant,
  ChatMetadata,
  DiscoveredMedia,
  DownloadPayload,
} from '@mediadock/shared';
import { BaseTelegramAdapter } from './BaseTelegramAdapter';

export class WebAAdapter extends BaseTelegramAdapter {
  public detectVariant(): TelegramVariant {
    return 'webA';
  }

  public getCurrentChat(): ChatMetadata | null {
    const chatTitleEl =
      this.safeQuery<HTMLElement>(document, '.chat-title, .person-name', 'chat_title_weba') ||
      this.safeQuery<HTMLElement>(document, '.tgico-user', 'user_title_weba');

    if (!chatTitleEl) return null;

    const label = chatTitleEl.textContent?.trim() || 'Unknown Chat';

    return {
      id: `weba_${label.toLowerCase().replace(/\s+/g, '_')}`,
      label,
      isGroup: false,
      isChannel: false,
    };
  }

  public findVisibleMedia(): DiscoveredMedia[] {
    const results: DiscoveredMedia[] = [];

    const viewerModal = document.querySelector('.viewer-container, .modal-viewer');
    if (viewerModal && !this.detectRestrictedMedia(viewerModal)) {
      const imgEl = viewerModal.querySelector<HTMLImageElement>('img');
      const videoEl = viewerModal.querySelector<HTMLVideoElement>('video');

      if (videoEl && videoEl.src) {
        results.push({
          id: `weba_viewer_video_${Date.now()}`,
          type: 'video',
          element: videoEl as HTMLElement,
          srcUrl: videoEl.src,
          mimeType: 'video/mp4',
          isRestricted: false,
        });
      } else if (imgEl && imgEl.src) {
        results.push({
          id: `weba_viewer_photo_${Date.now()}`,
          type: 'image',
          element: imgEl as HTMLElement,
          srcUrl: imgEl.src,
          mimeType: 'image/jpeg',
          isRestricted: false,
        });
      }
    }

    const mediaContainers = this.safeQueryAll<HTMLElement>(
      document,
      '.media-container, .photo-container, .video-container',
      'media_containers_weba'
    );

    mediaContainers.forEach((el, index) => {
      if (this.detectRestrictedMedia(el)) return;

      const imgEl = el.querySelector<HTMLImageElement>('img');
      const videoEl = el.querySelector<HTMLVideoElement>('video');

      if (videoEl && videoEl.src) {
        results.push({
          id: `weba_video_${index}_${Date.now()}`,
          type: 'video',
          element: el,
          srcUrl: videoEl.src,
          mimeType: 'video/mp4',
          isRestricted: false,
        });
      } else if (imgEl && imgEl.src) {
        results.push({
          id: `weba_photo_${index}_${Date.now()}`,
          type: 'image',
          element: el,
          srcUrl: imgEl.src,
          mimeType: 'image/jpeg',
          isRestricted: false,
        });
      }
    });

    return results;
  }

  public async requestAuthorizedDownload(mediaId: string): Promise<DownloadPayload> {
    const media = this.getMediaMetadata(mediaId);
    if (!media || !media.srcUrl) {
      throw new Error(`Media ID ${mediaId} not available for download.`);
    }

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
}
