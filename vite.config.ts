/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  // Keep CRA's output folder so the existing Vercel project settings still work.
  build: {
    outDir: 'build',
    // react-pdf (~1.2 MB) is its own lazy chunk, loaded only when an ATS PDF
    // is downloaded, so it never affects first load.
    chunkSizeWarningLimit: 1300,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    css: false,
  },
});
