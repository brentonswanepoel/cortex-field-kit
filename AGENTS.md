# Agents in Cortex Field Kit

**No customer information, ever.** This repository is public. Do not put customer names, data, logs, IP addresses, hostnames, tenant IDs, emails, or any other identifying detail in content, code, comments, fixtures, issues, commit messages, or pull requests. The only sample addresses allowed are the documentation ranges in RFC 5737 (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`) and RFC 3849 (`2001:db8::/32`). The only sample domains allowed are `example.com`, `example.org`, and `example.net`. Implementation files such as content packs and test data stay in a separate private repository. Do not copy them here.

Brenton Swanepoel reviews every pull request. Agents open pull requests. They do not merge, and they do not deploy by hand.

## What this repository is

Cortex Field Kit is a static catalogue: a portfolio and a set of reusable, sanitized use cases and assets for Cortex Domain Consultants. The site is independent. It is not endorsed by Palo Alto Networks. Say that when you add visitor-facing copy. The footer and the About page already do.

## Layout

```text
content/assets/       Catalogue assets (one markdown file each)
content/usecases/     Use-case library
content/snippets/     Short XQL notes
src/content.config.ts Collection schemas (glob loaders pointed at content/)
src/pages/            Routes
src/components/       Shared UI
src/layouts/          Base HTML layout
scripts/              Link check, customer-information check, label sync, agent-ready review
.github/              Workflows, issue templates, label definitions
```

Markdown lives under `content/`, not `src/content/`. `src/content.config.ts` loads those directories with Astro glob loaders and validates frontmatter at build time. A schema error fails `npm run build`.

## Content schemas

Shared fields:

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Seed and unverified entries start with `Example:`. |
| `description` | yes | One paragraph. It is the card text, the meta description, and the RSS summary. |
| `example` | yes | Boolean. `true` renders the visible Example badge. Set this consciously. |
| `products` | yes | One or more of `xsiam`, `xdr`, `xsoar`, `cortex-cloud`. |
| `attack` | usually | ATT&CK IDs such as `T1059` or `T1059.001`. Required for snippets. |
| `published`, `updated` | yes | ISO dates (`2026-10-08`). |
| `tags` | no | Free strings. |
| `related` | no | `{ collection, id }` pointing at a real entry. The build fails if the target is missing. `collection` is `assets`, `usecases`, or `snippets`. |

Assets also require `status` (`draft`, `beta`, `stable`, `deprecated`), `version` (semantic version), `type`, `language`, and `reuse` (one or more steps). The detail page renders `reuse` as **How to reuse**.

Use cases also require `status`, `problem`, `dataSources`, `successCriteria`, and `reuse`.

Snippets require at least one ATT&CK ID and a `language` (default `XQL`).

## Add an entry

1. Create `content/assets/<id>.md`, `content/usecases/<id>.md`, or `content/snippets/<id>.md`. The file name is the URL id.
2. Fill the frontmatter. For anything that has not been reviewed as publishable catalogue content, set `example: true` and start the title with `Example:`.
3. Write the body in markdown. Keep sample values inside the documentation ranges and example domains above.
4. Point `related` only at ids that exist.
5. Run `npm run build` and `npm run check:customer-info`.

Asset detail URLs are `/cortex-field-kit/assets/<id>/`. Use cases are under `/use-cases/`. Snippets are under `/snippets/`. The `base` in `astro.config.mjs` is what adds the `/cortex-field-kit` prefix. Use `import.meta.env.BASE_URL` or the helpers in `src/lib/format.ts` for new links. Do not hard-code root paths.

## Commands

```bash
npm install
npm run dev          # local site, search index not built
npm test             # customer-information and agent-ready unit tests
npm run check:customer-info
npm run build        # schema validation, static HTML, Pagefind index
npm run preview      # serve dist, including search, under /cortex-field-kit/
npm run check:links  # after a build
```

`npm run build` reads `GITHUB_TOKEN` when it is set and uses it to render the roadmap from open GitHub issues. With no token, or if the API cannot be reached, the roadmap page shows an unavailable state and the build still succeeds. Do not print the token. Do not put issue bodies on the page. Titles are published, so issues must follow the customer-information rule too.

## Issue to production

1. A person opens an issue with the asset, site-feature, or use-case template. Blank issues are disabled.
2. Someone applies the `agent-ready` label.
3. `.github/workflows/agent-ready.yml` checks the template fields and the confirmation checkbox. It comments that the issue is queued, or lists what is missing. The comment does not repeat issue text.
4. An agent opens a pull request. The pull request template repeats the customer-information check.
5. CI builds the site, validates content schemas, checks internal links, and runs the secret scan (gitleaks plus the customer-information check).
6. Brenton reviews and merges.
7. A push to `main` runs `.github/workflows/deploy.yml`, which publishes to GitHub Pages.

Labels live in `.github/labels.yml`: `asset`, `site-feature`, `use-case`, and `agent-ready`. `.github/workflows/labels.yml` upserts them on a change to that file on `main`, and on manual dispatch. It does not delete other labels.

## Site configuration

- `site` is `https://brentonswanepoel.github.io`.
- `base` is `/cortex-field-kit`.
- Output is static.
- Search is Pagefind, run at the end of `npm run build`. Result URLs are rewritten in the browser so they keep the base path.

## Manual GitHub settings

These are not in the repo. The owner turns them on:

- Secret scanning and push protection.
- Pages source set to GitHub Actions.
- Workflow permissions that allow the `issues: write`, `pages: write`, and `id-token: write` scopes declared in the workflows.
