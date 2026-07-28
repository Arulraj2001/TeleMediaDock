# Chrome Web Store Reviewer Instructions & Verification Guide

**Extension Name**: MediaDock – Chat Media Manager  
**Version**: 1.0.0  
**Target Browser**: Google Chrome (MV3)  

---

## 1. Summary for Reviewers
MediaDock is a privacy-first utility extension designed to help users view, filter, and save media assets that are already loaded inside their authenticated Telegram Web browser session.

**Key Architecture Boundary**: MediaDock is 100% client-side. Media files, chat text, captions, and authentication tokens are **NEVER** transmitted to or processed by remote backend servers.

---

## 2. Step-by-Step Test Procedure for Reviewers

### Step 1: Open Telegram Web
1. Open Google Chrome and navigate to [https://web.telegram.org](https://web.telegram.org) (either Telegram Web K or Web A version).
2. Log in to a test Telegram account or open any public/demo channel containing images, videos, or documents (e.g. public media channels).

### Step 2: Open MediaDock SidePanel
1. Click the **MediaDock** icon in the Chrome extension toolbar (or press `Ctrl+Shift+M`).
2. The responsive SidePanel drawer will open, automatically detecting visible media items in your current active chat view.

### Step 3: Test Basic Local Download
1. In the MediaExplorer SidePanel, hover over any visible media item thumbnail.
2. Click the **Download** button.
3. Observe that Chrome triggers a standard local download directly to your computer's Downloads folder (`Downloads/MediaDock/...`).

### Step 4: Test Batch Selection & Subfolder Templates
1. Click the **Multi-Select** checkbox button in the toolbar.
2. Select 2-3 items and click **Download Selected**.
3. Open MediaDock Options (right-click extension icon -> Options) to verify subfolder template rules (`MediaDock/{chat}/{type}/`).

---

## 3. Paid Features & Entitlement Verification

- **Free Tier (Default)**: All basic download features, individual downloads, standard templates, and batch queues up to 20 items are **100% free forever** without requiring account sign-in.
- **Pro Tier (Optional Upgrade)**: Unlocks unlimited batch queue size (up to 100 items), custom token templates, and sponsor-free views.
- **Test Credentials for Reviewers**:
  - *Account Email*: `reviewer-demo@mediadock.app`
  - *Status*: Pre-granted Pro entitlement active for store review verification.

---

## 4. Platform Safety & Restricted Media Handling

- **Restricted Media**: If a Telegram channel has restricted saving enabled (DRM protection), MediaDock detects the restriction attribute and **disables** the download action button. MediaDock never bypasses platform security controls.
- **Disappearing / Secret Media**: MediaDock completely ignores disappearing or self-destructing media items.

---

## 5. Demo Video Script & Review Materials
A 60-second video walkthrough demonstrating Telegram Web media detection, local sidepanel rendering, subfolder template configuration, and local file saving (using fictional test content) is available at:  
`https://mediadock.app/docs/store-review-demo.mp4`
