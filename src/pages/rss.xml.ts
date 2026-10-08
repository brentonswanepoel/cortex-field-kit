import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCatalogue } from '../lib/catalogue';
import { collectionPaths, type CatalogueCollection } from '../lib/format';

export async function GET(context: APIContext) {
  const site = context.site;
  if (!site) {
    throw new Error('astro.config.mjs must set `site` so the RSS feed can emit absolute links.');
  }

  const catalogue = await getCatalogue();
  const groups: Array<{ collection: CatalogueCollection; entries: typeof catalogue.assets | typeof catalogue.usecases | typeof catalogue.snippets }> = [
    { collection: 'assets', entries: catalogue.assets },
    { collection: 'usecases', entries: catalogue.usecases },
    { collection: 'snippets', entries: catalogue.snippets },
  ];

  const items = groups.flatMap((group) =>
    group.entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.published,
      categories: [...entry.data.products, ...entry.data.attack, ...(entry.data.example ? ['example'] : [])],
      link: `${collectionPaths[group.collection]}/${entry.id}/`,
    })),
  );

  items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Cortex Field Kit',
    description: 'Example assets, use cases, and snippets from the Cortex Field Kit catalogue.',
    site: new URL(import.meta.env.BASE_URL, site).href,
    trailingSlash: true,
    items,
    customData: '<language>en-gb</language>',
  });
}
