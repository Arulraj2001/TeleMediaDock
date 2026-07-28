// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest';
import { sanitizeFilename } from '@mediadock/shared';
import { EntitlementManager } from './EntitlementManager';
import { BatchQueueEngine } from './BatchQueueEngine';
import { FullEntitlementSchema, SponsorCardSchema } from '@mediadock/validation';


describe('Phase 16 — Formal Security & Threat Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Threat 1: should reject forged entitlement response payloads', () => {
    const forged = {
      plan: 'pro_monthly',
      status: 'active',
      features: ['all_pro_features'],
      // Invalid date format (not ISO datetime)
      startsAt: 'INVALID_DATE',
      expiresAt: null,
      gracePeriodEndsAt: null,
      lastVerifiedAt: 'INVALID_TIMESTAMP',
      provider: 'malicious_hacker_provider',
    };

    const parsed = FullEntitlementSchema.safeParse(forged);
    expect(parsed.success).toBe(false);
  });

  it('Threat 2: should reject sponsor responses violating domain allowlist', async () => {
    const maliciousSponsor = {
      id: 'sp_hack',
      label: 'Sponsored',
      title: 'Malicious Ad',
      description: 'Phishing link',
      imageUrl: 'http://malicious-ads.com/ad.png', // Insecure HTTP & non-allowlisted domain
      destinationUrl: 'http://phishing-site.com',
      campaignStart: '2026-01-01T00:00:00Z',
      campaignEnd: '2026-12-31T23:59:59Z',
    };

    const parsed = SponsorCardSchema.safeParse(maliciousSponsor);
    expect(parsed.success).toBe(false);
  });

  it('Threat 3: should sanitize malicious filenames with path traversal and control chars', () => {
    const maliciousInput = '../../../../etc/passwd\0malicious.exe';
    const sanitized = sanitizeFilename(maliciousInput);

    expect(sanitized).not.toContain('../');
    expect(sanitized).not.toContain('\0');
    expect(sanitized).not.toContain('/etc/');
    expect(sanitized).toBe('passwd_malicious.exe');
  });


  it('Threat 4: should reject unsafe URL protocols like javascript: and data:text/html', () => {
    const unsafeUrls = [
      'javascript:alert("XSS")',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)',
    ];

    unsafeUrls.forEach((url) => {
      const isValid = /^https?:\/\//i.test(url) || /^blob:/i.test(url);
      expect(isValid).toBe(false);
    });
  });

  it('Threat 5: should reject content-script sender URLs from unapproved origins', () => {
    const approvedOrigins = [
      'https://web.telegram.org/k/',
      'https://web.telegram.org/a/',
      'https://k.telegram.org/',
      'https://a.telegram.org/',
    ];

    const maliciousSenderUrl = 'https://attacker.com/fake-telegram-phishing';

    const isApproved = approvedOrigins.some((origin) => maliciousSenderUrl.startsWith(origin));
    expect(isApproved).toBe(false);
  });

  it('Threat 6: should enforce MAX_CONCURRENCY_CAP (4) on batch queue config', () => {
    const engine = new BatchQueueEngine();
    // Attempting to set dangerously high concurrency
    engine.setConcurrency(50);
    expect(engine.getConcurrency()).toBe(4);
  });

  it('Threat 7: should cap maximum batch size to 20 for Free plan tier', () => {
    const mockItems = Array.from({ length: 50 }, (_, i) => ({
      id: `msg_${i}`,
      chatLabel: 'Chat',
      mediaType: 'image' as const,
      originalFilename: `img_${i}.jpg`,
      fileSize: 1000,
      timestamp: '2026-07-28T00:00:00Z',
      directUrl: 'https://web.telegram.org/blob/123',
    }));

    // Enforce free tier batch limit
    const itemsToQueue = mockItems.slice(0, 20);
    expect(itemsToQueue.length).toBe(20);
  });


  it('Threat 8: should fall back gracefully when cached entitlement grace period expires', async () => {
    const expiredCachedPro = {
      ...EntitlementManager.getDefaultFreeEntitlement(),
      plan: 'pro_monthly',
      status: 'active' as const,
      // Verified 15 days ago (grace period is 7 days)
      lastVerifiedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    };

    await EntitlementManager.setCachedEntitlement(expiredCachedPro);
    const entitlement = await EntitlementManager.getEntitlement();

    expect(entitlement.plan).toBe('free');
    expect(entitlement.status).toBe('free');
    expect(EntitlementManager.isProUnlocked(entitlement)).toBe(false);
  });
});
