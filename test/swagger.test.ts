import test from 'node:test';
import assert from 'node:assert/strict';
import { createSwaggerBackedDefaultConfig, extractOperations, type SwaggerV2Spec } from '../src/swagger.js';

const spec: SwaggerV2Spec = {
  swagger: '2.0',
  host: 'api.billit.be',
  schemes: ['https'],
  paths: {
    '/v1/orders': {
      get: {
        operationId: 'Order_GetOrders',
        summary: 'Get orders',
        parameters: [{ name: 'fullTextSearch', in: 'query', type: 'string' }]
      },
      post: {
        operationId: 'Order_PostOrders',
        summary: 'Create order',
        parameters: [{ name: 'order', in: 'body', schema: { $ref: '#/definitions/Order' } }]
      }
    },
    '/v1/orders/{orderID}': {
      get: {
        operationId: 'Order_GetOrder',
        summary: 'Get order',
        parameters: [{ name: 'orderID', in: 'path', required: true, type: 'integer' }]
      }
    },
    '/v1/webhooks/{webhookID}': {
      delete: {
        operationId: 'Webhook_DeleteWebhooks',
        summary: 'Delete webhook',
        parameters: [{ name: 'webhookID', in: 'path', required: true, type: 'integer' }]
      }
    }
  }
};

test('extractOperations returns logical keys and parameter partitions', () => {
  const operations = extractOperations(spec);
  assert.equal(operations.length, 4);

  const getOrder = operations.find((x) => x.key === 'orders.orderID.get');
  assert.ok(getOrder);
  assert.equal(getOrder.pathParams[0]?.name, 'orderID');

  const createOrder = operations.find((x) => x.key === 'orders.post');
  assert.ok(createOrder);
  assert.equal(createOrder.bodyParam?.name, 'order');
});

test('createSwaggerBackedDefaultConfig maps all swagger operations to resources', () => {
  const config = createSwaggerBackedDefaultConfig(spec);
  assert.equal(config.baseUrls.production, 'https://api.billit.be');
  assert.equal(config.auth.header, 'APIKey');
  assert.equal(config.adapter.resources['orders.get']?.path, '/v1/orders');
  assert.equal(config.adapter.resources['webhooks.webhookID.delete']?.method, 'DELETE');
});
