import { v1PrerenderWithEntryPointValues } from '../../v1Render/v1Prerender.js';
import { getLinkLabels } from '../commonData/de-DE.js';

console.log('Server entry: de-DE');

const v1Prerender = v1PrerenderWithEntryPointValues.bind(null, {
  linkLabels: await getLinkLabels(),
});

export { v1Prerender };
