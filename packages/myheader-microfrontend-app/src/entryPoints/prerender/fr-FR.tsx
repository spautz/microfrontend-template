import { v1Header_prerenderWithEntryPointValues } from '../../v1Header/v1HeaderPrerender.js';
import { getLinkLabels } from '../commonData/fr-FR.js';

if (process.env.NODE_ENV !== 'production') {
  // biome-ignore lint/suspicious/noConsole: This is for local dev only
  console.log('Server entry: fr-FR');
}

const v1Header_prerender = v1Header_prerenderWithEntryPointValues.bind(null, {
  linkLabels: await getLinkLabels(),
});

export { v1Header_prerender };
