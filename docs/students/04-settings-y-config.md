# 04 — Settings y configuración

Hay dos niveles de configuración: la del **negocio** (compartida, en La Matriz) y la **específica del módulo** (convención acordada).

## Settings globales del negocio

El `org_admin` edita en **Dashboard → Configuración**. La API los expone en `matrix.auth.check().settings`.

Estructura por defecto ([`BusinessSettingsService`](../../apps/matrix-api/app/Services/BusinessSettingsService.php)):

```json
{
  "identity": {
    "trade_name": "Karting Valencia",
    "legal_name": "",
    "logo_url": ""
  },
  "web": {
    "url": "https://ejemplo.com",
    "language": "es"
  },
  "fiscal": {
    "tax_id": "B12345678",
    "address": "",
    "city": "Valencia",
    "postal_code": "",
    "country": "ES"
  },
  "contact": {
    "phone": "+34 600 000 001",
    "public_email": "info@ejemplo.com"
  }
}
```

### Campos que suelen usar los módulos

| Módulo | Settings globales |
|--------|-------------------|
| web-uptime | `web.url` |
| monitor-menciones | `identity.trade_name` |
| resenas-gmb | `identity.trade_name`, `contact.public_email` |
| seo-pipeline | `web.url`, `web.language`, `identity.trade_name` |
| whatsapp-guardia | `contact.phone` (referencia), horario en `modules.whatsapp-guardia` |

**Legacy:** algunos seeds usan `monitor_url` a nivel raíz. Prioriza `web.url`; el check de la API puede devolver ambos.

## Settings por módulo: `settings.modules.{slug}`

Convención para configuración que solo afecta a un módulo. El alumno documenta el esquema en su ficha `modules/{slug}.md`.

Ejemplo en el JSON del negocio (futuro PATCH vía API o UI del módulo):

```json
{
  "modules": {
    "whatsapp-guardia": {
      "timezone": "Europe/Madrid",
      "schedule": {
        "mon": { "open": "09:00", "close": "18:00" },
        "tue": { "open": "09:00", "close": "18:00" }
      },
      "escalation_email": "encargado@negocio.com"
    },
    "resenas-gmb": {
      "location_id": "accounts/123/locations/456",
      "positive_auto_publish": false,
      "tone": "profesional_cercano"
    },
    "seo-pipeline": {
      "cadence": "weekly",
      "topics": ["servicios locales", "mantenimiento"],
      "approval_required": true
    }
  }
}
```

### Cómo leerlo en código

```typescript
const ctx = await matrix.auth.check();
const mod = (ctx.settings as { modules?: Record<string, unknown> })
  ?.modules?.['whatsapp-guardia'] ?? {};
```

### Cómo escribirlo (MVP)

Opciones para el alumno:

1. **Panel propio del módulo** que guarde en su BD (recomendado al inicio).
2. Pedir al org_admin que use API Matriz `PATCH /businesses/{id}/settings` con merge de `modules.{slug}` (desde matrix-web en el futuro).
3. Variables en `.env` solo para desarrollo local (no para producción multitenancy).

## Provider Connections

Credenciales de terceros **no** van en `settings`. Van en Integraciones y se leen con `matrix.connections.get('gemini')`. Ver [appendices/provider-connections.md](appendices/provider-connections.md).

## Secretos del módulo

| Secreto | Dónde |
|---------|--------|
| `MODULE_API_KEY` | `.env` del módulo (por negocio/suscripción) |
| Claves Google/Meta/WP | Provider Connections en La Matriz |
| JWT de tu API propia | `.env` del módulo |
| `screenToken` de players | Generado en BD del módulo |

## Siguiente paso

[05 — Panel y experiencia de usuario](05-panel-y-ux.md)
