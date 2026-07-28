import React from 'react';

export default function AcceptableUsePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-slate-300">
      <header className="space-y-3 border-b border-[#243047] pb-6">
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Acceptable Use Policy</h1>
        <p className="text-xs text-slate-400">Effective Date: July 28, 2026</p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-[#F8FAFC]">1. Prohibited Conduct</h2>
        <p>
          You agree not to use MediaDock for any illegal purpose, including unauthorized distribution of copyrighted material, bypassing content protection mechanisms, or attempting to extract disappearing/self-destructing media.
        </p>

        <h2 className="text-xl font-bold text-[#F8FAFC]">2. DRM & Security Restrictions</h2>
        <p>
          MediaDock strictly respects platform security boundaries and will never attempt to bypass protected channels, restricted media settings, or secret chat protections.
        </p>
      </section>
    </main>
  );
}
