import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-slate-300">
      <header className="space-y-3 border-b border-[#243047] pb-6">
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Effective Date: July 28, 2026</p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-[#F8FAFC]">1. Zero-Server Media Processing Guarantee</h2>
        <p>
          MediaDock is architected privacy-first. All media detection, file processing, filename token rendering, and downloads occur 100% locally within your browser context. Message content, captions, usernames, chat labels, and raw media files are never transmitted to or stored on MediaDock servers.
        </p>

        <h2 className="text-xl font-bold text-[#F8FAFC]">2. Data Collected & Account Information</h2>
        <p>
          Account registration is completely optional. If you sign in to sync preferences or purchase a Pro subscription, we collect only your email address, subscription status, and randomly generated UUID installation IDs. Card billing details are handled directly by hosted payment processor Lemon Squeezy and are never seen by our systems.
        </p>

        <h2 className="text-xl font-bold text-[#F8FAFC]">3. Local Storage Usage</h2>
        <p>
          MediaDock stores user preferences, filename templates, duplicate tracking signatures, and local download history strictly within your browser&apos;s IndexedDB and local storage.
        </p>
      </section>
    </main>
  );
}
