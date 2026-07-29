import React, { useEffect, useRef } from 'react';
import { PRODUCT_NAME, type UserPlanTier } from '@mediadock/shared';
import { FolderDown, Settings, Layers, Download, History, Sliders, Moon, Sun } from 'lucide-react';
import { PlanBadge } from '../components/PlanBadge';
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '../lib/utils';

export type ExtensionTab = 'media' | 'downloads' | 'history' | 'rules' | 'settings';

export interface SidePanelShellProps {
  activeTab: ExtensionTab;
  onTabChange: (tab: ExtensionTab) => void;
  tier?: UserPlanTier;
  queueCount?: number;
  children: React.ReactNode;
}

export const SidePanelShell: React.FC<SidePanelShellProps> = ({
  activeTab,
  onTabChange,
  tier = 'free',
  queueCount = 0,
  children,
}) => {
  const { resolvedTheme, setTheme } = useTheme();
  const scrollAreaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeTab]);

  const navItems = [
    { id: 'media', label: 'Media', icon: <Layers className="w-4 h-4" /> },
    { id: 'downloads', label: 'Downloads', icon: <Download className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
    { id: 'rules', label: 'Rules', icon: <Sliders className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ] as const;

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-dvh min-h-0 w-full min-w-0 max-w-[520px] flex-col overflow-hidden bg-[#F8FAFC] text-[#0F172A] dark:bg-[#090E1A] dark:text-[#F8FAFC] mx-auto select-none">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#E2E8F0] dark:border-[#243047] bg-[#FFFFFF] dark:bg-[#111827] shrink-0">
        <div className="flex min-w-0 items-center gap-2">
          <div className="w-7 h-7 rounded-[8px] bg-[#4F46E5] flex items-center justify-center text-white font-bold shrink-0">
            <FolderDown className="w-4 h-4" />
          </div>
          <span className="truncate font-bold text-sm tracking-tight">{PRODUCT_NAME}</span>
          <PlanBadge tier={tier} />
        </div>

        <div className="flex items-center gap-1">
          {queueCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#4F46E5] text-white">
              {queueCount} in queue
            </span>
          )}

          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-1.5 rounded-[8px] text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172033] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main
        ref={scrollAreaRef}
        className="relative min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain"
      >
        {children}
      </main>

      {/* Privacy Guarantee Bar */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-[9px] leading-tight text-[#64748B] dark:border-[#243047] dark:bg-[#090E1A] dark:text-[#94A3B8]">
        <span className="min-w-0">Downloads stay on this device.</span>
        <span className="shrink-0 font-semibold text-[#10B981]">100% Local</span>
      </div>

      {/* Bottom Navigation */}

      <nav className="z-30 grid h-14 shrink-0 grid-cols-5 items-stretch border-t border-[#E2E8F0] bg-[#FFFFFF] px-1 dark:border-[#243047] dark:bg-[#111827]">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as ExtensionTab)}
              className={cn(
                'flex h-full min-w-0 flex-col items-center justify-center gap-1 px-0.5 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]',
                isActive
                  ? 'text-[#4F46E5]'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
              )}
            >
              {item.icon}
              <span className="w-full truncate text-center">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
