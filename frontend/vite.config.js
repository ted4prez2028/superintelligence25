import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: {
    host: true, port: 5173, strictPort: true, hmr: { overlay: true },
    proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true, rewrite: (p)=>p.replace(/^\/api/,'') } }
  },
  build: { sourcemap: true, outDir: 'dist', assetsDir: 'assets' },
  optimizeDeps: { include: ['react','react-dom','react-router-dom'] }
});
