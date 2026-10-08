---
title: "Example: Cloud role assumption burst"
description: "Example note for repeated assumptions of the fictional role example-admin, tagged T1078.004."
example: true
products:
  - cortex-cloud
  - xsiam
attack:
  - T1078.004
  - T1098
language: XQL
published: 2026-09-29
updated: 2026-10-07
tags:
  - xql
  - cloud
related:
  - collection: usecases
    id: example-cloud-privilege
---

Cloud notes here use a role that exists only in the example, `example-admin`, and the address `203.0.113.80`.

```sql
dataset = example_cloud_audit
| filter role_name = "example-admin"
| filter source_ip = "203.0.113.80"
| fields _time, role_name, source_ip, event_name
| limit 20
```

More than one row in the lab means the "burst" the use case describes. The dataset name `example_cloud_audit` is fictional, like the role.
