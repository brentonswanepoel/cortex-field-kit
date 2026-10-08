---
title: "Example: Remote management tool abuse"
description: "Placeholder use case for a fictional remote management tool on a lab endpoint. Written so the product and status filters have a stable XDR and XSIAM entry."
example: true
status: stable
products:
  - xsiam
  - xdr
problem: "Consultants need a reusable way to explain remote-tool abuse without naming a tool from a customer estate."
dataSources:
  - "Synthetic process events for example-rmm.exe"
  - "Synthetic network events to update.example.net"
successCriteria:
  - "The hunt returns endpoint-02.example.com and no other host."
  - "The destination shown is 203.0.113.44."
  - "The note cites T1219 and explains the fictional tool name."
attack:
  - T1219
  - T1021
published: 2026-06-20
updated: 2026-09-26
tags:
  - rmm
related:
  - collection: assets
    id: example-rmm-hunt
  - collection: snippets
    id: example-remote-access-tool
reuse:
  - "Keep the tool fictional. If a conversation needs a real vendor name, do that verbally and leave it out of the catalogue."
  - "Show the narrow hunt and mention the deprecated broad hunt as a contrast."
  - "Do not add allow-lists copied from a customer."
---

## Discussion points

Remote management tools are legitimate until the context says otherwise. In this example the context is a lab host that should not be running `example-rmm.exe` at all. That makes the success criterion binary and easy to demo.
