# billit-agent

A configurable Billit integration toolkit for Node.js and OpenClaw.

It is designed to be useful **right now** without pretending to know private or unstable Billit endpoint details. The repo combines:

- a TypeScript SDK/client
- a CLI (`billit-agent`)
- an OpenClaw skill under `skills/billit/`
- adapter-driven request mapping so you can cover the full Billit lifecycle

## Why it is adapter-driven

Billit publicly exposes a developer program and public API-documentation topics that establish the broad integration surface, but their docs are not fully machine-readable from this environment because parts of the docs are shielded by anti-bot protections.

So this project is deliberately split into two layers:

1. **Confirmed public integration concepts**
   - API-key authentication
   - sandbox vs production environments
   - company/entity registration
   - identification flow
   - sales invoice / order creation and sending
   - invoice retrieval and status tracking
   - calculations guidance
   - webhooks

2. **Configurable endpoint adapter**
   - logical operations such as `orders.create` and `webhooks.register`
   - configurable paths, methods, auth header naming, and base URLs
   - raw logical requests for anything Billit exposes now or later

This gives you a repo that is honest about what is confirmed, while still being broad enough to connect a coding agent to Billit end-to-end.

## Install

```bash
npm install
npm run build
```

## Configure

Copy the example file and fill in your real values:

```bash
cp billit.config.example.json billit.config.json
```

Then edit:

- `apiKey`
- production/sandbox base URLs
- auth header details
- adapter resource mappings if needed

You can pass the config explicitly:

```bash
billit-agent --config ./billit.config.json operations
```

Or set:

```bash
export BILLIT_CONFIG=./billit.config.json
```

## CLI examples

### List configured operations

```bash
billit-agent operations
```

### Create an order / sales invoice draft

```bash
billit-agent order-create --body '{"customer":{"name":"ACME"},"lines":[{"description":"Consulting","quantity":1,"unitPrice":100,"vatRate":21}]}'
```

### Send an order

```bash
billit-agent order-send --order-id 123 --body '{"channel":"peppol"}'
```

### Get status

```bash
billit-agent order-status 123
```

### Raw logical operation

```bash
billit-agent raw \
  --operation orders.list \
  --query '{"page":1,"limit":50}'
```

### Local totals helper

```bash
billit-agent calculate --lines '[{"quantity":2,"unitPrice":10,"vatRate":21}]'
```

## Logical operations covered by the default example adapter

- `entities.register`
- `entities.get`
- `contacts.list`
- `contacts.get`
- `contacts.create`
- `orders.create`
- `orders.get`
- `orders.list`
- `orders.send`
- `orders.status`
- `invoices.received.list`
- `invoices.received.get`
- `attachments.upload`
- `attachments.download`
- `identification.start`
- `identification.status`
- `webhooks.register`
- `webhooks.list`

These are **logical** operations. Confirm and adjust concrete endpoints against the current Billit docs/account before using in production.

## SDK usage

```ts
import { loadConfig, BillitClient } from 'billit-agent';

const config = loadConfig('./billit.config.json');
const client = new BillitClient(config);

const draft = await client.createOrder({
  customer: { name: 'ACME' },
  lines: [{ description: 'Consulting', quantity: 1, unitPrice: 100, vatRate: 21 }]
});

console.log(draft.data);
```

## OpenClaw skill

See `skills/billit/SKILL.md`.

The skill tells another agent when to use this repo, how to validate config, and when to fall back to the `raw` command.

## Webhooks

This repo includes lightweight webhook utilities for:

- normalizing headers
- parsing event envelopes
- verifying HMAC SHA-256 signatures when you choose to use that style

Billit-specific signature conventions should be set according to current docs/account settings.

## Tests

```bash
npm test
```

Current tests cover:

- config validation
- request building
- calculation helpers
- webhook normalization and signature verification

## Public-source notes

See `docs/notes-public-sources.md`.

## What you should do before production use

1. Confirm the exact Billit production and sandbox base URLs.
2. Confirm whether auth uses `x-api-key`, `Authorization`, or another header in your account/docs.
3. Confirm exact endpoint paths for each operation you want.
4. If needed, extend `billit.config.json` with any newly documented resources.
5. Run a sandbox smoke test with the `raw` command before automating real invoice flows.

## License

MIT
