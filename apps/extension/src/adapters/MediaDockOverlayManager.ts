import type { DiscoveredMedia } from '@mediadock/shared';

export interface OverlaySaveCallback {
  (media: DiscoveredMedia): void;
}

export class MediaDockOverlayManager {
  private overlayContainer: HTMLElement | null = null;
  private currentMedia: DiscoveredMedia | null = null;
  private onSaveCallback: OverlaySaveCallback | null = null;

  constructor(onSave: OverlaySaveCallback) {
    this.onSaveCallback = onSave;
  }

  public updateOverlay(visibleMedia: DiscoveredMedia[]): void {
    // Find media active in full viewer modal or highest visible media item
    const viewerMedia = visibleMedia.find((m) => m.id.includes('viewer')) || visibleMedia[0];

    if (!viewerMedia || viewerMedia.isRestricted) {
      this.hideOverlay();
      return;
    }

    this.currentMedia = viewerMedia;

    // Anchor overlay to viewer container or top right corner of media element
    const anchorParent =
      document.querySelector('.media-viewer, .MediaViewer, .viewer-container') ||
      viewerMedia.element ||
      document.body;

    if (!this.overlayContainer) {
      this.createOverlay();
    }

    if (this.overlayContainer && anchorParent) {
      if (this.overlayContainer.parentElement !== anchorParent) {
        anchorParent.appendChild(this.overlayContainer);
      }
      this.overlayContainer.style.display = 'flex';
    }
  }

  private createOverlay(): void {
    const container = document.createElement('div');
    container.id = 'mediadock-quick-save-overlay';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'MediaDock Quick Saver');

    // Distinctive MediaDock branding styling (Indigo pill with icon + label)
    Object.assign(container.style, {
      position: 'absolute',
      top: '16px',
      right: '16px',
      zIndex: '999999',
      display: 'none',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 14px',
      backgroundColor: '#4F46E5',
      color: '#FFFFFF',
      borderRadius: '10px',
      boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'transform 0.15s ease, background-color 0.15s ease',
    });

    container.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      <span>MediaDock Quick Save</span>
    `;

    container.addEventListener('mouseenter', () => {
      container.style.backgroundColor = '#4338CA';
      container.style.transform = 'translateY(-1px)';
    });

    container.addEventListener('mouseleave', () => {
      container.style.backgroundColor = '#4F46E5';
      container.style.transform = 'translateY(0)';
    });

    container.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.currentMedia && this.onSaveCallback) {
        this.onSaveCallback(this.currentMedia);
      }
    });

    this.overlayContainer = container;
  }

  public hideOverlay(): void {
    if (this.overlayContainer) {
      this.overlayContainer.style.display = 'none';
    }
  }

  public dispose(): void {
    if (this.overlayContainer && this.overlayContainer.parentNode) {
      this.overlayContainer.parentNode.removeChild(this.overlayContainer);
    }
    this.overlayContainer = null;
    this.currentMedia = null;
  }
}
