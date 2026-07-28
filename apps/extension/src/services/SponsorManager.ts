import { SponsorCardSchema, type SponsorCard } from '@mediadock/validation';

export class SponsorManagerService {
  private static DISMISSED_SPONSORS_KEY = 'mediadock_dismissed_sponsors';
  private static IMPRESSIONS_KEY = 'mediadock_sponsor_impressions';

  /**
   * Evaluates and fetches an active, valid sponsor card for Free tier users.
   * Enforces approved domain allowlist, active campaign window, and dismissal status.
   */
  public async getActiveSponsorCard(
    userTier: 'free' | 'pro',
    hideSponsorsSetting = false
  ): Promise<SponsorCard | null> {
    // Pro users or users with hideSponsors enabled receive zero sponsor cards
    if (userTier === 'pro' || hideSponsorsSetting) {
      return null;
    }

    // Default sample sponsor campaign payload
    const candidate: SponsorCard = {
      id: 'sp_antigravity_01',
      label: 'Sponsored',
      title: 'Antigravity Developer Suite',
      description: 'High-performance privacy-first tools for modern web developers.',
      imageUrl: 'https://cdn.mediadock.app/sponsor.png',
      destinationUrl: 'https://mediadock.app',
      campaignStart: '2026-01-01T00:00:00Z',
      campaignEnd: '2026-12-31T23:59:59Z',
    };

    // 1. Zod Schema Validation & Approved Domain Allowlist Check
    const parsed = SponsorCardSchema.safeParse(candidate);
    if (!parsed.success) {
      return null;
    }

    const sponsor = parsed.data;

    // 2. Campaign Window Check
    const now = Date.now();
    const start = new Date(sponsor.campaignStart).getTime();
    const end = new Date(sponsor.campaignEnd).getTime();
    if (now < start || now > end) {
      return null;
    }

    // 3. Dismissal Check
    const dismissedIds = await this.getDismissedSponsorIds();
    if (dismissedIds.includes(sponsor.id)) {
      return null;
    }

    // Record aggregate impression
    await this.recordImpression(sponsor.id);

    return sponsor;
  }

  /**
   * Get dismissed sponsor campaign IDs
   */
  public async getDismissedSponsorIds(): Promise<string[]> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const stored = await chrome.storage.local.get(SponsorManagerService.DISMISSED_SPONSORS_KEY);
      return stored[SponsorManagerService.DISMISSED_SPONSORS_KEY] || [];
    }
    const raw = localStorage.getItem(SponsorManagerService.DISMISSED_SPONSORS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  /**
   * Dismiss a sponsor card permanently on client
   */
  public async dismissSponsor(sponsorId: string): Promise<void> {
    const current = await this.getDismissedSponsorIds();
    if (!current.includes(sponsorId)) {
      current.push(sponsorId);
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.set({ [SponsorManagerService.DISMISSED_SPONSORS_KEY]: current });
      } else {
        localStorage.setItem(SponsorManagerService.DISMISSED_SPONSORS_KEY, JSON.stringify(current));
      }
    }
  }

  /**
   * Record aggregate campaign impression count (zero chat/media details recorded)
   */
  public async recordImpression(sponsorId: string): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const stored = await chrome.storage.local.get(SponsorManagerService.IMPRESSIONS_KEY);
      const counts: Record<string, number> = stored[SponsorManagerService.IMPRESSIONS_KEY] || {};
      counts[sponsorId] = (counts[sponsorId] || 0) + 1;
      await chrome.storage.local.set({ [SponsorManagerService.IMPRESSIONS_KEY]: counts });
    }
  }
}

export const SponsorManager = new SponsorManagerService();
