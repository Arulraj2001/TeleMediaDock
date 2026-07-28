import React from 'react';
import {
  Image,
  Video,
  Music,
  Mic,
  Film,
  Sticker,
  FileText,
} from 'lucide-react';
import type { MediaType } from '@mediadock/shared';
import { cn } from '../lib/utils';

export interface MediaTypeIconProps {
  type: MediaType;
  className?: string;
}

export const MediaTypeIcon: React.FC<MediaTypeIconProps> = ({ type, className }) => {
  const iconProps = { className: cn('w-4 h-4', className), 'aria-hidden': true };

  switch (type) {
    case 'image':
      return <Image {...iconProps} />;
    case 'video':
      return <Video {...iconProps} />;
    case 'audio':
      return <Music {...iconProps} />;
    case 'voice':
      return <Mic {...iconProps} />;
    case 'gif':
      return <Film {...iconProps} />;
    case 'sticker':
      return <Sticker {...iconProps} />;
    case 'document':
    default:
      return <FileText {...iconProps} />;
  }
};
