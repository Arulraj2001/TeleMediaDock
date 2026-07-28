import React from 'react';
import { cn } from '../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-[12px] border border-[#E2E8F0] dark:border-[#243047] bg-[#FFFFFF] dark:bg-[#111827] text-[#0F172A] dark:text-[#F8FAFC] p-4 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
