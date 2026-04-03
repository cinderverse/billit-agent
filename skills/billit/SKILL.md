---
name: billit
description: Work with the Billit integration toolkit in this repository to connect automations or coding agents to Billit. Use when you need to configure or extend Billit API access, send or retrieve invoices/orders, wire webhooks, handle entity registration or identification flows, or perform Billit operations from an OpenClaw-compatible workflow. Read this skill when the repo contains `billit-agent` and the task is to use or adapt its CLI/SDK rather than re-deriving Billit integration structure from scratch.
---

# Billit skill

Use the repo-local Billit toolkit instead of improvising direct API calls.

## Start here

1. Read `docs/notes-public-sources.md` to understand what is publicly confirmed from the live Swagger.
2. Read `swagger-v1.json` and `swagger-v1.billit.config.example.json` first.
3. Read the active config file to see whether the logical operations were kept as generated or customized.
4. Prefer the CLI for one-off automation and shell workflows.
5. Prefer the SDK when embedding Billit access into a larger TypeScript service.

## CLI patterns

List configured operations:

```bash
npm run build
node dist/src/cli.js --config ./billit.config.json operations
```

Inspect live Swagger operations:

```bash
node dist/src/cli.js swagger-operations --file ./swagger-v1.json
```

Generate config from Swagger:

```bash
node dist/src/cli.js swagger-config --file ./swagger-v1.json
```

Raw logical operation:

```bash
node dist/src/cli.js --config ./billit.config.json raw \
  --operation orders.get \
  --query '{"fullTextSearch":"ACME"}'
```

Create and send an order using real Swagger-grounded keys:

```bash
node dist/src/cli.js --config ./billit.config.json raw \
  --operation orders.post \
  --body '{"OrderType":"Invoice","Customer":{"Name":"ACME"}}'

node dist/src/cli.js --config ./billit.config.json raw \
  --operation orders.commands.send.post \
  --body '{"OrderIds":[123],"TransportType":"Peppol"}'
```

## Rules

- Prefer the Swagger-grounded config over the older generic example config.
- Do not hardcode random paths; extract from Swagger or add explicit adapter mappings.
- Use the `raw` command first when exploring a new Billit endpoint family.
- For webhook work, use the helpers in `src/webhooks.ts` and align signature handling with current Billit docs/account behavior.
- For calculations or local validation logic, keep business rules separate from transport code.
- If the Swagger changes, refresh `swagger-v1.json`, regenerate the config, then update tests.

## When to read more

- Read `README.md` for overall usage.
- Read `src/request-builder.ts` when adjusting transport/auth behavior.
- Read `src/client.ts` when adding a first-class Billit method.
- Read `docs/notes-public-sources.md` when deciding what can be safely claimed as verified.
