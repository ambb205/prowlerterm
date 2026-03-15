import { z } from 'astro/zod';

const mediaSchema = z.object({
  type: z.enum(['video', 'image']),
  file: z.string(),
  caption: z.string().optional(),
});

const platformSchema = z.object({
  os: z.enum(['linux', 'windows', 'macos']),
  arch: z.string(),
  file: z.string(),
  label: z.string(),
  size: z.string().optional(),
});

export const releaseSchema = z.object({
  slug: z.string(),
  displayName: z.string(),
  tagline: z.string(),
  description: z.string(),
  version: z.string(),
  released: z.coerce.date(),
  hero: z.object({
    image: z.string(),
    alt: z.string(),
  }),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  platforms: z.array(platformSchema).min(1),
  media: z.array(mediaSchema).optional(),
  links: z.record(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  install: z.record(z.string()).optional(),
});

export type Release = z.infer<typeof releaseSchema>;
export type Platform = z.infer<typeof platformSchema>;
export type Media = z.infer<typeof mediaSchema>;
