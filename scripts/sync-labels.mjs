import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

export function planLabelSync(desired, existing) {
  const current = new Map(existing.map((label) => [label.name, label]));
  const operations = [];
  for (const label of desired) {
    const found = current.get(label.name);
    if (!found) {
      operations.push({ action: 'create', label });
      continue;
    }
    const color = String(found.color ?? '').replace(/^#/, '').toLowerCase();
    const description = found.description ?? '';
    if (color !== label.color.toLowerCase() || description !== label.description) {
      operations.push({ action: 'update', label });
    }
  }
  return operations;
}

async function github(token, repository, method, path, body) {
  const response = await fetch(`https://api.github.com/repos/${repository}${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'cortex-field-kit',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${method} ${path} failed with ${response.status}: ${detail.slice(0, 300)}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

async function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  if (!token || !repository) {
    throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY are required.');
  }
  const desired = parse(readFileSync(new URL('../.github/labels.yml', import.meta.url), 'utf8'));
  if (!Array.isArray(desired)) throw new Error('.github/labels.yml must be a list.');
  const existing = [];
  for (let page = 1; page < 10; page += 1) {
    const batch = await github(token, repository, 'GET', `/labels?per_page=100&page=${page}`);
    existing.push(...batch);
    if (!Array.isArray(batch) || batch.length < 100) break;
  }
  const operations = planLabelSync(desired, existing);
  for (const operation of operations) {
    if (operation.action === 'create') {
      await github(token, repository, 'POST', '/labels', operation.label);
      console.log(`Created label ${operation.label.name}`);
    } else {
      await github(
        token,
        repository,
        'PATCH',
        `/labels/${encodeURIComponent(operation.label.name)}`,
        { color: operation.label.color, description: operation.label.description },
      );
      console.log(`Updated label ${operation.label.name}`);
    }
  }
  if (operations.length === 0) console.log('Labels already match .github/labels.yml.');
}

const isDirectRun = process.argv[1] && process.argv[1].endsWith('sync-labels.mjs');
if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
