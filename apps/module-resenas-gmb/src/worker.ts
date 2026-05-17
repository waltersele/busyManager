/**
 * Worker de sincronización y generación de respuestas.
 * TODO (Nicolás): polling/mock de reseñas, Gemini, cola de aprobación, reglas ≤3★.
 */
import { createMatrixClient } from '@busymanager/matrix-sdk';

const matrix = createMatrixClient({
  baseUrl: process.env.MATRIX_API_URL ?? 'http://localhost:8080',
  moduleKey: process.env.MODULE_API_KEY!,
});

async function main() {
  await matrix.subscriptions.check('resenas-gmb');
  const ctx = await matrix.auth.check();
  console.log('Worker resenas-gmb — pendiente de implementar', {
    business_id: ctx.business_id,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
