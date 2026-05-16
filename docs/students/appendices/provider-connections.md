# Provider Connections

Las credenciales de servicios externos se guardan cifradas en La Matriz. El `org_admin` las configura en **Dashboard → Integraciones**.

Tu módulo las obtiene así:

```typescript
const conn = await matrix.connections.get('gemini');
// conn.credentials — objeto según el provider
```

Herencia: conexiones a nivel **organización** aplican a todos los negocios; las de **negocio** sobrescriben.

## Providers por módulo

| Módulo | Providers recomendados | Uso |
|--------|------------------------|-----|
| resenas-gmb | `google_business`, `gemini` | API reseñas + generación de respuestas |
| monitor-menciones | `google_business`, `gemini` (opcional resumen) | Búsqueda / alertas |
| whatsapp-guardia | `meta_whatsapp`, `gemini` | Mensajes + RAG |
| voz-gestion | `meta_whatsapp`, `gemini`, `openai` (o whisper en gemini) | Audio + extracción |
| seo-pipeline | `wordpress`, `gemini`, `email` | Borrador WP + redacción + preview |
| web-uptime | `email`, `meta_whatsapp` | Alertas multicanal |
| digital-signage | — | MVP sin provider obligatorio |
| menu-dinamico | — | MVP sin provider obligatorio |
| video-local | — | MVP sin provider obligatorio |

## Identificadores sugeridos (`provider`)

Usa estos slugs al documentar y al pedir al org_admin que configure (deben coincidir con lo que implemente el vault):

| Slug | Contenido típico de `credentials` |
|------|-----------------------------------|
| `gemini` | `{ "api_key": "..." }` |
| `meta_whatsapp` | `{ "phone_number_id", "access_token", "verify_token" }` |
| `google_business` | OAuth tokens + `account_id`, `location_id` |
| `wordpress` | `{ "site_url", "username", "application_password" }` |
| `email` | `{ "from": "alertas@negocio.com" }` — Matriz usa SMTP/Resend global en dev |
| `openai` | `{ "api_key" }` — solo si Whisper no va por Gemini |

En desarrollo, el seed demo incluye `gemini` y `email` con valores ficticios.

## Manejo de errores

```typescript
try {
  await matrix.connections.get('meta_whatsapp');
} catch {
  await matrix.notify('alert_center', {
    title: 'WhatsApp Guardia sin configurar',
    body: 'Conecta Meta WhatsApp en Integraciones para activar el módulo.',
    severity: 'warning',
  });
  return;
}
```

## Seguridad

- No loguees `credentials` completas.
- No copies tokens a tu BD; guárdalos solo en memoria durante la petición.
- Si necesitas cache, cifra en reposo y expira en < 1 h.
