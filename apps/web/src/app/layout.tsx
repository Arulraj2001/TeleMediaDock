import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

import './globals.css';
import { PRODUCT_NAME } from '@mediadock/shared';
import { Download, Shield, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: `${PRODUCT_NAME} – Privacy-First Chat Media Manager for Telegram Web`,
  description:
    'Organize, filter, and batch download your authorized Telegram Web media assets privacy-first. Files download 100% locally to your device.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090E1A] text-[#F8FAFC] antialiased flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white">
        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#090E1A]/80 border-b border-[#243047]">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-[#F8FAFC]">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4F46E5] to-[#06B6D4] flex items-center justify-center text-white shadow-sm">
                <Download className="w-4 h-4" />
              </div>
              <span>{PRODUCT_NAME}</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
              <Link href="/#features" className="hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/guides/telegram-web-productivity" className="hover:text-white transition-colors">
                Guides
              </Link>
              <Link href="/legal/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/support" className="hover:text-white transition-colors">
                Support
              </Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/pricing"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/30 hover:bg-[#4F46E5]/20 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Pro</span>
              </Link>
              <a
                href="https://chrome.google.com/webstore"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-colors shadow-sm"
              >
                Add to Chrome
              </a>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1">{children}</div>

        {/* Global Footer with Mandatory Legal Disclosures */}
        <footer className="bg-[#0D1424] border-t border-[#243047] text-slate-400 text-xs py-12">
          <div className="max-w-6xl mx-auto px-6 space-y-8">
            <div className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2 font-bold text-base text-[#F8FAFC]">
                  <Shield className="w-4 h-4 text-[#06B6D4]" />
                  <span>{PRODUCT_NAME} Privacy Guarantee</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                  MediaDock operates 100% locally within your browser. Chat messages, media content, filenames, and authentication cookies are never sent to remote servers.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Product</p>
                <ul className="space-y-1.5 text-xs">
                  <li><Link href="/#features" className="hover:text-white">Features</Link></li>
                  <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                  <li><Link href="/gallery" className="hover:text-white">Gallery</Link></li>
                  <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Legal & Safety</p>
                <ul className="space-y-1.5 text-xs">
                  <li><Link href="/legal/privacy" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/legal/terms" className="hover:text-white">Terms of Service</Link></li>
                  <li><Link href="/legal/acceptable-use" className="hover:text-white">Acceptable Use</Link></li>
                  <li><Link href="/legal/copyright" className="hover:text-white">Copyright & DMCA</Link></li>
                  <li><Link href="/legal/refund" className="hover:text-white">Refund Policy</Link></li>
                  <li><Link href="/legal/cookie" className="hover:text-white">Cookie Policy</Link></li>
                  <li><Link href="/legal/security" className="hover:text-white">Security & Subprocessors</Link></li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Support & Guides</p>
                <ul className="space-y-1.5 text-xs">
                  <li><Link href="/support" className="hover:text-white">Help Center</Link></li>
                  <li><Link href="/support/installation" className="hover:text-white">Installation Guide</Link></li>
                  <li><Link href="/support/troubleshooting" className="hover:text-white">Troubleshooting</Link></li>
                  <li><Link href="/support/contact" className="hover:text-white">Contact Us</Link></li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-[#243047] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
              <p>© 2026 {PRODUCT_NAME}. All rights reserved.</p>
              <p className="text-center md:text-right font-medium text-slate-400">
                MediaDock is an independent project and is not affiliated with, endorsed by, or sponsored by Telegram Messenger Inc.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
