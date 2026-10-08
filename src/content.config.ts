import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const products = ['xsiam', 'xdr', 'xsoar', 'cortex-cloud'] as const;
export const statuses = ['draft', 'beta', 'stable', 'deprecated'] as const;
export const assetTypes = [
  'lab-kit',
  'correlation-rule',
  'parsing-rule',
  'modeling-rule',
  'xql-hunt',
  'playbook',
  'integration',
  'dashboard',
  'template',
  'migration-kit',
  'skill',
] as const;

const attackId = z
  .string()
  .regex(/^T\d{4}(\.\d{3})?$/, 'Use an ATT&CK technique ID such as T1059 or T1059.001');

const relatedRef = z.object({
  collection: z.enum(['assets', 'usecases', 'snippets']),
  id: z.string().min(1),
});

const shared = {
  title: z.string().min(1),
  description: z.string().min(1),
  /** When true, the site renders a visible Example badge. Seed content must set this. */
  example: z.boolean(),
  products: z.array(z.enum(products)).min(1),
  attack: z.array(attackId).default([]),
  published: z.coerce.date(),
  updated: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  related: z.array(relatedRef).default([]),
};

const assets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/assets' }),
  schema: z.object({
    ...shared,
    status: z.enum(statuses),
    version: z
      .string()
      .regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/, 'Use a semantic version such as 1.2.0'),
    type: z.enum(assetTypes),
    language: z.string().min(1),
    reuse: z.array(z.string().min(1)).min(1),
  }),
});

const usecases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/usecases' }),
  schema: z.object({
    ...shared,
    status: z.enum(statuses),
    problem: z.string().min(1),
    dataSources: z.array(z.string().min(1)).min(1),
    successCriteria: z.array(z.string().min(1)).min(1),
    reuse: z.array(z.string().min(1)).min(1),
  }),
});

const snippets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/snippets' }),
  schema: z.object({
    ...shared,
    attack: z.array(attackId).min(1),
    language: z.string().min(1).default('XQL'),
  }),
});

export const collections = { assets, usecases, snippets };
