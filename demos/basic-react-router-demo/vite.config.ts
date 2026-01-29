import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const viteConfig: UserConfig = defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});

export default viteConfig;
