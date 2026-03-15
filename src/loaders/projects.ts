import type { Loader } from 'astro/loaders';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { releaseSchema } from '../schemas/release';

export function projectsLoader(): Loader {
  const projectsDir = process.env.PROJECTS_DIR || './fixtures';

  return {
    name: 'projects-loader',
    load: async ({ store, parseData, logger, generateDigest }) => {
      const resolvedDir = resolve(projectsDir);

      if (!existsSync(resolvedDir)) {
        logger.error(`PROJECTS_DIR does not exist: ${resolvedDir}`);
        return;
      }

      logger.info(`Loading projects from: ${resolvedDir}`);
      store.clear();

      const entries = readdirSync(resolvedDir, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const manifestPath = join(resolvedDir, entry.name, 'release.json');

        if (!existsSync(manifestPath)) {
          logger.warn(`Skipping ${entry.name}: no release.json found`);
          continue;
        }

        try {
          const raw = readFileSync(manifestPath, 'utf-8');
          const json = JSON.parse(raw);
          const data = await parseData({ id: json.slug, data: json });

          store.set({
            id: json.slug,
            data,
            digest: generateDigest(data),
          });

          logger.info(`  Loaded: ${json.displayName} v${json.version}`);
        } catch (err) {
          logger.error(`Failed to load ${manifestPath}: ${err}`);
        }
      }
    },
    schema: releaseSchema,
  };
}
