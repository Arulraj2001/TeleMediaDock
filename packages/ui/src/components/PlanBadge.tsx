import React from 'react';
import type { UserPlanTier } from '@mediadock/shared';
import { Badge } from './Badge';

export interface PlanBadgeProps {
  tier: UserPlanTier;
  className?: string;
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({ tier, className }) => {
  return (
    <Badge variant={tier === 'pro' ? 'pro' : 'free'} className={className}>
      {tier === 'pro' ? 'Pro' : 'Free'}
    </Badge>
  );
};
