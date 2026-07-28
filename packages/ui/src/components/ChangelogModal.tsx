'use client';

import React from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { Sparkles, Zap, Shield, Keyboard, FolderTree } from 'lucide-react';

export interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="What's New in MediaDock v1.0">
      <div className="space-y-6 text-xs text-[#0F172A] dark:text-[#F8FAFC]">
        <div className="flex items-center gap-2 p-3 rounded-[10px] bg-[#4F46E5]/10 text-[#4F46E5] font-semibold">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Major Release 1.0 — Privacy-First Chat Media Manager</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">High-Speed Performance Engine</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Lazy thumbnail rendering, automatic Blob memory URL revocation, and debounced DOM scans keep your browser fast.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Keyboard className="w-5 h-5 text-[#06B6D4] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Customizable Keyboard Shortcuts</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Press <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">Ctrl+Shift+M</code> to launch MediaDock or <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">Ctrl+Shift+D</code> to download active media.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FolderTree className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Smart File Naming & Subfolders</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Automate subfolder routing rules using dynamic tokens (<code className="font-mono">{'{chat}'}</code>, <code className="font-mono">{'{type}'}</code>, <code className="font-mono">{'{date}'}</code>).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">100% Client-Side Privacy Guarantee</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                All media processing and downloads occur locally on your machine. Message content and media files are never sent to remote servers.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#243047] flex justify-end">
          <Button variant="primary" onClick={onClose} className="font-semibold text-xs">
            Got it, let&apos;s go!
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
