import {defineConfig, Schema} from '@julr/vite-plugin-validate-env';

export default defineConfig({
  VITE_API_ENDPOINT: Schema.string(),
  VITE_BASE_URL: Schema.string(),
  VITE_ALLOWED_COOKIE_DOMAIN: Schema.string(),
});
