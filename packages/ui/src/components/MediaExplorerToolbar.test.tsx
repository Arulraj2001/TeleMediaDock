// @vitest-environment jsdom

import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MediaExplorerToolbar } from './MediaExplorerToolbar';

describe('MediaExplorerToolbar Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders search input, view mode toggles, and multi-select button', () => {
    render(
      <MediaExplorerToolbar
        searchValue=""
        onSearchChange={() => {}}
        activeCategory="all"
        onCategoryChange={() => {}}
        sortOption="date_desc"
        onSortChange={() => {}}
        viewMode="grid"
        onViewModeChange={() => {}}
        isMultiSelect={false}
        onToggleMultiSelect={() => {}}
        onRefresh={() => {}}
      />
    );

    expect(screen.getByPlaceholderText('Search media by filename...')).toBeTruthy();
    expect(screen.getByLabelText('Multi-select items')).toBeTruthy();
  });

  it('triggers onRefresh when Refresh button is clicked', () => {
    const handleRefresh = vi.fn();
    render(
      <MediaExplorerToolbar
        searchValue=""
        onSearchChange={() => {}}
        activeCategory="all"
        onCategoryChange={() => {}}
        sortOption="date_desc"
        onSortChange={() => {}}
        viewMode="grid"
        onViewModeChange={() => {}}
        isMultiSelect={false}
        onToggleMultiSelect={() => {}}
        onRefresh={handleRefresh}
      />
    );

    const refreshBtn = screen.getByLabelText('Refresh media scan');
    fireEvent.click(refreshBtn);
    expect(handleRefresh).toHaveBeenCalled();
  });
});
