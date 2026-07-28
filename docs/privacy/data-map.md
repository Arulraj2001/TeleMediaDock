# MediaDock – Privacy Data Map & Data Flow Audit

## 1. Overview & Core Privacy Guarantee

MediaDock is engineered with a strict **Privacy-First, Local-Only Architecture**.

> [!IMPORTANT]
> **Fundamental Privacy Rule**
> The default answer for all Telegram content (messages, media files, Blob URLs, captions, usernames, chat titles, avatars, and file metadata) is **NEVER LEAVES THE DEVICE**.
> MediaDock does NOT operate any telemetry, tracking servers, or remote logging services that inspect user media or browsing activity.

---

## 2. Complete Data Category Inventory

| Data Category | Specific Data Elements | Origin / Source | Leaves Device? | Retention Period | Primary Purpose | Is Necessary? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Telegram Media Files** | Images, videos, audio, voice messages, documents, GIFs, stickers | Telegram Web DOM / Network Blob URLs | **NO** (Stays 100% Local) | Transient (In-memory buffer during download execution) | Saving authorized files to user's local disk | **Yes** (Core function) |
| **Telegram Media Metadata** | File names, file sizes, mime types, dimensions, durations | Telegram Web DOM elements | **NO** (Stays 100% Local) | IndexedDB storage (or cleared on history delete) | Filename templating, filter grid display, duplicate check | **Yes** (Core function) |
| **Telegram Chat Metadata** | Chat title, channel handle, message timestamp, sender display name | Telegram Web DOM elements | **NO** (Stays 100% Local) | IndexedDB storage | Sub-folder routing & dynamic filename token generation | **Yes** (Core function) |
| **Message Captions & Text** | Text accompanying media attachments | Telegram Web DOM elements | **NO** (Stays 100% Local) | Transient / IndexedDB for local manifest export | `{caption_slug}` filename token & manifest export | **Yes** (Optional feature) |
| **User Download History** | Local download logs, file hashes, disk paths, completion status | Extension engine (`chrome.downloads` & Dexie DB) | **NO** (Stays 100% Local) | Persistent in IndexedDB until manually cleared | Preventing duplicate downloads, history UI tab | **Yes** (Core function) |
| **Extension Configuration** | Filename templates, sub-folder rules, UI preference settings | Extension UI user input | **NO** (Local/Chrome Sync) | Persistent in `chrome.storage.local` / `chrome.storage.sync` | Storing user preferences & rule definitions | **Yes** (User settings) |
| **Entitlement Verification Token** | Cryptographically signed JWT token (License status, Tier, Expiration) | MediaDock API / Supabase Billing | **YES** (Sent to MediaDock API via HTTPS) | Cached locally in `chrome.storage.local` for 7 days | Verifying Pro subscription status | **Yes** (Pro verification) |
| **First-Party Sponsor Request** | App version, extension locale, subscription status tier (Free/Pro) | Extension background client | **YES** (Sent to `api.mediadock.app`) | Ephemeral (No server logging of IP/User identity) | Fetching static JSON configuration for sponsor cards | **Optional** (Free tier only) |
| **Customer Billing Info** | Email address, payment details, transaction history | Lemon Squeezy / Paddle hosted checkout | **YES** (Handled directly by Payment Processor) | Stored by Payment Processor / Supabase DB | Subscription management & invoice processing | **Yes** (Purchases only) |

---

## 3. Detailed Data Flow Architecture

```
                               ┌─────────────────────────────────────────┐
                               │             USER DEVICE                 │
                               │                                         │
 ┌──────────────────┐          │  ┌──────────────────┐                   │
 │                  │  DOM/Blob│  │   Telegram Web   │                   │
 │  Telegram Web    ├──────────┼─►│   Tab Context    │                   │
 │  Servers         │  (HTTPS) │  └────────┬─────────┘                   │
 └──────────────────┘          │           │ Isolated Adapter            │
                               │           ▼                             │
                               │  ┌──────────────────┐                   │
                               │  │ MediaDock        │                   │
                               │  │ Extension Engine │                   │
                               │  └────────┬─────────┘                   │
                               │           │                             │
                               │     ┌─────┴────────────────┐            │
                               │     ▼                      ▼            │
                               │ ┌──────────────┐   ┌──────────────┐     │
                               │ │ Local Disk   │   │ IndexedDB    │     │
                               │ │ Downloads    │   │ History &    │     │
                               │ │ Folder       │   │ Rules State  │     │
                               │ └──────────────┘   └──────────────┘     │
                               └─────────────────────────────────────────┘
                                                    │
                                      Entitlement   │ App Version / Tier ONLY
                                      JWT check     │ (NO Telegram Data!)
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │           MediaDock Cloud API           │
                               │  (api.mediadock.app / Supabase DB)      │
                               └─────────────────────────────────────────┘
```

---

## 4. Privacy & Compliance Audit Verification

### 4.1 Third-Party Telemetry & Analytics
* **Google Analytics / Mixpanel / PostHog:** **NONE.** No third-party tracking scripts are bundled or loaded.
* **Error Tracking (Sentry / Bugsnag):** **NONE.** Extension runtime errors are logged strictly to the browser's developer console.

### 4.2 Network Request Audit
* All extension network traffic is strictly audited.
* Allowed outbound domains:
  1. `https://web.telegram.org/*`, `https://k.telegram.org/*`, `https://z.telegram.org/*` (Target tab interaction)
  2. `https://api.mediadock.app/*` (MediaDock Entitlement & First-Party Sponsor API)
  3. `https://cdn.mediadock.app/*` (Static sponsor image assets for Free tier)
* **Zero outbound traffic to any other domain.**

### 4.3 Chrome Web Store Privacy Disclosure Alignment
In accordance with the Chrome Web Store Developer Privacy Policy guidelines, MediaDock declares:
* **Single Purpose:** MediaDock has a single purpose: helping users organize and download media they are authorized to access through Telegram Web.
* **Data Minimization:** Collects only the minimal data required for subscription entitlement verification.
* **Data Selling & Advertising:** MediaDock **NEVER** sells, rents, or trades user data. MediaDock **NEVER** uses Telegram content or metadata for targeted advertising.
