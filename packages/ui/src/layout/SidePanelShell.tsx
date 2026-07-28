import React from 'react';
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
    <div className="flex flex-col h-screen w-full max-w-[520px] mx-auto bg-[#F8FAFC] dark:bg-[#090E1A] text-[#0F172A] dark:text-[#F8FAFC] overflow-hidden select-none">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#E2E8F0] dark:border-[#243047] bg-[#FFFFFF] dark:bg-[#111827] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[8px] bg-[#4F46E5] flex items-center justify-center text-white font-bold shrink-0">
            <FolderDown className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight">{PRODUCT_NAME}</span>
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
      <main className="flex-1 overflow-y-auto relative">{children}</main>

      {/* Privacy Guarantee Bar */}
      <div className="px-3 py-1.5 border-t border-[#E2E8F0] dark:border-[#243047] bg-[#F8FAFC] dark:bg-[#090E1A] text-[10px] text-[#64748B] dark:text-[#94A3B8] flex items-center justify-between shrink-0">
        <span>Media downloads directly to your device and is not uploaded to MediaDock.</span>
        <span className="font-semibold text-[#10B981] shrink-0 ml-2">100% Local</span>
      </div>

      {/* Bottom Navigation */}

      <nav className="flex items-center justify-around h-14 border-t border-[#E2E8F0] dark:border-[#243047] bg-[#FFFFFF] dark:bg-[#111827] px-2 shrink-0 z-30">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as ExtensionTab)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-full h-full text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]',
                isActive
                  ? 'text-[#4F46E5]'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
              )}
            >
              {item.icon}
              <span className="truncate max-w-[60px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
