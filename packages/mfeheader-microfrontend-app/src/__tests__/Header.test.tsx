import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Header } from '../v1Header/Header/Header.js';

describe('Header', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders all link labels', () => {
    const linkLabels = {
      siteTitle: 'Header Title',
      home: 'Home',
      coffee: 'Coffee',
      tea: 'Tea',
      beer: 'Beer',
      wine: 'Wine',
      water: 'Water',
    };

    render(<Header linkLabels={linkLabels} />);

    expect(screen.getByRole('heading', { name: linkLabels.siteTitle })).toBeVisible();
    expect(screen.getByText(linkLabels.home)).toBeVisible();
    expect(screen.getByText(linkLabels.coffee)).toBeVisible();
    expect(screen.getByText(linkLabels.tea)).toBeVisible();
    expect(screen.getByText(linkLabels.beer)).toBeVisible();
    expect(screen.getByText(linkLabels.wine)).toBeVisible();
    expect(screen.getByText(linkLabels.water)).toBeVisible();
  });
});
