---
title: "Example: Ransomware precursors"
description: "Placeholder use case for showing how a lab would rehearse scheduled-task and encryption-like signals before a ransomware conversation."
example: true
status: stable
products:
  - xsiam
  - xdr
problem: "A workshop audience needs to see an early signal and a later impact signal without using anyone's incident."
dataSources:
  - "Synthetic process events from the example POV lab kit"
  - "Synthetic file events created for this example"
successCriteria:
  - "The lab shows a T1053.005 event on endpoint-01.example.com."
  - "A later synthetic file event is visible for the same host."
  - "The example correlation entry explains how the two would be joined."
attack:
  - T1053.005
  - T1486
published: 2026-07-18
updated: 2026-10-05
tags:
  - ransomware
related:
  - collection: assets
    id: example-ransomware-correlation
  - collection: snippets
    id: example-scheduled-task
  - collection: assets
    id: example-pov-lab-kit
reuse:
  - "Present this as a workshop script. Do not attach it to a live incident."
  - "Generate both signals in the lab before the meeting."
  - "Narrate the ATT&CK technique IDs rather than a victim story."
  - "Close the session by listing which success criteria were actually met."
---

## Workshop shape

Give the audience one host and two beats. The first beat is a scheduled task created by `example-task.exe`. The second is a rename to a suffix that exists only in this example, `.example-encrypted`.

Stop there. The point is the join, not a story about an intrusion.
