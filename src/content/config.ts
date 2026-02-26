import { defineCollection, z } from 'astro:content';

const apps = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    logo: z.string(),
    url: z.string().url(),
    order: z.number(),
  }),
});

const portraits = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    image: z.string().url(),
    order: z.number(),
  }),
});

export const collections = {
  'apps': apps,
  'portraits': portraits,
};
