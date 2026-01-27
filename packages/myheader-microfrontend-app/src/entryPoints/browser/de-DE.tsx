import { v1Header_mountWithEntryPointValues } from '../../v1Header/v1HeaderMount.js';
import { v1Header_prerenderWithEntryPointValues } from '../../v1Header/v1HeaderPrerender.tsx';
import { v1Header_rehydrateWithEntryPointValues } from '../../v1Header/v1HeaderRehydrate.tsx';
import { getLinkLabels } from '../commonData/de-DE.js';

if (process.env.NODE_ENV !== 'production') {
  // biome-ignore lint/suspicious/noConsole: This is for local dev only
  console.log('Browser entry: de-DE');
}

const entryPointValues = { linkLabels: await getLinkLabels() };

const v1Header_mount = v1Header_mountWithEntryPointValues.bind(null, entryPointValues);
const v1Header_rehydrate = v1Header_rehydrateWithEntryPointValues.bind(null, entryPointValues);
const v1Header_prerender = v1Header_prerenderWithEntryPointValues.bind(null, entryPointValues);

export { v1Header_mount, v1Header_rehydrate, v1Header_prerender };
