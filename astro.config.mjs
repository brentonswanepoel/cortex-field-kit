import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages project site: https://brentonswanepoel.github.io/cortex-field-kit/
// `site` is the origin. `base` is the repository subpath. Astro prefixes
// generated asset and page URLs with `base`.
export default defineConfig({
  site: 'https://brentonswanepoel.github.io',
  base: '/cortex-field-kit',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
    },
  },
});
