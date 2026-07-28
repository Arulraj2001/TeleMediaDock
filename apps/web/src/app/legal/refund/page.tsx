import React from 'react';

export default function RefundPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-slate-300">
      <header className="space-y-3 border-b border-[#243047] pb-6">
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Refund Policy</h1>
        <p className="text-xs text-slate-400">Effective Date: July 28, 2026</p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-[#F8FAFC]">1. 14-Day Money-Back Guarantee</h2>
        <p>
          We offer a full 14-day money-back guarantee for all MediaDock Pro subscriptions and Early Adopter Lifetime licenses.
        </p>

        <h2 className="text-xl font-bold text-[#F8FAFC]">2. Requesting a Refund</h2>
        <p>
          To request a refund, visit your Customer Billing Portal via your dashboard or contact <code className="text-[#4F46E5]">support@mediadock.app</code> with your order ID. Refunds are processed within 3-5 business days.
        </p>
      </section>
    </main>
  );
}
