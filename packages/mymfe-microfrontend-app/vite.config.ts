import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { autoComplete, Plugin as importToCDN } from 'vite-plugin-cdn-import';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // importToCDN({
    //   modules: [
    //     autoComplete('react'),
    //     autoComplete('react-dom')
    //   ],
    // }),
  ],
  build: {
    manifest: true,
    rollupOptions: {
      external: ['react', 'react-dom'],
      input: {
        index1: resolve(__dirname, 'index-one.html'),
        index2: resolve(__dirname, 'index-two.html'),
      },
    },
  },
  resolve: {
    // alias: {
    //   'react': 'https://unpkg.com/react@18/umd/react.development.js',
    //   'react/jsx-runtime': 'https://unpkg.com/react@18/umd/react.development.js',
    //   // 'react/': 'https://cdn.skypack.dev/react@18/jsx-runtime',
    //   'react-dom': 'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
    //   'react-dom/client': 'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
    //   // 'react-dom/client': 'https://cdn.skypack.dev/react-dom@18/client'
    // }
  },
});
