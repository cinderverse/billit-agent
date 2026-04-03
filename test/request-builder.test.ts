import test from 'node:test';
import assert from 'node:assert/strict';
import { parseConfig } from '../src/config.js';
import { buildRequest } from '../src/request-builder.js';

const config = parseConfig({
  environment: 'sandbox',
  apiKey: 'abc123',
  baseUrls: {
    production: 'https://api.example.com',
    sandbox: 'https://sandbox.example.com/'
  },
  auth: {
    type: 'apiKey',
    header: 'x-api-key'
  },
  adapter: {
    resources: {
      'orders.get': { method: 'GET', path: '/v1/orders/{orderId}' },
      'orders.create': { method: 'POST', path: '/v1/orders', queryDefaults: { include: 'lines' } }
    }
  },
  defaults: {
    headers: {
      accept: 'application/json'
    }
  }
});

test('buildRequest injects path params and auth header', () => {
  const built = buildRequest(config, {
    operation: 'orders.get',
    pathParams: { orderId: 'ORD-42' }
  });

  assert.equal(built.method, 'GET');
  assert.equal(built.url, 'https://sandbox.example.com/v1/orders/ORD-42');
  assert.equal(built.headers['x-api-key'], 'abc123');
});

test('buildRequest merges query defaults and serializes JSON body', () => {
  const built = buildRequest(config, {
    operation: 'orders.create',
    query: { lang: 'nl' },
    body: { hello: 'world' }
  });

  assert.equal(built.url, 'https://sandbox.example.com/v1/orders?include=lines&lang=nl');
  assert.equal(built.headers['content-type'], 'application/json');
  assert.equal(built.body, JSON.stringify({ hello: 'world' }));
});
