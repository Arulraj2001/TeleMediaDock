import React from 'react';

export default function UnsupportedLayoutGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-6 text-slate-300">
      <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Telegram Layout Unsupported Guide</h1>
      <p className="text-xs text-slate-400">Understanding variant detection and layout compatibility.</p>

      <div className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-[#F8FAFC]">Variant Detection Architecture</h2>
        <p>
          MediaDock uses decoupled adapter modules (`TelegramWebKAdapter` and `TelegramWebAAdapter`) to interface with Telegram Web DOM elements safely.
        </p>

        <h2 className="text-xl font-bold text-[#F8FAFC]">What happens if Telegram updates its layout?</h2>
        <p>
          If Telegram updates class names or container structures, MediaDock gracefully displays an &quot;Unsupported Telegram Layout&quot; notification. Our engineering team releases adapter hotfixes within 24 hours.
        </p>
      </div>
    </main>
  );
}
