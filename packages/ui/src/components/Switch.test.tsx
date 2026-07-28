import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from './Switch';

describe('Switch Component', () => {
  it('toggles switch state on click and space key', () => {
    const handleToggle = vi.fn();
    render(<Switch label="Enable Notifications" checked={false} onCheckedChange={handleToggle} />);

    const switchBtn = screen.getByRole('switch');
    expect(switchBtn).toBeDefined();

    fireEvent.click(switchBtn);
    expect(handleToggle).toHaveBeenCalledWith(true);

    fireEvent.keyDown(switchBtn, { key: ' ' });
    expect(handleToggle).toHaveBeenCalledWith(true);
  });
});
