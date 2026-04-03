import { createHmac, timingSafeEqual } from 'node:crypto';
import type { WebhookEvent } from './types.js';

export function normalizeHeaders(input: Headers | Record<string, string | string[] | undefined>): Record<string, string> {
  if (input instanceof Headers) {
    return Object.fromEntries(input.entries());
  }

  const entries = Object.entries(input).map(([key, value]) => [key.toLowerCase(), Array.isArray(value) ? value.join(',') : value ?? '']);
  return Object.fromEntries(entries);
}

export function parseWebhookEvent<T = unknown>(rawBody: string, headers: Headers | Record<string, string | string[] | undefined>): WebhookEvent<T> {
  const normalizedHeaders = normalizeHeaders(headers);
  const payload = JSON.parse(rawBody) as T & { type?: string; eventType?: string; id?: string; eventId?: string; timestamp?: string };

  const eventId = payload.eventId ?? payload.id ?? normalizedHeaders['x-event-id'];

  return {
    eventType: payload.eventType ?? payload.type ?? normalizedHeaders['x-event-type'] ?? 'unknown',
    ...(eventId !== undefined ? { eventId } : {}),
    receivedAt: payload.timestamp ?? new Date().toISOString(),
    payload,
    rawBody,
    headers: normalizedHeaders
  };
}

export function signHmacSha256(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifyHmacSha256(secret: string, payload: string, expectedHex: string): boolean {
  const actual = Buffer.from(signHmacSha256(secret, payload), 'hex');
  const expected = Buffer.from(expectedHex, 'hex');
  if (actual.length !== expected.length) {
    return false;
  }
  return timingSafeEqual(actual, expected);
}
