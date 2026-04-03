# Billit public sources used

This project was intentionally based only on public online information available at build time.

## Sources consulted

### 1. Billit developer landing page
- URL: https://www.billit.eu/nl-be/voor-wie/ontwikkelaars/
- Public evidence established:
  - Billit offers a developer-facing integration program.
  - They advertise documentation, code examples, and an API for developers.

### 2. Billit public API docs root/search results
- URL family: https://docs.accesspoint.billit.eu/
- Public evidence established from discoverable search snippets:
  - There is a Billit API documentation site.
  - Public topics include:
    - Authentication
    - Sandbox vs Production
    - Create Entities / registering companies
    - Identification process
    - Sending sales invoices
    - Retrieve a list of invoices
    - Get status of a sales invoice
    - Calculations
    - Webhooks
    - Getting received invoices
    - Support

### 3. Public search snippet for authentication
- Search result title/snippet indicated:
  - Authentication method uses an API key.
  - API key is available in the Billit application profile of a user with access to the master account.

### 4. Public search snippet for sending
- Search result title/snippet indicated:
  - Sending sales invoices is supported.
  - Integrators map their dataset to a Billit JSON structure.
  - Billit can transfer combined data to supported networks.

### 5. Public search snippet for retrieving invoices
- Search result title/snippet indicated:
  - There is a list API endpoint for retrieving invoices.
  - Single-invoice retrieval is available in JSON format.

### 6. Public search snippet for status
- Search result title/snippet indicated:
  - Sales invoice delivery/status retrieval is supported.
  - Users may also see delivery info in the Billit UI, but API feedback is available.

### 7. Public search snippet for identification
- Search result title/snippet indicated:
  - There is a customer/entity identification flow.
  - The process involves provider completion and redirect/validation behavior.

### 8. Public search snippet for sandbox vs production
- Search result title/snippet indicated:
  - Billit provides separate production and sandbox-style environments.

### 9. Public search snippet for webhooks
- Search result title/snippet indicated:
  - Billit can push HTTPS webhook calls with JSON payloads to a registered URL.

### 10. Public PDF search snippet
- URL: https://www.billit.eu/media/fq4llng1/api-diagram.pdf
- Search result snippet indicated concepts such as:
  - `v1/orders`
  - `v1/commandSend`
  - polling or webhook updates
- Because the PDF content was not cleanly extractable in this environment, these path hints were treated as suggestive public evidence, not absolute truth.

## Design consequence

Because the public docs were partially protected by anti-bot measures from this environment, this repo does **not** hardcode the full Billit API as if it were fully verified. Instead it:

- models the publicly evidenced lifecycle comprehensively
- keeps endpoint paths/methods configurable via adapter config
- includes a raw logical-operation escape hatch
- documents exactly which assumptions need account-level confirmation before production use
