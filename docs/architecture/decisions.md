# MediaDock – Architecture Decision Records (ADR)

## Record Index
* [ADR-001: Monorepo Architecture with Turborepo & pnpm](#adr-001-monorepo-architecture-with-turborepo--pnpm)
* [ADR-002: Browser Extension Stack (WXT, MV3, React, TypeScript Strict)](#adr-002-browser-extension-stack-wxt-mv3-react-typescript-strict)
* [ADR-003: Manifest V3 Service Worker State & Queue Persistence](#adr-003-manifest-v3-service-worker-state--queue-persistence)
* [ADR-004: Telegram Web DOM Adapter Pattern with Dependency Injection](#adr-004-telegram-web-dom-adapter-pattern-with-dependency-injection)
* [ADR-005: Local Media Download Pipeline & Memory Safeguards](#adr-005-local-media-download-pipeline--memory-safeguards)
* [ADR-006: Offline-First Fail-Safe Entitlement Verification](#adr-006-offline-first-fail-safe-entitlement-verification)
* [ADR-007: First-Party Static Sponsor Card Framework](#adr-007-first-party-static-sponsor-card-framework)
* [ADR-008: Companion Web Application & Billing Architecture](#adr-008-companion-web-application--billing-architecture)
* [ADR-009: Telegram Web DOM Isolation, Observer Debouncing & Health Telemetry](#adr-009-telegram-web-dom-isolation-observer-debouncing--health-telemetry)

---


## ADR-001: Monorepo Architecture with Turborepo & pnpm

### Context & Problem Statement
MediaDock consists of a Manifest V3 browser extension and a companion Next.js web application, sharing design systems, UI components, TypeScript type definitions, and Zod validation schemas. Managing these in separate repositories would create code duplication and synchronization overhead.

### Decision
We adopt a **pnpm monorepo** managed with **Turborepo**.

```
Telegram/
├── apps/
│   ├── extension/          # WXT Browser Extension (Chrome/Edge/Firefox)
│   └── web/                # Next.js Companion SaaS Web App
├── packages/
│   ├── ui/                 # Shared React components (shadcn/ui style, Tailwind)
│   ├── shared/             # Shared types, Zod schemas, constants
│   ├── validation/         # Shared input validation logic
│   ├── config/             # Shared build configs
│   ├── eslint-config/      # Base ESLint rules
│   └── typescript-config/  # Shared tsconfig definitions
├── supabase/               # Database migrations, RLS policies, Edge functions
└── docs/                   # Product, privacy, architecture, & CWS documentation
```

### Consequences
* **Positive:** Shared Zod schemas ensure 100% type and runtime validation alignment between extension client and web API. Shared design tokens guarantee visual brand consistency. Single pnpm lockfile reduces disk footprint and speeds up CI.
* **Negative:** Requires monorepo awareness in build pipelines and extension bundling tools.

---

## ADR-002: Browser Extension Stack (WXT, MV3, React, TypeScript Strict)

### Context & Problem Statement
Manifest V3 (MV3) requires strict background service worker compliance, no remote code loading, and strict permission scoping. Building directly with raw Webpack/Vite config for Manifest V3 requires significant boilerplate for background workers, side panels, and content scripts.

### Decision
We choose **WXT** (Web Extension Tools) with **React**, **TypeScript (strict mode)**, and **Tailwind CSS**.

### Consequences
* **Positive:** WXT provides out-of-the-box support for Manifest V3 entry points (Side Panel, Background Worker, Content Script), automatic reload during development, strict asset bundling without external CDN references, and type-safe browser API wrappers.
* **Negative:** Developers must adhere to WXT entry point conventions (`entrypoints/sidepanel/`, `entrypoints/background.ts`, `entrypoints/content.ts`).

---

## ADR-003: Manifest V3 Service Worker State & Queue Persistence

### Context & Problem Statement
In Manifest V3, background service workers are event-driven and can be suspended by Chrome after ~30 seconds of inactivity. If download queue state is held in JavaScript memory global variables, worker termination causes lost queues, hung downloads, and corrupted user states.

### Decision
We implement persistent queue storage using **IndexedDB (via Dexie.js)** combined with **`chrome.storage.local`**.

### Mechanics
1. Every download job added to the queue is immediately written to Dexie IndexedDB with status `QUEUED`.
2. When the background worker starts or wakes up (via `chrome.runtime.onStartup` or `chrome.downloads.onChanged`), it queries Dexie for active or pending tasks.
3. Queue status updates (`IN_PROGRESS`, `COMPLETED`, `PAUSED`, `FAILED`) are transactionally committed to IndexedDB.
4. If suspended mid-download, the re-awakened service worker picks up the exact state without user intervention.

---

## ADR-004: Telegram Web DOM Adapter Pattern with Dependency Injection

### Context & Problem Statement
Telegram Web exists in multiple major web client variants (Telegram Web A, Telegram Web K, Telegram Web Z). Each variant uses different DOM structures, class names, and attributes. Hardcoding DOM selectors in React components or content scripts causes widespread breakage whenever Telegram updates its UI.

### Decision
We implement an **Isolated DOM Adapter Interface** injected via **Dependency Injection (DI)**.

```typescript
export interface TelegramDomAdapter {
  readonly version: 'A' | 'K' | 'Z';
  detect(): boolean;
  getChatTitle(): string | null;
  getMediaElements(): MediaElementCandidate[];
  extractBlobUrl(element: Element): Promise<string | null>;
  observeNewMedia(callback: (elements: MediaElementCandidate[]) => void): () => void;
}
```

### Consequences
* **Positive:** General application logic and React UI components deal exclusively with unified `MediaElementCandidate` interfaces. Selector changes in Telegram Web A/K/Z require updates ONLY inside the corresponding adapter implementation (`src/adapters/telegram-a.ts`).
* **Negative:** Requires initial investment in mock DOM snapshots for unit testing adapter implementations.

---

## ADR-005: Local Media Download Pipeline & Memory Safeguards

### Context & Problem Statement
Downloading large batches of media (e.g., 50 high-definition videos or thousands of images) can exhaust browser RAM if full Blobs are stored in memory or written to IndexedDB.

### Decision
1. **Direct Stream Routing:** Media files are passed directly to `chrome.downloads.download()` via local Blob URLs or Telegram Web media stream references.
2. **Short-Lived Memory Buffers:** Raw media Blobs are NEVER stored persistently in IndexedDB. Only metadata (filenames, hashes, dates) is saved in Dexie.
3. **Explicit Revocation:** `URL.revokeObjectURL()` is invoked immediately after `chrome.downloads` accepts the job.
4. **Batch Concurrency Throttling:** Simultaneous active downloads are capped at 3 items to prevent network socket starvation and browser memory spikes.

---

## ADR-006: Offline-First Fail-Safe Entitlement Verification

### Context & Problem Statement
If a user is offline, on a spotty network, or if our billing server is undergoing maintenance, entitlement checks must not fail catastrophically or block basic extension utility.

### Decision
1. **Signed Entitlement JWTs:** Upon login or purchase, the backend issues an RSA-256 signed JWT containing the user's active plan, feature flags, and expiration timestamp.
2. **Local Caching:** The extension verifies the JWT signature locally and caches the payload in `chrome.storage.local`.
3. **Graceful Fallback:** If network verification fails or entitlement expires while offline, the system safely falls back to the fully functional **Free Tier** (up to 20 items per batch, standard templates) without throwing runtime crashes or locking out the user.

---

## ADR-007: First-Party Static Sponsor Card Framework

### Context & Problem Statement
To support the Free tier without relying on third-party ad networks (which violate CWS single-purpose and privacy rules by inserting tracking pixels), MediaDock requires a lightweight, transparent sponsor mechanism.

### Decision
1. **First-Party Sponsor API:** Extension requests static JSON configuration from `https://api.mediadock.app/v1/sponsors`.
2. **Strict Zod Schema Validation:** Outgoing requests contain ONLY product version, app language, and Free/Pro status. Incoming payloads are validated against Zod schemas.
3. **Strict Domain Whitelisting:** Images and URLs must match strict whitelists (`cdn.mediadock.app`).
4. **User Controls:** Free users can dismiss sponsor cards or disable them by upgrading to Pro. Pro users never receive sponsor requests.

---

## ADR-008: Companion Web Application & Billing Architecture

### Context & Problem Statement
The product requires a commercial marketing site, user account portal, subscription management system, and webhook processing for license issuance.

### Decision
* **Framework:** Next.js (App Router, React, TypeScript strict mode).
* **Styling:** Tailwind CSS with local `shadcn/ui` components.
* **Backend & Database:** Supabase PostgreSQL with strict Row Level Security (RLS) policies.
* **Authentication:** Supabase Auth (Email magic link / OAuth).
* **Payment Processor:** Hosted checkout via **Lemon Squeezy** or **Paddle**.
* **Hosting:** Netlify deployment.

---

## ADR-009: Telegram Web DOM Isolation, Observer Debouncing & Health Telemetry

### Context & Problem Statement
Telegram Web maintains distinct web variants (Web K, Web Z, Web A) with evolving DOM structures. Uncontrolled DOM scanning causes high CPU usage and browser lag, while hardcoded DOM selectors break when Telegram updates its UI.

### Decision
1. **Isolated Adapter Modules:** All DOM selectors are strictly contained inside `WebKAdapter`, `WebZAdapter`, and `WebAAdapter`. React UI components NEVER import or reference Telegram DOM selectors.
2. **250ms Debounced MutationObserver:** DOM changes are observed via a centralized `BaseTelegramAdapter` observer throttled at 250ms, preventing CPU thrashing during message scrolling.
3. **Strict Restricted Media Gatekeeping:** Disappearing timers, protected content (`.protected-content`, `.no-copy`), and self-destructing elements are filtered out by `detectRestrictedMedia` and skipped.
4. **Branded Floating Action Overlay:** Injected floating controls (`MediaDock Quick Save`) use distinctive Indigo branding and never imitate Telegram native controls.
5. **Zero-Content Health Telemetry:** `SelectorHealthChecker` reports failing selector IDs formatted as `{ adapterVersion, telegramVariant, failedSelectorId, extensionVersion }` without capturing any page text, user messages, or DOM HTML.
6. **Graceful Fallback:** If selectors fail or an unsupported variant is detected, `UnsupportedStateScreen` is displayed to guide the user safely.

