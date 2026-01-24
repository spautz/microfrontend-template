import { v1RenderWithEntryPointValues } from '../../v1Render/v1Render.js';
import { getLinkLabels } from '../commonData/es-ES.js';

console.log('Browser entry: es-ES');

const v1Render = v1RenderWithEntryPointValues.bind(null, { linkLabels: await getLinkLabels() });

export { v1Render };
