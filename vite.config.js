import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' → relative asset paths, so the built site works from any
// GitHub Pages URL (username.github.io/repo/) without extra config.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2018',
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: false,
  },
});
