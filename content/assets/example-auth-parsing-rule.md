---
title: "Example: Authentication parsing rule"
description: "Placeholder example of an ingest parsing rule for a fictional authentication log source. It describes the idea, not a real log format from a customer."
example: true
status: beta
version: 0.9.0
products:
  - xsiam
type: parsing-rule
language: XQL
attack:
  - T1078
published: 2026-09-02
updated: 2026-09-30
tags:
  - parsing
  - identity
related:
  - collection: usecases
    id: example-identity-attacks
  - collection: assets
    id: example-triage-playbook
reuse:
  - "Invent the log format in the lab. A single synthetic line is enough for this example."
  - "Remember that parsing rules apply to new data at ingest. Historical events need a separate modeling approach."
  - "Map only the fields this example names: time, username, source address, and outcome."
  - "Use 192.0.2.0/24, 198.51.100.0/24, or 203.0.113.0/24 if the sample line needs an address."
  - "Do not attach a sample that you did not write yourself for this example."
---

Parsing rules shape events as they arrive. This example covers a fictional product called Example Auth, writing one line per sign-in to `auth.example.com`.

## Synthetic line

```text
2026-09-30T09:15:00Z user=analyst@example.com src=192.0.2.40 outcome=failure app=example-auth
```

## Fields the example extracts

- Event time
- Username (`analyst@example.com`)
- Source address (`192.0.2.40`)
- Outcome (`failure`)

The example stops there. A modeling rule would be a separate asset if the same fields needed to line up with a data model for older events.
