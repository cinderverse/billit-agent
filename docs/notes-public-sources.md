# Billit public sources used

This project was intentionally based only on public online information available at build time.

## Sources consulted

### 1. Billit developer landing page
- URL: https://www.billit.eu/nl-be/voor-wie/ontwikkelaars/
- Public evidence established:
  - Billit offers a developer-facing integration program.
  - They advertise documentation, code examples, and an API for developers.

### 2. Live Billit Swagger v1 document
- URL: https://api.billit.be/swagger/docs/v1
- Public evidence established directly from the live JSON:
  - Swagger version: `2.0`
  - API title: `Billit.API`
  - host: `api.billit.be`
  - scheme: `https`
  - 71 concrete REST paths were visible at build time.

### 3. Concrete path families visible in the live Swagger
The live Swagger exposed concrete REST endpoints for:

- account information / sso token / company registration / sequences / license
- accountant feeds
- cashbook
- daily receipt books
- documents
- e-invoice registrations, integrations, identification, send, orders, files, webhooks
- files
- financial transactions
- gl accounts
- journals
- misc company search + type codes
- OAuth2 token + revoke
- orders, payments, booking entries, send, eSign, deleted orders
- parties
- peppol participants, inbox, confirm/refuse, sendOrder, participantInformation
- products
- reports
- toProcess uploads
- global webhooks

### 4. Concrete models visible in the live Swagger
The live Swagger definitions exposed models such as:

- `Order`
- `Party`
- `Document`
- `File`
- `Webhook`
- `RegisterAccountRequestModel`
- `RegisterAccountResponse`
- `CreateAndSendEDocumentPost`
- `CreateAndSendEdocumentResponse`
- `OAuthAccessTokenRequest`
- `SendRequest`
- `KYCInitiationPost`
- `KYCInitiationResponse`

### 5. Specific details established from the live Swagger
Examples of concrete facts visible in the spec:

- `/v1/orders` supports `GET` and `POST`
- `/v1/orders/{orderID}` supports `GET`, `PATCH`, and `DELETE`
- `/v1/orders/commands/send` exists
- `/v1/parties` supports `GET` and `POST`
- `/v1/webhooks` supports `GET` and `POST`
- `/v1/einvoices/registrations/{registrationID}/identification` exists and initiates KYC
- `/OAuth2/token` and `/OAuth2/revoke` exist
- `RegisterAccountResponse` includes an `APIKey` field
- `Webhook` includes fields like `EntityType`, `EntityUpdateType`, `WebhookURL`, and `Secret`
- `SendRequest` includes `OrderIds`, `TransportType`, and `PrintType`

## Important caveat

The live Swagger did **not** expose a formal `securityDefinitions` block in the fetched document.
That means the repo can now be Swagger-grounded for paths and shapes, but auth header handling remains configurable rather than asserted as absolute truth from the spec alone.

## Design consequence

Because we now have the live Swagger, this repo no longer has to guess the major Billit endpoint families. It now:

- vendors the fetched Swagger as `swagger-v1.json`
- extracts logical operations from the real Billit paths
- can generate a Swagger-backed config
- still keeps adapter/auth settings configurable for account-specific correctness
