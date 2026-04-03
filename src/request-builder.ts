import { getResource } from './adapter.js';
import type { BillitConfig, BuiltRequest, RequestBuildInput } from './types.js';

function encodePath(path: string, pathParams: Record<string, string | number> = {}): string {
  return path.replace(/\{([^}]+)\}/g, (_, key: string) => {
    const value = pathParams[key];
    if (value === undefined) {
      throw new Error(`Missing path param: ${key}`);
    }
    return encodeURIComponent(String(value));
  });
}

export function buildRequest(config: BillitConfig, input: RequestBuildInput): BuiltRequest {
  const resource = getResource(config, input.operation);
  const baseUrl = config.baseUrls[config.environment].replace(/\/$/, '');
  const pathname = encodePath(resource.path, input.pathParams);
  const url = new URL(`${baseUrl}${pathname}`);

  const mergedQuery = { ...(resource.queryDefaults ?? {}), ...(input.query ?? {}) };
  for (const [key, value] of Object.entries(mergedQuery)) {
    if (value === undefined || value === null) continue;
    url.searchParams.set(key, String(value));
  }

  const headers: Record<string, string> = {
    accept: 'application/json',
    ...(config.defaults?.headers ?? {}),
    ...(resource.headers ?? {}),
    ...(input.headers ?? {})
  };

  const authValue = `${config.auth.prefix ?? ''}${config.apiKey}`;
  headers[config.auth.header] = authValue;

  let body: string | undefined;
  if (input.body !== undefined) {
    headers['content-type'] = headers['content-type'] ?? 'application/json';
    body = headers['content-type'].includes('application/json')
      ? JSON.stringify(input.body)
      : String(input.body);
  }

  return {
    operation: input.operation,
    method: resource.method,
    url: url.toString(),
    headers,
    ...(body !== undefined ? { body } : {})
  };
}
