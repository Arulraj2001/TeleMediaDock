import React from 'react';

export default function SubscriptionRestorationGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-6 text-slate-300">
      <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Subscription Restoration & Key Recovery</h1>
      <p className="text-xs text-slate-400">Restore your MediaDock Pro entitlements across browser installations.</p>

      <div className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-[#F8FAFC]">1. Sign In to Sync Entitlement</h2>
        <p>
          Open MediaDock Options or SidePanel settings, click <strong>Account Sign In</strong>, and enter your email address. You will receive a magic link email to verify your active Pro subscription.
        </p>

        <h2 className="text-xl font-bold text-[#F8FAFC]">2. Offline Grace Period</h2>
        <p>
          MediaDock caches your entitlement locally for up to 7 days in case of network outages, ensuring uninterrupted access to Pro features.
        </p>
      </div>
    </main>
  );
}
