# billit-agent

A configurable Billit integration toolkit for Node.js and OpenClaw.

It is now grounded against the live Billit Swagger v1 document at `https://api.billit.be/swagger/docs/v1`, while still keeping an adapter layer for future-proofing and account-specific adjustments. The repo combines:

- a TypeScript SDK/client
- a CLI (`billit-agent`)
- an OpenClaw skill under `skills/billit/`
- adapter-driven request mapping so you can cover the full Billit lifecycle

## Why it still has an adapter layer

The repo now has a concrete Billit Swagger v1 source, but keeping the adapter layer is still useful because it gives you:

1. **Real Billit coverage based on the live Swagger spec**
   - account endpoints
   - orders
   - parties
   - documents
   - files
   - webhooks
   - e-invoice registrations / integrations / identification / send
   - peppol inbox and direct send
   - OAuth token endpoints present in the spec

2. **A stable logical layer for automations and coding agents**
   - logical operations can be generated from Swagger
   - account-specific overrides remain possible without rewriting code
   - raw logical requests still work for newly added or less-frequently used operations

This means the toolkit is now both Swagger-grounded **and** practical for automation.

## Install

```bash
npm install
npm run build
```

## Configure

Copy the Swagger-grounded example file and fill in your real values:

```bash
cp swagger-v1.billit.config.example.json billit.config.json
```

Then edit:

- `apiKey`
- optionally, base URLs if Billit gives you a different sandbox host
- auth details if your account integration differs
- adapter resource mappings only if you want custom logical aliases

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

### Inspect operations from the live Billit Swagger JSON

```bash
billit-agent swagger-operations --file ./swagger-v1.json
```

### Generate a Swagger-backed config

```bash
billit-agent swagger-config --file ./swagger-v1.json
```

### Create an order / sales invoice draft

```bash
billit-agent raw \
  --operation orders.post \
  --body '{"OrderType":"Invoice","Customer":{"Name":"ACME"}}'
```

### Send one or more orders

```bash
billit-agent raw \
  --operation orders.commands.send.post \
  --body '{"OrderIds":[123],"TransportType":"Peppol"}'
```

### Get an order

```bash
billit-agent raw \
  --operation orders.orderID.get \
  --path-params '{"orderID":123}'
```

### List parties

```bash
billit-agent raw \
  --operation parties.get \
  --query '{"fullTextSearch":"acme"}'
```

### Local totals helper

```bash
billit-agent calculate --lines '[{"quantity":2,"unitPrice":10,"vatRate":21}]'
```

## Swagger-grounded operation coverage

The repo now includes `swagger-v1.json` and a generated example config `swagger-v1.billit.config.example.json` based on the live spec.

The live Swagger currently exposes 71 Billit paths including:

- account info / SSO / company registration / license
- accountant feeds
- cashbook
- daily receipts
- documents
- e-invoice registrations, integrations, send, orders, identification, webhooks
- files
- financial transaction imports
- GL accounts / journals import
- misc company search and type codes
- OAuth2 token + revoke
- orders + payments + booking entries + send + eSign + deleted
- parties
- peppol participants / inbox / confirm / refuse / sendOrder / participant info
- products
- reports
- toProcess uploads
- global webhooks

Use `billit-agent swagger-operations --file ./swagger-v1.json` to inspect the extracted logical operation list.

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

## What is now concretely established from Swagger

From the live spec, this repo now directly knows:

- host: `api.billit.be`
- scheme: `https`
- concrete REST paths for the listed operations
- path/query/body parameter structure for those operations
- many public model names and response shapes
- presence of `/OAuth2/token` and `/OAuth2/revoke`
- presence of fields such as `RegisterAccountResponse.APIKey`

The Swagger does **not** appear to declare a formal `securityDefinitions` block, so the default config still keeps auth header handling configurable. The generated example uses `APIKey` because that string appears in the live spec and response models, but you should verify against your live account behavior.

## What you should do before production use

1. Confirm the exact authentication header/flow for your Billit account.
2. Confirm whether a distinct sandbox host exists for your environment.
3. Run a smoke test against a harmless endpoint like account info.
4. If needed, regenerate/refresh config from a newer Swagger export.
5. Add any missing convenience wrappers you want on top of the raw logical operations.

## License

MIT
