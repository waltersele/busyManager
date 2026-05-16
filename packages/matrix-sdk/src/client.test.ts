import { describe, expect, it, vi } from 'vitest';
import { createMatrixClient } from './client.js';
import { InsufficientTokensError, ModuleNotSubscribedError } from './errors.js';

describe('createMatrixClient', () => {
  it('checks subscription', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ active: true }),
    });

    const matrix = createMatrixClient({
      baseUrl: 'http://localhost:8080',
      moduleKey: 'bm_test',
      fetchImpl,
    });

    const active = await matrix.subscriptions.check('web-uptime');
    expect(active).toBe(true);
    expect(fetchImpl).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/matrix/subscriptions/check/web-uptime',
      expect.objectContaining({
        headers: expect.objectContaining({ 'X-Module-Key': 'bm_test' }),
      }),
    );
  });

  it('throws ModuleNotSubscribedError on 403', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      json: async () => ({ message: 'not subscribed' }),
    });

    const matrix = createMatrixClient({
      baseUrl: 'http://localhost:8080',
      moduleKey: 'bm_test',
      fetchImpl,
    });

    await expect(matrix.subscriptions.check('seo-onpage')).rejects.toBeInstanceOf(
      ModuleNotSubscribedError,
    );
  });

  it('throws InsufficientTokensError on 402', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 402,
      statusText: 'Payment Required',
      json: async () => ({}),
    });

    const matrix = createMatrixClient({
      baseUrl: 'http://localhost:8080',
      moduleKey: 'bm_test',
      fetchImpl,
    });

    await expect(matrix.tokens.check(500)).rejects.toBeInstanceOf(
      InsufficientTokensError,
    );
  });
});
