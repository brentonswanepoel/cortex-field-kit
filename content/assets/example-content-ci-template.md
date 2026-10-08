---
title: "Example: Content-as-code CI template"
description: "Placeholder example of a continuous-integration template for Cortex content packs. The workflow is described, not shipped as a working customer pipeline."
example: true
status: stable
version: 1.1.0
products:
  - xsoar
  - xsiam
type: template
language: YAML
attack: []
published: 2026-05-04
updated: 2026-08-19
tags:
  - ci
  - template
related:
  - collection: assets
    id: example-spl-xql-migration
reuse:
  - "Fork the idea, not a customer's repository. Start a new lab repo with synthetic fixtures."
  - "Run validation on the example pack only. Do not point the job at a production content repository."
  - "Fail the job when fixtures contain a non-documentation IP address or a non-example email address."
  - "Keep secrets in the CI system. Never print tokens into the catalogue."
  - "Describe the template here. Store the workflow file you actually run somewhere private until it is sanitized."
---

Other consultants should be able to copy a pattern for validating content without copying anyone's pipeline. This example names the stages and nothing else.

## Stages in the example

1. Install the content SDK in a clean job.
2. Validate the example pack structure.
3. Lint scripts and playbooks.
4. Reject fixtures that fail the same customer-information check this site uses.
5. Upload a lab artifact only when the above stages pass.

```yaml
name: example-content-check
on:
  pull_request:
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Replace this sketch with a real lab workflow"
```

The YAML above is a placeholder so the catalogue has something to read. It does not call an external service.
