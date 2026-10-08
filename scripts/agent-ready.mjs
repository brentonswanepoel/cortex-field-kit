import { readFileSync } from 'node:fs';

const REQUIREMENTS = {
  asset: ['Product', 'Asset type', 'Summary', 'Desired status'],
  'site-feature': ['Summary', 'Page'],
  'use-case': ['Product', 'Problem', 'Data sources', 'Success criteria'],
};

const CONFIRMATION = /-\s*\[x\]\s*I confirm this issue contains no customer/i;

export function parseIssueFields(body) {
  const fields = new Map();
  const normalized = String(body ?? '').replace(/\r\n/g, '\n');
  for (const part of normalized.split(/\n(?=### )/)) {
    const match = part.match(/^###\s+([^\n]+)\n?([\s\S]*)$/);
    if (!match) continue;
    fields.set(match[1].trim().toLowerCase(), match[2].trim());
  }
  return fields;
}

export function isBlank(value) {
  if (!value) return true;
  const trimmed = value.trim();
  return trimmed === '' || trimmed === '_No response_' || trimmed === 'N/A';
}

export function validateIssue({ labels, body }) {
  const typeLabels = [...new Set(labels.filter((label) => Object.hasOwn(REQUIREMENTS, label)))];
  const missing = [];
  if (typeLabels.length === 0) {
    missing.push('A type label is required: asset, site-feature, or use-case.');
  }
  const fields = parseIssueFields(body);
  for (const label of typeLabels) {
    for (const name of REQUIREMENTS[label]) {
      if (isBlank(fields.get(name.toLowerCase()))) missing.push(`${label}: ${name}`);
    }
  }
  if (!CONFIRMATION.test(String(body ?? ''))) {
    missing.push('Checked confirmation that the issue contains no customer information.');
  }
  return { ok: missing.length === 0, missing, typeLabels };
}

export function reviewComment({ ok, missing, typeLabels }) {
  if (!ok) {
    const lines = [
      'This issue is not queued for an agent.',
      '',
      'Add the missing items below, then remove and re-apply the `agent-ready` label:',
      ...missing.map((item) => `- ${item}`),
      '',
      'Do not add customer names, data, logs, IP addresses, hostnames, tenant IDs, or emails. This repository is public.',
    ];
    return lines.join('\n');
  }
  return [
    'This issue is queued for an agent.',
    '',
    `Type: ${typeLabels.join(', ')}. The required fields are present, including the no-customer-information confirmation.`,
    '',
    'An agent may open a pull request. Brenton Swanepoel reviews every pull request before it is merged. Nothing in that pull request may contain customer information.',
  ].join('\n');
}

async function commentOnIssue() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!token || !repository || !eventPath) {
    throw new Error('GITHUB_TOKEN, GITHUB_REPOSITORY, and GITHUB_EVENT_PATH are required.');
  }
  const event = JSON.parse(readFileSync(eventPath, 'utf8'));
  const issue = event.issue;
  const labels = (issue.labels ?? []).map((label) => (typeof label === 'string' ? label : label.name));
  const result = validateIssue({ labels, body: issue.body ?? '' });
  const text = reviewComment(result);
  const response = await fetch(`https://api.github.com/repos/${repository}/issues/${issue.number}/comments`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'cortex-field-kit',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ body: text }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub comment failed with ${response.status}: ${detail.slice(0, 300)}`);
  }
  console.log(result.ok ? 'Queued comment posted.' : 'Missing-field comment posted.');
}

const isDirectRun = process.argv[1] && process.argv[1].endsWith('agent-ready.mjs');
if (isDirectRun) {
  commentOnIssue().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
