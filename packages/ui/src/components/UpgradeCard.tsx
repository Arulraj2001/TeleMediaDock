import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

export interface UpgradeCardProps {
  onUpgrade?: () => void;
  className?: string;
}

export const UpgradeCard: React.FC<UpgradeCardProps> = ({ onUpgrade, className }) => {
  return (
    <Card className={`p-4 bg-gradient-to-br from-[#4F46E5]/10 via-[#06B6D4]/5 to-transparent border-[#4F46E5]/30 space-y-3 ${className || ''}`}>
      <div className="flex items-center gap-2 text-[#4F46E5] font-semibold text-xs">
        <Sparkles className="w-4 h-4" />
        <span>Unlock Unlimited Batching</span>
      </div>
      <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
        Upgrade to MediaDock Pro for unlimited downloads, custom folder routing, and duplicate detection.
      </p>
      <Button
        variant="primary"
        size="sm"
        className="w-full text-xs"
        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        onClick={onUpgrade}
      >
        Upgrade to Pro ($4.99/mo)
      </Button>
    </Card>
  );
};
