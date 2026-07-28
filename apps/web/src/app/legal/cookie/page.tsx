import React from 'react';

export default function CookiePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-slate-300">
      <header className="space-y-3 border-b border-[#243047] pb-6">
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Cookie & Storage Policy</h1>
        <p className="text-xs text-slate-400">Effective Date: July 28, 2026</p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-[#F8FAFC]">1. Essential Cookies Only</h2>
        <p>
          MediaDock companion website uses essential session cookies solely to maintain user authentication states. We do not use cross-site tracking cookies or invasive advertising cookies.
        </p>

        <h2 className="text-xl font-bold text-[#F8FAFC]">2. Extension Local Storage</h2>
        <p>
          The browser extension uses <code className="text-[#4F46E5]">chrome.storage.local</code> to save user preferences, custom filename rules, and local download history offline.
        </p>
      </section>
    </main>
  );
}
