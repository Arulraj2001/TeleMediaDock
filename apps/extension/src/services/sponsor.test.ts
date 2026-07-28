// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest';
import { SponsorManager } from './SponsorManager';

describe('Phase 13 — Sponsor Manager & Monetization Rules', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return zero sponsor cards for Pro tier users', async () => {
    const card = await SponsorManager.getActiveSponsorCard('pro');
    expect(card).toBeNull();
  });

  it('should return zero sponsor cards when hideSponsors setting is true', async () => {
    const card = await SponsorManager.getActiveSponsorCard('free', true);
    expect(card).toBeNull();
  });

  it('should return valid sponsor card for Free tier users', async () => {
    const card = await SponsorManager.getActiveSponsorCard('free', false);
    expect(card).not.toBeNull();
    expect(card?.label).toBe('Sponsored');
    expect(card?.destinationUrl).toBe('https://mediadock.app');
  });

  it('should persist dismissal and suppress dismissed sponsor card', async () => {
    let card = await SponsorManager.getActiveSponsorCard('free', false);
    expect(card).not.toBeNull();

    if (card) {
      await SponsorManager.dismissSponsor(card.id);
    }

    card = await SponsorManager.getActiveSponsorCard('free', false);
    expect(card).toBeNull();
  });
});
