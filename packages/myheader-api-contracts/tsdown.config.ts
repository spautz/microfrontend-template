import { defineConfig } from 'tsdown';
import { baseConfig } from '../../tsdown-base-config.ts';

const config = defineConfig([
  ...baseConfig.map((buildConfig) => {
    // Expand the entry points, but keep all other settings the same
    return {
      ...buildConfig,
      entry: ['src/v1/index.ts'],
      outDir: `${buildConfig.outDir}/v1/`,
    };
  }),
  {
    // Plus a void/invalid root import
    entry: 'src/no-import-from-root.ts',
    format: 'esm',
    outDir: './dist/',
    tsconfig: './tsconfig.build-esm.json',
    fixedExtension: false,
  },
]);

export default config;
