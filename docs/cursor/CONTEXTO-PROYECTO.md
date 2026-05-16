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
- **AppSidebar**: categorías; solo apps `active` en menú; «Explorar categoría» → catálogo
- **Configuración** (`/dashboard/settings`): pestañas Negocio, Identidad, Web, Fiscal, Contacto
- **Tienda** (`/dashboard/catalog`): todas las apps; gratis vs de pago
- **Landing** (`/dashboard/apps/[slug]`)

### SDK y módulo referencia

- `packages/matrix-sdk` — tests vitest
- `apps/module-web-uptime` — lee `settings.web.url`

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
| Settings | `apps/matrix-web/src/app/dashboard/settings/page.tsx` |
| Catálogo | `apps/matrix-web/src/app/dashboard/catalog/page.tsx` |
| Landing app | `apps/matrix-web/src/app/dashboard/apps/[slug]/page.tsx` |
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
