import React, { useState } from 'react';
import { SettingsScreen, OnboardingWizard, WebShell } from '@mediadock/ui';
import { HistoryManager } from '../../src/services/HistoryManager';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <WebShell>
      <div className="max-w-4xl mx-auto py-6 px-4">
        {showOnboarding ? (
          <OnboardingWizard
            onComplete={() => setShowOnboarding(false)}
            onRequestPermissions={() => {
              if (typeof chrome !== 'undefined' && chrome.permissions) {
                chrome.permissions.request({ permissions: ['downloads'] });
              }
            }}
            onOpenTelegramWeb={() => window.open('https://web.telegram.org', '_blank')}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
                MediaDock Preferences & Settings
              </h1>
              <button
                onClick={() => setShowOnboarding(true)}
                className="text-xs text-[#4F46E5] hover:underline font-semibold"
              >
                Re-run Onboarding Setup
              </button>
            </div>

            <SettingsScreen
              tier="free"
              onClearLocalData={() => HistoryManager.clearAllHistory()}
              onExportSettingsJson={async () => {
                const settings = {
                  version: '1.0.0',
                  exportedAt: new Date().toISOString(),
                  baseFolder: 'MediaDock',
                  concurrency: 2,
                  retentionPolicy: 'indefinite',
                };
                const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'mediadock_settings_backup.json';
                a.click();
              }}
            />
          </div>
        )}
      </div>
    </WebShell>
  );
}
