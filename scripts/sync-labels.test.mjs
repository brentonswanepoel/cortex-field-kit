import assert from 'node:assert/strict';
import test from 'node:test';
import { planLabelSync } from './sync-labels.mjs';

const desired = [
  { name: 'asset', color: '8a5a12', description: 'Catalogue asset' },
  { name: 'agent-ready', color: 'b45309', description: 'Ready for an agent' },
];

test('creates missing labels and updates drifted ones', () => {
  const operations = planLabelSync(desired, [
    { name: 'asset', color: '000000', description: 'Catalogue asset' },
  ]);
  assert.deepEqual(
    operations.map((operation) => `${operation.action}:${operation.label.name}`),
    ['update:asset', 'create:agent-ready'],
  );
});

test('does nothing when labels match', () => {
  const operations = planLabelSync(desired, [
    { name: 'asset', color: '#8A5A12', description: 'Catalogue asset' },
    { name: 'agent-ready', color: 'b45309', description: 'Ready for an agent' },
    { name: 'bug', color: 'd73a4a', description: 'Something else' },
  ]);
  assert.equal(operations.length, 0);
});
