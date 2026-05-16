# 03 — Contrato con La Matriz (SDK)

La API de módulos está en `/api/v1/matrix/*`. El paquete `@busymanager/matrix-sdk` envía el header `X-Module-Key` en cada petición.

Código fuente: [packages/matrix-sdk/src/client.ts](../../packages/matrix-sdk/src/client.ts).

## Inicialización

```typescript
import { createMatrixClient } from '@busymanager/matrix-sdk';

export const matrix = createMatrixClient({
  baseUrl: process.env.MATRIX_API_URL ?? 'http://localhost:8080',
  moduleKey: process.env.MODULE_API_KEY!,
});
```

## Métodos disponibles

| Método | Cuándo usarlo |
|--------|----------------|
| `matrix.auth.check()` | Al inicio de cada job: `organization_id`, `business_id`, `module_slug`, `settings` del negocio |
| `matrix.subscriptions.check(slug)` | Verificar que el negocio tiene tu módulo activo; lanza si no |
| `matrix.connections.get(provider)` | Obtener credenciales cifradas (Gemini, Meta, WordPress, email…) |
| `matrix.connections.list()` | Listar conexiones disponibles para el negocio/org |
| `matrix.tokens.check(amount)` | Antes de llamar a un LLM; lanza si saldo insuficiente |
| `matrix.tokens.consume({ amount, module, reference })` | Tras usar IA; `reference` = id de operación para auditoría |
| `matrix.leads.create(payload)` | Crear lead en el workbench transversal |
| `matrix.leads.update(id, payload)` | Actualizar lead existente |
| `matrix.leads.event(id, type, data)` | Añadir evento al timeline del lead |
| `matrix.webhooks.emit(event, data)` | Notificar sistemas externos del negocio |
| `matrix.notify(channel, { title, body, severity?, meta? })` | Alertas (email vía `alert_center`, etc.) |

## Respuesta de `auth.check()`

```typescript
interface MatrixContext {
  organization_id: number;
  business_id: number;
  module_slug?: string;
  settings?: Record<string, unknown>;
}
```

`settings` incluye la estructura del negocio (`identity`, `web`, `fiscal`, `contact`) y, si existe, `monitor_url` legacy. Para la URL web usa preferentemente `settings.web.url`. Ver [04-settings-y-config.md](04-settings-y-config.md).

## Errores tipados

| Error | HTTP | Significado |
|-------|------|-------------|
| `ModuleNotSubscribedError` | 403 | Módulo no activo para este negocio |
| `InsufficientTokensError` | 402 | Sin créditos IA en la organización |
| `MatrixError` | otros | Mensaje genérico de la API |

Trata estos errores en logs; no reintentes consumo de tokens si falló `check`.

## Ejemplo: crear un lead

```typescript
await matrix.leads.create({
  source: 'whatsapp-guardia',
  status: 'new',
  contact_name: 'María López',
  contact_email: 'maria@example.com',
  contact_phone: '+34600111222',
  intent: 'consulta_fuera_horario',
  data: {
    message_preview: '¿Abrís el domingo?',
    escalated_at: new Date().toISOString(),
  },
});
```

## Ejemplo: alerta + webhook

```typescript
await matrix.notify('alert_center', {
  title: 'Reseña negativa en Google',
  body: 'Nueva reseña de 2 estrellas. Requiere aprobación antes de responder.',
  severity: 'warning',
  meta: { review_id: 'abc123' },
});

await matrix.webhooks.emit('review.negative', {
  rating: 2,
  review_id: 'abc123',
});
```

## Consumo de tokens (IA)

```typescript
const estimatedTokens = 800;
await matrix.tokens.check(estimatedTokens);

// ... llamada a Gemini/OpenAI ...

await matrix.tokens.consume({
  amount: estimatedTokens,
  module: 'resenas-gmb',
  reference: `review-reply-${reviewId}`,
});
```

El pool es **por organización**, compartido entre todos los módulos activos.

## Lo que La Matriz NO expone (hoy)

Implementa en **tu** módulo:

- Subida y almacenamiento de PDFs/documentos.
- Colas de aprobación con UI propia.
- Publicación en WordPress (usa REST con credenciales de `connections.get('wordpress')`).
- CRUD de incidencias, menús, pantallas, vídeos.

Contrato futuro posible (no disponible aún): endpoints centralizados de aprobaciones o assets. No esperes a que existan para entregar el MVP.

## Siguiente paso

[04 — Settings y configuración](04-settings-y-config.md)
