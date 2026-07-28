'use client';

import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import {
  FolderDown,
  ShieldCheck,
  KeyRound,
  ExternalLink,
  Zap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { PRODUCT_NAME } from '@mediadock/shared';

export interface OnboardingWizardProps {
  onComplete: () => void;
  onRequestPermissions?: () => void;
  onOpenTelegramWeb?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onRequestPermissions,
  onOpenTelegramWeb,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Welcome', icon: <FolderDown className="w-5 h-5" /> },
    { title: 'Privacy First', icon: <ShieldCheck className="w-5 h-5" /> },
    { title: 'Permissions', icon: <KeyRound className="w-5 h-5" /> },
    { title: 'Telegram Web', icon: <ExternalLink className="w-5 h-5" /> },
    { title: 'Pro Overview', icon: <Zap className="w-5 h-5" /> },
    { title: 'Ready', icon: <CheckCircle2 className="w-5 h-5" /> },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] max-w-xl mx-auto p-4 select-none">
      {/* Progress Indicator */}
      <div className="w-full flex items-center justify-between mb-6 px-2">
        {steps.map((s, i) => (
          <div key={s.title} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i === currentStep
                  ? 'bg-[#4F46E5] text-white ring-4 ring-[#4F46E5]/20'
                  : i < currentStep
                  ? 'bg-[#10B981] text-white'
                  : 'bg-[#F1F5F9] dark:bg-[#172033] text-[#64748B]'
              }`}
            >
              {i < currentStep ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className="text-[10px] font-medium text-[#64748B] hidden sm:block">
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <Card className="w-full p-6 space-y-6 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#243047] shadow-lg">
        {/* Step 1: Welcome */}
        {currentStep === 0 && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-[14px] bg-[#4F46E5] text-white flex items-center justify-center mx-auto shadow-md">
              <FolderDown className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
                Welcome to {PRODUCT_NAME}
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Chat Media Manager for Telegram Web
              </p>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed max-w-md mx-auto">
              MediaDock helps you organize and save media files you are already authorized to access in your open Telegram Web conversations—completely locally and privately.
            </p>
          </div>
        )}

        {/* Step 2: Privacy Guarantee */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-[12px] bg-[#EEF2FF] dark:bg-[#1E1B4B]/40 border border-[#C7D2FE] text-[#4F46E5]">
              <ShieldCheck className="w-6 h-6 shrink-0" />
              <div className="text-xs font-semibold">Privacy First Architecture</div>
            </div>
            <ul className="space-y-2.5 text-xs text-[#475569] dark:text-[#CBD5E1]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span>
                  <strong>100% Local Processing:</strong> Media files, chat messages, captions, and usernames are never sent to external servers.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span>
                  <strong>No Account Required:</strong> Free local features work completely offline without sign-in or registration.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Bypass Policy:</strong> MediaDock respects disappearing timers, protected channel rules, and privacy controls.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Step 3: Permissions Rationale */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-[12px] bg-[#FEF3C7] dark:bg-[#78350F]/40 border border-[#FCD34D] text-[#D97706]">
              <KeyRound className="w-6 h-6 shrink-0" />
              <div className="text-xs font-semibold">Required Browser Permissions</div>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#CBD5E1]">
              To save media files directly to your device and scan active conversation views, MediaDock requires:
            </p>
            <div className="p-3 rounded-[10px] bg-[#F8FAFC] dark:bg-[#172033] text-xs space-y-1">
              <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">• downloads</p>
              <p className="text-[11px] text-[#64748B]">Saves authorized media to your default browser downloads folder.</p>
              <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] mt-2">• activeTab</p>
              <p className="text-[11px] text-[#64748B]">Detects currently visible media items inside Telegram Web tabs.</p>
            </div>
            {onRequestPermissions && (
              <Button variant="outline" size="sm" className="w-full" onClick={onRequestPermissions}>
                Grant Permissions Now
              </Button>
            )}
          </div>
        )}

        {/* Step 4: Telegram Web Tutorial */}
        {currentStep === 3 && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#E0F2FE] dark:bg-[#075985]/40 text-[#0284C7] flex items-center justify-center mx-auto">
              <ExternalLink className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              How to Use MediaDock
            </h3>
            <p className="text-xs text-[#475569] dark:text-[#CBD5E1] max-w-sm mx-auto">
              Open Telegram Web in an active browser tab, select any chat, and click the floating <strong>MediaDock Quick Save</strong> pill near photos or open the SidePanel.
            </p>
            {onOpenTelegramWeb && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<ExternalLink className="w-4 h-4" />}
                onClick={onOpenTelegramWeb}
              >
                Open Telegram Web (web.telegram.org)
              </Button>
            )}
          </div>
        )}

        {/* Step 5: Optional Pro Overview */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#4F46E5]" />
                <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  Optional Pro Features
                </h3>
              </div>
              <Badge variant="pro">Pro</Badge>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Free users enjoy unlimited individual downloads and 20-item batch operations. Pro unlocks advanced workflow tools:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-[10px] bg-[#F8FAFC] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#243047]">
                <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Up to 100 Item Batches</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">Process larger media queues.</p>
              </div>
              <div className="p-2.5 rounded-[10px] bg-[#F8FAFC] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#243047]">
                <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Advanced Filters</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">Filter by date, size & extension.</p>
              </div>
              <div className="p-2.5 rounded-[10px] bg-[#F8FAFC] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#243047]">
                <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Smart Subfolders</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">Organize by chat & media type.</p>
              </div>
              <div className="p-2.5 rounded-[10px] bg-[#F8FAFC] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#243047]">
                <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Duplicate Rules</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">Per-chat naming & duplicate handling.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Ready to Launch */}
        {currentStep === 5 && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#10B981] text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Setup Complete!
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-sm mx-auto">
              You are ready to organize and download authorized media with MediaDock.
            </p>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0] dark:border-[#243047]">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            disabled={currentStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>

          <Button
            data-testid="onboarding-next-btn"
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={handleNext}
          >
            {currentStep === steps.length - 1 ? 'Launch Media Explorer' : 'Continue'}
          </Button>

        </div>
      </Card>
    </div>
  );
};
