import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'info',
  title,
  children,
  ...props
}) => {
  const icons = {
    info: <Info className="w-5 h-5 text-[#06B6D4] shrink-0" aria-hidden="true" />,
    success: <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" aria-hidden="true" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0" aria-hidden="true" />,
    error: <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0" aria-hidden="true" />,
  };

  const variants = {
    info: 'border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#0F172A] dark:text-[#F8FAFC]',
    success: 'border-[#16A34A]/30 bg-[#16A34A]/10 text-[#0F172A] dark:text-[#F8FAFC]',
    warning: 'border-[#D97706]/30 bg-[#D97706]/10 text-[#0F172A] dark:text-[#F8FAFC]',
    error: 'border-[#DC2626]/30 bg-[#DC2626]/10 text-[#0F172A] dark:text-[#F8FAFC]',
  };

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 p-4 rounded-[12px] border text-sm',
        variants[variant],
        className
      )}
      {...props}
    >
      {icons[variant]}
      <div className="flex-1 space-y-1">
        {title && <h4 className="font-semibold text-sm leading-tight">{title}</h4>}
        <div className="text-xs opacity-90">{children}</div>
      </div>
    </div>
  );
};
