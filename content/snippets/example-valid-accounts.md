---
title: "Example: Valid accounts sign-in sketch"
description: "Example XQL note for failed sign-ins by analyst@example.com, tagged T1078 and T1110."
example: true
products:
  - xsiam
attack:
  - T1078
  - T1110
language: XQL
published: 2026-09-12
updated: 2026-10-03
tags:
  - xql
  - identity
related:
  - collection: usecases
    id: example-identity-attacks
  - collection: assets
    id: example-spl-xql-migration
---

Identity notes in this catalogue use one mailbox, `analyst@example.com`, and documentation addresses only.

```sql
dataset = example_auth
| filter username = "analyst@example.com"
| filter outcome = "failure"
| filter source_ip = "192.0.2.40"
| fields _time, username, source_ip, outcome
| limit 20
```

`example_auth` is not a product dataset name. It marks the sketch as synthetic. Pair it with the example parsing rule if you need to show ingest as well as search.
