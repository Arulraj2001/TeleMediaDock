import React from 'react';
import { cn } from '../lib/utils';

export interface ProgressProps {
  value: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    primary: 'bg-[#4F46E5]',
    success: 'bg-[#16A34A]',
    warning: 'bg-[#D97706]',
    danger: 'bg-[#DC2626]',
  };

  return (
    <div className="w-full space-y-1">
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
          <span>Progress</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          'w-full rounded-full bg-[#E2E8F0] dark:bg-[#243047] overflow-hidden',
          heights[size],
          className
        )}
      >
        <div
          className={cn(
            'h-full transition-all duration-200 ease-in-out motion-reduce:transition-none',
            variants[variant]
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
