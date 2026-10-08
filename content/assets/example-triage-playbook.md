---
title: "Example: Identity triage playbook"
description: "Placeholder example XSOAR playbook that triages a synthetic failed-sign-in alert. The steps are illustrative and contain no tenant details."
example: true
status: draft
version: 0.4.0
products:
  - xsoar
type: playbook
language: Python
attack:
  - T1078
  - T1110
published: 2026-09-14
updated: 2026-10-01
tags:
  - playbook
  - identity
related:
  - collection: usecases
    id: example-identity-attacks
  - collection: assets
    id: example-auth-parsing-rule
reuse:
  - "Keep the playbook in draft until a lab run shows each branch with synthetic alerts."
  - "Name the incident owner as a role, such as example-analyst, not as a person from an engagement."
  - "Stub the integration calls. This example does not ship working code."
  - "Pair the playbook with the example authentication parsing rule so the alert fields exist."
  - "A human must review the playbook text before the Example badge comes off."
---

This draft example is the automation half of an identity use case. An alert arrives for `analyst@example.com` failing to sign in from `192.0.2.40`. The playbook asks three questions and then stops.

## Branches

1. Is the source address inside the lab documentation range the scenario expected?
2. Did the fictional user `analyst@example.com` succeed from `198.51.100.24` within the same hour?
3. If both are true, open a lab ticket titled "Example: review synthetic sign-in". Otherwise close the example incident as a negative test.

## What this entry does not include

No integration code, no API keys, and no incident payload. Those belong in a private repository, reviewed separately, and they still must not carry customer information if they are ever proposed for publication.
