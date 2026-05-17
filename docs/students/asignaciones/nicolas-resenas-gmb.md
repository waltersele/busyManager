# Asignación — Nicolás · Reseñas GMB (`resenas-gmb`)

**Alumno:** Nicolás  
**Módulo:** Respuestas automáticas a reseñas de Google Business  
**Slug en La Matriz:** `resenas-gmb`  
**Carpeta de trabajo:** `apps/module-resenas-gmb/`

---

## Objetivo

Construir una aplicación que monitorice las reseñas del negocio en Google Business Profile, genere respuestas con IA y las publique **solo cuando las reglas de negocio lo permitan**. Las reseñas negativas (1–3 estrellas) **nunca** se publican sin aprobación humana explícita.

## Valor para el cliente PYME

El dueño del negocio agradece reseñas positivas con rapidez y controla con calma las críticas, sin discutir en público ni publicar respuestas inadecuadas generadas por IA.

---

## Lecturas obligatorias (en este orden)

1. [01 — Entorno y activación](../01-entorno-y-activacion.md)
2. [02 — Anatomía de un módulo](../02-anatomia-de-un-modulo.md)
3. [03 — Contrato con La Matriz (SDK)](../03-contrato-matriz.md)
4. [04 — Settings y configuración](../04-settings-y-config.md)
5. [05 — Panel y experiencia de usuario](../05-panel-y-ux.md)
6. [06 — Guía de estilos](../06-guia-estilos.md) — **obligatoria** (panel de aprobación)
7. Ficha técnica: [modules/resenas-gmb.md](../modules/resenas-gmb.md)
8. Apéndices: [provider-connections](../appendices/provider-connections.md), [eventos-webhook](../appendices/eventos-webhook.md), [checklist-entrega](../appendices/checklist-entrega.md)

**Referencia de código:** `apps/module-web-uptime` (worker + SDK), **no** copies su lógica; úsalo solo como patrón de integración.

---

## Alcance de tu entrega

### Fase MVP (obligatoria)

| # | Requisito |
|---|-----------|
| 1 | Carpeta `apps/module-resenas-gmb` con README, `.env.example`, scripts documentados |
| 2 | Worker o job que llame a `matrix.subscriptions.check('resenas-gmb')` y `matrix.auth.check()` |
| 3 | Import de **3 reseñas mock** (1★, 3★, 5★) en BD propia del módulo |
| 4 | Generación de borrador de respuesta con **Gemini** vía `connections.get('gemini')` + `tokens.check` / `consume` |
| 5 | **Bloqueo:** reseñas ≤3★ no llaman a API de publicación hasta existir `approved_by` + `approved_at` en BD |
| 6 | `matrix.notify` cuando llega reseña negativa |
| 7 | `matrix.webhooks.emit('review.negative', …)` al crear borrador de reseña ≤3★ |
| 8 | **Panel web** (puerto libre, ej. `4001`) con cola de aprobación y guía de estilos BusyManager |

### Fase completa (si el tiempo lo permite)

| # | Requisito |
|---|-----------|
| 9 | OAuth / API real de Google Business Profile |
| 10 | Publicación automática en 4–5★ si `positive_auto_publish: true` en settings |
| 11 | Publicación en Google tras aprobar en panel (reseñas ≤3★) |
| 12 | Webhook `review.reply.published` al publicar |

---

## Reglas de negocio (innegociables)

> **NUNCA** publiques una respuesta a reseña de **1–3 estrellas** sin `approved_by` y fecha de aprobación en base de datos.  
> Las respuestas deben ser empáticas, sin discutir con el cliente ni ofrecer compensaciones no autorizadas.  
> No inventes hechos sobre la visita del cliente.

En el panel, el botón «Publicar en Google» debe estar **deshabilitado** hasta cumplir la regla anterior.

---

## Stack recomendado

| Capa | Sugerencia |
|------|------------|
| Runtime | Node 20 + TypeScript |
| Worker | `tsx` + cron o `scheduler.ts` |
| API + panel | Express o Fastify |
| BD | MySQL o SQLite en desarrollo |
| IA | Gemini vía Provider Connection |
| Estilos | Tailwind o [panel-base.css](../assets/panel-base.css) |

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
3. **Tienda** → activar **Reseñas GMB** → copiar `MODULE_API_KEY`
4. **Integraciones** → configurar `gemini` (y `google_business` cuando llegues a fase completa)
5. En tu módulo:

```powershell
cd apps\module-resenas-gmb
copy .env.example .env
# Editar MODULE_API_KEY
pnpm install
pnpm ping
```

---

## Variables de entorno (`apps/module-resenas-gmb/.env`)

| Variable | Descripción |
|----------|-------------|
| `MATRIX_API_URL` | `http://localhost:8080` |
| `MODULE_API_KEY` | `bm_...` del dashboard |
| `DATABASE_URL` | Conexión a tu BD del módulo |
| `PANEL_PORT` | Puerto del panel (ej. `4001`) |
| `GOOGLE_*` | Solo en dev local si no usas Provider Connection aún |

---

## Modelo de datos

Implementa al menos las tablas descritas en [modules/resenas-gmb.md](../modules/resenas-gmb.md):

- `reviews` — reseñas importadas
- `responses` — textos generados / publicados
- `approval_queue` — cola con `approved_by`, `approved_at`, `status`

Todas las tablas: `organization_id` + `business_id` (desde `auth.check()`, no hardcodeados).

---

## Settings del módulo

Lee desde `ctx.settings.modules['resenas-gmb']` (ver [04-settings](../04-settings-y-config.md)):

```json
{
  "location_id": "accounts/xxx/locations/yyy",
  "positive_auto_publish": false,
  "tone": "profesional_cercano",
  "language": "es"
}
```

Settings globales del negocio: `identity.trade_name`, `contact.public_email`.

---

## Integración SDK (resumen)

| Método | Uso |
|--------|-----|
| `subscriptions.check('resenas-gmb')` | Inicio de cada job |
| `connections.get('google_business')` | API reseñas (fase completa) |
| `connections.get('gemini')` | Generar respuesta |
| `tokens.check(1)` / `consume({ reference: 'review-{id}' })` | Por cada respuesta IA |
| `notify` | Alerta reseña negativa |
| `webhooks.emit` | `review.negative`, `review.reply.published` |

---

## Panel de aprobación (UI)

Pantallas mínimas:

1. **Dashboard:** contadores (pendientes, publicadas hoy, errores).
2. **Cola:** tabla con estrellas, extracto del comentario, estado, acciones.
3. **Detalle:** respuesta generada, botones Aprobar / Rechazar, regla visible para ≤3★.

Sigue [06-guia-estilos.md](../06-guia-estilos.md).

---

## Demo de 5 minutos (para la entrega)

1. Login en http://localhost:3000 → Karting Valencia.
2. Módulo activo y API key configurada en `.env`.
3. Ejecutar worker una vez → mostrar 3 reseñas mock en BD.
4. Mostrar reseña 2★ en panel: botón publicar deshabilitado.
5. Aprobar manualmente → publicación (mock o API) y webhook/notify en Mailpit http://localhost:8025.

---

## Entrega

- Pull request o rama `feature/nicolas-resenas-gmb` con README actualizado.
- Marcar [checklist-entrega](../appendices/checklist-entrega.md).
- Indicar qué fase completaste (MVP / completo).

**Dudas:** canal acordado con el profesor · Repo: [github.com/walperezdev/busymanager](https://github.com/walperezdev/busymanager) · Inicio: [00-inicio-rapido.md](../00-inicio-rapido.md)
