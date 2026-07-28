# MediaDock – Quality Assurance & Testing Strategy

This document outlines the testing strategy, toolchain, mock architecture, and test execution workflows for MediaDock.

---

## 1. Testing Pyramid & Toolchain Summary

```
                      /  Playwright E2E  \       <- Extension Side Panel & Web App E2E
                     /--------------------\
                    / React Testing Lib.  \      <- Component & State Integration
                   /-----------------------\
                  /   Vitest Unit & Logic   \    <- Schemas, Utilities, Adapters, Rules
                 /---------------------------\
```

| Layer | Focus Area | Technology | Responsibility |
| :--- | :--- | :--- | :--- |
| **Unit Testing** | Zod schemas, Filename template parser, Path sanitizer, Queue state machine, DOM Adapter logic | **Vitest** | Fast execution (<2s), 100% coverage on core utility logic |
| **Component Testing** | Side Panel UI, Media Grid, Download Drawer, Sponsor Card, Settings Tabs | **React Testing Library** | Verifying user interactions, WCAG AA accessibility, focus states |
| **Adapter Mock Testing** | Telegram DOM selector extraction for Telegram A, K, Z variants | **Vitest + JSDOM** | Validating selector stability against synthetic DOM snapshots |
| **Service Worker Lifecycle** | MV3 background event queue persistence and wakeup recovery | **Vitest + Storage Mock** | Verifying state recovery across simulated SW restarts |
| **End-to-End (E2E)** | Extension side panel workflow, Companion Next.js marketing and billing portal | **Playwright** | Real browser validation of download initiation and subscription flows |

---

## 2. Component-Level Test Guidelines

### 2.1 Domain & Selector Mock Strategy
To test Telegram Web DOM adapters without requiring live network access to Telegram:
1. Maintain synthetic HTML DOM snapshots for Telegram Web A, K, and Z in `packages/shared/testing/dom-snapshots/`.
2. Load snapshots in JSDOM unit tests to verify selector extraction logic.
3. Validate that DOM adapter implementations gracefully return `null` or fallback arrays when selectors fail to match.

### 2.2 Filename Template Engine Tests
* Test cases MUST verify:
  * `{chat}` token replacement with sanitized chat titles.
  * `{date}` formatting (`YYYY-MM-DD`).
  * `{index}` zero-padded numbering (`001`, `002`).
  * Prevention of directory traversal characters (`..`, `/`, `\`).
  * Fallback behavior for missing tokens or empty captions.

### 2.3 Sponsor Card Component Tests
* Test cases MUST verify:
  * Sponsor card renders when tier is `Free`.
  * Sponsor card does NOT render when tier is `Pro`.
  * Prominent `"Sponsored"` badge is accessible via screen readers (`aria-label`).
  * Clicking `"Dismiss"` hides card and stores dismissal preference locally.
  * Invalid sponsor payload (failed Zod validation) causes card to fail silently (hidden) without crashing the UI.

---

## 3. Automated Test Execution Commands

```bash
# Run unit & component test suite
pnpm run test

# Run tests in watch mode during development
pnpm run test:watch

# Run test coverage report
pnpm run test:coverage

# Run Playwright End-to-End test suite
pnpm run test:e2e
```

---

## 4. Verification Checklist for Every Phase Release

Before declaring any build phase complete, the engineering workflow mandates execution of:

* [ ] `pnpm run lint` — Zero ESLint errors or warnings.
* [ ] `pnpm run type-check` — Zero TypeScript strict type errors.
* [ ] `pnpm run test` — All Vitest unit and component tests passing.
* [ ] `pnpm run build` — Production build completes cleanly for both extension and web app.
