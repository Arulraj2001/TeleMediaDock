# Security Policy

## Core Privacy & Security Commitment
MediaDock is designed from the ground up as a **local-first, privacy-preserving browser extension**. Under no circumstances does MediaDock extract, send, or store Telegram chat messages, media URLs, files, credentials, or session tokens on remote servers.

## Reporting a Security Vulnerability
If you discover a security vulnerability or potential privacy leak within MediaDock, please do **NOT** open a public GitHub issue.

Instead, please report it directly to our security response team:
* **Email:** `security@mediadock.app`
* **Response Window:** We acknowledge security reports within 24 hours and aim to provide a remediation plan within 72 hours.

## Scope & Non-Negotiables
We treat the following as critical security bugs:
1. Any network transmission containing Telegram chat data, media content, captions, or URLs.
2. Any execution of remotely hosted code inside the browser extension.
3. Path traversal vulnerabilities in filename templating or dynamic folder routing.
4. Incomplete or forged payment webhook signature validation.
