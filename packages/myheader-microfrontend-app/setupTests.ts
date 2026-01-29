/// <reference types="vite/client" />
import '@testing-library/jest-dom/vitest';

const testEnvDefaults: Record<string, string> = {
  VITE_NEXTJS_APP_BASEURL: 'http://localhost:3001',
  VITE_REACTROUTER_APP_BASEURL: 'http://localhost:3002',
  VITE_TANSTACK_APP_BASEURL: 'http://localhost:3003',
  VITE_VITE_APP_BASEURL: 'http://localhost:3004',
};

const env = import.meta.env as Record<string, string | undefined>;
for (const [key, value] of Object.entries(testEnvDefaults)) {
  if (!env[key]) {
    env[key] = value;
  }
}
