# Guía rápida: módulos alumno

Documentación completa para alumnos: **[docs/students/README.md](students/README.md)**

Asignaciones actuales: [docs/students/asignaciones/](students/asignaciones/) · Guía de estilos: [06-guia-estilos.md](students/06-guia-estilos.md)

## Reglas (resumen)

1. **Nunca** accedas a la base de datos de La Matriz.
2. Usa `@busymanager/matrix-sdk` con `MODULE_API_KEY`.
3. Credenciales de terceros vía `matrix.connections.get()`, no en tu `.env` de producción.
4. IA solo tras `matrix.tokens.check()` + `matrix.tokens.consume()`.

## Activación

1. Dashboard → Tienda / Catálogo → **Añadir a mi suite**.
2. Copia `MODULE_API_KEY` (una sola vez).
3. Configura `MATRIX_API_URL` y `MODULE_API_KEY` en tu módulo.

## Referencia: web-uptime

```bash
cd apps/module-web-uptime
cp .env.example .env
pnpm install
pnpm check    # una comprobación
pnpm start    # cada 5 minutos
```

Lee la URL en `settings.web.url` (Dashboard → Configuración). El código de referencia está en `apps/module-web-uptime/src/check.ts`.

## SDK (métodos principales)

| Método | Uso |
|--------|-----|
| `matrix.auth.check()` | Contexto org/negocio/settings |
| `matrix.subscriptions.check(slug)` | ¿Módulo activo? |
| `matrix.connections.get(provider)` | Credenciales |
| `matrix.tokens.check(n)` / `consume(...)` | Presupuesto IA |
| `matrix.leads.create(...)` | Lead Workbench |
| `matrix.webhooks.emit(event, data)` | Webhooks del negocio |
| `matrix.notify(channel, { title, body })` | Alertas |

Detalle: [docs/students/03-contrato-matriz.md](students/03-contrato-matriz.md).

## Catálogo activo (slugs visibles)

Social, Contenido (`seo-pipeline`, `enlaces-rotos`), Gestión (`voz-gestion`), Monitorización (`web-uptime` con SSL), Visual (próximamente). No desarrollar como apps separadas: `monitor-ssl`, `seo-onpage`, `alerta-posicion-seo`, captación ni el resto de gestión/monitorización retirados.

## Módulos del curso

| Slug | Documentación |
|------|----------------|
| `web-uptime` | [modules/web-uptime.md](students/modules/web-uptime.md) |
| `enlaces-rotos` | [modules/enlaces-rotos.md](students/modules/enlaces-rotos.md) |
| `resenas-gmb` | [modules/resenas-gmb.md](students/modules/resenas-gmb.md) |
| `whatsapp-guardia` | [modules/whatsapp-guardia.md](students/modules/whatsapp-guardia.md) |
| `voz-gestion` | [modules/voz-gestion.md](students/modules/voz-gestion.md) |
| `seo-pipeline` | [modules/seo-pipeline.md](students/modules/seo-pipeline.md) |
| `monitor-menciones` | [modules/monitor-menciones.md](students/modules/monitor-menciones.md) |
| `digital-signage` | [modules/digital-signage.md](students/modules/digital-signage.md) |
| `menu-dinamico` | [modules/menu-dinamico.md](students/modules/menu-dinamico.md) |
| `video-local` | [modules/video-local.md](students/modules/video-local.md) |
