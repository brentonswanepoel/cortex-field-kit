---
title: "Example: Scheduled task on a lab endpoint"
description: "Example XQL note for a synthetic scheduled task on endpoint-01.example.com, tagged T1053.005."
example: true
products:
  - xsiam
  - xdr
attack:
  - T1053.005
language: XQL
published: 2026-07-21
updated: 2026-10-06
tags:
  - xql
  - ransomware
related:
  - collection: assets
    id: example-ransomware-correlation
  - collection: usecases
    id: example-ransomware-precursors
---

Look for the fictional image `example-task.exe` creating a task on the lab host. This note is an illustration of the stages a hunt might use. It has not been certified as a product query.

```sql
dataset = xdr_data
| filter agent_hostname = "endpoint-01.example.com"
| filter action_process_image_name contains "example-task.exe"
| fields _time, agent_hostname, action_process_image_command_line
| limit 20
```

Expect the address `198.51.100.24` if the lab kit is running the matching scenario. Any other address means the wrong dataset was attached.
