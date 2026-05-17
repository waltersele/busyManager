# Asignación — Julio · SEO Pipeline / WordPress (`seo-pipeline`)

**Alumno:** Julio  
**Módulo:** Publicación automática de artículos en WordPress **con aprobación humana**  
**Slug en La Matriz:** `seo-pipeline`  
**Carpeta de trabajo:** `apps/module-seo-pipeline/`

---

## Objetivo

Construir un pipeline que genere artículos SEO con IA, los cree como **borrador** en WordPress, notifique al responsable y **solo publique** tras aprobación explícita, dejando auditoría con hash SHA-256 del contenido aprobado. **Nunca** publiques directamente sin pasar por el flujo de aprobación.

## Valor para el cliente PYME

El negocio mantiene un blog activo sin riesgo de contenido publicado sin revisar: cada artículo pasa por preview, aprobación y trazabilidad legal/técnica.

---

## Lecturas obligatorias (en este orden)

1. [01 — Entorno y activación](../01-entorno-y-activacion.md)
2. [02 — Anatomía de un módulo](../02-anatomia-de-un-modulo.md)
3. [03 — Contrato con La Matriz (SDK)](../03-contrato-matriz.md)
4. [04 — Settings y configuración](../04-settings-y-config.md)
5. [05 — Panel y experiencia de usuario](../05-panel-y-ux.md)
6. [06 — Guía de estilos](../06-guia-estilos.md) — **obligatoria** (panel de aprobación)
7. Ficha técnica: [modules/seo-pipeline.md](../modules/seo-pipeline.md)
8. Apéndices: [provider-connections](../appendices/provider-connections.md), [eventos-webhook](../appendices/eventos-webhook.md), [checklist-entrega](../appendices/checklist-entrega.md)

**Referencia de código:** `apps/module-web-uptime` (patrón SDK + worker).

---

## Alcance de tu entrega

### Fase MVP (obligatoria)

| # | Requisito |
|---|-----------|
| 1 | Carpeta `apps/module-seo-pipeline` con README, `.env.example`, scripts documentados |
| 2 | Scheduler o comando manual que ejecute el pipeline |
| 3 | Generación de artículo (título + cuerpo + meta) con **Gemini** + `tokens.check` / `consume` con `reference: article-{id}` |
| 4 | Tablas `articles` y `content_approvals` en BD propia |
| 5 | **Simulación WordPress** en MVP: flag local `wp_post_id` / `status` sin llamar a WP real, O crear draft real si tienes WP de prueba |
| 6 | Cálculo y guardado de **SHA-256** del contenido exacto al aprobar |
| 7 | **Sin publish** hasta fila en `content_approvals` con `approved_at` no nulo |
| 8 | Si el contenido cambia tras aprobar → invalidar aprobación y exigir re-aprobar |
| 9 | **Panel web** (puerto libre, ej. `4002`): listar borradores pendientes + Aprobar / Rechazar |
| 10 | `matrix.notify` — «Borrador listo para revisar» |
| 11 | `matrix.webhooks.emit('article.draft_ready', …)` |

### Fase completa (si el tiempo lo permite)

| # | Requisito |
|---|-----------|
| 12 | WordPress REST: `POST /wp-json/wp/v2/posts` con `status: draft` |
| 13 | Tras aprobar: `POST` con `status: publish` |
| 14 | Email con enlace de preview (Mailpit en dev) |
| 15 | Cadencias `daily` / `weekly` / `biweekly` según settings |
| 16 | Webhook `article.published` |

---

## Reglas de negocio (innegociables)

> **NUNCA** llames a WordPress con `status: publish` sin registro en `content_approvals` con `approved_at` no nulo.  
> El hash debe calcularse sobre el HTML/markdown **exacto** que se publica.  
> Si el contenido cambia tras la preview, invalidar aprobación y pedir re-aprobar.

En el panel, «Publicar en WordPress» solo activo si el hash del contenido actual coincide con el aprobado.

---

## Stack recomendado

| Capa | Sugerencia |
|------|------------|
| Runtime | Node 20 + TypeScript |
| Scheduler | `node-cron` o script + Task Scheduler |
| API + panel | Express o Fastify |
| BD | MySQL o SQLite |
| WordPress | REST API + Application Password |
| IA | Gemini vía Provider Connection |
| Estilos | [06-guia-estilos](../06-guia-estilos.md) / [panel-base.css](../assets/panel-base.css) |

### WordPress de prueba (local)

Puedes usar [Local WP](https://localwp.com/), Docker `wordpress` o un sitio staging. En **Integraciones** del dashboard (o Provider Connection) guarda:

```json
{
  "site_url": "https://tu-sitio.test",
  "username": "admin",
  "application_password": "xxxx xxxx xxxx xxxx"
}
```

Documentación: [WordPress Application Passwords](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/).

---

## Arranque rápido

```powershell
git clone https://github.com/walperezdev/busymanager.git
cd busymanager
pnpm install

cd docker
docker compose up -d

copy apps\matrix-web\.env.local.example apps\matrix-web\.env.local
pnpm dev:web
```

1. Login: `orgadmin@karting.demo` / `password`
2. Negocio: **Karting Valencia**
3. **Tienda** → activar **SEO Pipeline** → copiar `MODULE_API_KEY`
4. **Integraciones** → `wordpress`, `gemini`, `email`
5. **Configuración** → completar `web.url` e identidad del negocio

```powershell
cd apps\module-seo-pipeline
copy .env.example .env
pnpm install
pnpm ping
```

---

## Variables de entorno (`apps/module-seo-pipeline/.env`)

| Variable | Descripción |
|----------|-------------|
| `MATRIX_API_URL` | `http://localhost:8080` |
| `MODULE_API_KEY` | `bm_...` del dashboard |
| `DATABASE_URL` | BD del módulo |
| `PANEL_PORT` | Ej. `4002` |
| `WP_*` | Solo dev si no usas Provider Connection aún |

---

## Modelo de datos

Ver [modules/seo-pipeline.md](../modules/seo-pipeline.md):

- `articles` — borradores generados, `wp_post_id`, `preview_url`, `status`
- `content_approvals` — `approved_by`, `approved_at`, `approver_ip`, `content_hash_sha256`

### Hash (obligatorio)

```typescript
import { createHash } from 'crypto';

const hash = createHash('sha256').update(contentExacto, 'utf8').digest('hex');
```

Guarda `contentExacto` en BD al momento de aprobar.

---

## WordPress REST

**Crear borrador:**

```http
POST {site_url}/wp-json/wp/v2/posts
Authorization: Basic base64(username:application_password)
Content-Type: application/json

{
  "title": "...",
  "content": "...",
  "status": "draft",
  "categories": [5]
}
```

**Publicar (solo tras aprobación):**

```http
POST {site_url}/wp-json/wp/v2/posts/{id}
{ "status": "publish" }
```

Credenciales: `matrix.connections.get('wordpress')`.

---

## Settings del módulo

`ctx.settings.modules['seo-pipeline']`:

```json
{
  "cadence": "weekly",
  "day_of_week": 1,
  "topics": ["mantenimiento", "servicios locales"],
  "min_words": 800,
  "wp_category_id": 5,
  "approver_emails": ["dueno@negocio.com"]
}
```

`cadence`: `daily` | `weekly` | `biweekly`

Settings globales: `web.url`, `web.language`, `identity.trade_name`.

---

## Integración SDK (resumen)

| Método | Uso |
|--------|-----|
| `subscriptions.check('seo-pipeline')` | Scheduler |
| `connections.get('wordpress')` | REST WP |
| `connections.get('gemini')` | Redacción |
| `tokens.check(2000)` / `consume` | Ajustar por artículo real |
| `notify` | Borrador listo |
| `webhooks.emit` | `article.draft_ready`, `article.published` |

---

## Panel de aprobación (UI)

Pantallas mínimas:

1. **Lista de borradores** con estado, fecha, título, enlace preview.
2. **Vista detalle** con contenido renderizado (markdown/HTML).
3. **Aprobar** → guarda hash + auditoría → publica (o simula en MVP).
4. **Rechazar** → motivo opcional.
5. Aviso si el contenido fue editado tras la preview (hash no coincide).

Sigue [06-guia-estilos.md](../06-guia-estilos.md).

---

## Demo de 5 minutos (para la entrega)

1. Login dashboard → activar SEO Pipeline y configurar integraciones.
2. Ejecutar pipeline una vez → artículo en BD + borrador (WP o simulado).
3. Abrir panel → mostrar pendiente de aprobación.
4. Intentar publicar sin aprobar → debe fallar o estar bloqueado.
5. Aprobar → hash guardado → publish → webhook + Mailpit.

---

## Entrega

- Rama `feature/julio-seo-pipeline` o PR con README completo.
- [checklist-entrega](../appendices/checklist-entrega.md) marcado.
- Indicar MVP vs completo y URL de WordPress de prueba si aplica.

**Dudas:** canal acordado con el profesor · Repo: [github.com/walperezdev/busymanager](https://github.com/walperezdev/busymanager) · Inicio: [00-inicio-rapido.md](../00-inicio-rapido.md)
