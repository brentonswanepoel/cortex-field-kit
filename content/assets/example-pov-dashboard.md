---
title: "Example: POV value dashboard"
description: "Placeholder example of an executive dashboard outline for a proof of value, with invented metrics only."
example: true
status: beta
version: 0.5.0
products:
  - xsiam
  - cortex-cloud
type: dashboard
language: JSON
attack: []
published: 2026-08-01
updated: 2026-09-18
tags:
  - pov
  - dashboard
related:
  - collection: assets
    id: example-pov-lab-kit
  - collection: usecases
    id: example-ransomware-precursors
reuse:
  - "Populate the tiles from the lab kit's synthetic scenarios. Do not import production widgets."
  - "Label every number as example data in the readout, even when the figure is obviously round."
  - "Keep the three tiles listed here. Add a tile only when you can name its synthetic source."
  - "Use the dashboard to rehearse an executive conversation, not to report a real programme."
  - "If a screenshot is added later, it must show example.com names and documentation addresses only."
---

Executives want a short readout. This example dashboard has three tiles and invented numbers so the layout can be discussed without implying a measurement programme.

## Tiles

| Tile | Example value | Synthetic source |
| --- | --- | --- |
| Scenarios completed | 3 | POV lab kit run-of-show |
| Example detections | 2 | Ransomware and remote-tool scenarios |
| Example cases auto-closed | 1 | Identity triage negative test |

```json
{
  "title": "Example POV readout",
  "tiles": ["scenarios", "detections", "auto-closed"]
}
```

None of these numbers are measurements. They exist so the catalogue can render a dashboard entry.
