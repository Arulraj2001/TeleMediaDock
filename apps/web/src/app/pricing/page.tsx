'use client';

import React, { useState } from 'react';
import { Button, Card, Badge } from '@mediadock/ui';
import { Check, Sparkles } from 'lucide-react';

import {
  PRO_MONTHLY_PRICE,
  PRO_ANNUAL_PRICE,
  EARLY_ADOPTER_LIFETIME_PRICE,
} from '@mediadock/shared';

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: 'pro_monthly' | 'pro_annual' | 'lifetime') => {
    try {
      setLoadingPlan(plan);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Failed to launch hosted checkout portal');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 space-y-12 select-none">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
          Simple, Transparent Pricing
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Choose the plan that best fits your Telegram Web media organization needs. All features run 100% locally and privately on your device.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <Card className="p-6 space-y-6 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#243047] flex flex-col justify-between">
          <div className="space-y-4">
            <Badge variant="free">Free Forever</Badge>
            <h2 className="text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">$0</h2>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Up to 20 items per batch download</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>All Telegram media types supported</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>2 standard filename templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% offline IndexedDB history</span>
              </li>
            </ul>
          </div>
          <Button variant="outline" className="w-full">
            Install Extension
          </Button>
        </Card>

        {/* Pro Monthly & Annual Plan */}
        <Card className="p-6 space-y-6 bg-white dark:bg-[#111827] border-2 border-[#4F46E5] flex flex-col justify-between relative shadow-lg">
          <div className="absolute top-0 right-0 bg-[#4F46E5] text-white text-[10px] uppercase tracking-wider px-3 py-1 font-bold rounded-bl-[10px]">
            MOST POPULAR
          </div>
          <div className="space-y-4">
            <Badge variant="pro">MediaDock Pro</Badge>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
                  ${PRO_MONTHLY_PRICE}
                </span>
                <span className="text-slate-500 text-xs">/ month</span>
              </div>
              <p className="text-[11px] text-[#10B981] font-semibold">
                Or ${PRO_ANNUAL_PRICE}/year (Save over 30%)
              </p>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#4F46E5] shrink-0" />
                <span>Up to 100 items per batch queue</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#4F46E5] shrink-0" />
                <span>Custom dynamic template tokens ({'{chat}'}, {'{date}'})</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#4F46E5] shrink-0" />
                <span>Custom subfolder routing rules</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#4F46E5] shrink-0" />
                <span>Advanced duplicate strategy presets</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#4F46E5] shrink-0" />
                <span>Hide sponsor cards</span>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <Button
              variant="primary"
              className="w-full"
              isLoading={loadingPlan === 'pro_monthly'}
              onClick={() => handleCheckout('pro_monthly')}
            >
              Get Pro Monthly (${PRO_MONTHLY_PRICE}/mo)
            </Button>
            <Button
              variant="outline"
              className="w-full text-xs"
              isLoading={loadingPlan === 'pro_annual'}
              onClick={() => handleCheckout('pro_annual')}
            >
              Get Pro Annual (${PRO_ANNUAL_PRICE}/yr)
            </Button>
          </div>
        </Card>

        {/* Early Adopter Lifetime Plan */}
        <Card className="p-6 space-y-6 bg-gradient-to-b from-[#1E1B4B]/20 to-transparent dark:bg-[#111827] border border-amber-300 dark:border-amber-900/50 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" /> Early Adopter
              </div>
              <Badge variant="sponsored">LIMITED</Badge>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
                ${EARLY_ADOPTER_LIFETIME_PRICE}
              </span>
              <span className="text-slate-500 text-xs">one-time pay</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Lifetime access to all Pro features</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>No recurring subscription fees</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Priority feature updates</span>
              </li>
            </ul>
          </div>
          <Button
            variant="secondary"
            className="w-full"
            isLoading={loadingPlan === 'lifetime'}
            onClick={() => handleCheckout('lifetime')}
          >
            Get Lifetime Access (${EARLY_ADOPTER_LIFETIME_PRICE})
          </Button>
        </Card>
      </div>
    </main>
  );
}
