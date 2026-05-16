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

## Categorías de módulos (catálogo)

1. Captación — lead-router, form-builder, form-detector
2. Social — whatsapp-guardia, resenas-gmb, reputacion-multicanal, monitor-menciones
3. Contenido — seo-onpage, seo-pipeline, enlaces-rotos, alerta-posicion-seo
4. Gestión — voz-gestion, presupuestos-wa, seguimiento-automatico, asignacion-zona
5. Monitorización — web-uptime, monitor-ssl, velocidad-carga, caida-trafico
6. Visual — digital-signage, video-local, menu-dinamico (en desarrollo)

## Documentación para alumnos

Especificaciones por módulo, contrato SDK y checklists: [docs/students/README.md](students/README.md).
