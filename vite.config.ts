  import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  build: {
    target: 'esnext',
    outDir: '../dist',
    minify: false,
    emptyOutDir: true,
  },
});
