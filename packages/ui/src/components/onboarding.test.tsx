// @vitest-environment jsdom

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { OnboardingWizard } from './OnboardingWizard';

describe('OnboardingWizard', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders initial welcome step correctly', () => {
    render(<OnboardingWizard onComplete={vi.fn()} />);
    expect(screen.getByText(/Welcome to MediaDock/i)).toBeDefined();
  });

  it('navigates through steps when clicking continue', () => {
    const handleComplete = vi.fn();
    render(<OnboardingWizard onComplete={handleComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(screen.getByText(/Privacy First Architecture/i)).toBeDefined();
  });

  it('triggers onComplete on final step completion', () => {
    const handleComplete = vi.fn();
    render(<OnboardingWizard onComplete={handleComplete} />);

    // Step 0 -> 1
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    // Step 1 -> 2
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    // Step 2 -> 3
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    // Step 3 -> 4
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    // Step 4 -> 5
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    // Step 5 -> Complete
    fireEvent.click(screen.getByRole('button', { name: /Launch Media Explorer/i }));

    expect(handleComplete).toHaveBeenCalledTimes(1);
  });
});
