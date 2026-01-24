import { v1RenderWithEntryPointValues } from '../v1Render/v1Render.js';

console.log('Browser entry: de-DE');

const linkLabels = {
  home: 'Home',
  coffee: 'Coffee',
  tea: 'Tea',
  beer: 'Beer',
  wine: 'Wine',
  water: 'Water',
};

const v1Render = v1RenderWithEntryPointValues.bind(null, { linkLabels });

export { v1Render };
