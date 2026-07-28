import React from 'react';
import { PRODUCT_NAME } from '@mediadock/shared';
import { FolderDown, Moon, Sun, Github } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

export interface WebShellProps {
  children: React.ReactNode;
}

export const WebShell: React.FC<WebShellProps> = ({ children }) => {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#090E1A] text-[#0F172A] dark:text-[#F8FAFC]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] dark:border-[#243047] bg-[#FFFFFF]/80 dark:bg-[#111827]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC]">
            <div className="w-8 h-8 rounded-[10px] bg-[#4F46E5] flex items-center justify-center text-white">
              <FolderDown className="w-5 h-5" />
            </div>
            <span>{PRODUCT_NAME}</span>
          </a>

          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="/gallery" className="text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]">
              Component Gallery
            </a>
            <a href="/pricing" className="text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]">
              Pricing
            </a>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-[10px] text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172033] transition-colors"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] dark:border-[#243047] bg-[#FFFFFF] dark:bg-[#111827] py-8 text-xs text-[#64748B] dark:text-[#94A3B8]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MediaDock. All rights reserved. Built privacy-first.</p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms of Service</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#0F172A] dark:hover:text-white">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
