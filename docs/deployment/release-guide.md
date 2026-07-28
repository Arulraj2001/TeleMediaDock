# MediaDock Production Deployment & Release Guide

**Version**: 1.0.0  
**Target Environments**: Development, Preview, Production  

---

## 1. Web Application Deployment (Netlify)

### Automated Netlify Deployment
1. Connect GitHub repository to Netlify.
2. Build setting configuration:
   - **Base directory**: `/`
   - **Build command**: `pnpm --filter @mediadock/web build`
   - **Publish directory**: `apps/web/.next`
3. Configure Environment Variables in Netlify Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `LEMONSQUEEZY_API_KEY`
   - `LEMONSQUEEZY_STORE_ID`
   - `LEMONSQUEEZY_WEBHOOK_SECRET`
   - `LEMONSQUEEZY_VARIANT_PRO_MONTHLY`
   - `LEMONSQUEEZY_VARIANT_PRO_ANNUAL`
   - `LEMONSQUEEZY_VARIANT_LIFETIME`

---

## 2. Supabase Backend Deployment

1. **Apply Migrations**:
   ```bash
   npx supabase db push
   ```
2. **Verify Row Level Security (RLS)**:
   - Confirm RLS policies are enabled on all 9 tables.
3. **Configure Authentication Redirect URLs**:
   - Site URL: `https://mediadock.app`
   - Redirect URLs: `https://mediadock.app/dashboard`, `chrome-extension://*/options.html`

---

## 3. Chrome Web Store Extension Release

1. **Run Release Preparation Command**:
   ```bash
   pnpm release:prepare
   ```
   *Executes monorepo linting, type-checking, vitest tests, secret scanning, ZIP artifact generation, SHA-256 checksum generation, and release notes compilation.*
2. **Upload Package**:
   - Upload `dist-release/mediadock-v1.0.0-chrome-mv3.zip` to the Chrome Web Store Developer Dashboard.
3. **Attach Reviewer Instructions**:
   - Copy content from `docs/store/reviewer-instructions.md`.
