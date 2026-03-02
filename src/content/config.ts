import { defineCollection, z } from 'astro:content';

const apps = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    name: z.string(),
    description: z.string(),
    logo: image(),
    url: z.string().url(),
    order: z.number(),
    tag: z.string(),
    year: z.string(),
    color: z.string(),
    screenshot: image().optional(),
    screenshot_desktop: image().optional(),
    screenshot_mobile: image().optional(),
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

const career = defineCollection({
  type: 'content',
  schema: z.object({
    version: z.string(),
    date: z.string(),
    company: z.string(),
    location: z.string(),
    period: z.string(),
    role: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    order: z.number(),
  }),
});

export const collections = {
  'apps': apps,
  'portraits': portraits,
  'career': career,
};
