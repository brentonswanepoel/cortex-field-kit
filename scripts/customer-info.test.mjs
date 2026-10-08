import assert from 'node:assert/strict';
import test from 'node:test';
import { findCustomerInfo, isDocumentationIPv4, isExampleEmail } from './customer-info.mjs';

test('allows RFC 5737 documentation addresses', () => {
  assert.equal(isDocumentationIPv4('192.0.2.15'), true);
  assert.equal(isDocumentationIPv4('198.51.100.24'), true);
  assert.equal(isDocumentationIPv4('203.0.113.80'), true);
  assert.equal(findCustomerInfo('collector at 203.0.113.10').length, 0);
});

test('flags non-documentation IPv4 addresses', () => {
  assert.equal(isDocumentationIPv4('10.1.2.3'), false);
  assert.equal(isDocumentationIPv4('8.8.8.8'), false);
  assert.equal(isDocumentationIPv4('192.168.1.10'), false);
  const findings = findCustomerInfo('seen 172.16.4.4 and 192.0.2.1');
  assert.deepEqual(
    findings.map((finding) => finding.value),
    ['172.16.4.4'],
  );
});

test('allows example domains and flags other mailboxes', () => {
  assert.equal(isExampleEmail('analyst@example.com'), true);
  assert.equal(isExampleEmail('analyst@mail.example.org'), true);
  assert.equal(isExampleEmail('analyst@example.net'), true);
  assert.equal(isExampleEmail('analyst@example.co'), false);
  const findings = findCustomerInfo('write analyst@example.com not ada@company.test');
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'email');
  assert.equal(findings[0].value, 'ada@company.test');
});
