import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const IPV4 = /(?<!\d)(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?!\d)/g;

const TEXT_EXTENSIONS = new Set(['.md', '.mdx', '.html', '.xml', '.txt', '.svg', '.yml', '.yaml']);

const EXAMPLE_HOSTS = ['example.com', 'example.org', 'example.net'];

export function isDocumentationIPv4(ip) {
  const parts = ip.split('.').map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }
  const [a, b, c] = parts;
  if (a === 192 && b === 0 && c === 2) return true;
  if (a === 198 && b === 51 && c === 100) return true;
  if (a === 203 && b === 0 && c === 113) return true;
  return false;
}

export function isExampleEmail(email) {
  const host = email.split('@')[1]?.toLowerCase().replace(/\.$/, '');
  if (!host) return false;
  return EXAMPLE_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

export function findCustomerInfo(text) {
  const findings = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const match of line.matchAll(IPV4)) {
      if (!isDocumentationIPv4(match[0])) {
        findings.push({ line: index + 1, kind: 'ipv4', value: match[0] });
      }
    }
    for (const match of line.matchAll(EMAIL)) {
      if (!isExampleEmail(match[0])) {
        findings.push({ line: index + 1, kind: 'email', value: match[0] });
      }
    }
  });
  return findings;
}

function walk(dir, files) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const info = statSync(full);
    if (info.isDirectory()) {
      if (name === 'pagefind' || name === 'node_modules') continue;
      walk(full, files);
    } else if (TEXT_EXTENSIONS.has(extname(name))) {
      files.push(full);
    }
  }
  return files;
}

export function scanPaths(paths) {
  const results = [];
  for (const root of paths) {
    let info;
    try {
      info = statSync(root);
    } catch {
      continue;
    }
    const files = info.isDirectory() ? walk(root, []) : [root];
    for (const file of files) {
      const findings = findCustomerInfo(readFileSync(file, 'utf8'));
      for (const finding of findings) {
        results.push({ file, ...finding });
      }
    }
  }
  return results;
}

function main() {
  const roots = ['content'];
  try {
    if (statSync('dist').isDirectory()) roots.push('dist');
  } catch {
    /* A source-only run still checks content/. */
  }
  const findings = scanPaths(roots);
  if (findings.length === 0) {
    console.log(`Customer-information check passed (${roots.join(', ')}).`);
    return;
  }
  console.error('Customer-information check failed. This public repository only allows RFC 5737 documentation IPv4 addresses and example.com, example.org, or example.net emails.');
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line} ${finding.kind} ${finding.value}`);
  }
  process.exitCode = 1;
}

if (process.argv[1] && process.argv[1].endsWith('customer-info.mjs')) {
  main();
}
