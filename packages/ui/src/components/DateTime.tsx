import React from 'react';

export interface DateTimeProps {
  timestamp: number | string | Date;
  format?: 'relative' | 'full' | 'dateOnly';
  className?: string;
}

export const DateTime: React.FC<DateTimeProps> = ({
  timestamp,
  format = 'full',
  className,
}) => {
  const dateObj = new Date(timestamp);
  const isValid = !isNaN(dateObj.getTime());

  if (!isValid) {
    return <span className={className}>Invalid Date</span>;
  }

  let text = dateObj.toLocaleString();

  if (format === 'dateOnly') {
    text = dateObj.toLocaleDateString();
  } else if (format === 'relative') {
    const now = Date.now();
    const diffMs = now - dateObj.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) text = 'Just now';
    else if (diffMins < 60) text = `${diffMins}m ago`;
    else if (diffHours < 24) text = `${diffHours}h ago`;
    else if (diffDays < 7) text = `${diffDays}d ago`;
    else text = dateObj.toLocaleDateString();
  }

  return (
    <time dateTime={dateObj.toISOString()} className={className}>
      {text}
    </time>
  );
};
