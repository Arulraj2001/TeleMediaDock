import { z } from 'zod';

export const MagicLinkLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const SyncedPreferencesSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']).default('system'),
  namingTemplate: z.string().min(1).max(200).default('{chat}_{date}_{index}'),
  folderTemplate: z.string().min(1).max(200).default('MediaDock/'),
  duplicateStrategy: z.enum(['ask', 'skip', 'rename']).default('ask'),
  maxConcurrency: z.number().min(1).max(4).default(2),
  confirmLargeBatches: z.boolean().default(true),
  autoOpenSidePanel: z.boolean().default(true),
  showOverlayControl: z.boolean().default(true),
});

export const DeviceRegistrationSchema = z.object({
  installationId: z.string().uuid(),
  deviceName: z.string().min(1).max(100),
  lastSeenAt: z.string().datetime(),
});

export const EntitlementTokenSchema = z.object({
  userId: z.string().min(1),
  tier: z.enum(['free', 'pro']),
  expiresAt: z.string().datetime(),
  signature: z.string().min(1),
});

export type MagicLinkLogin = z.infer<typeof MagicLinkLoginSchema>;
export type SyncedPreferences = z.infer<typeof SyncedPreferencesSchema>;
export type DeviceRegistration = z.infer<typeof DeviceRegistrationSchema>;
export type EntitlementToken = z.infer<typeof EntitlementTokenSchema>;
