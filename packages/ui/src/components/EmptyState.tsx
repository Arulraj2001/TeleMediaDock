import React from 'react';
import { Layers } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card } from './Card';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Layers className="w-8 h-8 text-[#4F46E5]" />,
  title,
  description,
  action,
  className,
}) => {
  return (
    <Card className={cn('flex flex-col items-center justify-center p-8 text-center space-y-4', className)}>
      <div className="w-14 h-14 rounded-full bg-[#F1F5F9] dark:bg-[#172033] flex items-center justify-center">
        {icon}
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{title}</h3>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </Card>
  );
};
