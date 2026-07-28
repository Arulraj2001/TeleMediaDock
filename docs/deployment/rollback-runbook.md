# MediaDock Emergency Rollback Runbook

This document defines emergency procedure steps to revert web site deployments, database migrations, or extension releases in the event of an operational failure.

---

## 1. Web Application Rollback (Netlify)

1. Open **Netlify Dashboard** -> **Deploys**.
2. Select the previous stable production deployment.
3. Click **Publish Deploy**. Netlify instantly switches traffic back to the previous atomic build in < 5 seconds.

---

## 2. Supabase Migration Rollback

1. Execute backward SQL migration script:
   ```bash
   npx supabase db repair --status reverted <migration_timestamp>
   ```
2. In case of unexpected entitlement token issues, cached offline entitlements allow users a 7-day grace period while server configurations are restored.

---

## 3. Chrome Extension Version Rollback

1. In Chrome Web Store Developer Dashboard, click **Revert to previous published version** or upload the previous verified ZIP package from `dist-release/`.
2. Chrome Web Store automatically propagates the rollback release to users within 1-2 hours.
