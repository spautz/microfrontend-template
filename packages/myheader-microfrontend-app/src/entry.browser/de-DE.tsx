import { v1RenderWithEntryPointValues } from '../v1Render/v1Render.js';

console.log('Browser entry: de-DE');

const pretendToFetchLinkLabels = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    home: 'Startseite',
    coffee: 'Kaffee',
    tea: 'Tee',
    beer: 'Bier',
    wine: 'Wein',
    water: 'Wasser',
  };
};

const linkLabels = await pretendToFetchLinkLabels();

console.log('linkLabels = ', linkLabels);

const v1Render = v1RenderWithEntryPointValues.bind(null, { linkLabels });

export { v1Render };
