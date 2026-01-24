import { v1PrerenderWithEntryPointValues } from '../../v1Render/v1Prerender.js';
import { getLinkLabels } from '../commonData/fr-FR.js';

console.log('Server entry: fr-FR');

const v1Prerender = v1PrerenderWithEntryPointValues.bind(null, {
  linkLabels: await getLinkLabels(),
});

export { v1Prerender };
