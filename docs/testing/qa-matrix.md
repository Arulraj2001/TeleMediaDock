# MediaDock Master QA & Testing Matrix

**Date**: July 28, 2026  
**Version**: 1.0.0-release  
**Status**: All Automated & Manual Test Cases Passed (100%)

---

## 1. Unit Testing Matrix

| Component / Utility | Test Description | Status |
| :--- | :--- | :--- |
| **Filename Sanitization** | Path traversal, null bytes, Windows reserved names (CON/PRN), Unicode NFC | PASS |
| **Template Engine** | Token replacement (`{chat}`, `{date}`, `{type}`, `{index}`, `{original}`), illegal character strip | PASS |
| **Subfolder Generator** | Dynamic path creation (`MediaDock/{chat}/{type}/`), path traversal safety | PASS |
| **Queue Engine** | Concurrency cap (max 4), pause/resume, retry exponential backoff (1s, 2s, 4s) | PASS |
| **Duplicate Detector** | Fast metadata signature matching (size + name + chat), collision-safe renaming | PASS |
| **Entitlement Manager** | Pro status validation, offline 7-day grace period, fallback to free tier | PASS |
| **Sponsor Validation** | Schema validation, domain allowlist (`cdn.mediadock.app`), active date windows | PASS |
| **Analytics Engine** | Opt-in default OFF, prohibited data stripping, coarse error codes | PASS |
| **Device Manager** | Random UUID v4 installation ID generation, zero hardware fingerprinting | PASS |
| **IndexedDB Repository** | Download history persistence, retention policy auto-clear (30d/90d) | PASS |

---

## 2. Component Testing Matrix

| Component | Verified Behaviors | Status |
| :--- | :--- | :--- |
| **Button** | Primary, secondary, outline, danger, loading spinner, disabled states | PASS |
| **Checkbox & Switch** | Checked state, toggle callback, keyboard focus ring | PASS |
| **SponsorCard** | Labeled "Sponsored", Learn More link, Dismiss callback persistence | PASS |
| **OnboardingWizard** | 6-step setup flow, permission explanation, Telegram guide, step indicators | PASS |
| **SettingsScreen** | Tabbed sub-panels (General, Downloads, Naming, Privacy, Sponsors, Account, About) | PASS |
| **MediaCard** | Thumbnail display, size, media type badge, individual download action | PASS |
| **BatchToolbar** | Multi-select toggle, search query filter, sort selector, pause/resume | PASS |

---

## 3. Integration Testing Matrix

| Flow / Lifecycle | Verified Integration Scenario | Status |
| :--- | :--- | :--- |
| **Content Script -> Background** | MutationObserver media detection -> background service worker message | PASS |
| **SidePanel -> Queue Engine** | User clicks download selected -> BatchQueueEngine concurrency queue -> state dispatch | PASS |
| **Service Worker Suspension** | Queue state stored in `chrome.storage.local` -> restored cleanly on SW restart | PASS |
| **Auth & Entitlement Refresh** | Supabase session token refresh -> entitlement grant -> Pro features unlock | PASS |
| **Webhook Processing** | Lemon Squeezy HMAC signature -> Supabase subscriptions & entitlements update | PASS |
| **Settings Sync** | Sanitized preferences push -> filter forbidden chat/media fields -> cloud sync | PASS |

---

## 4. Browser & Accessibility Matrix

| Environment / Feature | Test Result | Status |
| :--- | :--- | :--- |
| **Chrome (MV3)** | Extension background service worker, sidepanel, options page | PASS |
| **Microsoft Edge (MV3)** | Chromium extension engine, sidepanel, downloads API | PASS |
| **Light & Dark Themes** | CSS design tokens, HSL colors, high-contrast dark mode (`#090E1A`) | PASS |
| **Display Scaling** | 100%, 125%, 150%, 200% DPI responsive layout rendering | PASS |
| **Keyboard Navigation** | Complete tab focus sequence, `focus-visible` outline rings, Enter/Space action | PASS |
| **Reduced Motion** | CSS `prefers-reduced-motion: reduce` micro-animation suppression | PASS |
| **Offline Mode** | Cached entitlement with 7-day grace period, IndexedDB history read/write | PASS |
| **Telegram Web Variants** | Telegram Web K and Telegram Web A DOM selector adapters | PASS |

---

## 5. Comprehensive Manual Media Test Matrix (17 Media Types)

| Media Type / Case | Test Condition | Action & Output | Status |
| :--- | :--- | :--- | :--- |
| **1. Small Image** | PNG image (< 500 KB) | Direct authorized download, thumbnail rendered in Media Explorer | PASS |
| **2. Large Image** | High-res JPEG (15 MB) | Downloaded directly without buffer crash, correct size displayed | PASS |
| **3. Short Video** | MP4 video clip (10 sec) | Video thumbnail preview, download preserved as `.mp4` | PASS |
| **4. Large Video** | 1080p MP4 (250 MB) | Direct stream download triggered, zero memory exhaustion | PASS |
| **5. Audio Track** | MP3 audio file | List view rendering, preserved duration & file size | PASS |
| **6. Voice Message** | OGG Opus voice note | Detected as voice type, saved with `.ogg` extension | PASS |
| **7. PDF Document** | Technical PDF report | Compact list view, preserved `.pdf` extension | PASS |
| **8. Archive File** | Compressed ZIP archive | Classified as document, saved cleanly to disk | PASS |
| **9. Animated GIF** | Looped MP4/WebM GIF | Detected as GIF, thumbnail animation previewed | PASS |
| **10. TGS Sticker** | Vector / Lottie sticker | Rendered where available, saved safely without DOM mutation | PASS |
| **11. Unicode Filename** | Chinese/Arabic/Emoji title | NFC normalized, invalid chars stripped, saved accurately | PASS |
| **12. Missing Filename** | Unnamed media item | Fallback naming (`mediadock_file.bin`) generated | PASS |
| **13. Duplicate File** | Same media downloaded twice | Collision handling applied (`photo (1).jpg`), zero file overwrite | PASS |
| **14. Temporary URL** | Expired blob memory URL | Refresh requested from content script, successfully re-downloaded | PASS |
| **15. Expired Media** | Evicted message reference | Graceful error state shown with retry suggestion | PASS |
| **16. Restricted Media** | DRM protected channel file | Respects Telegram restriction, download action disabled | PASS |
| **17. Disappearing Item** | Self-destructing media | Respects privacy rules, media completely ignored | PASS |
