#!/usr/bin/env node
import { Command } from 'commander';
import { loadConfig } from './config.js';
import { BillitClient } from './client.js';
import { calculateTotals } from './calculations.js';
import { listOperations } from './adapter.js';
import { printJson, readOptionalJsonArgOrStdin } from './output.js';
import { readFileSync } from 'node:fs';
import { createSwaggerBackedDefaultConfig, extractOperations, type SwaggerV2Spec } from './swagger.js';

const program = new Command();
program
  .name('billit-agent')
  .description('Configurable Billit CLI and SDK')
  .option('-c, --config <path>', 'Path to billit config JSON');

function getClient(configPath?: string): BillitClient {
  const config = loadConfig(configPath);
  return new BillitClient(config);
}

program
  .command('operations')
  .description('List configured logical operations')
  .action(() => {
    const config = loadConfig(program.opts().config);
    printJson(listOperations(config));
  });

program
  .command('swagger-operations')
  .description('List operations directly from a Billit Swagger v2 JSON file')
  .requiredOption('-f, --file <path>', 'Path to swagger JSON')
  .action((options) => {
    const spec = JSON.parse(readFileSync(options.file, 'utf8')) as SwaggerV2Spec;
    printJson(extractOperations(spec));
  });

program
  .command('swagger-config')
  .description('Generate a default Billit config from a Billit Swagger v2 JSON file')
  .requiredOption('-f, --file <path>', 'Path to swagger JSON')
  .action((options) => {
    const spec = JSON.parse(readFileSync(options.file, 'utf8')) as SwaggerV2Spec;
    printJson(createSwaggerBackedDefaultConfig(spec));
  });

program
  .command('raw')
  .description('Perform a raw logical Billit operation via the adapter')
  .requiredOption('-o, --operation <name>', 'Logical operation name')
  .option('-p, --path-params <json>', 'Path params JSON')
  .option('-q, --query <json>', 'Query JSON')
  .option('-b, --body <json-or-dash>', 'Body JSON or - for stdin')
  .option('-H, --headers <json>', 'Headers JSON')
  .action(async (options) => {
    const client = getClient(program.opts().config);
    const response = await client.request({
      operation: options.operation,
      pathParams: options.pathParams ? JSON.parse(options.pathParams) : undefined,
      query: options.query ? JSON.parse(options.query) : undefined,
      body: await readOptionalJsonArgOrStdin(options.body),
      headers: options.headers ? JSON.parse(options.headers) : undefined
    });
    printJson(response.data);
  });

program
  .command('entity-register')
  .description('Register an entity/company')
  .requiredOption('-b, --body <json-or-dash>', 'Body JSON or - for stdin')
  .action(async (options) => {
    const client = getClient(program.opts().config);
    printJson((await client.registerEntity(await readOptionalJsonArgOrStdin(options.body))).data);
  });

program
  .command('entity-get')
  .description('Get an entity by id')
  .argument('<entityId>')
  .action(async (entityId) => {
    const client = getClient(program.opts().config);
    printJson((await client.getEntity(entityId)).data);
  });

program
  .command('contacts-list')
  .description('List contacts/receivers')
  .option('-q, --query <json>', 'Query JSON')
  .action(async (options) => {
    const client = getClient(program.opts().config);
    printJson((await client.listContacts(options.query ? JSON.parse(options.query) : undefined)).data);
  });

program
  .command('contacts-create')
  .description('Create a contact/receiver')
  .requiredOption('-b, --body <json-or-dash>', 'Body JSON or - for stdin')
  .action(async (options) => {
    const client = getClient(program.opts().config);
    printJson((await client.createContact(await readOptionalJsonArgOrStdin(options.body))).data);
  });

program
  .command('order-create')
  .description('Create an order/sales invoice draft')
  .requiredOption('-b, --body <json-or-dash>', 'Body JSON or - for stdin')
  .action(async (options) => {
    const client = getClient(program.opts().config);
    printJson((await client.createOrder(await readOptionalJsonArgOrStdin(options.body))).data);
  });

program
  .command('order-get')
  .description('Get an order by id')
  .argument('<orderId>')
  .action(async (orderId) => {
    const client = getClient(program.opts().config);
    printJson((await client.getOrder(orderId)).data);
  });

program
  .command('orders-list')
  .description('List orders/sales invoices')
  .option('-q, --query <json>', 'Query JSON')
  .action(async (options) => {
    const client = getClient(program.opts().config);
    printJson((await client.listOrders(options.query ? JSON.parse(options.query) : undefined)).data);
  });

program
  .command('order-send')
  .description('Send an order/sales invoice')
  .option('-i, --order-id <id>', 'Order id if supported as query param')
  .option('-b, --body <json-or-dash>', 'Body JSON or - for stdin')
  .action(async (options) => {
    const client = getClient(program.opts().config);
    printJson((await client.sendOrder(options.orderId, await readOptionalJsonArgOrStdin(options.body))).data);
  });

program
  .command('order-status')
  .description('Get order/sales invoice status')
  .argument('<orderId>')
  .action(async (orderId) => {
    const client = getClient(program.opts().config);
    printJson((await client.getOrderStatus(orderId)).data);
  });

program
  .command('received-list')
  .description('List received invoices')
  .option('-q, --query <json>', 'Query JSON')
  .action(async (options) => {
    const client = getClient(program.opts().config);
    printJson((await client.listReceivedInvoices(options.query ? JSON.parse(options.query) : undefined)).data);
  });

program
  .command('received-get')
  .description('Get a received invoice')
  .argument('<invoiceId>')
  .action(async (invoiceId) => {
    const client = getClient(program.opts().config);
    printJson((await client.getReceivedInvoice(invoiceId)).data);
  });

program
  .command('identification-start')
  .description('Start identification/onboarding flow')
  .requiredOption('-b, --body <json-or-dash>', 'Body JSON or - for stdin')
  .action(async (options) => {
    const client = getClient(program.opts().config);
    printJson((await client.startIdentification(await readOptionalJsonArgOrStdin(options.body))).data);
  });

program
  .command('identification-status')
  .description('Get identification session status')
  .argument('<sessionId>')
  .action(async (sessionId) => {
    const client = getClient(program.opts().config);
    printJson((await client.getIdentificationStatus(sessionId)).data);
  });

program
  .command('webhooks-list')
  .description('List registered webhooks')
  .action(async () => {
    const client = getClient(program.opts().config);
    printJson((await client.listWebhooks()).data);
  });

program
  .command('webhooks-register')
  .description('Register a webhook')
  .requiredOption('-b, --body <json-or-dash>', 'Body JSON or - for stdin')
  .action(async (options) => {
    const client = getClient(program.opts().config);
    printJson((await client.registerWebhook(await readOptionalJsonArgOrStdin(options.body))).data);
  });

program
  .command('attachments-upload')
  .description('Upload an attachment using adapter-defined semantics')
  .requiredOption('-b, --body <json-or-dash>', 'Body JSON or - for stdin')
  .action(async (options) => {
    const client = getClient(program.opts().config);
    printJson((await client.uploadAttachment(await readOptionalJsonArgOrStdin(options.body))).data);
  });

program
  .command('attachments-download')
  .description('Download attachment metadata/content using adapter-defined semantics')
  .argument('<attachmentId>')
  .action(async (attachmentId) => {
    const client = getClient(program.opts().config);
    printJson((await client.downloadAttachment(attachmentId)).data);
  });

program
  .command('calculate')
  .description('Calculate invoice totals locally')
  .requiredOption('-l, --lines <json>', 'Array of line items as JSON')
  .action((options) => {
    const lines = JSON.parse(options.lines) as Array<{ quantity: number; unitPrice: number; vatRate: number }>;
    printJson(calculateTotals(lines));
  });

program.parseAsync(process.argv);
