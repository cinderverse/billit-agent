import { buildRequest } from './request-builder.js';
import type { BillitConfig, BillitResponse, RequestBuildInput } from './types.js';

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

export class BillitClient {
  constructor(
    private readonly config: BillitConfig,
    private readonly fetchImpl: typeof fetch = fetch
  ) {}

  async request<T = unknown>(input: RequestBuildInput): Promise<BillitResponse<T>> {
    const built = buildRequest(this.config, input);
    const init: RequestInit = {
      method: built.method,
      headers: built.headers,
      ...(built.body !== undefined ? { body: built.body } : {})
    };
    const response = await this.fetchImpl(built.url, init);

    const data = await parseResponseBody(response);
    return {
      status: response.status,
      ok: response.ok,
      headers: response.headers,
      data: data as T
    };
  }

  listOrders(query?: RequestBuildInput['query']) {
    return this.request({ operation: 'orders.list', ...(query !== undefined ? { query } : {}) });
  }

  getOrder(orderId: string | number) {
    return this.request({ operation: 'orders.get', pathParams: { orderId } });
  }

  createOrder(body: unknown) {
    return this.request({ operation: 'orders.create', body });
  }

  sendOrder(orderId?: string | number, body?: unknown) {
    return this.request({
      operation: 'orders.send',
      ...(orderId !== undefined ? { query: { orderId } } : {}),
      ...(body !== undefined ? { body } : {})
    });
  }

  getOrderStatus(orderId: string | number) {
    return this.request({ operation: 'orders.status', pathParams: { orderId } });
  }

  listReceivedInvoices(query?: RequestBuildInput['query']) {
    return this.request({ operation: 'invoices.received.list', ...(query !== undefined ? { query } : {}) });
  }

  getReceivedInvoice(invoiceId: string | number) {
    return this.request({ operation: 'invoices.received.get', pathParams: { invoiceId } });
  }

  registerEntity(body: unknown) {
    return this.request({ operation: 'entities.register', body });
  }

  getEntity(entityId: string | number) {
    return this.request({ operation: 'entities.get', pathParams: { entityId } });
  }

  listContacts(query?: RequestBuildInput['query']) {
    return this.request({ operation: 'contacts.list', ...(query !== undefined ? { query } : {}) });
  }

  getContact(contactId: string | number) {
    return this.request({ operation: 'contacts.get', pathParams: { contactId } });
  }

  createContact(body: unknown) {
    return this.request({ operation: 'contacts.create', body });
  }

  startIdentification(body: unknown) {
    return this.request({ operation: 'identification.start', body });
  }

  getIdentificationStatus(sessionId: string | number) {
    return this.request({ operation: 'identification.status', pathParams: { sessionId } });
  }

  registerWebhook(body: unknown) {
    return this.request({ operation: 'webhooks.register', body });
  }

  listWebhooks() {
    return this.request({ operation: 'webhooks.list' });
  }

  uploadAttachment(body: unknown) {
    return this.request({ operation: 'attachments.upload', body });
  }

  downloadAttachment(attachmentId: string | number) {
    return this.request({ operation: 'attachments.download', pathParams: { attachmentId } });
  }
}
