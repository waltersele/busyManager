/**
 * Genera artículo, crea borrador WP y notifica.
 * TODO (Julio): Gemini, WP REST draft, content_approvals, hash SHA-256.
 */
import { createMatrixClient } from '@busymanager/matrix-sdk';

const matrix = createMatrixClient({
  baseUrl: process.env.MATRIX_API_URL ?? 'http://localhost:8080',
  moduleKey: process.env.MODULE_API_KEY!,
});

async function main() {
  await matrix.subscriptions.check('seo-pipeline');
  const ctx = await matrix.auth.check();
  console.log('Pipeline seo-pipeline — pendiente de implementar', {
    business_id: ctx.business_id,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
