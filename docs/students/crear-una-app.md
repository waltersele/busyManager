# Cómo crear tu app en BusyManager

Cada app vive en su carpeta bajo `apps/`. La Matriz (API + dashboard) ya está hecha: tú construyes el **worker** y, si toca, un **panel propio** que habla con La Matriz por el SDK. No toques la base de datos de Laravel.

## Antes de escribir código

1. Clona el repo y levanta el entorno → [00-inicio-rapido.md](00-inicio-rapido.md)
2. Lee el contrato del SDK → [03-contrato-matriz.md](03-contrato-matriz.md)
3. Abre la ficha de **tu app** en [apps/](apps/) (objetivo, MVP, reglas)
4. Mira `apps/module-web-uptime` solo como ejemplo de integración, no copies su lógica si tu app es otra cosa

## Paso 1 — Carpeta del módulo

El slug debe coincidir con el del catálogo (ej. `resenas-gmb` → `apps/module-resenas-gmb`).

```powershell
cd busymanager
mkdir apps\module-mi-slug
cd apps\module-mi-slug
pnpm init
```

`package.json` mínimo:

```json
{
  "name": "@busymanager/module-mi-slug",
  "private": true,
  "type": "module",
  "scripts": {
    "ping": "tsx src/ping.ts",
    "start": "tsx src/worker.ts"
  },
  "dependencies": {
    "@busymanager/matrix-sdk": "workspace:*"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "typescript": "^5.6.0"
  }
}
```

Registra el paquete en el `pnpm-workspace.yaml` de la raíz (mira cómo están los otros `apps/module-*`).

Desde la raíz: `pnpm install`.

## Paso 2 — Activar la app en el dashboard

1. http://localhost:3000 → `orgadmin@karting.demo` / `password`
2. Negocio **Karting Valencia**
3. **Configuración → Apps** → tu app → **Activar app**
4. Copia la clave `bm_...` (solo sale una vez)

`.env` en tu módulo:

```env
MATRIX_API_URL=http://localhost:8080
MODULE_API_KEY=bm_tu_clave
```

Prueba:

```powershell
pnpm ping
```

Si el ping falla, no sigas: revisa Docker, la key y que la app esté activa en ese negocio.

## Paso 3 — Estructura que suele funcionar

```
apps/module-mi-slug/
  .env.example
  package.json
  tsconfig.json
  README.md
  src/
    ping.ts      # comprobación rápida del SDK
    worker.ts    # lógica programada o manual
    server.ts    # opcional: panel de aprobación en Express/Fastify
```

- **BD propia** del módulo (SQLite en dev está bien): incidencias, borradores, colas de aprobación, etc.
- **Credenciales de terceros** (Google, WordPress, Gemini): `matrix.connections.get('provider')`, no las hardcodees en producción.
- **IA:** siempre `matrix.tokens.check(n)` antes y `matrix.tokens.consume(...)` después.

## Paso 4 — Publicar datos en el dashboard (opcional)

Si tu app tiene KPIs o estado para el cliente, usa `matrix.runtime.publish({ ... })`. El panel de La Matriz puede leerlos (como en Monitor web y SSL). El slug del runtime es el de tu app.

## Paso 5 — Alertas y eventos

- Avisos al dueño del negocio: `matrix.notify('alert_center', { title, body, severity })`
- Integraciones externas del cliente: `matrix.webhooks.emit('tu.evento', data)`

Catálogo de eventos sugeridos: [appendices/eventos-webhook.md](appendices/eventos-webhook.md).

## Paso 6 — Panel propio (si la app lo pide)

Muchas apps llevan cola de aprobación (reseñas negativas, artículos SEO, etc.). Usa la [guía de estilos](06-guia-estilos.md) y `assets/panel-base.css` para que no parezca un proyecto distinto.

Puerto libre en local (4001, 4002…). Documenta en tu README cómo arrancarlo.

## Paso 7 — Subir tu trabajo

```powershell
git checkout -b feature/mi-slug-descripcion
git add apps/module-mi-slug
git commit -m "feat(mi-slug): lo que hayas hecho"
git push -u origin feature/mi-slug-descripcion
```

Abre Pull Request en GitHub. Detalles: [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Qué no hacer

- Conectar a MySQL de `apps/matrix-api`
- Commitear `.env` ni API keys
- Cambiar `matrix-api` o `matrix-web` sin acordarlo
- Publicar en WordPress / Google sin pasar por las reglas de tu ficha de app

## Entrega

[checklist-entrega.md](appendices/checklist-entrega.md)
