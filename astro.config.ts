import { defineConfig } from 'astro/config';

export default defineConfig({
  outDir: './dist',
  build: {
    assets: '_assets',
  },
  vite: {
    server: {
      fs: {
        allow: [process.env.PROJECTS_DIR || './fixtures'],
      },
    },
  },
});
