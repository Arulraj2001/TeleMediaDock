import { DownloadManager } from '../src/services/DownloadManager';

export default defineBackground(() => {
  const downloadManager = DownloadManager.getInstance();

  // Recover pending/interrupted downloads when Service Worker boots
  chrome.runtime.onStartup.addListener(() => {
    downloadManager.recoverPendingDownloads();
  });

  chrome.runtime.onInstalled.addListener(() => {
    downloadManager.recoverPendingDownloads();
  });

  // Handle download trigger messages from content scripts or sidepanel
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'MEDIADOCK_TRIGGER_DOWNLOAD') {
      downloadManager
        .handleUserDownloadRequest(message.payload, true)
        .then((jobId) => sendResponse({ success: true, jobId }))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true; // Keep message channel open for async response
    }
  });
});
