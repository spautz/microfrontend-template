import { defineConfig } from 'tsdown';

import { baseConfigValues } from '../../tsdown-base-config.ts';

const entry = ['src/index.ts', 'src/server.ts'];

const config = defineConfig(
  baseConfigValues.map((baseConfig) => ({
    ...baseConfig,
    entry,
  })),
);

export default config;
