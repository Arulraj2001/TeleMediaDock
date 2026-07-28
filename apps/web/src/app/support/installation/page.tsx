import React from 'react';

export default function InstallationGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-6 text-slate-300">
      <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Installation & Getting Started Guide</h1>
      <p className="text-xs text-slate-400">Step-by-step setup guide for MediaDock Chrome MV3 Extension.</p>

      <div className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-[#F8FAFC]">Step 1: Install from Chrome Web Store</h2>
        <p>
          Visit the Chrome Web Store, search for &quot;MediaDock&quot;, and click &quot;Add to Chrome&quot;. Confirm the permission prompts to allow local download operations.
        </p>

        <h2 className="text-xl font-bold text-[#F8FAFC]">Step 2: Pin Extension to Toolbar</h2>
        <p>
          Click the puzzle piece extension icon in your Chrome toolbar and click the pin icon next to MediaDock.
        </p>

        <h2 className="text-xl font-bold text-[#F8FAFC]">Step 3: Open Telegram Web & SidePanel</h2>
        <p>
          Open Telegram Web (K or A version). Click the MediaDock icon to open the responsive side panel interface. MediaDock will automatically attach to your current active chat session.
        </p>
      </div>
    </main>
  );
}
