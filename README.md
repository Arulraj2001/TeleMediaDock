# MediaDock – Chat Media Manager

> MediaDock helps users organize and download media they are already authorized to access through Telegram Web.

MediaDock is a production-quality commercial browser extension and companion SaaS platform built with privacy-first principles. Processing and downloads happen locally on the user's device. Messages, captions, usernames, chat names, media URLs, and downloaded files are **never** sent to any backend server.

---

## 1. Project Architecture

MediaDock is structured as a **pnpm monorepo** managed with **Turborepo**:

```
Telegram/
├── apps/
│   ├── extension/          # Manifest V3 Browser Extension (WXT, React, TS, Tailwind)
│   └── web/                # Companion SaaS Web App (Next.js 14, Tailwind, Supabase)
├── packages/
│   ├── ui/                 # Shared React UI components (shadcn/ui-inspired)
│   ├── shared/             # Core domain types, constants, and utilities
│   ├── validation/         # Zod schemas for env vars, templates, and sponsor API
│   ├── config/             # Shared build configurations
│   ├── eslint-config/      # Strict ESLint rule presets
│   └── typescript-config/  # Base tsconfig presets
├── docs/                   # Architectural decisions, PRD, Privacy data map, Compliance
└── .github/                # CI workflows, dependabot, PR templates
```

---

## 2. Local Setup & Prerequisites

### Prerequisites
* **Node.js:** `>= 18.0.0` (Recommended v20+)
* **pnpm:** `>= 8.0.0` (Recommended v9+)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/mediadock.git
cd mediadock

# Install all workspace dependencies
pnpm install
```

---

## 3. Workspaces & Monorepo Commands

| Command | Action |
| :--- | :--- |
| `pnpm run build` | Builds all packages, extension (`apps/extension`), and web app (`apps/web`) via Turbo |
| `pnpm run dev` | Starts development servers for extension (WXT auto-reload) and web app (Next.js) |
| `pnpm run lint` | Runs ESLint across all workspaces |
| `pnpm run type-check` | Performs strict TypeScript type checking across all workspaces |
| `pnpm run test` | Runs Vitest unit and component test suites |
| `pnpm run format` | Formats all files using Prettier |

---

## 4. Fundamental Security & Privacy Rules

1. **Local-Only Processing:** Telegram messages, media files, Blob URLs, captions, and chat metadata MUST NEVER leave the user's browser client.
2. **Zero Remote Executable Code:** No dynamic JS/CSS/HTML loading via CDN or `eval()`. All extension code is bundled locally via WXT.
3. **Restricted Host Permissions:** Extension host permissions are strictly limited to `https://web.telegram.org/*`, `https://k.telegram.org/*`, `https://z.telegram.org/*`, and `https://api.mediadock.app/*`. Broad `<all_urls>` host permissions are strictly banned.
4. **No Secrets in Extension:** Extension builds must NEVER contain payment secrets, Supabase service-role keys, or webhook signing secrets.
5. **No Bypassing Restrictions:** Extension must NEVER bypass disappearing media, self-destructing content, restricted channels, or DRM controls.

---

## 5. Deployment Summary

* **Browser Extension (`apps/extension`):** Packaged via `pnpm --filter @mediadock/extension zip` for submission to Chrome Web Store and Microsoft Edge Add-ons.
* **Companion Web App (`apps/web`):** Deployed to Netlify / Vercel with environment variables for Supabase Auth and Lemon Squeezy / Paddle checkout embeds.
