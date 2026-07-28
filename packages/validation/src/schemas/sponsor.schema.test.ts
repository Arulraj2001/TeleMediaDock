import { describe, it, expect } from 'vitest';
import { SponsorCardSchema } from './sponsor.schema';

describe('SponsorCardSchema', () => {
  it('validates a correct first-party sponsor payload', () => {
    const valid = {
      id: 'sponsor_1',
      label: 'Sponsored',
      title: 'Cloud Backups for Creators',
      description: 'Secure your files in local storage.',
      imageUrl: 'https://cdn.mediadock.app/banner.webp',
      destinationUrl: 'https://mediadock.app/pro',
      campaignStart: '2026-01-01T00:00:00Z',
      campaignEnd: '2026-12-31T23:59:59Z',
    };
    expect(() => SponsorCardSchema.parse(valid)).not.toThrow();
  });

  it('rejects image URLs from unapproved third-party domains', () => {
    const invalid = {
      id: 'sponsor_2',
      label: 'Sponsored',
      title: 'Malicious Tracker',
      description: 'Tracking pixel image',
      imageUrl: 'https://unapproved-ad-network.com/tracker.png',
      destinationUrl: 'https://mediadock.app/pro',
      campaignStart: '2026-01-01T00:00:00Z',
      campaignEnd: '2026-12-31T23:59:59Z',
    };
    expect(() => SponsorCardSchema.parse(invalid)).toThrow();
  });
});
