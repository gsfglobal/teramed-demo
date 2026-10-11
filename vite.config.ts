import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build` → build classica (dist/), con code splitting per il 3D.
// `npm run build:single` → un solo file HTML autosufficiente (dist-single/), usato per l'anteprima pubblicata.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile({ removeViteModuleLoader: true })] : [])],
  build: {
    outDir: mode === 'single' ? 'dist-single' : 'dist',
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
    assetsInlineLimit: mode === 'single' ? 100000000 : 4096,
  },
}));
