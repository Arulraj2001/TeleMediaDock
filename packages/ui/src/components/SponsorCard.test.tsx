import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SponsorCard } from './SponsorCard';

describe('SponsorCard Component', () => {
  const validData = {
    id: 'sponsor_100',
    label: 'Sponsored' as const,
    title: 'Awesome Sponsor Product',
    description: 'Short description for testing',
    imageUrl: 'https://cdn.mediadock.app/image.webp',
    destinationUrl: 'https://mediadock.app/landing',
    campaignStart: '2026-01-01T00:00:00Z',
    campaignEnd: '2026-12-31T23:59:59Z',
  };

  it('renders sponsor card with Sponsored badge and dismiss button', () => {
    const handleDismiss = vi.fn();
    render(<SponsorCard data={validData} onDismiss={handleDismiss} />);

    expect(screen.getByText('Sponsored')).toBeDefined();
    expect(screen.getByText('Awesome Sponsor Product')).toBeDefined();

    const dismissBtn = screen.getByRole('button', { name: /dismiss sponsor card/i });
    fireEvent.click(dismissBtn);
    expect(handleDismiss).toHaveBeenCalledWith('sponsor_100');
  });

  it('fails silently (returns null) for invalid domains', () => {
    const invalidData = {
      ...validData,
      imageUrl: 'https://malicious-ad-server.com/badge.png',
    };
    const { container } = render(<SponsorCard data={invalidData} />);
    expect(container.firstChild).toBeNull();
  });
});
