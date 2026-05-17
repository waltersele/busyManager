# Arquitectura BusyManager

## Jerarquía multitenant

```
Agencia (superadmin)
  └── Organización (cliente)
        ├── Negocio A
        │     ├── Módulos activos (suscripciones)
        │     ├── Provider connections (negocio)
        │     └── Leads, webhooks, alertas
        └── Negocio B
              └── ...
```

## Infraestructura transversal (solo en La Matriz)

- **Auth** — Sanctum JWT + OAuth Socialite
- **Provider Connections** — Cofre cifrado; herencia org → negocio en lectura
- **Token budget** — Pool por organización; `check` / `consume` vía SDK
- **LeadWorkbench** — Leads + timeline de eventos
- **Webhooks** — Dispatcher con reintentos
- **Centro de alertas** — Email (Resend/SMTP) + registro in-app

## Roles

| Rol | Ámbito |
|-----|--------|
| superadmin | Agencia |
| org_admin | Toda la organización |
| manager | Un negocio |
| agent | Leads asignados en un negocio |
| viewer | Solo lectura en un negocio |
| module (API key) | SDK; sin panel web |

## Contrato SDK

Los módulos **no** acceden a MySQL de la Matriz. Usan `@busymanager/matrix-sdk`:

- `matrix.auth.check()` — contexto del token
- `matrix.subscriptions.check(slug)`
- `matrix.connections.get(provider)`
- `matrix.tokens.check(n)` / `consume({...})`
- `matrix.leads.create|update|event`
- `matrix.webhooks.emit(event, data)`
- `matrix.notify(channel, msg)`

El `organization_id` y `business_id` vienen del JWT del módulo; el SDK no permite sobrescribirlos.

## Categorías de módulos (catálogo visible)

Las apps con `catalog_visible = false` no aparecen en Mi suite ni en Configuración → Apps (legado absorbido u ocultas).

| Categoría | Apps visibles |
|-----------|----------------|
| **Social** | whatsapp-guardia, resenas-gmb, reputacion-multicanal, monitor-menciones |
| **Contenido** | seo-pipeline (incl. SEO on-page), enlaces-rotos (incl. alertas de posición) |
| **Gestión** | voz-gestion |
| **Monitorización** | web-uptime (disponibilidad + certificado SSL; slug único) |
| **Visual** | digital-signage, video-local, menu-dinamico (`is_available: false`, próximamente) |

**No en catálogo:** captación; monitor-ssl, seo-onpage, alerta-posicion-seo; presupuestos-wa, seguimiento-automatico, asignacion-zona; velocidad-carga, caida-trafico.

## Documentación para alumnos

Especificaciones por módulo, contrato SDK y checklists: [docs/students/README.md](students/README.md).
