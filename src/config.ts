import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';
import type { BillitConfig } from './types.js';

const resourceSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  path: z.string().min(1),
  queryDefaults: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  headers: z.record(z.string()).optional()
});

const configSchema = z.object({
  environment: z.enum(['production', 'sandbox']),
  apiKey: z.string().min(1),
  baseUrls: z.object({
    production: z.string().url(),
    sandbox: z.string().url()
  }),
  auth: z.object({
    type: z.literal('apiKey'),
    header: z.string().min(1),
    prefix: z.string().optional()
  }),
  adapter: z.object({
    resources: z.record(resourceSchema)
  }),
  defaults: z.object({
    headers: z.record(z.string()).optional()
  }).optional()
});

export function parseConfig(value: unknown): BillitConfig {
  return configSchema.parse(value) as BillitConfig;
}

export function loadConfig(configPath?: string): BillitConfig {
  const finalPath = resolve(configPath ?? process.env.BILLIT_CONFIG ?? 'billit.config.json');
  const raw = readFileSync(finalPath, 'utf8');
  const parsed = JSON.parse(raw) as unknown;
  return parseConfig(parsed);
}
