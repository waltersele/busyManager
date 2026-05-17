# Contexto del proyecto (Cursor / La Matriz)

Documento de continuidad para retomar el desarrollo en otro equipo. El historial completo del chat está en [`chat/`](./chat/).

## Visión

**BusyManager / La Matriz**: SaaS multitenant para PYMEs y formación de alumnos.

Jerarquía:

```
Agencia (superadmin)
  └── Organización (cliente)
        ├── Negocio A → módulos, conexiones, leads, settings
        └── Negocio B → ...
```

El **dashboard actual** (`apps/matrix-web`) es el panel **org_admin** (cliente), no el superadmin de agencia.

## Stack acordado

| Capa | Tecnología |
|------|------------|
| API / Matriz | Laravel 11, PHP 8.3, Sanctum |
| Dashboard web | Next.js 15, TypeScript, Tailwind |
| App móvil (futuro) | Flutter |
| Módulos alumno | Workers/apps + `@busymanager/matrix-sdk` |
| BD | MySQL 8 |
| Colas | Redis + Laravel Queues |
| Email dev | Mailpit |

Paquete npm: `@busymanager/*` (antes se planteó `@aiapps/*`).

## Qué vive solo en la Matriz

1. Organizaciones, usuarios, roles, multitenancy
2. Auth (Sanctum; OAuth previsto)
3. **Provider Connections** — cofre compartido por negocio/org
4. Suscripciones y módulos activos por negocio
5. **Token budget** — pool de créditos IA
6. **LeadWorkbench** — leads transversales
7. Webhooks de salida
8. Audit log y notificaciones

Los módulos de alumnos consumen la API vía SDK; no duplican auth ni datos de otras orgs.

## Categorías de módulos (catálogo producto)

1. Captación  
2. Social  
3. Contenido  
4. Gestión  
5. Infraestructura / técnico  
6. **Monitorización** (p. ej. salud web: uptime, SSL, velocidad)

Principio: herramientas **pequeñas**, vendibles por separado, que **integradas** dan valor PYME.

## MVP implementado (estado al commit inicial)

### API (`apps/matrix-api`)

- Migraciones: schema completo + pricing en `modules` (`is_free`, `price_monthly_cents`, `marketing_description`)
- Rutas: `/api/v1/auth`, `/org/*`, `/businesses/{id}/*`, `/matrix/*` (SDK)
- Servicios: settings, vault conexiones, tokens, leads, webhooks
- Endpoints UI: `apps-sidebar`, `settings`, `apps/{slug}`
- Seed: Karting demo — `orgadmin@karting.demo` / `password`

### Dashboard (`apps/matrix-web`)

- Tema claro, login dos columnas
- **AppSidebar**: todas las apps por categoría (activas + inactivas); Configuración como hub único
- **Configuración** (`/dashboard/settings/*`): Negocio, Apps, Integraciones, Equipo, Tokens IA
- **Apps** (`/dashboard/settings/apps`): grid `AppDiscoveryCard` sin precios en UI
- **Por app** (`/dashboard/apps/[slug]`): landing marketing si inactiva; workspace si activa (`web-uptime` con dashboard runtime)

### SDK y módulo referencia

- `packages/matrix-sdk` — tests vitest
- `apps/module-web-uptime` — incidencias, site.up/down, `runtime.publish`; gratis en catálogo
- API `module_runtime_snapshots` + `GET .../apps/{slug}/runtime`

### Docker (`docker/`)

- MySQL host **3307** (si 3306 ocupado), Redis, Mailpit, API, queue worker

## Decisiones técnicas recordadas

- Docker = solo desarrollo local, no requisito de producción
- Puerto API: `8080` en compose
- Errores login «Failed to fetch» → API no levantada; mensaje mejorado en UI
- Componentes animados: `motion` de framer-motion (evitar tags JSX mal escritos en TSX)

## Archivos clave

| Área | Ruta |
|------|------|
| Rutas API | `apps/matrix-api/routes/api.php` |
| Sidebar | `apps/matrix-web/src/components/AppSidebar.tsx` |
| Settings hub | `apps/matrix-web/src/app/dashboard/settings/` |
| Apps grid | `apps/matrix-web/src/app/dashboard/settings/apps/page.tsx` |
| App pages | `apps/matrix-web/src/app/dashboard/apps/[slug]/page.tsx` |
| Web uptime UI | `apps/matrix-web/src/components/apps/WebUptimeDashboard.tsx` |
| Compose | `docker/docker-compose.yml` |
| E2E manual | `scripts/e2e-validation.md` |

## Cómo usar este contexto en Cursor

1. Abre el repo clonado en Cursor.
2. La regla `.cursor/rules/busymanager-context.mdc` aplica automáticamente.
3. Para detalle del diálogo: `docs/cursor/chat/*.jsonl`.
4. Mockups del chat: `docs/cursor/assets/*.png`.

## Pendiente / siguientes pasos (no bloqueante MVP)

- UI superadmin agencia
- OAuth Google/Microsoft en producción
- Más módulos del catálogo (SSL, enlaces rotos, etc.)
- App Flutter campo
- CI/CD y despliegue
