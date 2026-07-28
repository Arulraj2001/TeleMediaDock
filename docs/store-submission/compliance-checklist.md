# MediaDock – Chrome Web Store Compliance & Policy Checklist

This document details MediaDock's adherence to Google Chrome Web Store Developer Program Policies, Manifest V3 guidelines, privacy standards, and monetization policies.

---

## 1. Single Purpose Policy Compliance

* [x] **Requirement:** An extension must have a single, narrow, easy-to-understand purpose.
* [x] **Verification:** MediaDock's sole declared purpose is: *"Helping users organize and download media they are authorized to access through Telegram Web."*
* [x] **Implementation:** All UI elements (Side Panel, Settings, Filters) directly support media organization, filtering, batch saving, and download queueing for Telegram Web. No auxiliary features (e.g., VPNs, price comparison, social media sharing, or text messaging) are included.

---

## 2. Permission Minimization & Scope Restriction

* [x] **Requirement:** Request only the absolute minimum browser permissions necessary for functionality.

| Permission | Justification | Scope / Boundary |
| :--- | :--- | :--- |
| `sidePanel` | Displays the media organization grid and control interface alongside Telegram Web. | Active window only |
| `downloads` | Saves user-selected media files to local disk via browser native download manager. | Local disk target folder |
| `storage` | Stores local configuration (templates, rules) and queue state in `chrome.storage.local`. | Local extension storage |
| `activeTab` | Inspects the active Telegram Web tab when the user opens the side panel. | User-initiated tab focus |

* [x] **Host Permission Restriction:** Broad `<all_urls>` host permission is **EXPLICITLY PROHIBITED**.
* [x] **Host Whitelist:** Host access is strictly limited to:
  * `https://web.telegram.org/*`
  * `https://k.telegram.org/*`
  * `https://z.telegram.org/*`
  * `https://api.mediadock.app/*`

---

## 3. Remote Code Prohibition Policy

* [x] **Requirement:** Manifest V3 strictly prohibits the execution of remotely hosted code (JavaScript, Wasm, CSS injected remotely, `eval()`).
* [x] **Compliance Steps:**
  1. All JavaScript, TypeScript, CSS, and HTML assets are compiled and bundled locally via WXT.
  2. No remote scripts (`<script src="https://...">`) are fetched or injected into extension pages or content scripts.
  3. Strict Content Security Policy (CSP) is defined in `manifest.json`:
     ```json
     "content_security_policy": {
       "extension_pages": "script-src 'self'; object-src 'self';"
     }
     ```
  4. Use of `eval()`, `new Function()`, or dynamic code execution is strictly banned and audited via ESLint rule `no-eval`.
  5. The Sponsor Card API returns validated pure JSON data only. It NEVER returns executable scripts or HTML strings.

---

## 4. User Data & Privacy Policy Audit

* [x] **Requirement:** Clear disclosures regarding collection, use, and disclosure of user data.
* [x] **Audit Findings:**
  * MediaDock does **NOT** collect, transmit, or store Telegram messages, media URLs, files, credentials, or session tokens on any server.
  * Media processing occurs 100% locally within the browser client.
  * Web traffic is limited to local extension initialization and backend JWT entitlement validation for Pro subscribers.
* [x] **Privacy Policy Location:** Published at `https://mediadock.app/privacy` and mirrored in `docs/privacy/data-map.md`.

---

## 5. Monetization & First-Party Sponsor Policy

* [x] **Requirement:** Ads must be unobtrusive, transparent, and non-deceptive.
* [x] **Compliance Rules:**
  * No AdSense or third-party ad networks inside the extension.
  * First-party sponsor card displays a prominent `"Sponsored"` badge.
  * Sponsor card is visually distinct from download controls and media action buttons.
  * Free users can dismiss sponsor cards or disable them in settings (or by upgrading to Pro).
  * No Telegram data is ever transmitted to select or serve sponsor cards.
  * No popups, forced redirects, or ad-clicks required to unlock Free batch downloads.

---

## 6. Pre-Submission Automated Audit Checklist

```bash
# Run prior to store packaging
pnpm run lint          # ESLint audit (checks for forbidden dynamic code / eval)
pnpm run type-check    # Strict TypeScript verification
pnpm run test          # Vitest suite execution
pnpm run build         # WXT production build & bundle validation
```
