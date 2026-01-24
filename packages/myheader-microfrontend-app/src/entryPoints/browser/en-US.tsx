import { v1RenderWithEntryPointValues } from '../../v1Render/v1Render.js';
import { getLinkLabels } from '../commonData/en-US.js';

console.log('Browser entry: en-US');

const v1Render = v1RenderWithEntryPointValues.bind(null, { linkLabels: await getLinkLabels() });

export { v1Render };
