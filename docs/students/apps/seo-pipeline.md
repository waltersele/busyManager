# App: SEO Pipeline (`seo-pipeline`)

## De qué va

Generas artículos SEO con IA, los dejas en **borrador** (WordPress o simulado en local) y avisas al responsable. **Nada se publica** hasta que apruebe en tu panel. Guardas quién aprobó, cuándo y un hash del contenido exacto.

El negocio quiere blog activo sin sustos de «la IA publicó esto sin mirarlo».

**Carpeta:** `apps/module-seo-pipeline/` (esqueleto con `pnpm ping`).

## Lecturas

[00](../00-inicio-rapido.md) → [03](../03-contrato-matriz.md) → [06](../06-guia-estilos.md).  
Ficha: [modules/seo-pipeline.md](../modules/seo-pipeline.md) (incluye SEO on-page en el mismo flujo; no hay app aparte).

## MVP

1. Comando o scheduler que ejecute el pipeline.
2. Artículo (título, cuerpo, meta) con Gemini + `tokens.check` / `consume`.
3. Tablas `articles` y `content_approvals` en tu BD.
4. En MVP puedes **simular** WordPress con flags locales; si tienes WP de prueba, draft real vía REST.
5. SHA-256 del contenido al aprobar.
6. Cero `publish` sin fila en `content_approvals` con fecha de aprobación.
7. Si editas el texto después de aprobar → invalidar y volver a pedir OK.
8. Panel (~4002): listar pendientes, Aprobar / Rechazar.
9. `notify` — borrador listo.
10. `webhooks.emit('article.draft_ready', …)`.

## Si te da tiempo

WordPress REST de verdad, email con preview (Mailpit en dev), cadencias daily/weekly, webhook `article.published`.

Credenciales WP en **Configuración → Integraciones** (`wordpress`, `gemini`).

## Reglas

Nunca `status: publish` en WordPress sin aprobación en BD. El hash es sobre el HTML/markdown que realmente publicas.

## Arranque

Mismo clone y Docker que el resto del curso → activar **SEO Pipeline** en Apps → key en `.env` del módulo → `pnpm ping`.

WordPress local: Local WP, Docker, o staging; Application Password en la doc de WordPress.

## Entrega

[checklist-entrega.md](../appendices/checklist-entrega.md)
