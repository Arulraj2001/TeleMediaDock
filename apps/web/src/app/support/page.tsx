'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, FileText, Wrench, AlertTriangle, ShieldCheck, Download } from 'lucide-react';


const ARTICLES = [
  {
    title: 'Installation & Getting Started Guide',
    slug: '/support/installation',
    category: 'Setup',
    snippet: 'How to install MediaDock from Chrome Web Store and open the side panel.',
    icon: Download,
  },
  {
    title: 'General Troubleshooting Guide',
    slug: '/support/troubleshooting',
    category: 'Troubleshooting',
    snippet: 'Resolve common detection delays, permissions issues, or sidepanel connection states.',
    icon: Wrench,
  },
  {
    title: 'Telegram Web Layout Unsupported Guide',
    slug: '/support/unsupported-layout',
    category: 'Adapters',
    snippet: 'What to do if Telegram Web updates its DOM structure or switches variant versions.',
    icon: AlertTriangle,
  },
  {
    title: 'Download Failure & Network Recovery',
    slug: '/support/download-failure',
    category: 'Downloads',
    snippet: 'Diagnose expired temporary URLs, blob timeouts, or file system permission errors.',
    icon: FileText,
  },
  {
    title: 'Subscription Restoration & Pro Key Recovery',
    slug: '/support/subscription-restoration',
    category: 'Billing',
    snippet: 'Restore your active MediaDock Pro license across browsers or after clearing storage.',
    icon: ShieldCheck,
  },
];

export default function HelpCenterPage() {
  const [query, setQuery] = useState('');

  const filtered = ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.snippet.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-10 select-none">
      <header className="text-center space-y-4 max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">MediaDock Help Center</h1>
        <p className="text-xs text-slate-400">Search troubleshooting guides, installation steps, and support resources.</p>

        {/* Live Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search articles (e.g. installation, layout, downloads)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#111827] border border-[#243047] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#4F46E5] transition-colors"
          />
        </div>
      </header>

      {/* Articles Grid */}
      <section className="grid md:grid-cols-2 gap-4">
        {filtered.map((article) => {
          const IconComp = article.icon;
          return (
            <Link
              key={article.slug}
              href={article.slug}
              className="p-5 rounded-2xl bg-[#111827] border border-[#243047] hover:border-[#4F46E5] transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#06B6D4]">{article.category}</span>
                <IconComp className="w-4 h-4 text-slate-400 group-hover:text-[#4F46E5] transition-colors" />
              </div>
              <h2 className="font-bold text-sm text-[#F8FAFC] group-hover:text-[#4F46E5] transition-colors">
                {article.title}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">{article.snippet}</p>
            </Link>
          );
        })}
      </section>

      {/* Contact Banner */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#243047] flex items-center justify-between text-xs">
        <div>
          <p className="font-bold text-slate-200">Can&apos;t find what you&apos;re looking for?</p>
          <p className="text-slate-400">Submit a support ticket or structured bug report directly to our engineering team.</p>
        </div>
        <Link
          href="/support/contact"
          className="px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold transition-colors shrink-0"
        >
          Contact Support
        </Link>
      </div>
    </main>
  );
}
