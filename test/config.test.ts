import test from 'node:test';
import assert from 'node:assert/strict';
import { parseConfig } from '../src/config.js';

test('parseConfig accepts valid api-key config', () => {
  const config = parseConfig({
    environment: 'production',
    apiKey: 'key',
    baseUrls: {
      production: 'https://api.example.com',
      sandbox: 'https://sandbox.example.com'
    },
    auth: { type: 'apiKey', header: 'Authorization', prefix: 'Bearer ' },
    adapter: { resources: { ping: { method: 'GET', path: '/ping' } } }
  });

  assert.equal(config.auth.prefix, 'Bearer ');
  assert.equal(config.environment, 'production');
});

test('parseConfig rejects missing api key', () => {
  assert.throws(() =>
    parseConfig({
      environment: 'production',
      apiKey: '',
      baseUrls: {
        production: 'https://api.example.com',
        sandbox: 'https://sandbox.example.com'
      },
      auth: { type: 'apiKey', header: 'Authorization' },
      adapter: { resources: { ping: { method: 'GET', path: '/ping' } } }
    })
  );
});
