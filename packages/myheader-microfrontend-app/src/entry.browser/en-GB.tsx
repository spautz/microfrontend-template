import { v1RenderWithEntryPointValues } from '../v1Render/v1Render.js';

console.log('Browser entry: de-DE');

const linkLabels = {
  home: 'Home',
  coffee: 'Coffee',
  tea: 'Afternoon tea',
  beer: 'Pints',
  wine: 'Wine',
  water: 'Tap water',
};

const v1Render = v1RenderWithEntryPointValues.bind(null, { linkLabels });

export { v1Render };
