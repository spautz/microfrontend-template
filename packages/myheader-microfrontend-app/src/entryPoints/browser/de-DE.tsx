import { v1RenderWithEntryPointValues } from '../../v1Render/v1Render.js';
import { getLinkLabels } from '../commonData/de-DE.js';

console.log('Browser entry: de-DE');

const v1Render = v1RenderWithEntryPointValues.bind(null, { linkLabels: await getLinkLabels() });

export { v1Render };
