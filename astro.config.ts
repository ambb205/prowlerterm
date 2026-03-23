import { defineConfig } from 'astro/config';
import { existsSync, createReadStream, statSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';

const projectsDir = process.env.PROJECTS_DIR || './fixtures';

const mimeTypes: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

export default defineConfig({
  outDir: './dist',
  build: {
    assets: '_assets',
  },
  vite: {
    server: {
      fs: {
        allow: [projectsDir, '.'],
      },
    },
    plugins: [
      {
        name: 'serve-dl',
        configureServer(server) {
          const root = resolve(projectsDir);
          server.middlewares.use((req, res, next) => {
            if (!req.url?.startsWith('/dl/')) return next();
            const rel = req.url.slice(4); // strip "/dl/"
            const filePath = join(root, decodeURIComponent(rel));
            if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
              res.statusCode = 404;
              res.end('Not found');
              return;
            }
            const mime = mimeTypes[extname(filePath).toLowerCase()];
            if (mime) res.setHeader('Content-Type', mime);
            createReadStream(filePath).pipe(res);
          });
        },
      },
    ],
  },
});
