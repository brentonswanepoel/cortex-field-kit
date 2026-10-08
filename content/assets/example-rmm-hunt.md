---
title: "Example: Remote management tool hunt"
description: "Placeholder example XQL hunt for a fictional remote management tool, mapped to T1219. Built for the catalogue filters, not for a tenant."
example: true
status: stable
version: 1.0.0
products:
  - xsiam
  - xdr
type: xql-hunt
language: XQL
attack:
  - T1219
  - T1021
published: 2026-06-18
updated: 2026-09-28
tags:
  - hunt
  - rmm
related:
  - collection: usecases
    id: example-rmm-abuse
  - collection: snippets
    id: example-remote-access-tool
  - collection: assets
    id: example-legacy-broad-hunt
reuse:
  - "Use the fictional tool name example-rmm.exe. Do not swap in a customer's software inventory."
  - "Point the hunt at a lab dataset, or at telemetry you generated for this example."
  - "Compare results with the deprecated broad hunt so you can explain why a named tool is easier to review."
  - "Keep any sample command line free of real usernames, paths, and hostnames."
  - "Publish a follow-up snippet only after the same human review as any other catalogue edit."
---

Remote management tools are a common hunt theme. This example uses a tool that does not exist, `example-rmm.exe`, so the note can be shared without describing anyone's estate.

## What to show

A single host, `endpoint-02.example.com`, making an outbound connection to `update.example.net` (`203.0.113.44`) while the fictional process is running.

## Why it is marked stable

"Stable" here means the example text is complete enough to reuse as a teaching pattern. It does not mean the hunt has been deployed.
