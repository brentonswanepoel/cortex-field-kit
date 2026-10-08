---
title: "Example: Fictional remote access tool"
description: "Example XQL note for example-rmm.exe talking to update.example.net, tagged T1219."
example: true
products:
  - xsiam
  - xdr
attack:
  - T1219
language: XQL
published: 2026-06-22
updated: 2026-09-27
tags:
  - xql
  - rmm
related:
  - collection: assets
    id: example-rmm-hunt
  - collection: usecases
    id: example-rmm-abuse
---

The process name is fictional. The destination is a documentation address. Together they keep the note shareable.

```sql
dataset = xdr_data
| filter action_process_image_name = "example-rmm.exe"
| filter action_remote_ip = "203.0.113.44"
| fields _time, agent_hostname, action_remote_ip
| limit 20
```

A hit should name `endpoint-02.example.com` and `update.example.net`. If the result set is large, the filter was widened and the example is no longer the one published here.
