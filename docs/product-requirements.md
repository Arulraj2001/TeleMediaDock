# MediaDock – Product Requirements Document (PRD)

## 1. Executive Summary & Product Purpose

**Product Purpose:**
> MediaDock is a privacy-first browser extension and media management tool that enables users to organize, filter, batch download, and export media assets they are authorized to access through Telegram Web, operating entirely on their local device.

MediaDock respects user privacy, message integrity, and platform access controls. It provides productivity tools—such as filename templating, structured folder routing, duplicate detection, and batch download queuing—without ever transmitting chat content, media URLs, metadata, or user files off the user's machine.

---

## 2. Target Users & Use Cases

| Target User Group | Core Use Case | Key Needs |
| :--- | :--- | :--- |
| **Content Creators** | Managing high-res photos, videos, and graphics received in creator groups or channels. | Batch download, dynamic folder routing by channel name, custom filename templates (`{date}_{chat}_{index}`). |
| **Community Managers** | Archiving user-submitted media, event submissions, and promotional materials. | Duplicate detection, metadata manifest export (JSON/CSV), type filtering. |
| **Researchers & Analysts** | Archiving open-access media, charts, documents, and recordings from public research feeds. | Bulk collection within authorized limits, date/type filtering, structured file naming. |
| **Students & Educators** | Organizing lecture notes, PDFs, voice notes, and study group materials. | Voice message downloading, document categorization, local search. |
| **Small-Business Users** | Managing receipts, invoices, client photos, and project files received via Telegram Web. | Reliable batch downloads, clear history tracking, local storage without third-party cloud exposure. |

---

## 3. Scope Boundaries & Technical Principles

### 3.1 Supported Media Types
MediaDock supports the following media items rendered within Telegram Web (A, K, and Z versions):
- **Images:** JPEG, PNG, WEBP, SVG, standard image attachments.
- **Videos:** MP4, WEBM, MOV, video notes (round videos).
- **Audio:** MP3, FLAC, WAV, AAC audio tracks.
- **Voice Messages:** `.ogg` / `.opus` voice recordings.
- **GIFs:** Animated GIF clips and short looped clips.
- **Stickers:** TGS (animated), WEBP (static), video stickers.
- **Documents:** PDF, DOCX, XLSX, ZIP, code files, and generic binary attachments.

### 3.2 Excluded Behavior & Non-Negotiable Restrictions
To remain fully compliant with Chrome Web Store policies, copyright laws, and privacy standards, MediaDock explicitly enforces the following non-negotiables:

> [!IMPORTANT]
> **Core Non-Negotiables & Security Boundaries**
> 1. **Disappearing / Self-Destructing Media:** MediaDock NEVER interacts with, previews, captures, or saves self-destructing or timer-bound media.
> 2. **Restricted Content / Protected Channels:** MediaDock NEVER bypasses "Save / Forward Restricted" flags, secret-chat restrictions, or DRM protection.
> 3. **Unauthorized Chats:** MediaDock CANNOT access, index, or inspect any conversation that the user cannot already view in their active Telegram Web session.
> 4. **No Automated Account Scraping:** MediaDock does NOT run automated bots, background scraping scripts, or headless crawlers across unvisited chats.
> 5. **No Text Export / Message Scraping:** MediaDock is strictly a media manager; it does NOT export full chat logs or message text dumps.
> 6. **Zero Backend Data Exfiltration:** MediaDock NEVER sends messages, captions, usernames, chat names, media URLs, hashes, or downloaded files to any remote backend server.

---

## 4. Free vs. Pro Feature Matrix

| Feature | Free Tier | Pro Tier |
| :--- | :--- | :--- |
| **Batch Download Limit** | Max 20 items per batch | Unlimited (subject to browser memory/quota safeguards) |
| **Media Types Supported** | Images, Videos, Audio, Voice, GIFs, Stickers, Documents | All media types |
| **Media Browser** | Basic filter by type (Images, Videos, Docs) | Advanced multi-attribute search (Type, Date range, File size, Chat) |
| **Filename Templates** | 2 pre-set templates (`{original_name}`, `{chat}_{date}`) | Unlimited custom dynamic templates with variables (`{chat}`, `{author}`, `{date}`, `{type}`, `{index}`, `{caption_slug}`) |
| **Folder Organization** | Download to default browser folder | Dynamic sub-folder routing rules based on chat name, media type, or date |
| **Duplicate Detection** | None | Hash-based and file-size duplicate detection prior to downloading |
| **Download Presets** | Default configuration only | Save & load custom download configuration presets |
| **Metadata Export** | None | Export batch metadata as structured JSON or CSV manifests |
| **Queue Control** | Standard start/pause/cancel | Priority queuing, concurrency tuning, retry rules |
| **Settings Sync** | Local device storage only | Encrypted synchronization via `chrome.storage.sync` |
| **Sponsor Cards** | Single first-party sponsor card (clearly labeled, non-targeted, dismissible) | Zero sponsor cards / No ads |
| **Support** | Community documentation & GitHub issues | Priority customer support link |

---

## 5. User Stories & Acceptance Criteria

### User Story 1: Local Batch Download (Free User)
* **As a** Free user browsing Telegram Web,
* **I want to** select up to 20 images or documents in my current chat view and batch download them,
* **So that** I don't have to manually click save on every single item.
* **Acceptance Criteria:**
  * MediaDock side panel displays all media items currently loaded in the active chat view.
  * Selecting >20 items in Free mode prompts a clear upgrade modal without blocking selection up to 20.
  * Clicking "Download Batch" triggers native browser downloads sequentially using clean filenames.
  * No chat or media data leaves the browser client.

### User Story 2: Custom Filename & Sub-folder Organization (Pro User)
* **As a** Pro subscriber managing multi-channel media,
* **I want to** configure dynamic filename templates and target sub-folders (e.g., `Telegram/DesignChat/{date}_{index}.png`),
* **So that** my downloaded files are automatically structured on my disk.
* **Acceptance Criteria:**
  * Template editor allows live previewing of filenames based on sample tokens.
  * Sub-folder paths are validated to prevent unsafe characters or path traversal (e.g., prohibiting `../`).
  * Download queue engine applies folder routing dynamically during `chrome.downloads.download()` execution.

### User Story 3: Duplicate Detection & Manifest Export (Pro User)
* **As a** Pro researcher archiving media,
* **I want to** detect already-downloaded files and export a JSON manifest of the batch,
* **So that** I avoid redundant downloads and maintain audit logs of my authorized research files.
* **Acceptance Criteria:**
  * Extension checks candidate media hashes/IDs against Dexie IndexedDB download history.
  * Duplicates are flagged with visual badges and can be excluded with a single click.
  * "Export Manifest" generates a local `.json` file containing filenames, file sizes, timestamps, and media types (excluding private message tokens).

### User Story 4: Privacy & Fail-Safe Entitlement
* **As a** privacy-conscious user,
* **I want** all licensing checks to fail safely and never compromise my media privacy,
* **So that** I can use MediaDock with complete peace of mind.
* **Acceptance Criteria:**
  * Entitlement validation uses cryptographically signed JWTs cached locally.
  * If backend entitlement check fails or network is offline, extension falls back gracefully to Free tier functionality without locking the user out.
  * Web traffic is strictly zero for media operations.

---

## 6. Risk Register & Mitigation Strategies

| Risk ID | Risk Category | Risk Description | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **R-01** | Technical | Telegram DOM changes break element selectors | High | Implement isolated DOM Adapters using Dependency Injection. Maintain versioned adapters for Telegram Web A, K, and Z with selector fallback chains and automated DOM breakage detection. |
| **R-02** | Technical | Temporary Blob URLs revoked before download finishes | Medium | Fetch Blob streams immediately upon user queue action; stream directly to disk or hold in transient memory buffer with timeout release. |
| **R-03** | Technical | MV3 Service Worker suspended during long download queue | High | Persist complete queue state in Dexie IndexedDB and `chrome.storage.local`. Service worker automatically resumes queue execution on `chrome.runtime.onStartup` or storage events. |
| **R-04** | Performance | Browser memory pressure during large media batches | High | Implement batch concurrency limits (max 3 active streams), chunked buffer processing, explicit Blob URL revoking (`URL.revokeObjectURL`), and garbage collection triggers. |
| **R-05** | Usability | Duplicate file downloads fill user disk space | Medium | Implement local IndexedDB history tracking. Hash media metadata to detect duplicates and prompt user options (Skip / Overwrite / Rename). |
| **R-06** | Monetization | Expired paid session locks extension usability | Medium | Cache signed JWT entitlements locally with soft expiration. Default to operational Free mode if remote verification is unreachable or expired. |
| **R-07** | Backend | Payment webhook failure leads to entitlement sync delay | Medium | Webhook handler uses idempotent processing with Supabase background retries. Client app polls billing state upon return from checkout. |
| **R-08** | Compliance | Chrome Web Store rejection due to MV3 / remote code policy | High | Zero remote code loading. All JS, CSS, and HTML bundled locally via WXT build system. Minimal scope host permissions (`web.telegram.org` & API domain only). |
| **R-09** | Legal | Copyright / DMCA complaints from unauthorized downloads | Medium | Clear TOS notice that extension acts strictly as a local helper tool for authorized content. Enforce strict prohibition on bypassing protected/restricted channels. |
| **R-10** | Compliance | Privacy policy mismatch with CWS Data Use disclosure | High | Maintain `docs/privacy/data-map.md` as the single source of truth. Automated CI check ensures privacy policy matches actual network requests. |

---

## 7. Major Screen Wireframes & Layout Specifications

### 7.1 Extension Side Panel (Width: 360px – 520px)

```
+-------------------------------------------------------+
|  [Logo] MediaDock         [Free/Pro] [Queue: 3] [Gear] |  <- Top Application Bar
+-------------------------------------------------------+
|  Chat: Design Team (142 media items found)            |  <- Current Chat Info
+-------------------------------------------------------+
|  [Search media...]                                    |  <- Search & Filter Area
|  [All]  [Images (80)]  [Videos (20)]  [Docs (42)]     |
+-------------------------------------------------------+
|  +-----+  +-----+  +-----+  +-----+                   |
|  | [x] |  | [ ] |  | [x] |  | [ ] |                   |  <- Media Grid (Virtual Scroll)
|  | IMG |  | VID |  | DOC |  | IMG |                   |
|  +-----+  +-----+  +-----+  +-----+                   |
|  +-----+  +-----+  +-----+  +-----+                   |
|  | [x] |  | [ ] |  | [ ] |  | [x] |                   |
|  | GIF |  | AUD |  | IMG |  | VID |                   |
|  +-----+  +-----+  +-----+  +-----+                   |
+-------------------------------------------------------+
|  [Sponsored: Upgrade your workflow with Cloud Tools]  |  <- Optional Sponsor Card (Free)
+-------------------------------------------------------+
|  4 items selected (12.4 MB)     [ Download Batch (4) ]|  <- Selection Action Bar
+-------------------------------------------------------+
|  [Media]  [Downloads]  [History]  [Rules]  [Settings] |  <- Bottom Navigation Bar
+-------------------------------------------------------+
```

#### Detailed Element Requirements:
1. **Top Application Bar:** Height 48px. Features MediaDock icon, title, Free/Pro status pill badge, live download queue counter badge (animated on activity), and Settings quick-link.
2. **Current Chat Header:** Displays active conversation title extracted safely from Telegram DOM.
3. **Search & Filter Toolbar:** Filter pills for All, Images, Videos, Audio, Voice, GIFs, Stickers, Documents. Search input filters by filename/caption text locally.
4. **Media Grid / List View:** 3-column responsive grid on 360px width, 4-column on 520px width. Built with virtual scrolling for handling 1000+ items without DOM lag. Overlay checkboxes for batch selection. Hover preview overlay.
5. **Selection Action Bar:** Sticky bottom bar showing count of selected items, cumulative file size estimation, download button, and template quick-select dropdown.
6. **Download Queue Drawer:** Slide-up panel displaying active jobs, progress bars, download speed, pause/resume buttons, and error retry controls.
7. **Sponsor Card (Free Users):** Distinctly styled container with `12px` radius, clear `"Sponsored"` micro-label badge, dismiss `(X)` button, title, thumbnail, and landing URL. Must never copy Telegram UI elements or disguise itself as a download button.
8. **Bottom Navigation Bar:** Height 56px with accessible icons and collapsing labels on small widths (<380px).

### 7.2 Extension Settings & Rules Tab
* **Tab 1: General & Entitlement:** Account status, Pro subscription upgrade/manage link, dark/light theme switch, "Hide sponsor cards" toggle (eligible users).
* **Tab 2: Filename Templates:** Interactive builder with tag pills (`{chat}`, `{date}`, `{type}`, `{index}`, `{caption}`). Real-time sample output preview.
* **Tab 3: Custom Folder Rules:** Rule table mapping media types or specific chat keywords to target sub-folders (e.g., `Videos` -> `Telegram/Videos`).
* **Tab 4: History & Storage:** Dexie IndexedDB storage usage statistics, clear download history button, manifest export configuration.

### 7.3 Companion Web Application (Next.js)
* **Landing Page (`/`):** Feature showcases, privacy architecture explanation, installation link, customer testimonials.
* **Pricing Page (`/pricing`):** Free vs Pro comparison, Lemon Squeezy / Paddle checkout embeds for Monthly, Annual, and Lifetime options.
* **Account & Billing Portal (`/account`):** Supabase Auth login, license key management, active session devices, customer billing portal redirect.
