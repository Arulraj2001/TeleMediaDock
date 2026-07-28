import React from 'react';

export default function TroubleshootingGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-6 text-slate-300">
      <h1 className="text-3xl font-extrabold text-[#F8FAFC]">General Troubleshooting Guide</h1>
      <p className="text-xs text-slate-400">Diagnose connection states, permission prompts, and detection issues.</p>

      <div className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-[#F8FAFC]">Issue 1: Media Explorer shows &quot;No Chat Selected&quot;</h2>
        <p>
          Ensure you have open Telegram Web in an active browser tab and have selected a conversation. If switching chats, wait 1-2 seconds for MediaDock&apos;s MutationObserver to detect the active chat label.
        </p>

        <h2 className="text-xl font-bold text-[#F8FAFC]">Issue 2: Browser Download Permission Warning</h2>
        <p>
          When executing batch downloads for the first time, Chrome may prompt: &quot;Allow MediaDock to download multiple files?&quot; Click <strong>Allow</strong> to permit continuous queue processing.
        </p>
      </div>
    </main>
  );
}
