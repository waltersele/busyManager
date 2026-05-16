# Guía: crear un módulo alumno

## Reglas

1. **Nunca** accedas a la base de datos de La Matriz.
2. Usa siempre `@busymanager/matrix-sdk`.
3. Autentícate con la API key que genera el dashboard al activar el módulo.

## Flujo

1. El `org_admin` activa tu módulo en **Dashboard → Módulos**.
2. Copia la `MODULE_API_KEY` (solo se muestra una vez).
3. En tu app, configura `MATRIX_API_URL` y `MODULE_API_KEY`.

## Ejemplo: web-uptime

```bash
cd apps/module-web-uptime
cp .env.example .env
# Edita MODULE_API_KEY
pnpm install
pnpm check
```

El módulo:

- Verifica suscripción `web-uptime`
- Lee `monitor_url` de los settings del negocio (configúralo en Dashboard → Negocios)
- Hace ping HTTP
- Si falla: `matrix.notify()` + `matrix.webhooks.emit('site.down', ...)`

## SDK — métodos disponibles

| Método | Uso |
|--------|-----|
| `matrix.auth.check()` | Contexto org/negocio/settings |
| `matrix.subscriptions.check(slug)` | ¿Módulo activo? |
| `matrix.connections.get('gemini')` | Credenciales (hereda org) |
| `matrix.tokens.check(n)` / `consume(...)` | Presupuesto IA |
| `matrix.leads.create(...)` | Lead Workbench |
| `matrix.webhooks.emit(event, data)` | Webhooks del negocio |
| `matrix.notify(channel, { title, body })` | Alertas |

## Scheduler

```bash
pnpm start   # ejecuta check cada 5 min
```

En producción usa cron, Laravel Scheduler o un worker en tu PaaS.
