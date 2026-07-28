import { z } from 'zod';

export const SubscriptionStateSchema = z.enum([
  'free',
  'trial',
  'active',
  'past_due',
  'grace_period',
  'cancelled_active',
  'expired',
  'refunded',
  'lifetime',
]);

export const PlanTypeSchema = z.enum(['pro_monthly', 'pro_annual', 'lifetime']);

export const CheckoutRequestSchema = z.object({
  plan: PlanTypeSchema,
  userId: z.string().optional(),
  email: z.string().email().optional(),
});

export const FullEntitlementSchema = z.object({
  plan: z.string(),
  status: SubscriptionStateSchema,
  features: z.array(z.string()),
  startsAt: z.string().datetime(),
  expiresAt: z.string().datetime().nullable(),
  gracePeriodEndsAt: z.string().datetime().nullable(),
  lastVerifiedAt: z.string().datetime(),
  provider: z.enum(['lemonsqueezy', 'paddle', 'local']),
  providerCustomerId: z.string().nullable(),
  providerSubscriptionId: z.string().nullable(),
});

export const LemonSqueezyWebhookSchema = z.object({
  meta: z.object({
    event_name: z.string(),
    custom_data: z.record(z.any()).optional(),
  }),
  data: z.object({
    id: z.string(),
    type: z.string(),
    attributes: z.object({
      store_id: z.number().optional(),
      customer_id: z.number().optional(),
      order_id: z.number().optional(),
      user_name: z.string().optional(),
      user_email: z.string().optional(),
      status: z.string().optional(),
      renews_at: z.string().nullable().optional(),
      ends_at: z.string().nullable().optional(),
      created_at: z.string().optional(),
      updated_at: z.string().optional(),
    }),
  }),
});

export type SubscriptionState = z.infer<typeof SubscriptionStateSchema>;
export type PlanType = z.infer<typeof PlanTypeSchema>;
export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;
export type FullEntitlement = z.infer<typeof FullEntitlementSchema>;
export type LemonSqueezyWebhook = z.infer<typeof LemonSqueezyWebhookSchema>;
