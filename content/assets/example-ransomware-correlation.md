---
title: "Example: Ransomware precursor correlation"
description: "Placeholder example correlation rule that ties a synthetic scheduled-task pattern to a later encryption-like file event. Not a production rule."
example: true
status: stable
version: 1.2.0
products:
  - xsiam
  - xdr
type: correlation-rule
language: XQL
attack:
  - T1053.005
  - T1486
published: 2026-07-20
updated: 2026-10-06
tags:
  - ransomware
  - correlation
related:
  - collection: usecases
    id: example-ransomware-precursors
  - collection: snippets
    id: example-scheduled-task
reuse:
  - "Copy the narrative into a lab content pack you control. Keep the Example badge until you replace the sketch with a validated rule."
  - "Generate the two synthetic events yourself. Do not paste logs from a tenant."
  - "Map the first event to T1053.005 and the second to T1486 before you tune thresholds."
  - "Record the lab hostname pattern you used, using names under example.com only."
  - "When the rule is real, link the private content pack from your own notes, not from this public entry."
---

This example shows the shape of a correlation that a consultant might rehearse for ransomware precursors. It watches for a synthetic scheduled-task creation followed by a burst of rename events. Both halves are invented.

## Illustrative sketch

The query shape below uses documented XQL stages (`dataset`, `filter`, `fields`) as a reading aid. It is an example sketch, not a certified product query.

```sql
dataset = xdr_data
| filter agent_hostname = "endpoint-01.example.com"
| filter action_process_image_name contains "example-task.exe"
| fields _time, agent_hostname, action_process_image_command_line
| limit 20
```

## Expected lab signal

- Host `endpoint-01.example.com` at `198.51.100.24`.
- A process image named `example-task.exe`.
- A later synthetic file event whose name ends in `.example-encrypted`.

If the lab does not produce both halves, the correlation did not fire. That is a successful negative test of this example.
