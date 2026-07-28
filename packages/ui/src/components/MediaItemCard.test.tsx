// @vitest-environment jsdom

import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MediaItemCard } from './MediaItemCard';

describe('MediaItemCard Component', () => {
  afterEach(() => {
    cleanup();
  });

  const mockItem = {
    id: 'msg_301',
    type: 'image' as const,
    filename: 'hero_mockup.png',
    size: 1048576,
    timestamp: '2026-07-28T12:00:00Z',
    srcUrl: 'https://web.telegram.org/blob/hero',
  };

  it('renders filename, size, and media type badge correctly', () => {
    render(<MediaItemCard item={mockItem} isSelected={false} onSelectToggle={() => {}} onDownload={() => {}} />);

    expect(screen.getByText('hero_mockup.png')).toBeTruthy();
    expect(screen.getByText('1 MB')).toBeTruthy();
  });

  it('triggers onDownload when download action is clicked', () => {
    const handleDownload = vi.fn();
    render(<MediaItemCard item={mockItem} isSelected={false} onSelectToggle={() => {}} onDownload={handleDownload} />);

    const downloadBtn = screen.getByLabelText('Download file');
    fireEvent.click(downloadBtn);
    expect(handleDownload).toHaveBeenCalledWith(mockItem);
  });
});
