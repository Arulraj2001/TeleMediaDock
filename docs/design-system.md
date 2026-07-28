# MediaDock – Shared Design System Documentation

This document outlines the visual identity, design tokens, component library standards, and accessibility guidelines for MediaDock.

---

## 1. Core Principles & Visual Identity

MediaDock's visual identity emphasizes clarity, precision, and privacy. It strictly avoids decorative glassmorphism or excessive gradients, using clean borders (`1px`), subtle soft shadows, curated HSL color tokens, and generous whitespace.

> [!IMPORTANT]
> **No Remote Fonts Policy**
> Extensions must NEVER fetch fonts from external CDNs (e.g., Google Fonts API). MediaDock uses an optimized local system font stack: `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.

---

## 2. Color System & HSL Tokens

| Token Name | Light Hex | Dark Hex | Role |
| :--- | :--- | :--- | :--- |
| **Primary Background** | `#F8FAFC` | `#090E1A` | Main page & side panel background |
| **Surface** | `#FFFFFF` | `#111827` | Cards, popups, side panel content cards |
| **Elevated Surface** | `#F1F5F9` | `#172033` | Hover states, tab backgrounds, code blocks |
| **Primary Brand** | `#4F46E5` | `#4F46E5` | Action buttons, active badges, progress bars |
| **Primary Hover** | `#4338CA` | `#4338CA` | Hover state for primary actions |
| **Secondary Accent** | `#06B6D4` | `#06B6D4` | Info badges, audio media indicators |
| **Success** | `#16A34A` | `#16A34A` | Download complete badges, success alerts |
| **Warning** | `#D97706` | `#D97706` | Batch limit warnings, trial expiration |
| **Danger** | `#DC2626` | `#DC2626` | Error states, cancel actions |
| **Text Primary** | `#0F172A` | `#F8FAFC` | Headings, primary labels |
| **Text Secondary** | `#64748B` | `#94A3B8` | Body text, captions, timestamps |
| **Borders** | `#E2E8F0` | `#243047` | Container borders, input outlines |

---

## 3. Typography Hierarchy

| Style Name | Size / Line-height | Weight | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | 28px / 34px | 700 | `text-2xl font-bold` | Hero headlines on website |
| **Page Title** | 20px / 28px | 650 | `text-xl font-bold` | Main page titles, modal headers |
| **Section Title**| 15px / 22px | 600 | `text-[#15px] font-semibold` | Card headers, filter sections |
| **Body** | 14px / 21px | 400 | `text-sm font-normal` | Paragraphs, description text |
| **Small** | 12px / 18px | 500 | `text-xs font-medium` | Input labels, button text, table cells |
| **Micro Label** | 11px / 16px | 600 | `text-[11px] font-semibold` | Badge tags, Sponsored pills |

---

## 4. Shape Language & Radii

* **Main Containers:** `14px` radius (`rounded-[14px]`)
* **Cards:** `12px` radius (`rounded-[12px]`)
* **Inputs & Buttons:** `10px` radius (`rounded-[10px]`)
* **Tags & Badges:** Fully rounded (`rounded-full`)
* **Borders:** Subtle `1px` solid (`border border-[#E2E8F0] dark:border-[#243047]`)

---

## 5. Component Inventory & Accessibility Matrix

| Component | Keyboard Support | ARIA Attributes | Focus State |
| :--- | :--- | :--- | :--- |
| **Button / IconButton** | `Enter`, `Space` | `aria-label`, `disabled` | `focus-visible:ring-2 focus-visible:ring-[#4F46E5]` |
| **Switch** | `Enter`, `Space` | `role="switch"`, `aria-checked` | `focus-visible:ring-2 focus-visible:ring-[#4F46E5]` |
| **Checkbox** | `Space` | `type="checkbox"`, `aria-checked` | `focus-visible:ring-2 focus-visible:ring-[#4F46E5]` |
| **RadioGroup** | `Arrow Up/Down` | `role="radiogroup"`, `aria-checked` | `focus-visible:ring-2 focus-visible:ring-[#4F46E5]` |
| **Tabs** | `Arrow Left/Right`| `role="tablist"`, `aria-selected` | `focus-visible:ring-2 focus-visible:ring-[#4F46E5]` |
| **Dialog / Modal** | `Escape` key close | `role="dialog"`, `aria-modal="true"` | Focus trapped inside dialog |
| **Drawer** | `Escape` key close | `aria-expanded` | Keyboard navigable list |
| **SponsorCard** | Focusable link | `aria-label="Dismiss sponsor card"` | Clear `"Sponsored"` badge |
