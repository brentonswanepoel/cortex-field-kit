import type { CollectionEntry } from 'astro:content';

export const productLabels = {
  xsiam: 'XSIAM',
  xdr: 'XDR',
  xsoar: 'XSOAR',
  'cortex-cloud': 'Cortex Cloud',
} as const;

export const statusLabels = {
  draft: 'Draft',
  beta: 'Beta',
  stable: 'Stable',
  deprecated: 'Deprecated',
} as const;

export const typeLabels = {
  'lab-kit': 'Lab kit',
  'correlation-rule': 'Correlation rule',
  'parsing-rule': 'Parsing rule',
  'modeling-rule': 'Modeling rule',
  'xql-hunt': 'XQL hunt',
  playbook: 'Playbook',
  integration: 'Integration',
  dashboard: 'Dashboard',
  template: 'Template',
  'migration-kit': 'Migration kit',
  skill: 'Skill',
} as const;

export const collectionPaths = {
  assets: 'assets',
  usecases: 'use-cases',
  snippets: 'snippets',
} as const;

export const collectionLabels = {
  assets: 'Asset',
  usecases: 'Use case',
  snippets: 'Snippet',
} as const;

export type CatalogueCollection = keyof typeof collectionPaths;

export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const trimmed = path.replace(/^\/+/, '');
  return `${base}${trimmed}`;
}

export function entryHref(collection: CatalogueCollection, id: string): string {
  return withBase(`${collectionPaths[collection]}/${id}/`);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function attackUrl(id: string): string {
  const [parent, sub] = id.split('.');
  if (sub) return `https://attack.mitre.org/techniques/${parent}/${sub}/`;
  return `https://attack.mitre.org/techniques/${parent}/`;
}

export function byUpdatedDesc<T extends { data: { updated: Date } }>(a: T, b: T): number {
  return b.data.updated.getTime() - a.data.updated.getTime();
}

export type AnyEntry =
  | CollectionEntry<'assets'>
  | CollectionEntry<'usecases'>
  | CollectionEntry<'snippets'>;

export interface CatalogueItem {
  collection: CatalogueCollection;
  entry: AnyEntry;
}

export function productLabel(value: string): string {
  return productLabels[value as keyof typeof productLabels] ?? value;
}

export function statusLabel(value: string): string {
  return statusLabels[value as keyof typeof statusLabels] ?? value;
}

export function typeLabel(value: string): string {
  return typeLabels[value as keyof typeof typeLabels] ?? value;
}
