/**
 * Panel de aprobación de borradores (PANEL_PORT).
 * TODO: listar artículos, aprobar con hash, publicar en WP.
 */
const port = Number(process.env.PANEL_PORT ?? 4002);

console.log(`Panel seo-pipeline — implementar en http://localhost:${port}`);
console.log('Ver: docs/students/apps/seo-pipeline.md');
process.exit(0);
