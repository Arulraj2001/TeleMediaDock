import React from 'react';

export default function DownloadFailureGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-6 text-slate-300">
      <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Download Failure & Network Recovery Guide</h1>
      <p className="text-xs text-slate-400">Diagnosing network errors, blob URL expirations, and queue retries.</p>

      <div className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-[#F8FAFC]">1. Temporary Blob URL Expiration</h2>
        <p>
          Telegram Web generates temporary blob memory URLs for media streams. If a queue item fails due to URL expiration, MediaDock requests the content adapter to refresh the item automatically while the chat remains open.
        </p>

        <h2 className="text-xl font-bold text-[#F8FAFC]">2. Exponential Backoff Retries</h2>
        <p>
          MediaDock retries failed downloads up to 3 times with exponential backoff (1s, 2s, 4s). You can also click <strong>Retry Failed Items</strong> in the queue toolbar.
        </p>
      </div>
    </main>
  );
}
