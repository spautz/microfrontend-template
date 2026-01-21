import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vitest } from 'vitest';

import { App } from '../App.tsx';

describe('App', () => {
  afterEach(() => {
    cleanup();
    vitest.resetModules();
  });

  test('Renders without error', () => {
    render(<App />);

    expect(screen.getByText('Vite + React')).toBeVisible();
  });
});
