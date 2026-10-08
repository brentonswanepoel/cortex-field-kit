import assert from 'node:assert/strict';
import test from 'node:test';
import { reviewComment, validateIssue } from './agent-ready.mjs';

const confirmation =
  '- [x] I confirm this issue contains no customer names, data, logs, IP addresses, hostnames, tenant IDs, or emails.';

function body(sections) {
  return Object.entries(sections)
    .map(([heading, value]) => `### ${heading}\n\n${value}`)
    .join('\n\n');
}

test('queues a complete asset issue', () => {
  const result = validateIssue({
    labels: ['asset', 'agent-ready'],
    body: body({
      Product: 'XSIAM',
      'Asset type': 'XQL hunt',
      Summary: 'An example hunt for the catalogue.',
      'Desired status': 'Draft',
      Confirmation: confirmation,
    }),
  });
  assert.equal(result.ok, true);
  assert.match(reviewComment(result), /queued for an agent/);
});

test('names missing use-case fields and an unchecked confirmation', () => {
  const result = validateIssue({
    labels: ['use-case'],
    body: body({
      Product: 'XDR',
      Problem: '_No response_',
      'Data sources': '',
      'Success criteria': 'A lab host shows the example signal.',
      Confirmation: '- [ ] I confirm this issue contains no customer names.',
    }),
  });
  assert.equal(result.ok, false);
  assert.ok(result.missing.some((item) => item.includes('Problem')));
  assert.ok(result.missing.some((item) => item.includes('Data sources')));
  assert.ok(result.missing.some((item) => item.includes('confirmation')));
  assert.match(reviewComment(result), /not queued/);
});

test('requires a type label', () => {
  const result = validateIssue({
    labels: ['agent-ready'],
    body: `### Summary\n\nHello\n\n### Confirmation\n\n${confirmation}`,
  });
  assert.equal(result.ok, false);
  assert.match(result.missing[0], /type label/);
});
