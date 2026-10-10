/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    // Offline support: precaches the app shell, fonts and the lazy react-pdf
    // chunk, so the whole editor (including ATS PDF export) works without a
    // connection. Updates wait for the user to reload (see UpdateToast).
    VitePWA({
      registerType: 'prompt',
      manifest: false, // keep public/manifest.json
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo192.png', 'logo512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,ico,svg}'],
        // react-pdf is ~1.2 MB; allow it so PDF export works offline too.
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        // SPA: any navigation (/impact, /view#…) is served the cached shell.
        navigateFallback: '/index.html',
      },
      devOptions: { enabled: false },
    }),
  ],
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
