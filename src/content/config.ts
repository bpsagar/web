import { defineCollection, z } from 'astro:content';

const apps = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    name: z.string(),
    description: z.string(),
    logo: image(),
    url: z.string().url(),
    order: z.number(),
  }),
});

const portraits = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    image: image(),
    titleComment: z.string().optional(),
    order: z.number(),
  }),
});

export const collections = {
  'apps': apps,
  'portraits': portraits,
};
