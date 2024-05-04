import {resolve} from 'path'
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index-one.html'),
        index2: resolve(__dirname, 'index-two.html'),
      },
    },
  },
});
