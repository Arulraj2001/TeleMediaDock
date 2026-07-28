import React from 'react';

export default function CopyrightPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-slate-300">
      <header className="space-y-3 border-b border-[#243047] pb-6">
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Copyright & Takedown Policy</h1>
        <p className="text-xs text-slate-400">Effective Date: July 28, 2026</p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-[#F8FAFC]">1. DMCA Compliance Notice</h2>
        <p>
          MediaDock respects intellectual property rights. Because MediaDock is a client-side extension tool and does not host, index, or store user chat media on remote servers, takedown requests regarding content hosted on Telegram must be directed to Telegram Messenger Inc.
        </p>

        <h2 className="text-xl font-bold text-[#F8FAFC]">2. Submitting Copyright Inquiries</h2>
        <p>
          For copyright inquiries regarding official MediaDock documentation or website content, please contact <code className="text-[#4F46E5]">copyright@mediadock.app</code>.
        </p>
      </section>
    </main>
  );
}
