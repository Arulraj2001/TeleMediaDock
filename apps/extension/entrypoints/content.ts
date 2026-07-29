import { AdapterFactory } from '../src/adapters/AdapterFactory';
import { MediaDockOverlayManager } from '../src/adapters/MediaDockOverlayManager';
import { SelectorHealthChecker } from '../src/adapters/SelectorHealthChecker';
import type { DiscoveredMedia, DownloadPayload } from '@mediadock/shared';

type SerializableMedia = Omit<DiscoveredMedia, 'element'>;

function serializeMedia(media: DiscoveredMedia[]): SerializableMedia[] {
  return media.map(({ element: _element, ...item }) => item);
}

function filenameWithExtension(filename: string, mimeType: string): string {
  if (/\.[a-z0-9]{2,8}$/i.test(filename)) return filename;

  const extensions: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'audio/ogg': '.ogg',
    'audio/mpeg': '.mp3',
    'application/pdf': '.pdf',
  };

  return `${filename}${extensions[mimeType] || ''}`;
}

function downloadFromTelegramPage(payload: DownloadPayload): void {
  const link = document.createElement('a');
  link.href = payload.blobUrl;
  link.download = filenameWithExtension(payload.filename, payload.mimeType);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();

  if (payload.blobUrl.startsWith('blob:')) {
    window.setTimeout(() => URL.revokeObjectURL(payload.blobUrl), 60_000);
  }
}

export default defineContentScript({
  matches: [
    'https://web.telegram.org/*',
    'https://k.telegram.org/*',
    'https://z.telegram.org/*',
  ],
  main() {
    const adapter = AdapterFactory.createAdapter();

    if (!adapter) {
      console.warn('[MediaDock] Unsupported Telegram Web layout detected on page load.');
      return;
    }

    const healthChecker = SelectorHealthChecker.getInstance();
    healthChecker.addListener((report) => {
      // Dispatches telemetry message safely without DOM content or user page text
      chrome.runtime.sendMessage({
        type: 'MEDIADOCK_HEALTH_REPORT',
        payload: report,
      }).catch(() => {
        // Extension context invalidated or service worker sleeping
      });
    });

    const publishMedia = (discoveredMedia: DiscoveredMedia[]) => {
      chrome.runtime.sendMessage({
        type: 'MEDIADOCK_MEDIA_DISCOVERED',
        payload: {
          chat: adapter.getCurrentChat(),
          mediaCount: discoveredMedia.length,
          discoveredMedia: serializeMedia(discoveredMedia),
        },
      }).catch(() => {
        // The panel may be closed, or the extension may have just reloaded.
      });
    };

    const downloadMedia = async (mediaId: string) => {
      try {
        const payload = await adapter.requestAuthorizedDownload(mediaId);
        downloadFromTelegramPage(payload);
        return payload;
      } catch (error) {
        // Telegram documents are sometimes represented only by a native download
        // control until the web client has materialized a local Blob URL.
        const media = adapter.getMediaMetadata(mediaId);
        const nativeDownload = media?.element?.querySelector<HTMLElement>(
          'a[download], .download, .document-download, .btn-download, [role="button"][aria-label*="download" i], button[title*="download" i]'
        );
        if (!nativeDownload) throw error;

        nativeDownload.click();
        return {
          mediaId,
          blobUrl: '',
          filename: media?.originalFilename || `telegram_${media?.type || 'file'}_${Date.now()}`,
          mimeType: media?.mimeType || 'application/octet-stream',
          size: media?.fileSize || 0,
        };
      }
    };

    const overlayManager = new MediaDockOverlayManager(async (media) => {
      try {
        await downloadMedia(media.id);
      } catch (err) {
        console.error('[MediaDock] Download trigger error:', err);
      }
    });

    // Begin debounced media observation
    const stopMediaObservation = adapter.observeMediaChanges((discoveredMedia) => {
      overlayManager.updateOverlay(discoveredMedia);
      publishMedia(discoveredMedia);
    });

    const messageListener = (
      message: { type?: string; mediaId?: string },
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response: unknown) => void
    ) => {
      if (message.type === 'MEDIADOCK_REQUEST_SCAN') {
        const discoveredMedia = adapter.findVisibleMedia();
        adapter.rememberDiscoveredMedia(discoveredMedia);
        sendResponse({
          success: true,
          chat: adapter.getCurrentChat(),
          discoveredMedia: serializeMedia(discoveredMedia),
        });
        return;
      }

      if (message.type === 'MEDIADOCK_DOWNLOAD_MEDIA' && message.mediaId) {
        downloadMedia(message.mediaId)
          .then((payload) => sendResponse({ success: true, filename: payload.filename }))
          .catch((error: unknown) =>
            sendResponse({
              success: false,
              error: error instanceof Error ? error.message : 'Unable to download this media.',
            })
          );
        return true;
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup on window unload
    window.addEventListener('beforeunload', () => {
      chrome.runtime.onMessage.removeListener(messageListener);
      stopMediaObservation();
      overlayManager.dispose();
      adapter.dispose();
    });
  },
});
