import React from 'react';
import { AdBannerSlot } from '../../../components/AdBannerSlot';

export default function BrowserExtensionPrivacyGuide() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-slate-200">
      <header className="space-y-3">
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">
          Understanding Local Processing & Browser Extension Privacy
        </h1>
        <p className="text-xs text-slate-400">
          Published by MediaDock Security Team • Updated July 2026
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed text-slate-300">
        <p>
          Browser extension security is paramount when interacting with web applications. True privacy-first extensions operate entirely on client-side memory and local IndexedDB storage.
        </p>
        <h2 className="text-xl font-bold text-[#F8FAFC]">1. Zero-Server Data Guarantee</h2>
        <p>
          MediaDock processes chat media, filenames, and download operations 100% locally. No message content, captions, or raw media URLs are ever transmitted to external servers.
        </p>
      </section>

      {/* Website Ad Banner Container */}
      <AdBannerSlot />

      <section className="space-y-4 text-sm leading-relaxed text-slate-300">
        <h2 className="text-xl font-bold text-[#F8FAFC]">2. Manifest V3 & Extension Permissions</h2>
        <p>
          Modern extensions request explicit permissions (<code className="text-[#4F46E5]">downloads</code>, <code className="text-[#4F46E5]">storage</code>) to perform authorized background downloads safely without accessing unauthorized origins.
        </p>
      </section>
    </main>
  );
}
