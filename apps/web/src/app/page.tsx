import React from 'react';
import Link from 'next/link';
import { Card, Badge } from '@mediadock/ui';
import {
  Shield,
  Download,
  FolderTree,
  Zap,
  Lock,
  HardDrive,
  Sparkles,
  ArrowRight,
  Eye,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Mic,
  Sticker,
} from 'lucide-react';


export default function HomePage() {
  return (
    <main className="space-y-24 pb-20 select-none">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-16 px-6 text-center max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4F46E5]/15 border border-[#4F46E5]/30 text-[#4F46E5] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MediaDock Extension v1.0 Launch</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-tight">
          Organize your Telegram Web media without sending it to another server.
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          MediaDock helps you find, organize and download media already available in your Telegram Web conversations. Files download directly to your device.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all shadow-lg hover:shadow-[#4F46E5]/25 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Add to Chrome</span>
          </a>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-[#111827] hover:bg-[#172033] text-slate-200 border border-[#243047] transition-all flex items-center justify-center gap-2"
          >
            <span>See how it works</span>
          </a>
        </div>
      </section>

      {/* 2. Trust Message Bar */}
      <section className="border-y border-[#243047] bg-[#0D1424] py-6 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs text-slate-400 font-medium">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-[#06B6D4]" />
            <span>100% Local Browser Engine</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Zero Server Message Uploads</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <span>Offline IndexedDB Storage</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>No Account Required</span>
          </div>
        </div>
      </section>

      {/* 3. Interactive Product Preview */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="rounded-2xl bg-[#111827] border border-[#243047] p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#243047] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-xs text-slate-400 font-mono ml-2">Telegram Web SidePanel — MediaDock</span>
            </div>
            <Badge variant="pro">Pro Active</Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#172033] border border-[#243047] space-y-3">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-slate-200">Current Chat</span>
                <span className="text-[10px] text-emerald-400">Connected</span>
              </div>
              <p className="text-slate-300 font-medium truncate">Design System Team</p>
              <div className="flex items-center gap-2 pt-2">
                <div className="w-full bg-[#090E1A] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#4F46E5] h-full w-3/4" />
                </div>
                <span className="text-[10px] text-slate-400">75%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#172033] border border-[#243047] space-y-3">
              <span className="font-semibold text-slate-200">Smart Naming Template</span>
              <p className="font-mono text-[11px] text-[#06B6D4] bg-[#090E1A] p-2 rounded border border-[#243047]">
                MediaDock/{'{chat}'}/{'{type}'}/{'{date}'}_{'{index}'}
              </p>
              <p className="text-[10px] text-slate-400">Auto-routes photos and files directly into organized subfolders.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#172033] border border-[#243047] space-y-3">
              <span className="font-semibold text-slate-200">Batch Queue</span>
              <div className="flex items-center justify-between text-slate-300">
                <span>Selected: 48 items</span>
                <span className="text-emerald-400 font-bold">Downloading</span>
              </div>
              <p className="text-[10px] text-slate-400">Concurrency: 2 • Collision-safe deduplication</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Benefits */}
      <section id="features" className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-[#F8FAFC]">Engineered for Privacy & Efficiency</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            MediaDock runs entirely inside your local browser context. Never worry about remote servers or data leaks.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3 bg-[#111827] border-[#243047]">
            <Lock className="w-8 h-8 text-[#06B6D4]" />
            <h3 className="text-lg font-bold text-[#F8FAFC]">100% Privacy Guarantee</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your message text, media assets, chat labels, and authentication cookies remain local. Zero data leaves your computer.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-[#111827] border-[#243047]">
            <FolderTree className="w-8 h-8 text-[#4F46E5]" />
            <h3 className="text-lg font-bold text-[#F8FAFC]">Smart Subfolder Routing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically route photos, videos, and documents into structured subfolders automatically with customizable tokens.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-[#111827] border-[#243047]">
            <Zap className="w-8 h-8 text-emerald-400" />
            <h3 className="text-lg font-bold text-[#F8FAFC]">High-Speed Batch Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Batch download loaded chat media with concurrency controls, pause/resume state, and exponential retry backoff.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. Supported Media Grid */}
      <section className="max-w-5xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Supported Media Types</h2>
          <p className="text-slate-400 text-xs">MediaDock detects and organizes all media types visible in your Telegram Web view.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center text-xs">
          <div className="p-4 rounded-xl bg-[#111827] border border-[#243047] space-y-2">
            <ImageIcon className="w-6 h-6 text-blue-400 mx-auto" />
            <span className="font-semibold block text-slate-200">Photos</span>
          </div>
          <div className="p-4 rounded-xl bg-[#111827] border border-[#243047] space-y-2">
            <Video className="w-6 h-6 text-purple-400 mx-auto" />
            <span className="font-semibold block text-slate-200">Videos</span>
          </div>
          <div className="p-4 rounded-xl bg-[#111827] border border-[#243047] space-y-2">
            <Music className="w-6 h-6 text-emerald-400 mx-auto" />
            <span className="font-semibold block text-slate-200">Audio Clips</span>
          </div>
          <div className="p-4 rounded-xl bg-[#111827] border border-[#243047] space-y-2">
            <Mic className="w-6 h-6 text-amber-400 mx-auto" />
            <span className="font-semibold block text-slate-200">Voice Notes</span>
          </div>
          <div className="p-4 rounded-xl bg-[#111827] border border-[#243047] space-y-2">
            <FileText className="w-6 h-6 text-cyan-400 mx-auto" />
            <span className="font-semibold block text-slate-200">Documents</span>
          </div>
          <div className="p-4 rounded-xl bg-[#111827] border border-[#243047] space-y-2">
            <Sticker className="w-6 h-6 text-pink-400 mx-auto" />
            <span className="font-semibold block text-slate-200">Stickers</span>
          </div>
        </div>
      </section>

      {/* 6. How It Works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-[#F8FAFC]">How It Works in 3 Steps</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#243047] space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-bold">1</span>
            <h3 className="font-bold text-[#F8FAFC] text-base">Open Telegram Web</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Navigate to Telegram Web K or Web A and open any authorized chat conversation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-[#243047] space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-bold">2</span>
            <h3 className="font-bold text-[#F8FAFC] text-base">Launch MediaDock SidePanel</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click the MediaDock extension icon to open the responsive side panel. MediaDock automatically detects currently visible media.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-[#243047] space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-bold">3</span>
            <h3 className="font-bold text-[#F8FAFC] text-base">One-Click Smart Batch Download</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select desired files and click download. MediaDock names and routes files into subfolders directly on your computer.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Privacy Architecture */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#1E1B4B]/40 via-[#111827] to-[#0D1424] border border-[#4F46E5]/40 space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#06B6D4]" />
            <h2 className="text-2xl font-bold text-[#F8FAFC]">Privacy Architecture</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            MediaDock is built around strict local sandbox execution boundaries. Unlike online downloader services, MediaDock never uses remote web scrapers, never requests Telegram API tokens, and never sends your raw media or chat information to external cloud servers.
          </p>
        </div>
      </section>

      {/* 8. Feature Comparison */}
      <section className="max-w-5xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-[#F8FAFC]">Feature Comparison</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#243047] text-slate-400">
                <th className="p-4">Feature</th>
                <th className="p-4">Free Tier</th>
                <th className="p-4 text-[#4F46E5]">Pro Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243047] text-slate-300">
              <tr>
                <td className="p-4 font-semibold text-slate-200">Batch Queue Size</td>
                <td className="p-4">Up to 20 items</td>
                <td className="p-4 font-bold text-emerald-400">Up to 100 items</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Filename Templates</td>
                <td className="p-4">Standard presets</td>
                <td className="p-4 font-bold text-emerald-400">Custom dynamic tokens</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Subfolder Routing</td>
                <td className="p-4">Default folder</td>
                <td className="p-4 font-bold text-emerald-400">Custom rules ({'{chat}'}/{'{type}'})</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Duplicate Handling</td>
                <td className="p-4">Basic numbering</td>
                <td className="p-4 font-bold text-emerald-400">Advanced signature detection</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Sponsor Cards</td>
                <td className="p-4">Occasional bottom card</td>
                <td className="p-4 font-bold text-emerald-400">100% Sponsor Free</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 9. Pricing */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-[#F8FAFC]">Transparent Pricing</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Free forever for local individual downloads. Upgrade to Pro to unlock unlimited batch queues and custom file routing.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs transition-colors shadow-md"
        >
          <span>View Detailed Pricing & Plans</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* 10. FAQ Accordion */}
      <section className="max-w-3xl mx-auto px-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-5 rounded-xl bg-[#111827] border border-[#243047] space-y-2">
            <h3 className="font-bold text-slate-200 text-sm">Does MediaDock send my media to external servers?</h3>
            <p className="text-slate-400 leading-relaxed">
              No. MediaDock operates 100% locally inside your browser. Downloads are processed directly between Telegram Web and your local filesystem.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#111827] border border-[#243047] space-y-2">
            <h3 className="font-bold text-slate-200 text-sm">Do I need an account to use free features?</h3>
            <p className="text-slate-400 leading-relaxed">
              No account creation is required for core local extension features. Account login is optional for syncing settings across devices or managing Pro subscriptions.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#111827] border border-[#243047] space-y-2">
            <h3 className="font-bold text-slate-200 text-sm">Does MediaDock bypass restricted or self-destructing media?</h3>
            <p className="text-slate-400 leading-relaxed">
              No. MediaDock strictly respects Telegram security controls and never attempts to bypass restricted or disappearing content.
            </p>
          </div>
        </div>
      </section>

      {/* 11. Final CTA Banner */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] text-white text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl font-black">Ready to organize your Telegram Web media?</h2>
          <p className="text-xs text-white/80 max-w-lg mx-auto leading-relaxed">
            Install the official MediaDock browser extension today and take complete control over your chat media assets.
          </p>
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-[#4F46E5] font-extrabold text-xs shadow-lg hover:bg-slate-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Install Extension Free</span>
          </a>
        </div>
      </section>
    </main>
  );
}
