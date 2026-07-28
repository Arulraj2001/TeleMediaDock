import { AdapterFactory } from '../src/adapters/AdapterFactory';
import { MediaDockOverlayManager } from '../src/adapters/MediaDockOverlayManager';
import { SelectorHealthChecker } from '../src/adapters/SelectorHealthChecker';

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

    const overlayManager = new MediaDockOverlayManager(async (media) => {
      try {
        const payload = await adapter.requestAuthorizedDownload(media.id);
        chrome.runtime.sendMessage({
          type: 'MEDIADOCK_TRIGGER_DOWNLOAD',
          payload,
        });
      } catch (err) {
        console.error('[MediaDock] Download trigger error:', err);
      }
    });

    // Begin debounced media observation
    const stopMediaObservation = adapter.observeMediaChanges((discoveredMedia) => {
      overlayManager.updateOverlay(discoveredMedia);
      
      chrome.runtime.sendMessage({
        type: 'MEDIADOCK_MEDIA_DISCOVERED',
        payload: {
          chat: adapter.getCurrentChat(),
          mediaCount: discoveredMedia.length,
          discoveredMedia,
        },
      }).catch(() => {});

    });

    // Cleanup on window unload
    window.addEventListener('beforeunload', () => {
      stopMediaObservation();
      overlayManager.dispose();
      adapter.dispose();
    });
  },
});
