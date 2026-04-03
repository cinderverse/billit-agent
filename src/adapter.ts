import type { BillitConfig, ResourceDefinition } from './types.js';

export function getResource(config: BillitConfig, operation: string): ResourceDefinition {
  const resource = config.adapter.resources[operation];
  if (!resource) {
    throw new Error(`Unknown Billit operation: ${operation}`);
  }
  return resource;
}

export function listOperations(config: BillitConfig): string[] {
  return Object.keys(config.adapter.resources).sort();
}
