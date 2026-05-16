# Catálogo de eventos webhook

Los módulos emiten eventos con `matrix.webhooks.emit(event, data)`. El negocio configura URLs en **Dashboard → Webhooks**.

Convención de nombres: `recurso.accion` en minúsculas.

## Eventos por módulo

| Módulo | Evento | Payload sugerido |
|--------|--------|------------------|
| web-uptime | `site.down` | `{ url, statusCode, detectedAt }` |
| web-uptime | `site.up` | `{ url, durationSeconds, endedAt }` |
| resenas-gmb | `review.positive` | `{ reviewId, rating, published }` |
| resenas-gmb | `review.negative` | `{ reviewId, rating, pendingApproval: true }` |
| resenas-gmb | `review.reply.published` | `{ reviewId, responseId }` |
| whatsapp-guardia | `whatsapp.escalated` | `{ leadId, phone, reason }` |
| voz-gestion | `work_report.created` | `{ reportId, technicianPhone }` |
| seo-pipeline | `article.draft_ready` | `{ wpPostId, title, previewUrl }` |
| seo-pipeline | `article.published` | `{ wpPostId, approvalId, contentHash }` |
| monitor-menciones | `mention.detected` | `{ url, source, snippet }` |
| menu-dinamico | `menu.updated` | `{ version, changedItems[] }` |
| digital-signage | `playlist.updated` | `{ screenId, playlistId }` |

## Ejemplo

```typescript
await matrix.webhooks.emit('site.down', {
  url: 'https://ejemplo.com',
  statusCode: 503,
  detectedAt: new Date().toISOString(),
});
```

## Buenas prácticas

- Payload JSON pequeño (< 10 KB).
- Incluir siempre `business_id` implícito (La Matriz lo conoce por el token del módulo).
- No enviar PII innecesaria en webhooks; el receptor puede llamar a tu API con el id.

## Prueba local

El seed demo registra un webhook en `http://localhost:9090/webhook-test`. Usa [webhook.site](https://webhook.site) o un servidor Express mínimo para depurar.
