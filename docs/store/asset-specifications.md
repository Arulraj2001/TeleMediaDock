# Chrome Web Store Asset & Screenshot Specifications

This document outlines the visual specifications and screenshot concepts for the MediaDock Chrome Web Store submission package.

---

## 1. Extension Icon Specifications

All extension icons use the official MediaDock brand icon (a dark indigo background with cyan/blue gradient download dock symbol):
- `icon-16.png` — 16 × 16 px (Extension favicon & context menus)
- `icon-32.png` — 32 × 32 px (Windows Taskbar & Chrome extension menu)
- `icon-48.png` — 48 × 48 px (Chrome Extensions Management page `chrome://extensions`)
- `icon-96.png` — 96 × 96 px (High-DPI display scaling)
- `icon-128.png` — 128 × 128 px (Chrome Web Store main listing icon)

---

## 2. Promotional Graphic Banners

- **Small Promotional Tile**: 440 × 280 px (PNG/JPEG, max 5MB)
  - *Design*: Dark theme card featuring the headline *"Privacy-First Telegram Web Media Manager"* with the extension icon and a sleek side panel preview.
- **Marquee Promotional Banner**: 1,400 × 560 px (PNG/JPEG, max 5MB)
  - *Design*: Gradient background featuring the MediaDock interface, zero-server privacy badge, and feature highlights (Smart Templates, Concurrency Queue, Local Storage).

---

## 3. Screenshot Mockup Concepts (Fictional Data Only)

> [!IMPORTANT]
> To strictly protect user privacy, **ZERO** real personal Telegram chats, usernames, or private photos are used in store screenshots. All screenshots use fictional mock data (e.g. *"Acme Design Team"*, *"Open Source Project Alpha"*).

### Screenshot 1: Media Explorer SidePanel
- **Caption**: *"Inspect and filter visible Telegram Web media privacy-first"*
- **Visual**: Telegram Web A interface open alongside the MediaDock SidePanel displaying a grid of sample design mockups with media type filters (Images, Videos, Voice, Docs).

### Screenshot 2: Batch Selection & Filters
- **Caption**: *"Select multiple files with speed and accuracy"*
- **Visual**: SidePanel showing multi-select checkboxes enabled on 8 selected video clips with batch download counter (`8 items selected • 18.4 MB`).

### Screenshot 3: Smart Filename & Folder Builder
- **Caption**: *"Automate file naming and subfolder routing"*
- **Visual**: Visual naming template builder rendering the pattern `MediaDock/{chat}/{type}/{date}_{index}` with a live fictional preview (`MediaDock/Design_Team/image/2026-07-28_01.png`).

### Screenshot 4: High-Speed Concurrency Queue
- **Caption**: *"Monitor progress with auto-retry & collision protection"*
- **Visual**: Download Queue modal showing active progress bars, paused state controls, and collision-safe duplicate handling indicators (`vacation (1).jpg`).

### Screenshot 5: Privacy & Local-Processing Architecture
- **Caption**: *"100% Local Engine — Zero files sent to remote servers"*
- **Visual**: Infographic highlighting client-side browser execution boundaries, zero cloud file uploads, and offline IndexedDB history.

### Screenshot 6: Free vs Pro Feature Comparison
- **Caption**: *"Free forever for basic downloads • Pro for unlimited queues"*
- **Visual**: Side-by-side comparison matrix showing Free Tier (up to 20 items per batch) vs Pro Tier (unlimited queues, custom templates, zero sponsor cards).
