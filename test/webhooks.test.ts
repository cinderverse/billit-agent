import test from 'node:test';
import assert from 'node:assert/strict';
import { parseWebhookEvent, signHmacSha256, verifyHmacSha256 } from '../src/webhooks.js';

test('parseWebhookEvent normalizes headers and inferred fields', () => {
  const event = parseWebhookEvent(
    JSON.stringify({ type: 'invoice.sent', id: 'evt_1', data: { ok: true } }),
    { 'X-Event-Type': 'ignored-because-body-wins', 'X-Test': 'yes' }
  );

  assert.equal(event.eventType, 'invoice.sent');
  assert.equal(event.eventId, 'evt_1');
  assert.equal(event.headers['x-test'], 'yes');
});

test('verifyHmacSha256 validates correct signatures', () => {
  const payload = '{"hello":"world"}';
  const signature = signHmacSha256('secret', payload);
  assert.equal(verifyHmacSha256('secret', payload, signature), true);
  assert.equal(verifyHmacSha256('wrong', payload, signature), false);
});
