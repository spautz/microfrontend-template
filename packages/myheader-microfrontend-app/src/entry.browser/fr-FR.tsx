import { v1RenderWithEntryPointValues } from '../v1Render/v1Render.js';

console.log('Browser entry: de-DE');

const linkLabels = {
  home: 'Accueil',
  coffee: 'Café',
  tea: 'Thé',
  beer: 'Bière',
  wine: 'Vin',
  water: 'Eau',
};

const v1Render = v1RenderWithEntryPointValues.bind(null, { linkLabels });

export { v1Render };
