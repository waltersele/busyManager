# Contexto del proyecto (Cursor / La Matriz)

Documento de continuidad para retomar el desarrollo en otro equipo. Historial de chat: [`chat/`](./chat/).

**Repo del curso:** https://github.com/walperezdev/busymanager (privado)

## Visión

**BusyManager / La Matriz**: SaaS multitenant para PYMEs. Los alumnos desarrollan apps en `apps/module-{slug}/` contra el SDK; no tocan la BD de Laravel.

```
Agencia → Organización → Negocio (módulos, settings, leads)
```

Dashboard: `apps/matrix-web` = panel **org_admin**. Demo: `orgadmin@karting.demo` / `password`, negocio **Karting Valencia**.

## Stack

Laravel 11 API · Next.js 15 web · `@busymanager/matrix-sdk` · MySQL · Redis · Mailpit · Docker en `docker/` (MySQL host **3307**, API **8080**).

## Catálogo de apps (visible)

| Categoría | Apps |
|-----------|------|
| Social | whatsapp-guardia, resenas-gmb, reputacion-multicanal, monitor-menciones |
| Contenido | seo-pipeline (incl. on-page), enlaces-rotos (incl. alertas posición) |
| Gestión | voz-gestion |
| Monitorización | web-uptime (uptime + SSL, gratis) |
| Visual | digital-signage, video-local, menu-dinamico (próximamente) |

Ocultas (`catalog_visible=false`): captación, monitor-ssl, seo-onpage, alerta-posicion-seo, resto gestión/monitorización retirados.

Seed unificado: `ModuleCatalogSeeder`. API sidebar: `SubscriptionController::appsSidebar` filtra visibles y omite categorías vacías.

## Implementado

- **Configuración** hub: `/dashboard/settings/*` (negocio, apps, integraciones, equipo, tokens)
- **Apps**: landing marketing, workspace, coming soon; `AppDiscoveryCard`, `WebUptimeDashboard`
- **Runtime**: `module_runtime_snapshots`, `matrix.runtime.publish`, KPIs SSL en web-uptime
- **Módulo referencia**: `apps/module-web-uptime` (ping, incidencias, SSL, notify)
- **Scaffolds curso**: `module-resenas-gmb`, `module-seo-pipeline`
- **Docs alumnos**: `docs/students/00-inicio-rapido.md`, `apps/`, `crear-una-app.md`, `mensajes-para-alumnos.md`

## Archivos clave

| Área | Ruta |
|------|------|
| Catálogo seed | `apps/matrix-api/database/seeders/ModuleCatalogSeeder.php` |
| Sidebar API | `apps/matrix-api/app/Http/Controllers/Org/SubscriptionController.php` |
| Settings / Apps UI | `apps/matrix-web/src/app/dashboard/settings/` |
| App por slug | `apps/matrix-web/src/app/dashboard/apps/[slug]/page.tsx` |
| Regla Cursor | `.cursor/rules/busymanager-context.mdc` |
| Compose | `docker/docker-compose.yml` |

## Continuar en Cursor

1. Clona `walperezdev/busymanager`, abre en Cursor.
2. La regla `.cursor/rules/busymanager-context.mdc` se aplica sola.
3. Lee este archivo + `docs/students/README.md` según la tarea.
4. Chat histórico: `docs/cursor/chat/*.jsonl` (export JSONL de sesiones anteriores).

## Pendiente habitual

- Push desde máquina con cuenta `walperezdev` si `origin` falla con `waltersele`
- Más módulos alumno según asignación en `docs/students/apps/`
- Superadmin agencia, OAuth prod, CI/CD
