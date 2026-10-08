---
title: "Example: Cloud privilege escalation"
description: "Placeholder use case for a burst of fictional role assumptions in a lab cloud account. Cortex Cloud is included so product filters cover that column."
example: true
status: draft
products:
  - cortex-cloud
  - xsiam
problem: "Teams need a cloud privilege story for a demo that does not name an account, organization, or project from a customer."
dataSources:
  - "Synthetic cloud audit events authored for this example"
  - "A role name that exists only here: example-admin"
successCriteria:
  - "The snippet shows example-admin assumed more than once from 203.0.113.80."
  - "The narrative maps the activity to T1078.004."
  - "No account identifier other than the word example appears."
attack:
  - T1078.004
  - T1098
published: 2026-09-25
updated: 2026-10-07
tags:
  - cloud
related:
  - collection: snippets
    id: example-cloud-role-assumption
  - collection: assets
    id: example-pov-lab-kit
reuse:
  - "Create the audit events in the lab. Do not export a cloud trail from anywhere else."
  - "Use the role name example-admin exactly, so a search of the catalogue stays inside the example."
  - "Keep this use case in draft until the synthetic events and the snippet agree."
---

## Boundary

Privilege changes and role assumption are enough for the example. The note does not describe a workload, a repository, or a pipeline. Those details are where real engagements become identifiable, so they are out of scope on purpose.
