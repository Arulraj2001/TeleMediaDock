// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest';
import { EntitlementManager } from './EntitlementManager';


describe('Phase 12 — Entitlement Engine & Offline Grace Period', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return default free entitlement when no session exists', async () => {
    const entitlement = await EntitlementManager.getEntitlement();
    expect(entitlement.plan).toBe('free');
    expect(entitlement.status).toBe('free');
    expect(EntitlementManager.isProUnlocked(entitlement)).toBe(false);
  });

  it('should unlock Pro features for active or lifetime statuses', () => {
    const active = {
      ...EntitlementManager.getDefaultFreeEntitlement(),
      plan: 'pro_monthly',
      status: 'active' as const,
    };
    expect(EntitlementManager.isProUnlocked(active)).toBe(true);

    const lifetime = {
      ...EntitlementManager.getDefaultFreeEntitlement(),
      plan: 'lifetime',
      status: 'lifetime' as const,
    };
    expect(EntitlementManager.isProUnlocked(lifetime)).toBe(true);

    const cancelledActive = {
      ...EntitlementManager.getDefaultFreeEntitlement(),
      plan: 'pro_monthly',
      status: 'cancelled_active' as const,
    };
    expect(EntitlementManager.isProUnlocked(cancelledActive)).toBe(true);
  });

  it('should support 7-day offline grace period for cached Pro entitlements', async () => {
    const cachedPro = {
      ...EntitlementManager.getDefaultFreeEntitlement(),
      plan: 'pro_monthly',
      status: 'active' as const,
      // Verified 3 days ago (within 7-day grace window)
      lastVerifiedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    };

    await EntitlementManager.setCachedEntitlement(cachedPro);

    const entitlement = await EntitlementManager.getEntitlement();
    expect(entitlement.status).toBe('grace_period');
    expect(EntitlementManager.isProUnlocked(entitlement)).toBe(true);
  });

  it('should gracefully revert to free entitlement when offline grace period expires (>7 days)', async () => {
    const expiredCachedPro = {
      ...EntitlementManager.getDefaultFreeEntitlement(),
      plan: 'pro_monthly',
      status: 'active' as const,
      // Verified 10 days ago (past 7-day grace window)
      lastVerifiedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    };

    await EntitlementManager.setCachedEntitlement(expiredCachedPro);

    const entitlement = await EntitlementManager.getEntitlement();
    expect(entitlement.plan).toBe('free');
    expect(entitlement.status).toBe('free');
    expect(EntitlementManager.isProUnlocked(entitlement)).toBe(false);
  });
});
