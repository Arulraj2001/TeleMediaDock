import React from 'react';
import { formatBytes } from '@mediadock/shared';

export interface FileSizeProps {
  bytes?: number;
  className?: string;
}

export const FileSize: React.FC<FileSizeProps> = ({ bytes, className }) => {
  if (typeof bytes !== 'number' || isNaN(bytes)) {
    return <span className={className}>Unknown size</span>;
  }
  return <span className={className}>{formatBytes(bytes)}</span>;
};
