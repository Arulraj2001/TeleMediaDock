import { z } from 'zod';

export const ExtensionEventTypeSchema = z.enum([
  'extension_installed',
  'onboarding_completed',
  'feature_opened',
  'download_started',
  'download_completed',
  'download_failed',
  'upgrade_opened',
  'entitlement_refreshed',
  'adapter_health_failed',
]);

export const CoarseErrorCodeSchema = z.enum([
  'ERR_ADAPTER_SELECTOR_NOT_FOUND',
  'ERR_BLOB_TIMEOUT',
  'ERR_PERM_DENIED',
  'ERR_FILE_SYSTEM_FULL',
  'ERR_NETWORK_UNREACHABLE',
  'ERR_UNKNOWN',
]);

export const ExtensionAnalyticsEventSchema = z.object({
  event: ExtensionEventTypeSchema,
  timestamp: z.string().datetime(),
  installationId: z.string().uuid(),
  userTier: z.enum(['free', 'pro']),
  errorCode: CoarseErrorCodeSchema.optional(),
  itemCount: z.number().int().nonnegative().optional(),
});

export const WebsiteEventTypeSchema = z.enum([
  'landing_page_visit',
  'pricing_page_visit',
  'store_cta_click',
  'checkout_start',
  'successful_subscription',
  'documentation_search',
  'support_form_submission',
]);

export const UtmParametersSchema = z.object({
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  term: z.string().optional(),
  content: z.string().optional(),
});

export const WebsiteAnalyticsEventSchema = z.object({
  event: WebsiteEventTypeSchema,
  timestamp: z.string().datetime(),
  path: z.string(),
  utm: UtmParametersSchema.optional(),
});

export type ExtensionEventType = z.infer<typeof ExtensionEventTypeSchema>;
export type CoarseErrorCode = z.infer<typeof CoarseErrorCodeSchema>;
export type ExtensionAnalyticsEvent = z.infer<typeof ExtensionAnalyticsEventSchema>;
export type WebsiteEventType = z.infer<typeof WebsiteEventTypeSchema>;
export type UtmParameters = z.infer<typeof UtmParametersSchema>;
export type WebsiteAnalyticsEvent = z.infer<typeof WebsiteAnalyticsEventSchema>;
