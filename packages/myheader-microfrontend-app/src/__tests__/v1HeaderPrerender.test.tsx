import { describe, expect, it } from 'vitest';

import { v1Header_prerenderWithEntryPointValues } from '../v1Header/v1HeaderPrerender.js';

describe('v1Header_prerenderWithEntryPointValues', () => {
  it('returns static markup with the header labels', async () => {
    const linkLabels = {
      siteTitle: 'Header Title',
      home: 'Home',
      coffee: 'Coffee',
      tea: 'Tea',
      beer: 'Beer',
      wine: 'Wine',
      water: 'Water',
    };

    const markup = await v1Header_prerenderWithEntryPointValues(
      { linkLabels },
      { initialUrlPath: '/home' },
    );

    expect(markup).toContain(linkLabels.siteTitle);
    expect(markup).toContain(linkLabels.home);
    expect(markup).toContain(linkLabels.coffee);
    expect(markup).toContain(linkLabels.tea);
    expect(markup).toContain(linkLabels.beer);
    expect(markup).toContain(linkLabels.wine);
    expect(markup).toContain(linkLabels.water);
  });
});
