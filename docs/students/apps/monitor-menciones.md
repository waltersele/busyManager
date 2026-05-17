# App: Monitor de menciones (`monitor-menciones`)

## De qué va

El negocio configura su nombre comercial y tu app avisa cuando aparece en la web o en resultados relevantes. No es un CRM: es oído temprano para reseñas en foros, noticias locales o comparativas.

Gratis en el catálogo.

**Carpeta:** `apps/module-monitor-menciones/` (nueva).

## Lecturas

[crear-una-app.md](../crear-una-app.md), [modules/monitor-menciones.md](../modules/monitor-menciones.md).

## MVP orientativo

1. Nombre a vigilar desde settings del negocio.
2. Fuente en MVP: búsqueda simulada, RSS o API que documentes (no hace falta cubrir toda la web).
3. Guardar menciones nuevas en BD propia.
4. `notify` + opcional `webhooks.emit('mention.detected', …)`.
5. Panel o solo runtime con últimas menciones.

## Arranque

Activa la app (gratis), key, primer job de prueba.
