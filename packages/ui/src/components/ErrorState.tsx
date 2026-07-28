import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card } from './Card';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message,
  onRetry,
  className,
}) => {
  return (
    <Card className={cn('flex flex-col items-center justify-center p-8 text-center space-y-4 border-[#DC2626]/30 bg-[#DC2626]/5', className)}>
      <div className="w-14 h-14 rounded-full bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{title}</h3>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-[8px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
        >
          Try Again
        </button>
      )}
    </Card>
  );
};
