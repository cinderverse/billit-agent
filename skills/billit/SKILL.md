---
name: billit
description: Work with the Billit integration toolkit in this repository to connect automations or coding agents to Billit. Use when you need to configure or extend Billit API access, send or retrieve invoices/orders, wire webhooks, handle entity registration or identification flows, or perform Billit operations from an OpenClaw-compatible workflow. Read this skill when the repo contains `billit-agent` and the task is to use or adapt its CLI/SDK rather than re-deriving Billit integration structure from scratch.
---

# Billit skill

Use the repo-local Billit toolkit instead of improvising direct API calls.

## Start here

1. Read `docs/notes-public-sources.md` to understand what is publicly confirmed.
2. Read `billit.config.example.json` and the active config file to see how logical operations map to concrete Billit endpoints.
3. Prefer the CLI for one-off automation and shell workflows.
4. Prefer the SDK when embedding Billit access into a larger TypeScript service.

## CLI patterns

List configured operations:

```bash
npm run build
node dist/cli.js --config ./billit.config.json operations
```

Raw logical operation:

```bash
node dist/cli.js --config ./billit.config.json raw \
  --operation orders.list \
  --query '{"page":1}'
```

Create and send an order:

```bash
node dist/cli.js --config ./billit.config.json order-create --body @stdin
node dist/cli.js --config ./billit.config.json order-send --order-id 123 --body '{"channel":"peppol"}'
```

## Rules

- Do not assume the default example endpoints are production-correct; verify against the active Billit docs/account.
- If a needed operation is missing, extend the adapter config instead of hardcoding a random path in application code.
- Use the `raw` command first for sandbox exploration of newly documented operations.
- For webhook work, use the helpers in `src/webhooks.ts` and align signature handling with current Billit docs.
- For calculations or local validation logic, keep business rules separate from transport code.

## When to read more

- Read `README.md` for overall usage.
- Read `src/request-builder.ts` when adjusting transport/auth behavior.
- Read `src/client.ts` when adding a first-class Billit method.
- Read `docs/notes-public-sources.md` when deciding what can be safely claimed as verified.
