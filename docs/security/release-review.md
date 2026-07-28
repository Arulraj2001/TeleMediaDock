# MediaDock Security Release Review & Audit Report

**Date**: July 28, 2026  
**Auditor**: MediaDock Security & Architecture Team  
**Scope**: `@mediadock/extension` (MV3), `@mediadock/web` (Next.js 14), `@mediadock/shared`, `@mediadock/validation`, Supabase Database RLS Policies.

---

## 1. Extension Permissions & Host Isolation Audit

### Permissions Review
- `downloads`: Required solely to save authorized media files locally to the user's computer via Chrome Download API.
- `storage`: Required for offline IndexedDB download history and setting preferences.
- `sidepanel`: Required to render the responsive side panel interface.

### Host Permissions Audit
- `https://web.telegram.org/*`
- `https://k.telegram.org/*`
- `https://a.telegram.org/*`

*Constraint Verification*: Host permissions are strictly restricted to official Telegram Web origins. No wildcard (`<all_urls>`) or third-party domain permissions exist in `manifest.json`.

---

## 2. Content Security Policy (CSP) & Executable Code Restrictions

- **Extension Policy**: `script-src 'self'; object-src 'none';`
- **Verification**: Zero remote scripts, CDN scripts, inline eval (`unsafe-eval`), or third-party ad JavaScript are bundled or executed. All logic is compiled locally into static bundle artifacts (`background.js`, `content.js`, `sidepanel.html`).

---

## 3. Message Passing & Origin Validation

- **Sender & Origin Verification**: Background service worker validates incoming message origins using `sender.tab?.url`.
- **Approved Origin Regex**: `/^https:\/\/(web|k|a)\.telegram\.org\//i`
- **Confused Deputy Protection**: Messages originating from unauthorized tabs, arbitrary web pages, or untrusted extensions are rejected immediately.

---

## 4. Filename Sanitization & Protocol Filters

- **Sanitization Engine**: Removes path traversal sequences (`../`, `..\`), control characters (`\0`, `\n`), invalid OS characters (`<`, `>`, `:`, `"`, `/`, `\`, `|`, `?`, `*`), and normalizes Unicode.
- **Protocol Allowlist**: Downloads permit ONLY `https:`, `http:`, and `blob:` schemes. `javascript:`, `data:text/html`, and unsafe protocols are rejected.

---

## 5. Sponsor Domain Allowlist & Zero-3rd-Party Ads

- Extension sponsor cards are served strictly via validated JSON payloads over HTTPS.
- Approved domain allowlist: `cdn.mediadock.app`, `mediadock.app`.
- Requests targeting unapproved external domains or non-HTTPS URLs are discarded.

---

## 6. Secret Management & Production Bundle Inspection

- **Bundled Secrets Check**: Inspected compiled bundle `.output/chrome-mv3`. Confirmed zero service-role keys, database passwords, or webhook signing secrets (`LEMONSQUEEZY_WEBHOOK_SECRET`) are present.
- **Environment Boundaries**: `service_role` keys and webhook secrets reside exclusively in server-side Next.js environment variables.

---

## 7. Database Row Level Security (RLS) & Audit Policies

- **User Data Isolation**: RLS policies enforce `auth.uid() = user_id` across all 9 database tables (`profiles`, `subscriptions`, `entitlements`, `synced_preferences`, `devices`, `webhook_events`, `sponsor_campaigns`, `product_config`, `audit_events`).
- **Zero Media Guarantee**: Database schema strictly contains NO tables or columns for storing Telegram chat message text, captions, media URLs, or files.

---

## 8. Runbooks & Secret Rotation Procedures

### Secret Rotation Runbook
1. **Webhook Secrets**: Generate new HMAC secret in Lemon Squeezy Dashboard -> Update `LEMONSQUEEZY_WEBHOOK_SECRET` in environment -> Deploy updated `/api/webhooks/lemonsqueezy`.
2. **Supabase Anon Key**: Rotate anon key in Supabase Dashboard -> Update `VITE_SUPABASE_ANON_KEY` -> Rebuild extension MV3 bundle.

### Backup & Restore Procedure
- Database point-in-time recovery (PITR) enabled via Supabase automated daily snapshots with 30-day retention.
