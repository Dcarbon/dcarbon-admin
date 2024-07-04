import { ValidateEnv } from '@julr/vite-plugin-validate-env';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import million from 'million/compiler';
import { defineConfig } from 'vite';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import webfontDownload from 'vite-plugin-webfont-dl';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
const _plugins = [
  million.vite({ auto: true }),
  TanStackRouterVite(),
  react(),
  viteTsconfigPaths(),
  ValidateEnv(),
  chunkSplitPlugin(),
  nodePolyfills(),
  webfontDownload([
    'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap',
  ]),
];

export default defineConfig({
  plugins: _plugins,
});
