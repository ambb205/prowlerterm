import { defineCollection } from 'astro:content';
import { projectsLoader } from './loaders/projects';

const projects = defineCollection({
  loader: projectsLoader(),
});

export const collections = { projects };
