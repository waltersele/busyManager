/**
 * Comprueba conexión con La Matriz y suscripción resenas-gmb.
 * Uso: pnpm ping (tras configurar MODULE_API_KEY en .env)
 */
import { createMatrixClient } from '@busymanager/matrix-sdk';

const baseUrl = process.env.MATRIX_API_URL ?? 'http://localhost:8080';
const moduleKey = process.env.MODULE_API_KEY ?? '';

if (!moduleKey || moduleKey.includes('replace')) {
  console.error('Configura MODULE_API_KEY en .env (Dashboard → Reseñas GMB → API key)');
  process.exit(1);
}

const matrix = createMatrixClient({ baseUrl, moduleKey });
const SLUG = 'resenas-gmb';

async function main() {
  await matrix.subscriptions.check(SLUG);
  const ctx = await matrix.auth.check();
  const settings = ctx.settings as {
    identity?: { trade_name?: string };
    modules?: Record<string, unknown>;
  };
  const mod = settings.modules?.[SLUG] ?? {};

  console.log('OK — conectado a La Matriz');
  console.log({
    organization_id: ctx.organization_id,
    business_id: ctx.business_id,
    trade_name: settings.identity?.trade_name,
    module_settings: mod,
  });
  console.log('\nSiguiente: docs/students/apps/resenas-gmb.md');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
