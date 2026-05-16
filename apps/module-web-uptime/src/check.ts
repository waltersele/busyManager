import { createMatrixClient } from '@busymanager/matrix-sdk';

const baseUrl = process.env.MATRIX_API_URL ?? 'http://localhost:8080';
const moduleKey = process.env.MODULE_API_KEY ?? '';

if (!moduleKey) {
  console.error('MODULE_API_KEY is required');
  process.exit(1);
}

const matrix = createMatrixClient({ baseUrl, moduleKey });

async function ping(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

async function main() {
  await matrix.subscriptions.check('web-uptime');
  await matrix.tokens.check(0);

  const ctx = await matrix.auth.check();
  const settings = (ctx as { settings?: { web?: { url?: string }; monitor_url?: string } }).settings ?? {};
  const url = settings.web?.url || (settings as { monitor_url?: string }).monitor_url;

  if (!url) {
    console.error('No monitor_url in business settings');
    process.exit(1);
  }

  console.log(`Checking ${url}...`);
  const result = await ping(url);

  if (!result.ok) {
    console.warn(`Site down: ${url} (status ${result.status})`);
    await matrix.notify('alert_center', {
      title: 'Web caída detectada',
      body: `La URL ${url} no responde correctamente (HTTP ${result.status}).`,
      severity: 'critical',
    });
    await matrix.webhooks.emit('site.down', { url, statusCode: result.status });
    process.exit(2);
  }

  console.log(`OK: ${url} (${result.status})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
