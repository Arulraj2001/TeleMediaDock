import type { TelegramAdapter } from './TelegramAdapter';
import type { TelegramVariant } from '@mediadock/shared';
import { WebKAdapter } from './WebKAdapter';
import { WebZAdapter } from './WebZAdapter';
import { WebAAdapter } from './WebAAdapter';

export class AdapterFactory {
  public static detectVariantFromLocation(): TelegramVariant {
    const host = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();

    if (host.includes('webk') || host.startsWith('k.') || pathname.startsWith('/k/')) {
      return 'webk';
    }

    if (host.includes('webz') || host.startsWith('z.') || pathname.startsWith('/z/')) {
      return 'webz';
    }

    if (host.includes('weba') || host.startsWith('a.') || pathname.startsWith('/a/')) {
      return 'webA';
    }

    // Inspect DOM signatures if host URL is ambiguous
    if (document.querySelector('.chat-info .peer-title, .bubble-media, .media-viewer')) {
      return 'webk';
    }

    if (document.querySelector('.ChatInfo .title, .Media, .MediaViewer')) {
      return 'webz';
    }

    return 'unknown';
  }

  public static createAdapter(): TelegramAdapter | null {
    const variant = AdapterFactory.detectVariantFromLocation();

    switch (variant) {
      case 'webk':
        return new WebKAdapter();
      case 'webz':
        return new WebZAdapter();
      case 'webA':
        return new WebAAdapter();
      default:
        return null;
    }
  }
}
