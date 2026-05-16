# 05 — Panel y experiencia de usuario

El dashboard **matrix-web** es el panel del `org_admin`. Tu módulo puede coexistir de tres formas.

## 1. Solo worker (sin UI)

Adecuado para **web-uptime** o **monitor-menciones** en MVP:

- El cliente activa el módulo y configura URL/nombre en **Configuración** del dashboard.
- Tu worker hace el trabajo; alertas vía `matrix.notify` y leads si aplica.
- Historial opcional en API REST del módulo (enlace en email o doc).

## 2. Enlace desde la ficha de la app

Cuando el módulo está activo, matrix-web muestra la landing en `/dashboard/apps/{slug}`. Hoy es genérica; el alumno puede:

- Documentar en README la URL de su panel: `http://localhost:4000/admin?business={id}`.
- En entregables, añadir botón «Abrir panel del módulo» en la descripción de la app (PR futuro a matrix-web).

## 3. Panel embebido (iframe)

Tu API sirve una UI en `/embed` que matrix-web cargaría en iframe (integración futura). Requisitos:

- CORS configurado para el origen del dashboard.
- Autenticación: token de un solo uso generado por tu API tras validar sesión Matriz (patrón recomendado en proyecto final).

## 4. App web independiente

Para **digital-signage**, **menu-dinamico**, **seo-pipeline**:

- Panel admin en tu dominio/puerto.
- Player público sin auth de La Matriz (`/play/{token}`).
- Login del encargado: email mágico o cuenta local ligada a `business_id`.

## Qué ve el cliente en La Matriz hoy

| Pantalla | Uso |
|----------|-----|
| Tienda / Catálogo | Activar módulo |
| App activa | Ver estado, API key (una vez) |
| Configuración | Datos del negocio compartidos |
| Integraciones | Provider Connections |
| Leads | Leads creados por tu módulo vía SDK |
| Webhooks | Eventos que emites con `webhooks.emit` |

## Buenas prácticas de UX

- Mensajes de error claros si falta `web.url` o conexión Gemini.
- Estados visibles: «Última comprobación hace 5 min», «3 borradores pendientes de aprobación».
- No pidas al usuario repetir datos que ya están en settings del negocio.
- Móvil-first para módulos que el encargado usa en el local (menú, signage).

## Siguiente paso

Elige tu módulo en [modules/](modules/) y sigue su ficha técnica.
