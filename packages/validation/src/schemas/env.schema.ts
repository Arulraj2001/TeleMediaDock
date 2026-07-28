import { z } from 'zod';

export const ExtensionEnvSchema = z.object({
  VITE_API_URL: z.string().url().default('https://api.mediadock.app'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

export const WebEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_API_URL: z.string().url().default('https://api.mediadock.app'),
  LEMON_SQUEEZY_WEBHOOK_SECRET: z.string().optional(),
});

export type ExtensionEnv = z.infer<typeof ExtensionEnvSchema>;
export type WebEnv = z.infer<typeof WebEnvSchema>;
