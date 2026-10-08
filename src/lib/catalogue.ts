import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import {
  type AnyEntry,
  type CatalogueCollection,
  type CatalogueItem,
  byUpdatedDesc,
} from './format';

export interface Catalogue {
  assets: CollectionEntry<'assets'>[];
  usecases: CollectionEntry<'usecases'>[];
  snippets: CollectionEntry<'snippets'>[];
  latest: CatalogueItem[];
}

let cached: Promise<Catalogue> | undefined;

async function load(): Promise<Catalogue> {
  const [assets, usecases, snippets] = await Promise.all([
    getCollection('assets'),
    getCollection('usecases'),
    getCollection('snippets'),
  ]);

  assets.sort(byUpdatedDesc);
  usecases.sort(byUpdatedDesc);
  snippets.sort(byUpdatedDesc);

  const known = new Set<string>([
    ...assets.map((entry) => `assets:${entry.id}`),
    ...usecases.map((entry) => `usecases:${entry.id}`),
    ...snippets.map((entry) => `snippets:${entry.id}`),
  ]);

  for (const entry of [...assets, ...usecases, ...snippets]) {
    for (const related of entry.data.related) {
      const key = `${related.collection}:${related.id}`;
      if (!known.has(key)) {
        throw new Error(
          `content: "${entry.id}" relates to missing ${related.collection} entry "${related.id}".`,
        );
      }
    }
  }

  const latest: CatalogueItem[] = [
    ...assets.map((entry) => ({ collection: 'assets' as const, entry })),
    ...usecases.map((entry) => ({ collection: 'usecases' as const, entry })),
    ...snippets.map((entry) => ({ collection: 'snippets' as const, entry })),
  ].sort((a, b) => byUpdatedDesc(a.entry, b.entry));

  return { assets, usecases, snippets, latest };
}

export function getCatalogue(): Promise<Catalogue> {
  cached ??= load();
  return cached;
}

export async function getRelated(entry: AnyEntry): Promise<CatalogueItem[]> {
  const items = await Promise.all(
    entry.data.related.map(async (related) => {
      const match = await getEntry(related.collection, related.id);
      if (!match) return undefined;
      return { collection: related.collection as CatalogueCollection, entry: match };
    }),
  );
  return items.filter((item): item is CatalogueItem => Boolean(item));
}
