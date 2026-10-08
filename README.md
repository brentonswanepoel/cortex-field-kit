# Cortex Field Kit

Public catalogue of reusable, sanitized use cases and assets for Cortex Domain Consultants working with XSIAM, XDR, XSOAR, and Cortex Cloud.

The published site is intended to live at <https://brentonswanepoel.github.io/cortex-field-kit/>.

Cortex Field Kit is an independent project maintained by Brenton Swanepoel. It is not affiliated with, endorsed, sponsored, or supported by Palo Alto Networks.

**No customer information.** This repository is public. Do not add customer names, data, logs, IP addresses, hostnames, tenant IDs, or emails. Sample values, when one is unavoidable, use RFC 5737 or RFC 3849 documentation addresses and `example.com`, `example.org`, or `example.net`. See [AGENTS.md](AGENTS.md).

## Pages

- Home, with the latest catalogue updates
- Assets, filterable by product, type, and status
- Asset detail, including status, version, products, ATT&CK technique IDs, language, related entries, and how to reuse it
- Use-case library
- Snippets, short example XQL notes tagged with ATT&CK IDs
- Roadmap, built from open GitHub issues when `GITHUB_TOKEN` is available
- About
- Search (Pagefind)
- RSS at `/rss.xml`

Seed entries are placeholder examples. Each one sets `example: true` and shows an Example badge.

## Run locally

Node.js 22 or newer.

```bash
npm install
npm run dev
```

The dev server does not build the search index. For the production site, including search:

```bash
npm run build
npm run preview
```

Open the printed URL under `/cortex-field-kit/`. A local build leaves the roadmap in its unavailable state unless you export `GITHUB_TOKEN` first. A missing token does not fail the build.

Other checks:

```bash
npm test
npm run check:customer-info
npm run check:links
```

`npm run check:links` needs `dist/` from a build. Content schemas are validated by the build.

## Repository map

Catalogue markdown is in `content/assets`, `content/usecases`, and `content/snippets`. Schemas are in `src/content.config.ts`. How agents should change the repo is in [AGENTS.md](AGENTS.md).

GitHub issue templates, label definitions, and workflows live under `.github/`. A push to `main` publishes the site with GitHub Actions. Pull requests are reviewed by Brenton before they merge.
