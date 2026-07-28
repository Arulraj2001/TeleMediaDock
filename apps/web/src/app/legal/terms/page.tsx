import React from 'react';

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-slate-300">
      <header className="space-y-3 border-b border-[#243047] pb-6">
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Terms of Service</h1>
        <p className="text-xs text-slate-400">Effective Date: July 28, 2026</p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-[#F8FAFC]">1. Acceptance of Terms</h2>
        <p>
          By installing or using the MediaDock browser extension or visiting our companion website, you agree to comply with and be bound by these Terms of Service.
        </p>

        <h2 className="text-xl font-bold text-[#F8FAFC]">2. Non-Affiliation Disclaimer</h2>
        <p className="text-amber-400 font-semibold">
          MediaDock is an independent project and is not affiliated with, endorsed by, or sponsored by Telegram Messenger Inc.
        </p>

        <h2 className="text-xl font-bold text-[#F8FAFC]">3. Permitted Usage</h2>
        <p>
          MediaDock provides automated organization tools for media accessible within your authenticated Telegram Web browser session. You must only download media assets that you have legal authorization to access and store.
        </p>
      </section>
    </main>
  );
}
