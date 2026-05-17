# App: Detector de enlaces rotos (`enlaces-rotos`)

## De qué va

Rastreas la web del negocio, detectas enlaces que fallan y priorizas qué arreglar. También vigilas posiciones de keywords que el cliente defina (lo que antes sería una app de «alerta SEO» aparte; aquí va junto).

App **gratis** en el catálogo: buen módulo para practicar crawler + informes sin IA obligatoria.

**Carpeta:** `apps/module-enlaces-rotos/` (nueva).

## Lecturas

[crear-una-app.md](../crear-una-app.md), [modules/enlaces-rotos.md](../modules/enlaces-rotos.md).

## MVP orientativo

1. URL semilla desde `settings.web.url`.
2. Crawl acotado (profundidad, mismo dominio).
3. Lista de rotos con código HTTP y página origen.
4. `runtime.publish` con resumen para el panel (total rotos, último scan).
5. Opcional: comparar ranking de 2–3 keywords y `notify` si caen X posiciones.

## Arranque

Activa la app en Configuración → Apps (gratis). Key + worker periódico o comando manual.
