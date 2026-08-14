import { defineConfig } from 'vite';

// DAWN is a static, dependency-light experience. No React plugin, no SSR,
// nothing exotic — Vite is used purely as a dev server and bundler.
export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 5173,
    open: false,
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
  // Content JSON lives outside /public so it goes through the module graph
  // and hot-reloads during development. Vite will serve it via fetch('/content/...').
  publicDir: 'public',
});
