import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const BASE = '/cortex-field-kit';

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (name.endsWith('.html')) files.push(full);
  }
  return files;
}

function stripBase(urlPath) {
  if (urlPath === BASE || urlPath === `${BASE}/`) return '/';
  if (urlPath.startsWith(`${BASE}/`)) return urlPath.slice(BASE.length);
  return urlPath;
}

function candidates(urlPath) {
  const pathOnly = stripBase(urlPath.split('#')[0].split('?')[0]);
  if (pathOnly === '/' || pathOnly === '') return [join(DIST, 'index.html')];
  const relative = pathOnly.replace(/^\/+/, '');
  const options = [join(DIST, relative)];
  if (relative.endsWith('/')) options.push(join(DIST, relative, 'index.html'));
  else {
    options.push(join(DIST, `${relative}.html`));
    options.push(join(DIST, relative, 'index.html'));
  }
  return options;
}

function fileExists(urlPath) {
  return candidates(urlPath).some((file) => existsSync(file));
}

function idsIn(file) {
  const html = readFileSync(file, 'utf8');
  const ids = new Set();
  for (const match of html.matchAll(/\sid="([^"]+)"/g)) ids.add(match[1]);
  return ids;
}

function resolveFile(urlPath) {
  return candidates(urlPath).find((file) => existsSync(file));
}

function linksIn(html) {
  const found = [];
  const pattern = /(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  for (const match of html.matchAll(pattern)) found.push(match[1] ?? match[2]);
  return found;
}

function isSkippable(value) {
  if (!value || value.startsWith('#')) return value?.startsWith('#') ? false : true;
  if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(value)) return true;
  if (value.startsWith('//')) return true;
  return false;
}

function main() {
  if (!existsSync(DIST)) {
    console.error('dist/ is missing. Run npm run build before npm run check:links.');
    process.exit(1);
  }

  const failures = [];
  const htmlFiles = walk(DIST);

  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    for (const raw of linksIn(html)) {
      if (!raw || isSkippable(raw) && !raw.startsWith('#')) continue;
      if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(raw) || raw.startsWith('//')) continue;

      const hashIndex = raw.indexOf('#');
      const hash = hashIndex >= 0 ? raw.slice(hashIndex + 1) : '';
      const withoutHash = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw;

      if (raw.startsWith('#')) {
        if (hash && !idsIn(file).has(hash)) failures.push(`${file} -> missing #${hash}`);
        continue;
      }

      if (!withoutHash.startsWith('/')) continue;

      if (!fileExists(withoutHash)) {
        failures.push(`${file} -> missing ${withoutHash}`);
        continue;
      }

      if (hash) {
        const target = resolveFile(withoutHash);
        if (target && !idsIn(target).has(hash)) failures.push(`${file} -> missing ${withoutHash}#${hash}`);
      }
    }
  }

  const sitemap = ['sitemap-index.xml', 'sitemap-0.xml']
    .map((name) => join(DIST, name))
    .find((file) => existsSync(file));
  if (!sitemap) {
    failures.push('dist/ is missing a sitemap XML file');
  } else {
    const xml = readFileSync(sitemap, 'utf8');
    if (!xml.includes('https://brentonswanepoel.github.io/cortex-field-kit/')) {
      failures.push(`${sitemap} does not mention the GitHub Pages project URL`);
    }
  }

  const rss = join(DIST, 'rss.xml');
  if (!existsSync(rss)) failures.push('dist/rss.xml is missing');
  else {
    const feed = readFileSync(rss, 'utf8');
    if (!feed.includes('https://brentonswanepoel.github.io/cortex-field-kit/')) {
      failures.push('dist/rss.xml is missing absolute project URLs');
    }
    if (feed.includes('https://brentonswanepoel.github.io/assets/')) {
      failures.push('dist/rss.xml dropped the /cortex-field-kit/ base path');
    }
  }

  if (failures.length === 0) {
    console.log(`Internal link check passed (${htmlFiles.length} HTML files).`);
    return;
  }
  console.error(`Internal link check failed (${failures.length}).`);
  for (const failure of failures) console.error(failure);
  process.exit(1);
}

main();
