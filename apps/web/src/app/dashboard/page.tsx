'use client';

import React, { useState } from 'react';
import { Button, Card, Badge } from '@mediadock/ui';
import { User, Shield, CreditCard, HardDrive, RefreshCw, Trash2, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [registeredDevices, setRegisteredDevices] = useState([
    { id: 'inst_3f8a91c2-9a01', name: 'Chrome on Windows 11', lastSeen: 'Today, 2:15 PM' },
    { id: 'inst_7b2e10ff-4c8d', name: 'Chrome on macOS Sonoma', lastSeen: '2 days ago' },
  ]);

  const handlePortalRedirect = async () => {
    try {
      setLoadingPortal(true);
      const res = await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: 'cus_demo123' }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Failed to launch billing management portal');
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleRevokeDevice = (deviceId: string) => {
    setRegisteredDevices((prev) => prev.filter((d) => d.id !== deviceId));
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion request submitted successfully.');
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-8 select-none">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Account & Sync Dashboard</h1>
        <p className="text-xs text-slate-400">
          Manage your account profile, active subscriptions, registered device installations, and privacy settings.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="p-6 space-y-4 bg-[#111827] border-[#243047]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4F46E5]/20 text-[#4F46E5] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#F8FAFC]">Local User</p>
              <p className="text-[11px] text-slate-400">user@example.com</p>
            </div>
          </div>
          <div className="pt-2 border-t border-[#243047] flex items-center justify-between text-xs">
            <span className="text-slate-400">Status</span>
            <span className="text-emerald-400 font-semibold">Signed In</span>
          </div>
        </Card>

        {/* Current Subscription Card */}
        <Card className="p-6 space-y-4 bg-[#111827] border-[#243047]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#06B6D4]" />
              <span className="font-bold text-sm text-[#F8FAFC]">Subscription</span>
            </div>
            <Badge variant="pro">Pro Active</Badge>
          </div>
          <p className="text-xs text-slate-400">Renews automatically via Lemon Squeezy.</p>
          <Button
            variant="outline"
            className="w-full text-xs"
            isLoading={loadingPortal}
            onClick={handlePortalRedirect}
          >
            Manage Billing & Invoices
          </Button>
        </Card>

        {/* Sync Status Card */}
        <Card className="p-6 space-y-4 bg-[#111827] border-[#243047]">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm text-[#F8FAFC]">Synced Settings</span>
          </div>
          <p className="text-xs text-slate-400">
            Themes, filename templates, and duplicate strategies sync safely. Zero chat media stored.
          </p>
          <div className="pt-2 border-t border-[#243047] text-[11px] text-slate-400 flex items-center justify-between">
            <span>Last Synced</span>
            <span className="text-slate-200">Just Now</span>
          </div>
        </Card>
      </div>

      {/* Registered Device Installations */}
      <section className="p-6 rounded-2xl bg-[#111827] border border-[#243047] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#F8FAFC]">Registered Device Installations</h2>
            <p className="text-xs text-slate-400">Random UUID installation IDs assigned to your active browsers.</p>
          </div>
          <HardDrive className="w-5 h-5 text-slate-400" />
        </div>

        <div className="divide-y divide-[#243047]">
          {registeredDevices.map((device) => (
            <div key={device.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-200">{device.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">{device.id} • Last seen {device.lastSeen}</p>
              </div>
              <button
                onClick={() => handleRevokeDevice(device.id)}
                className="text-red-400 hover:text-red-300 font-medium transition-colors text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Revoke</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Support & Danger Zone */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3 bg-[#111827] border-[#243047]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#4F46E5]" />
            <h3 className="font-bold text-sm text-[#F8FAFC]">Need Help?</h3>
          </div>
          <p className="text-xs text-slate-400">Check our searchable help center or submit a support ticket.</p>
          <Link href="/support" className="inline-block text-xs font-semibold text-[#4F46E5] hover:underline">
            Visit Support & Help Center →
          </Link>
        </Card>

        <Card className="p-6 space-y-3 bg-[#111827] border border-red-900/40">
          <div className="flex items-center gap-2 text-red-400">
            <Shield className="w-5 h-5" />
            <h3 className="font-bold text-sm">Danger Zone</h3>
          </div>
          <p className="text-xs text-slate-400">Permanently delete your account profile and synced settings.</p>
          <Button variant="danger" className="w-full text-xs" onClick={handleDeleteAccount}>
            Delete Account Profile
          </Button>
        </Card>
      </section>
    </main>
  );
}
