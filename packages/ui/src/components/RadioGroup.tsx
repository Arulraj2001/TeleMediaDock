import React from 'react';
import { cn } from '../lib/utils';

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2" role="radiogroup">
      {options.map((opt) => {
        const isChecked = value === opt.value;
        const optId = `${name}-${opt.value}`;

        return (
          <label
            key={opt.value}
            htmlFor={optId}
            className={cn(
              'flex items-start gap-3 p-3 rounded-[10px] border border-[#E2E8F0] dark:border-[#243047] bg-[#FFFFFF] dark:bg-[#111827] cursor-pointer transition-colors hover:bg-[#F1F5F9] dark:hover:bg-[#172033]',
              isChecked && 'border-[#4F46E5] dark:border-[#4F46E5] bg-[#4F46E5]/5',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                id={optId}
                type="radio"
                name={name}
                value={opt.value}
                checked={isChecked}
                onChange={() => onChange(opt.value)}
                disabled={disabled}
                className="peer sr-only"
              />
              <div className="w-4 h-4 rounded-full border border-[#E2E8F0] dark:border-[#243047] bg-white dark:bg-[#111827] peer-checked:border-[#4F46E5] peer-focus-visible:ring-2 peer-focus-visible:ring-[#4F46E5] flex items-center justify-center">
                {isChecked && <div className="w-2 h-2 rounded-full bg-[#4F46E5]" />}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                {opt.label}
              </span>
              {opt.description && (
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  {opt.description}
                </span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
};
