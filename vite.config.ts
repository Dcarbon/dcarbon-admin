// vite.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
    esbuild: {
      pure: mode === 'production' ? ['console.log'] : [],
    },
    build: {
      cssMinify: 'esbuild',
      minify: 'esbuild',
      cssCodeSplit: true,
    },
    server: {
      port: 3000,
    },
    define: {
      'process.env': process.env,
      'process.platform': JSON.stringify(process.platform),
    },
    optimizeDeps: {
      include: ['axios', 'react-router-dom', 'antd', 'rc-picker'],
    },
  };
});
