---
title: "Example: Identity attacks"
description: "Placeholder use case for failed sign-ins from documentation addresses, with a parsing rule and a draft playbook."
example: true
status: beta
products:
  - xsiam
  - xsoar
problem: "A discovery workshop needs an identity scenario that covers data, detection, and a first automation step without a real directory export."
dataSources:
  - "Synthetic Example Auth logs"
  - "A one-line fixture using analyst@example.com"
successCriteria:
  - "The parsing example extracts user, source address, and outcome."
  - "The source address is 192.0.2.40."
  - "The draft playbook names its three branches and does not call a live integration."
attack:
  - T1078
  - T1110
published: 2026-09-08
updated: 2026-10-03
tags:
  - identity
related:
  - collection: assets
    id: example-auth-parsing-rule
  - collection: assets
    id: example-triage-playbook
  - collection: snippets
    id: example-valid-accounts
reuse:
  - "Use the mailbox analyst@example.com and no other."
  - "Keep the playbook in draft when you show it. Say that the automation is not wired up."
  - "If the audience asks for their own users, collect that privately and do not type it into this repository."
---

## Scope

The example covers password guessing against one fictional account (T1110) and the broader valid-accounts technique (T1078). It does not cover malware on the endpoint. That split keeps the data source to a single synthetic log.
