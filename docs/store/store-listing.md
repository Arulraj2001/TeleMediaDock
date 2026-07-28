# Chrome Web Store Listing Copy

## Product Identity
- **Title**: MediaDock – Chat Media Manager
- **Short Description**: Organize and download media you are authorized to access through Telegram Web.

---

## Full Store Description

### What MediaDock Does
MediaDock is a privacy-first browser extension designed to help you view, filter, organize, and download media assets already available within your loaded Telegram Web (K or A version) chat conversations.

Operating entirely within your browser local context, MediaDock extracts visible media references—such as photos, videos, voice notes, and technical documents—and allows you to organize them into structured subfolders directly on your computer.

---

### Supported Media Types
- **Photos**: High-definition images and gallery photos
- **Videos**: MP4 video clips and streams
- **Audio**: Music tracks and audio files
- **Voice Messages**: OGG Opus compressed voice notes
- **Documents**: PDF, ZIP archives, and work documents
- **GIFs & Stickers**: Animated WebM/MP4 clips and stickers

---

### How Local Downloads Work
1. **Local Access**: MediaDock detects media assets that Telegram Web has already downloaded to your browser memory.
2. **Direct Saving**: Files are saved directly from your browser memory to your local Downloads folder.
3. **Zero Server Intermediaries**: Your media files, chat messages, and authentication cookies are **NEVER** sent to or processed by remote cloud servers.

---

### Free Features
- Individual one-click media downloads
- Batch queue downloads up to 20 loaded items per queue
- Standard filename organization templates (`{original}`, `{chat}_{date}_{index}`)
- 100% offline IndexedDB download history
- Local duplicate file collision detection

---

### Pro Features (Optional Upgrade)
- Unlimited batch queue size (up to 100 items per batch)
- Custom dynamic token filename builder (`{chat}`, `{sender}`, `{date}`, `{type}`, `{index}`)
- Custom subfolder routing rules (`MediaDock/{chat}/{type}/`)
- Advanced duplicate signature matching
- 100% sponsor-card free experience

---

### Privacy Commitments
- **Zero Message Uploads**: We never collect or transmit chat message text, captions, or contact info.
- **Zero Media Scraping**: Files download directly between Telegram Web and your computer.
- **No Third-Party Ad Scripts**: We never integrate 3rd-party tracking scripts or ad SDKs inside the extension.

---

### Required Permissions Rationale
- **`downloads`**: Required to trigger local file saves through Chrome's native Download API.
- **`storage`**: Required to save your settings preferences and offline download history.
- **`sidepanel`**: Required to display the responsive Media Explorer interface.
- **Host Permissions (`https://web.telegram.org/*`, `https://k.telegram.org/*`, `https://a.telegram.org/*`)**: Required strictly to detect visible media elements inside your active Telegram Web tabs.

---

### Limitations & Platform Restrictions
- MediaDock works **ONLY** with media visible in your open Telegram Web conversation view.
- MediaDock does **NOT** automatically scroll or retrieve unrendered historical messages.
- MediaDock strictly respects platform security boundaries and will **NOT** bypass restricted media settings, DRM protections, or self-destructing/disappearing media.

---

### Mandatory Legal & Disclaimers

#### Copyright & Authorized-Use Notice
You must use MediaDock only in compliance with applicable copyright laws and Telegram terms of service. You should only download media assets that you have explicit permission to access and save.

#### Non-Affiliation Disclosure
**MediaDock is an independent browser extension project and is not affiliated with, endorsed by, or sponsored by Telegram Messenger Inc.**

#### Support Information
- **Website**: https://mediadock.app
- **Help Center**: https://mediadock.app/support
- **Support Email**: support@mediadock.app

#### Monetization Disclosure
MediaDock is funded through an optional Pro subscription ($2.99/mo or $24.99/yr) and occasional non-intrusive sponsor cards for free users. Account creation is completely optional; basic features remain free forever without sign-in.
