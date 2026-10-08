---
title: "Example: SPL to XQL migration kit"
description: "Placeholder example of a before-and-after note for translating a fictional SPL search into an XQL sketch during a SIEM displacement conversation."
example: true
status: draft
version: 0.2.0
products:
  - xsiam
type: migration-kit
language: XQL
attack:
  - T1078
published: 2026-09-22
updated: 2026-10-04
tags:
  - migration
  - xql
related:
  - collection: assets
    id: example-content-ci-template
  - collection: snippets
    id: example-valid-accounts
reuse:
  - "Write both the before and after against the fictional index example_auth. Do not paste a saved search from an engagement."
  - "Mark every translated query as an example sketch until someone runs it in a lab."
  - "Keep the review checklist in the entry: field names, time window, and aggregation."
  - "Store the real translation work in the private content repository, not beside this note."
  - "Leave the status at draft until the sketch has been executed on synthetic data."
---

Displacement conversations often start from a search the other platform already runs. This example uses a search that was written for the catalogue.

## Before (fictional SPL)

```sql
index=example_auth outcome=failure user=analyst@example.com
| stats count by src
```

## After (illustrative XQL)

```sql
dataset = example_auth
| filter outcome = "failure"
| filter username = "analyst@example.com"
| comp count() as failures by source_ip
| limit 20
```

## Review checklist

- The dataset name is fictional (`example_auth`).
- The only identity is `analyst@example.com`.
- The time window is whatever the lab scenario set, and it is not copied from a ticket.
- Aggregations are explained in a sentence a non-author can check.
