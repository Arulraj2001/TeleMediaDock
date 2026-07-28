import {
  FullEntitlementSchema,
  type FullEntitlement,
  type SubscriptionState,
} from '@mediadock/validation';
import { OFFLINE_GRACE_PERIOD_DAYS } from '@mediadock/shared';
import { supabase } from '../supabase/supabaseClient';

export class EntitlementManagerService {
  private static ENTITLEMENT_CACHE_KEY = 'mediadock_cached_entitlement';

  /**
   * Default free tier entitlement fallback
   */
  public getDefaultFreeEntitlement(): FullEntitlement {
    return {
      plan: 'free',
      status: 'free',
      features: ['individual_downloads', 'batch_up_to_20', 'basic_naming'],
      startsAt: new Date().toISOString(),
      expiresAt: null,
      gracePeriodEndsAt: null,
      lastVerifiedAt: new Date().toISOString(),
      provider: 'local',
      providerCustomerId: null,
      providerSubscriptionId: null,
    };
  }

  /**
   * Evaluates if a given entitlement status unlocks Pro tier features
   */
  public isProUnlocked(entitlement: FullEntitlement): boolean {
    const activeStates: SubscriptionState[] = [
      'active',
      'trial',
      'lifetime',
      'cancelled_active',
      'grace_period',
    ];
    return activeStates.includes(entitlement.status);
  }

  /**
   * Get cached entitlement from local storage
   */
  public async getCachedEntitlement(): Promise<FullEntitlement | null> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const stored = await chrome.storage.local.get(EntitlementManagerService.ENTITLEMENT_CACHE_KEY);
      if (stored[EntitlementManagerService.ENTITLEMENT_CACHE_KEY]) {
        const parsed = FullEntitlementSchema.safeParse(
          stored[EntitlementManagerService.ENTITLEMENT_CACHE_KEY]
        );
        if (parsed.success) return parsed.data;
      }
    } else {
      const raw = localStorage.getItem(EntitlementManagerService.ENTITLEMENT_CACHE_KEY);
      if (raw) {
        const parsed = FullEntitlementSchema.safeParse(JSON.parse(raw));
        if (parsed.success) return parsed.data;
      }
    }
    return null;
  }

  /**
   * Save entitlement to local storage cache
   */
  public async setCachedEntitlement(entitlement: FullEntitlement): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({
        [EntitlementManagerService.ENTITLEMENT_CACHE_KEY]: entitlement,
      });
    } else {
      localStorage.setItem(
        EntitlementManagerService.ENTITLEMENT_CACHE_KEY,
        JSON.stringify(entitlement)
      );
    }
  }

  /**
   * Fetch latest entitlement from Supabase or fallback to cached grace period
   */
  public async getEntitlement(): Promise<FullEntitlement> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData.session?.user) {
        const { data: sub, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .single();

        if (!error && sub) {
          const status: SubscriptionState = (sub.status as SubscriptionState) || 'free';
          const isPro = sub.plan_tier === 'pro' || status === 'lifetime';

          const fresh: FullEntitlement = {
            plan: isPro ? (status === 'lifetime' ? 'lifetime' : 'pro_monthly') : 'free',
            status: isPro ? status : 'free',
            features: isPro
              ? [
                  'individual_downloads',
                  'batch_up_to_100',
                  'custom_templates',
                  'smart_folders',
                  'advanced_filters',
                  'duplicate_rules',
                ]
              : ['individual_downloads', 'batch_up_to_20', 'basic_naming'],
            startsAt: sub.updated_at || new Date().toISOString(),
            expiresAt: sub.current_period_end || null,
            gracePeriodEndsAt: sub.current_period_end
              ? new Date(
                  new Date(sub.current_period_end).getTime() +
                    OFFLINE_GRACE_PERIOD_DAYS * 86400000
                ).toISOString()
              : null,
            lastVerifiedAt: new Date().toISOString(),
            provider: 'lemonsqueezy',
            providerCustomerId: sub.provider_customer_id || null,
            providerSubscriptionId: sub.provider_subscription_id || null,
          };

          await this.setCachedEntitlement(fresh);
          return fresh;
        }
      }
    } catch {
      // Network unreachable fallback
    }

    // Check cached entitlement with offline grace period logic
    const cached = await this.getCachedEntitlement();
    if (cached) {
      const now = Date.now();
      const lastVerified = new Date(cached.lastVerifiedAt).getTime();
      const offlineDays = (now - lastVerified) / (1000 * 3600 * 24);

      if (cached.plan !== 'free' && offlineDays <= OFFLINE_GRACE_PERIOD_DAYS) {
        return {
          ...cached,
          status: 'grace_period',
          gracePeriodEndsAt: new Date(
            lastVerified + OFFLINE_GRACE_PERIOD_DAYS * 86400000
          ).toISOString(),
        };
      }
    }

    return this.getDefaultFreeEntitlement();
  }
}

export const EntitlementManager = new EntitlementManagerService();
