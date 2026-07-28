// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { WebKAdapter } from './WebKAdapter';
import { WebZAdapter } from './WebZAdapter';
import { SelectorHealthChecker } from './SelectorHealthChecker';

describe('Telegram Web Adapters & Fixture Suite', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    SelectorHealthChecker.getInstance().reset();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('WebKAdapter detects variant, chat label, and visible media items', () => {
    document.body.innerHTML = `
      <div class="chat-info">
        <div class="peer-title">Tech Community</div>
        <div class="peer-subtitle">1,250 members</div>
      </div>
      <div class="message-media">
        <img class="full-media" src="https://web.telegram.org/k/assets/demo_photo.jpg" />
        <div class="message-time">10:45 AM</div>
      </div>
    `;

    const adapter = new WebKAdapter();
    expect(adapter.detectVariant()).toBe('webk');

    const chat = adapter.getCurrentChat();
    expect(chat).not.toBeNull();
    expect(chat?.label).toBe('Tech Community');
    expect(chat?.isGroup).toBe(true);

    const mediaList = adapter.findVisibleMedia();
    expect(mediaList.length).toBe(1);
    const item = mediaList[0]!;
    expect(item.type).toBe('image');
    expect(item.srcUrl).toBe('https://web.telegram.org/k/assets/demo_photo.jpg');
    expect(item.isRestricted).toBe(false);
  });

  it('detectRestrictedMedia identifies protected and disappearing TTL content', () => {
    document.body.innerHTML = `
      <div class="message-media protected-content">
        <img src="https://web.telegram.org/k/assets/protected.jpg" />
      </div>
      <div class="message-media">
        <div class="ttl-icon">10s</div>
        <img src="https://web.telegram.org/k/assets/disappearing.jpg" />
      </div>
    `;

    const adapter = new WebKAdapter();
    const protectedEl = document.querySelector('.protected-content') as HTMLElement;
    const ttlEl = document.querySelector('.ttl-icon')?.parentElement as HTMLElement;

    expect(adapter.detectRestrictedMedia(protectedEl)).toBe(true);
    if (ttlEl) {
      expect(adapter.detectRestrictedMedia(ttlEl)).toBe(true);
    }

    // Filtered media list must ignore both restricted elements
    const visibleMedia = adapter.findVisibleMedia();
    expect(visibleMedia.length).toBe(0);
  });

  it('WebZAdapter extracts chat title, document name, and formatted size', () => {
    document.body.innerHTML = `
      <div class="ChatInfo">
        <div class="title">Design System Hub</div>
        <div class="status">100 subscribers</div>
      </div>
      <div class="Media">
        <div class="document-title">guide.pdf</div>
        <div class="document-size">2.5 MB</div>
        <div class="message-date">11:15 AM</div>
      </div>
    `;

    const adapter = new WebZAdapter();
    expect(adapter.detectVariant()).toBe('webz');

    const chat = adapter.getCurrentChat();
    expect(chat?.label).toBe('Design System Hub');
    expect(chat?.isChannel).toBe(true);

    const mediaList = adapter.findVisibleMedia();
    expect(mediaList.length).toBe(1);
    const item = mediaList[0]!;
    expect(item.type).toBe('document');
    expect(item.originalFilename).toBe('guide.pdf');
    expect(item.fileSize).toBe(2621440); // 2.5 MB in bytes
  });

  it('SelectorHealthChecker dispatches schema-validated report without raw DOM content', () => {
    const checker = SelectorHealthChecker.getInstance();
    let receivedReport: Record<string, string> | null = null;

    checker.addListener((report) => {
      receivedReport = report as unknown as Record<string, string>;
    });


    checker.reportSelectorFailure('webk', 'test_selector_id');

    expect(receivedReport).not.toBeNull();
    expect(receivedReport?.['telegramVariant']).toBe('webk');
    expect(receivedReport?.['failedSelectorId']).toBe('test_selector_id');
    expect(receivedReport?.['adapterVersion']).toBe('1.0.0');
    expect(receivedReport?.['extensionVersion']).toBe('1.0.0');

    // Verify deduplication
    receivedReport = null;
    checker.reportSelectorFailure('webk', 'test_selector_id');
    expect(receivedReport).toBeNull();
  });
});
