---
title: "Example: POV lab kit"
description: "Placeholder example of a lab kit that stages synthetic targets and a run-of-show for a proof of value. It does not describe a real environment."
example: true
status: beta
version: 0.3.0
products:
  - xsiam
  - xdr
  - cortex-cloud
type: lab-kit
language: HCL
attack:
  - T1059
  - T1219
published: 2026-08-12
updated: 2026-10-02
tags:
  - pov
  - lab
related:
  - collection: assets
    id: example-pov-dashboard
  - collection: usecases
    id: example-ransomware-precursors
  - collection: snippets
    id: example-scheduled-task
reuse:
  - "Treat this entry as an illustration. Do not point it at a customer tenant."
  - "In a lab you control, replace every hostname with a name under example.com, example.org, or example.net."
  - "Keep sample addresses inside the RFC 5737 documentation ranges shown below."
  - "Walk the run-of-show against synthetic telemetry only, then record which success criteria the lab actually demonstrated."
  - "Remove the Example badge only after a human review confirms the entry is still free of customer information."
---

This example sketches a proof-of-value lab: a small piece of infrastructure-as-code, a synthetic target, and a written run-of-show. The hostnames and addresses are documentation values.

## What the kit is for

Use it to show how a Domain Consultant might rehearse three beats before a working session:

1. Confirm the lab collector is receiving synthetic process events.
2. Run one scripted scenario aligned to T1059 (Command and Scripting Interpreter).
3. Run a second scenario aligned to T1219 (Remote Access Software) and show the matching example hunt.

## Illustrative inventory

| Role | Example name | Address |
| --- | --- | --- |
| Collector | collector.example.net | 203.0.113.10 |
| Target | endpoint-01.example.com | 198.51.100.24 |
| Jump host | jump.example.org | 192.0.2.15 |

The block below is an illustrative sketch of how a lab variable file might look. It is not a validated configuration.

```text
lab_name    = "example-pov"
collector   = "collector.example.net"
target_name = "endpoint-01.example.com"
target_ip   = "198.51.100.24"
```

## Run-of-show

Open the example dashboard, start the synthetic scenario, and narrate only what the lab generated. Do not import logs from anywhere else.
