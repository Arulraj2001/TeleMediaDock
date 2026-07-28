-- ====================================================================
-- MediaDock Phase 11 — Database Schema & Security Policies (Supabase SQL)
-- STRICT PRIVACY POLICY: ZERO tables for Telegram messages or media.
-- ====================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users may view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users may update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- 2. Subscriptions Table (Server-Controlled Billing Status)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_tier TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users may read own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Entitlements Table (Signed entitlement tokens)
CREATE TABLE IF NOT EXISTS public.entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free',
  signature TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users may read own entitlements"
  ON public.entitlements FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Synced Preferences Table (Strictly settings tokens: theme, templates, concurrency)
CREATE TABLE IF NOT EXISTS public.synced_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.synced_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users may read own synced preferences"
  ON public.synced_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users may insert or update own synced preferences"
  ON public.synced_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Registered Devices Table (Anonymous Installation IDs - Zero Hardware Fingerprinting)
CREATE TABLE IF NOT EXISTS public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  installation_id UUID NOT NULL,
  device_name TEXT NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, installation_id)
);

ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users may read own registered devices"
  ON public.devices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users may manage own registered devices"
  ON public.devices FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Webhook Events Table (Stripe/Payment Webhook Audit)
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
-- Webhooks are strictly backend service-role only. No public user policies.

-- 7. Sponsor Campaigns Table (Sanitized Public Cards)
CREATE TABLE IF NOT EXISTS public.sponsor_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL DEFAULT 'Sponsored',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  campaign_start TIMESTAMPTZ NOT NULL,
  campaign_end TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.sponsor_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for active sponsor campaigns"
  ON public.sponsor_campaigns FOR SELECT
  USING (is_active = true AND timezone('utc'::text, now()) BETWEEN campaign_start AND campaign_end);

-- 8. Product Config Table (Public feature flags and tier limits)
CREATE TABLE IF NOT EXISTS public.product_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.product_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for product config"
  ON public.product_config FOR SELECT
  USING (true);

-- 9. Audit Events Table (Security logs)
CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users may view own security audit events"
  ON public.audit_events FOR SELECT
  USING (auth.uid() = user_id);
