import { defineCollection, z } from 'astro:content';

const apps = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    logo: z.string(),
    url: z.string().url(),
    order: z.number(),
    year: z.string(),
  }),
});

export const collections = {
  'apps': apps,
};
