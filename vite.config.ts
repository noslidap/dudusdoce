import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/**/*', // ou jpg, svg...
          dest: 'assets'              // vai pra dist/assets
        }
      ]
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
