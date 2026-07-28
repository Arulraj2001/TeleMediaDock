import { type UserPlanTier } from '@mediadock/shared';
import { supabase } from '../supabase/supabaseClient';
import { DeviceManager } from './DeviceManager';

export interface AuthState {
  user: {
    id: string;
    email: string;
  } | null;
  tier: UserPlanTier;
  isAuthenticated: boolean;
}

export class AuthManagerService {
  /**
   * Send Magic Link login email
   */
  public async signInWithMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof chrome !== 'undefined' && chrome.identity
            ? chrome.identity.getRedirectURL()
            : window.location.href,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (e: unknown) {
      return { success: false, error: (e as Error).message || 'Magic link sign-in failed' };
    }
  }

  /**
   * Sign in with Google OAuth
   */
  public async signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof chrome !== 'undefined' && chrome.identity
            ? chrome.identity.getRedirectURL()
            : window.location.href,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (e: unknown) {
      return { success: false, error: (e as Error).message || 'Google sign-in failed' };
    }
  }

  /**
   * Get current auth state & entitlements
   */
  public async getAuthState(): Promise<AuthState> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session || !session.user) {
        return {
          user: null,
          tier: 'free',
          isAuthenticated: false,
        };
      }

      // Query subscription tier from DB
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('plan_tier, status')
        .eq('user_id', session.user.id)
        .single();

      const tier: UserPlanTier = sub?.plan_tier === 'pro' && sub?.status === 'active' ? 'pro' : 'free';

      // Register device silently
      await DeviceManager.registerDevice();

      return {
        user: {
          id: session.user.id,
          email: session.user.email || '',
        },
        tier,
        isAuthenticated: true,
      };
    } catch {
      return {
        user: null,
        tier: 'free',
        isAuthenticated: false,
      };
    }
  }

  /**
   * Sign Out
   */
  public async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore network sign-out errors
    }
  }

  /**
   * Delete Account & Purge Profile
   */
  public async deleteAccount(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.user) {
        // Delete user profile and device registrations via RLS
        await supabase.from('profiles').delete().eq('user_id', sessionData.session.user.id);
        await supabase.from('devices').delete().eq('user_id', sessionData.session.user.id);
        await supabase.auth.signOut();
      }
      return { success: true };
    } catch (e: unknown) {
      return { success: false, error: (e as Error).message || 'Failed to delete account' };
    }
  }
}

export const AuthManager = new AuthManagerService();
