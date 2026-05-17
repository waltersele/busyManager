# App: Reseñas Google (`resenas-gmb`)

## De qué va

Tu app mira las reseñas del negocio en Google Business Profile, prepara respuestas con IA y las publica **solo cuando toca**. Las de 1 a 3 estrellas **no salen a Google** hasta que alguien las aprueba en tu panel.

El cliente gana tiempo en las buenas y control en las malas, sin pelear en público ni publicar tonterías generadas por máquina.

**Carpeta:** `apps/module-resenas-gmb/` (ya hay un esqueleto con `pnpm ping`).

## Lecturas

Entorno, SDK, settings, panel y estilos: [00](../00-inicio-rapido.md) → [03](../03-contrato-matriz.md) → [05](../05-panel-y-ux.md) → [06](../06-guia-estilos.md).  
Detalle técnico: [modules/resenas-gmb.md](../modules/resenas-gmb.md).

Patrón de integración: `apps/module-web-uptime` (no copies la lógica de uptime).

## MVP (lo mínimo para entregar)

1. Worker que pase `subscriptions.check('resenas-gmb')` y `auth.check()`.
2. Tres reseñas de prueba en tu BD (1★, 3★, 5★) si aún no tienes API de Google.
3. Borrador de respuesta con Gemini (`connections.get('gemini')` + tokens).
4. **Regla fija:** ≤3★ → no hay llamada de publicación sin `approved_by` y fecha en BD.
5. `notify` cuando entre una reseña mala.
6. `webhooks.emit('review.negative', …)` al crear borrador ≤3★.
7. Panel en un puerto tipo 4001: cola de aprobación, botón «Publicar» deshabilitado hasta aprobar.

## Si te da tiempo

OAuth real de Google Business, auto-publicar 4–5★ si el negocio lo tiene activado en settings, publicar en Google tras aprobar, webhook `review.reply.published`.

## Reglas que no se negocian

No publiques 1–3★ sin aprobación humana registrada. Respuestas empáticas, sin inventar lo que pasó en la visita ni prometer compensaciones raras.

## Cómo arrancar hoy

```powershell
git clone https://github.com/walperezdev/busymanager.git
cd busymanager
pnpm install
cd docker && docker compose up -d
cd ..
copy apps\matrix-web\.env.local.example apps\matrix-web\.env.local
pnpm dev:web
```

Login demo → Karting Valencia → Configuración → Apps → **Reseñas Google** → Activar → key en `apps/module-resenas-gmb/.env` → `pnpm ping`.

## Entrega

[checklist-entrega.md](../appendices/checklist-entrega.md)
