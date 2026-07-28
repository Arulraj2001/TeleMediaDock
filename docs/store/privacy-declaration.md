# Chrome Web Store Privacy Single-Purpose & Data Usage Declaration

This document details the responses for the Chrome Web Store Developer Dashboard Privacy Tab submission form for **MediaDock – Chat Media Manager**.

---

## 1. Single-Purpose Statement

**Single-Purpose Declaration**:  
MediaDock has a single, focused purpose: to help users view, filter, organize, and download media files that are already visible and accessible within their authorized Telegram Web browser sessions directly to their local computer.

---

## 2. Permission Justifications

### Host Permissions (`https://web.telegram.org/*`, `https://k.telegram.org/*`, `https://a.telegram.org/*`)
- **Justification**: Required strictly to inspect DOM elements and detect visible media assets (photos, videos, documents) inside active Telegram Web browser tabs open by the user. MediaDock does NOT request permissions for any other websites (`<all_urls>`).

### Downloads Permission (`downloads`)
- **Justification**: Required to save selected media items directly from browser memory to the user's local Downloads folder using Chrome's native `chrome.downloads` API.

### Storage Permission (`storage`)
- **Justification**: Required to persist user UI preferences (theme, filename templates, duplicate handling rules) and offline download history in local browser storage (`chrome.storage.local`).

### Side Panel Permission (`sidePanel`)
- **Justification**: Required to render the responsive Media Explorer interface in Chrome's side panel drawer.

---

## 3. Data Collection & Usage Disclosures

| Data Type | Collected? | Stored Locally? | Transmitted to Server? | Justification / Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Telegram Message Text** | **NO** | NO | NO | MediaDock strictly ignores message text and captions. |
| **Telegram Media Files** | **NO** | YES (Local Disk) | NO | Files save directly from browser memory to local disk. Zero server transit. |
| **Telegram Contact Info** | **NO** | NO | NO | MediaDock never accesses Telegram user contacts or phone numbers. |
| **Authentication Data** | **Optional** | YES | YES (Encrypted) | Optional email login to sync non-sensitive extension settings across devices. |
| **Subscription Status** | **YES** | YES | YES | Validates active Pro tier status with Lemon Squeezy payment processor. |
| **Telemetry Analytics** | **Optional** | YES | Optional | **Disabled by default**. Opt-in coarse error codes (e.g. `ERR_BLOB_TIMEOUT`). |
| **Sponsor Reporting** | **YES** | YES | Aggregate Only | Aggregate campaign impression/click counts without chat or file data. |

---

## 4. Certification & Security Disclosures

- **Remote Executable Code**: MediaDock certifies that it does **NOT** use remote executable code (no remote scripts, CDN JavaScript, or eval). All code is bundled inside the extension package.
- **Data Selling**: MediaDock certifies that user data is **NEVER** sold to third parties, data brokers, or advertising networks.
- **Data Usage Boundaries**: Collected subscription and opt-in telemetry data is used solely to provide and improve extension functionality.
