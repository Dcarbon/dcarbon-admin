import { ValidateEnv } from '@julr/vite-plugin-validate-env';
import MillionLint from '@million/lint';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
const _plugins = [
  TanStackRouterVite(),
  react(),
  viteTsconfigPaths(),
  ValidateEnv(),
  chunkSplitPlugin(),
  nodePolyfills(),
];
_plugins.unshift(MillionLint.vite());
export default defineConfig({
  plugins: _plugins,
});
