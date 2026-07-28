import React from 'react';
import { AdBannerSlot } from '../../../components/AdBannerSlot';

export default function MediaFormatsExplainerGuide() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-slate-200">
      <header className="space-y-3">
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">
          Media Formats Explainer: OGG, MP4, WebM & Document Handling
        </h1>
        <p className="text-xs text-slate-400">
          Published by MediaDock Technical Team • Updated July 2026
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed text-slate-300">
        <p>
          Telegram Web utilizes specialized container formats to deliver voice notes, high-definition video clips, animated stickers, and technical documents efficiently.
        </p>
        <h2 className="text-xl font-bold text-[#F8FAFC]">1. Voice Notes & Audio Formats (OGG Opus)</h2>
        <p>
          Voice messages in Telegram Web are typically delivered in OGG container format encoded with the Opus codec. This ensures ultra-low latency and compressed file sizes while preserving voice audio clarity.
        </p>
      </section>

      {/* Website Ad Banner Container */}
      <AdBannerSlot />

      <section className="space-y-4 text-sm leading-relaxed text-slate-300">
        <h2 className="text-xl font-bold text-[#F8FAFC]">2. Video & GIF Formats (MP4 / WebM)</h2>
        <p>
          Animations and short clips are transmitted as looped MP4 or WebM video streams. MediaDock identifies media format headers automatically to preserve correct file extensions on local download.
        </p>
      </section>
    </main>
  );
}
