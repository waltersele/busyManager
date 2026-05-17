# App: WhatsApp Guardia (`whatsapp-guardia`)

## De qué va

Fuera de horario el negocio sigue recibiendo WhatsApp. Tu app responde con lo que el cliente tiene en documentos (servicios, FAQs, precios orientativos) y, si no puede cerrar la consulta, deja datos para que el equipo responda al día siguiente.

Sin inventar plazos ni prometer lo que el negocio no puede cumplir.

**Carpeta:** `apps/module-whatsapp-guardia/` (la creas tú; ver [crear-una-app.md](../crear-una-app.md)).

## Lecturas

[crear-una-app.md](../crear-una-app.md), [03-contrato-matriz.md](../03-contrato-matriz.md), [modules/whatsapp-guardia.md](../modules/whatsapp-guardia.md).

## MVP orientativo

1. Recibir mensaje (webhook simulado o API Meta en fase 2).
2. Cargar contexto del negocio vía `auth.check()` / settings.
3. Respuesta con Gemini + control de tokens.
4. Si la confianza es baja o pide humano → `leads.create` o registro en tu BD + `notify`.
5. Horario: solo actuar fuera de `business_hours` en settings (o flag en config del módulo).

## Cuidado con

Meta WhatsApp y RGPD: en MVP puedes simular conversaciones en JSON; documenta qué harías en producción.

## Arranque

Activa **WhatsApp Guardia** en el dashboard, key en `.env`, `pnpm ping` cuando tengas el esqueleto.
