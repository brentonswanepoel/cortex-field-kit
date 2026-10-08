---
title: "Example: Legacy broad process hunt"
description: "Placeholder example of a retired hunt that matched too much synthetic noise. Kept so the catalogue can show a deprecated status."
example: true
status: deprecated
version: 0.1.0
products:
  - xdr
type: xql-hunt
language: XQL
attack:
  - T1059
published: 2026-04-02
updated: 2026-07-11
tags:
  - deprecated
  - hunt
related:
  - collection: assets
    id: example-rmm-hunt
reuse:
  - "Do not deploy this hunt. The deprecated status is the point of the example."
  - "Read it beside the remote management tool hunt to see a narrower replacement."
  - "If you need a negative example in a workshop, say clearly that the entry is retired."
  - "Do not copy the broad filter into a new snippet."
  - "Leave the Example badge in place. Retirement does not make the text a customer artifact, and it is still only an example."
---

Early example hunts sometimes filter on "any scripting host". That produces a page of noise even in a lab, and it teaches the wrong habit.

## Why it was retired

The replacement names a fictional tool and a documentation address. Reviewers can agree on a result. This broader note could not.

Use the remote management tool hunt instead.
