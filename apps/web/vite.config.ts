import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  // for some reason, I need to do this, or else the request becomes /publicassets instead of /public/assets
  base: process.env.NODE_ENV === 'production' ? '/public/' : '/public',
});
