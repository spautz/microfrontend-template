import { v1RenderWithEntryPointValues } from '../v1Render/v1Render.js';

console.log('Browser entry: de-DE');

const linkLabels = {
  home: 'Inicio',
  coffee: 'Café',
  tea: 'Té',
  beer: 'Cerveza',
  wine: 'Vino',
  water: 'Agua',
};

const v1Render = v1RenderWithEntryPointValues.bind(null, { linkLabels });

export { v1Render };
