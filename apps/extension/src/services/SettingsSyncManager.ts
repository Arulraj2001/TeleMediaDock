import { SyncedPreferencesSchema, type SyncedPreferences } from '@mediadock/validation';
import { supabase } from '../supabase/supabaseClient';

export class SettingsSyncManagerService {
  private static LOCAL_SETTINGS_KEY = 'mediadock_synced_preferences';

  /**
   * Sanitizes preferences object to enforce strict privacy boundaries.
   * Strictly strips forbidden keys: chat labels, filenames, media URLs, download history.
   */
  public sanitizePreferences(raw: Record<string, unknown>): SyncedPreferences {
    const candidate = {
      theme: raw.theme,
      namingTemplate: raw.namingTemplate,
      folderTemplate: raw.folderTemplate,
      duplicateStrategy: raw.duplicateStrategy,
      maxConcurrency: raw.maxConcurrency,
      confirmLargeBatches: raw.confirmLargeBatches,
      autoOpenSidePanel: raw.autoOpenSidePanel,
      showOverlayControl: raw.showOverlayControl,
    };

    const parsed = SyncedPreferencesSchema.safeParse(candidate);
    if (!parsed.success) {
      // Fallback to default schema values
      return SyncedPreferencesSchema.parse({});
    }
    return parsed.data;
  }

  /**
   * Push local preferences to Supabase synced_preferences table
   */
  public async pushPreferences(rawPreferences: Record<string, unknown>): Promise<SyncedPreferences> {

    const cleanSettings = this.sanitizePreferences(rawPreferences);

    // Save locally
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [SettingsSyncManagerService.LOCAL_SETTINGS_KEY]: cleanSettings });
    } else {
      localStorage.setItem(SettingsSyncManagerService.LOCAL_SETTINGS_KEY, JSON.stringify(cleanSettings));
    }

    // If user is authenticated, sync to Supabase
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user) {
      await supabase.from('synced_preferences').upsert({
        user_id: sessionData.session.user.id,
        payload: cleanSettings,
        updated_at: new Date().toISOString(),
      });
    }

    return cleanSettings;
  }

  /**
   * Fetch preferences from Supabase or fallback to local
   */
  public async pullPreferences(): Promise<SyncedPreferences> {
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData.session?.user) {
      const { data, error } = await supabase
        .from('synced_preferences')
        .select('payload')
        .eq('user_id', sessionData.session.user.id)
        .single();

      if (!error && data?.payload) {
        const cleanRemote = this.sanitizePreferences(data.payload);
        return cleanRemote;
      }
    }

    // Local fallback
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const stored = await chrome.storage.local.get(SettingsSyncManagerService.LOCAL_SETTINGS_KEY);
      if (stored[SettingsSyncManagerService.LOCAL_SETTINGS_KEY]) {
        return this.sanitizePreferences(stored[SettingsSyncManagerService.LOCAL_SETTINGS_KEY]);
      }
    } else {
      const raw = localStorage.getItem(SettingsSyncManagerService.LOCAL_SETTINGS_KEY);
      if (raw) {
        return this.sanitizePreferences(JSON.parse(raw));
      }
    }

    return SyncedPreferencesSchema.parse({});
  }
}

export const SettingsSyncManager = new SettingsSyncManagerService();
