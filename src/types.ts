export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type EnvironmentName = 'production' | 'sandbox';

export interface ResourceDefinition {
  method: HttpMethod;
  path: string;
  queryDefaults?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

export interface BillitAdapter {
  resources: Record<string, ResourceDefinition>;
}

export interface BillitConfig {
  environment: EnvironmentName;
  apiKey: string;
  baseUrls: Record<EnvironmentName, string>;
  auth: {
    type: 'apiKey';
    header: string;
    prefix?: string;
  };
  adapter: BillitAdapter;
  defaults?: {
    headers?: Record<string, string>;
  };
}

export interface RequestBuildInput {
  operation: string;
  pathParams?: Record<string, string | number>;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface BuiltRequest {
  operation: string;
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

export interface BillitResponse<T = unknown> {
  status: number;
  ok: boolean;
  headers: Headers;
  data: T;
}

export interface WebhookEvent<T = unknown> {
  eventType: string;
  eventId?: string;
  receivedAt: string;
  payload: T;
  rawBody: string;
  headers: Record<string, string>;
}
