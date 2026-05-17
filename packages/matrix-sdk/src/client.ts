import type {
  LeadPayload,
  MatrixContext,
  NotifyPayload,
  ProviderConnectionResponse,
  TokenConsumePayload,
} from '@busymanager/api-contracts';
import {
  InsufficientTokensError,
  MatrixError,
  ModuleNotSubscribedError,
} from './errors.js';

export interface MatrixClientOptions {
  baseUrl: string;
  moduleKey: string;
  fetchImpl?: typeof fetch;
}

export function createMatrixClient(options: MatrixClientOptions) {
  const baseUrl = options.baseUrl.replace(/\/$/, '');
  const fetchFn = options.fetchImpl ?? fetch;

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const res = await fetchFn(`${baseUrl}/api/v1/matrix${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Module-Key': options.moduleKey,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (res.status === 403 && path.includes('subscriptions')) {
        throw new ModuleNotSubscribedError();
      }
      if (res.status === 402) {
        throw new InsufficientTokensError();
      }
      throw new MatrixError(data.message ?? res.statusText, res.status);
    }

    return res.json() as Promise<T>;
  }

  return {
    auth: {
      check: () => request<MatrixContext>('GET', '/auth/check'),
    },
    subscriptions: {
      check: async (slug: string) => {
        const res = await request<{ active: boolean }>(
          'GET',
          `/subscriptions/check/${slug}`,
        );
        return res.active;
      },
    },
    connections: {
      get: (provider: string) =>
        request<ProviderConnectionResponse>('GET', `/connections/${provider}`),
      list: () =>
        request<{ connections: unknown[] }>('GET', '/connections'),
    },
    tokens: {
      check: async (amount: number) => {
        const res = await request<{ sufficient: boolean }>(
          'POST',
          '/tokens/check',
          { amount },
        );
        if (!res.sufficient) throw new InsufficientTokensError();
        return res;
      },
      consume: (payload: TokenConsumePayload) =>
        request<{ balance: number }>('POST', '/tokens/consume', payload),
    },
    leads: {
      create: (data: LeadPayload) => request<unknown>('POST', '/leads', data),
      update: (id: number, data: Partial<LeadPayload>) =>
        request<unknown>('PATCH', `/leads/${id}`, data),
      event: (id: number, type: string, data?: Record<string, unknown>) =>
        request<unknown>('POST', `/leads/${id}/events`, { type, data }),
    },
    webhooks: {
      emit: (event: string, data: Record<string, unknown>) =>
        request<{ dispatched: number }>('POST', '/webhooks/emit', {
          event,
          data,
        }),
    },
    notify: (channel: string, msg: Omit<NotifyPayload, 'channel'>) =>
      request<unknown>('POST', '/notify', { channel, ...msg }),
    runtime: {
      publish: (payload: Record<string, unknown>) =>
        request<{ ok: boolean }>('POST', '/runtime', { payload }),
    },
  };
}

export type MatrixClient = ReturnType<typeof createMatrixClient>;
