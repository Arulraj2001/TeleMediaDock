import React from 'react';
import { AdBannerSlot } from '../../../components/AdBannerSlot';

export default function FileOrganizationGuide() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-slate-200">
      <header className="space-y-3">
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">
          Download & File Organization Best Practices for Power Users
        </h1>
        <p className="text-xs text-slate-400">
          Published by MediaDock Engineering Team • Updated July 2026
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed text-slate-300">
        <p>
          Managing large quantities of downloaded images, documents, and voice messages requires structured folder hierarchies and collision-safe naming templates.
        </p>
        <h2 className="text-xl font-bold text-[#F8FAFC]">1. Subfolder Partitioning</h2>
        <p>
          Organizing downloads into category-based subfolders (e.g. <code className="text-[#4F46E5]">MediaDock/ChatName/Type/</code>) prevents cluttered single directories and improves local search speed.
        </p>
      </section>

      {/* Website Ad Banner Container */}
      <AdBannerSlot />

      <section className="space-y-4 text-sm leading-relaxed text-slate-300">
        <h2 className="text-xl font-bold text-[#F8FAFC]">2. Duplicate Collision Prevention</h2>
        <p>
          Always configure duplicate handling strategies (`ask`, `skip`, or `rename`) before executing large batch downloads to avoid overwriting existing local files.
        </p>
      </section>
    </main>
  );
}
