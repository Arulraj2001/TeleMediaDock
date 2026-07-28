import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full h-10 appearance-none rounded-[10px] border border-[#E2E8F0] dark:border-[#243047] bg-[#FFFFFF] dark:bg-[#111827] px-3 pr-8 text-sm text-[#0F172A] dark:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 w-4 h-4 text-[#64748B] dark:text-[#94A3B8] pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
