import React from 'react';

export default function SecurityPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-slate-300">
      <header className="space-y-3 border-b border-[#243047] pb-6">
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Security Architecture & Subprocessor List</h1>
        <p className="text-xs text-slate-400">Effective Date: July 28, 2026</p>
      </header>

      <section className="space-y-6 text-sm leading-relaxed">
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-[#F8FAFC]">1. Security Controls & Architecture</h2>
          <p>
            MediaDock implements strict Manifest V3 isolation, Row Level Security (RLS) on all database tables, and HMAC SHA-256 webhook verification. Hardware details are never collected; device registration relies solely on randomly generated UUID installation IDs.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-[#F8FAFC]">2. Approved Subprocessors</h2>
          <p>We engage a limited list of cloud subprocessors to deliver authentication and billing services:</p>
          <div className="border border-[#243047] rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#111827] text-slate-400 border-b border-[#243047]">
                <tr>
                  <th className="p-3">Subprocessor</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#243047] text-slate-300">
                <tr>
                  <td className="p-3 font-semibold">Lemon Squeezy, Inc.</td>
                  <td className="p-3">Merchant of Record, Billing & Hosted Checkout</td>
                  <td className="p-3">United States</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Supabase, Inc.</td>
                  <td className="p-3">Encrypted Profile Authentication & Preference Sync</td>
                  <td className="p-3">United States / EU</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
