import type { HttpMethod } from './types.js';

export interface SwaggerV2Parameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'body' | 'formData';
  required?: boolean;
  type?: string;
  format?: string;
  schema?: { $ref?: string; type?: string };
}

export interface SwaggerV2Operation {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  consumes?: string[];
  produces?: string[];
  parameters?: SwaggerV2Parameter[];
  responses?: Record<string, unknown>;
}

export interface SwaggerV2Spec {
  swagger: string;
  info?: { version?: string; title?: string };
  host?: string;
  schemes?: string[];
  paths: Record<string, Partial<Record<Lowercase<HttpMethod>, SwaggerV2Operation>>>;
  definitions?: Record<string, unknown>;
}

export interface ExtractedOperation {
  key: string;
  method: HttpMethod;
  path: string;
  operationId?: string;
  summary?: string;
  tags: string[];
  pathParams: SwaggerV2Parameter[];
  queryParams: SwaggerV2Parameter[];
  bodyParam?: SwaggerV2Parameter;
}

const METHOD_MAP = ['get', 'post', 'put', 'patch', 'delete'] as const;

function toLogicalKey(rawPath: string, method: HttpMethod): string {
  const cleaned = rawPath
    .replace(/^\/v1\//i, '')
    .replace(/^\//, '')
    .replace(/\{([^}]+)\}/g, '$1')
    .replace(/\//g, '.');
  return `${cleaned}.${method.toLowerCase()}`;
}

export function extractOperations(spec: SwaggerV2Spec): ExtractedOperation[] {
  const results: ExtractedOperation[] = [];

  for (const [path, pathItem] of Object.entries(spec.paths)) {
    for (const methodName of METHOD_MAP) {
      const operation = pathItem[methodName];
      if (!operation) continue;

      const method = methodName.toUpperCase() as HttpMethod;
      const parameters = operation.parameters ?? [];
      const bodyParam = parameters.find((p) => p.in === 'body');
      results.push({
        key: toLogicalKey(path, method),
        method,
        path,
        ...(operation.operationId !== undefined ? { operationId: operation.operationId } : {}),
        ...(operation.summary !== undefined ? { summary: operation.summary } : {}),
        tags: operation.tags ?? [],
        pathParams: parameters.filter((p) => p.in === 'path'),
        queryParams: parameters.filter((p) => p.in === 'query'),
        ...(bodyParam !== undefined ? { bodyParam } : {})
      });
    }
  }

  return results.sort((a, b) => a.key.localeCompare(b.key));
}

export function createSwaggerBackedDefaultConfig(spec: SwaggerV2Spec) {
  const baseUrl = `${spec.schemes?.[0] ?? 'https'}://${spec.host ?? 'api.billit.be'}`;
  const resources = Object.fromEntries(
    extractOperations(spec).map((operation) => [
      operation.key,
      {
        method: operation.method,
        path: operation.path
      }
    ])
  );

  return {
    environment: 'production' as const,
    apiKey: 'YOUR_BILLIT_API_KEY',
    baseUrls: {
      production: baseUrl,
      sandbox: baseUrl
    },
    auth: {
      type: 'apiKey' as const,
      header: 'APIKey',
      prefix: ''
    },
    adapter: { resources },
    defaults: {
      headers: {
        accept: 'application/json'
      }
    }
  };
}
