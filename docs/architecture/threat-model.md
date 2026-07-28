# MediaDock – Security Architecture & STRIDE Threat Model

This document outlines the security architecture and STRIDE threat analysis for MediaDock (Browser Extension, Next.js Companion Web App, and Backend API).

---

## 1. STRIDE Security Matrix Summary

| Threat Category | Potential Attack Vector | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Spoofing** | Attacker impersonates MediaDock Billing API to issue fake Pro entitlement JWTs. | High | Entitlement JWTs are cryptographically signed using RSA-256 / Ed25519 private keys. The extension verifies public key signatures locally before unlocking Pro features. |
| **Tampering** | User modifies local IndexedDB or `chrome.storage` to force Pro status locally. | Medium | Client-side tampering only affects local UI flags. Core server features (if any) validate signatures. Entitlement checks fail safely to Free mode if signature is invalid. |
| **Repudiation** | Malicious user claims unauthorized billing charges or webhooks fail without audit logs. | Medium | Idempotent webhook processing with cryptographic signature verification (Lemon Squeezy / Paddle secret keys) and Supabase database audit logs. |
| **Information Disclosure** | Extension leaks user Telegram media URLs or captions to external servers. | Critical | Architecture enforces local-only processing. Zero outbound network requests contain media payload data. Host permissions restricted to Telegram & API domains. |
| **Denial of Service** | Malicious chat or high volume of media crashes extension side panel memory. | High | Virtualized DOM list rendering, max 3 concurrent active stream downloads, explicit Blob object URL revocation (`URL.revokeObjectURL`), and Zod boundary validation. |
| **Elevation of Privilege** | DOM XSS attack in Telegram Web executes untrusted script in extension context. | Critical | Content Security Policy (CSP) bans dynamic code execution (`eval`, `new Function`). Input sanitization for all DOM renders (no `innerHTML` with untrusted data). Text node escaping. |

---

## 2. Detailed Threat Analysis & Safeguards

### 2.1 Threat Vector: Malicious / Crafty DOM Injection from Telegram Messages
* **Scenario:** A user opens a Telegram channel containing media items with malicious captions or filenames (e.g., `<script>alert('xss')</script>` or path traversal strings `../../etc/passwd`).
* **Mitigation:**
  1. MediaDock NEVER uses `innerHTML` or `dangerouslySetInnerHTML` for displaying message text, captions, or file names.
  2. All string renders utilize React's default JSX text escaping.
  3. Filenames are passed through a strict Sanitization Pipeline:
     ```typescript
     export function sanitizeFilename(filename: string): string {
       return filename
         .replace(/[\/\?<>\\:\*\|"]/g, '_') // Remove illegal chars & path separators
         .replace(/^\.+/, '')               // Block relative path traversal dots
         .trim()
         .slice(0, 255);                     // Enforce max OS filename length
     }
     ```

### 2.2 Threat Vector: Payment Webhook Forgery
* **Scenario:** An attacker sends fake payment webhooks to `https://api.mediadock.app/webhooks/billing` to claim free Pro access.
* **Mitigation:**
  1. Webhook endpoints require valid HMAC-SHA256 signature verification matching the raw request body against the webhook secret key.
  2. Replay attack prevention via timestamp verification tolerance (max 300s clock skew).
  3. Database updates occur within Supabase RLS protected transactions.

### 2.3 Threat Vector: Content Security Policy & Bundle Integrity
* **Scenario:** Supply chain compromise or CDN injection attempting to load third-party scripts.
* **Mitigation:**
  1. All extension JS/CSS assets are compiled into the extension package at build time.
  2. Host permissions restrict extension network access strictly to `web.telegram.org` variants and `api.mediadock.app`.
  3. CSP strictly enforces `"script-src 'self'"`. No external scripts allowed.

---

## 3. Defense-in-Depth Security Rules

1. **No Sensitive Keys in Extension:** Extension builds must NEVER contain Supabase service-role keys, payment processor secret keys, or webhook signing secrets.
2. **Strict Zod Validation:** Every external data boundary (Chrome messaging, API response, Storage retrieval) MUST be validated using Zod schemas.
3. **Fail-Safe Entitlement:** If authentication or entitlement checks fail or encounter unexpected payload structures, the extension defaults safely to Free tier functionality.
