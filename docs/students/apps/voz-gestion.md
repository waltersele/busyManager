# App: Voz a gestión (`voz-gestion`)

## De qué va

Llegan audios por WhatsApp al taller, clínica o tienda. Tu app transcribe, saca tareas («llamar a X», «pedir pieza Y») y las deja apuntadas para el equipo. Menos «eso lo comentó el jefe en un audio y se olvidó».

**Carpeta:** `apps/module-voz-gestion/` (nueva).

## Lecturas

[crear-una-app.md](../crear-una-app.md), [modules/voz-gestion.md](../modules/voz-gestion.md).

## MVP orientativo

1. Entrada: audio simulado o webhook de mensaje de voz.
2. Transcripción (Gemini o proveedor de speech vía connection).
3. Extracción de tareas estructuradas (JSON) en tu BD.
4. Panel simple: lista de tareas pendientes / hechas.
5. `notify` al responsable si hay tarea urgente (palabra clave en settings).

## Arranque

Activa **Voz a gestión** en Apps, configura key, prueba con un audio de ejemplo en local.
