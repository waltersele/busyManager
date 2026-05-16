# 01 — Entorno y activación

## Requisitos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js | 20+ |
| pnpm | 9+ |
| Docker Desktop | (recomendado para API + MySQL) |
| PHP + Composer | Solo si desarrollas módulo en Laravel |

## Clonar el monorepo

```powershell
git clone https://github.com/waltersele/busyManager.git
cd busyManager
pnpm install
```

## Arrancar La Matriz (desarrollo)

```powershell
cd docker
docker compose up -d
```

Espera ~60 s a que `matrix-api` ejecute migraciones y seed.

| Servicio | URL |
|----------|-----|
| API | http://localhost:8080 |
| Mailpit (emails) | http://localhost:8025 |
| Dashboard | http://localhost:3000 (tras `pnpm dev:web`) |

MySQL en el host: puerto **3307**, usuario `busymanager`, contraseña `secret`.

## Dashboard y negocio demo

1. Copia variables del frontend:
   ```powershell
   copy apps\matrix-web\.env.local.example apps\matrix-web\.env.local
   ```
2. Desde la raíz: `pnpm dev:web`
3. Login: `orgadmin@karting.demo` / `password`
4. Selecciona el negocio **Karting Valencia** (o el que uses en pruebas).

## Activar tu módulo y obtener la API key

1. **Dashboard → Tienda** o **Explorar categoría** → busca tu app.
2. Pulsa **Añadir a mi suite** (o **Añadir gratis**).
3. La API key (`bm_...`) se muestra **una sola vez**. Guárdala en `.env` de tu módulo:
   ```
   MATRIX_API_URL=http://localhost:8080
   MODULE_API_KEY=bm_xxxxxxxx
   ```

Si pierdes la key, desactiva y vuelve a activar el módulo en la ficha de la app (generará una nueva).

## Crear tu carpeta de módulo

```powershell
mkdir apps\module-mi-slug
cd apps\module-mi-slug
pnpm init
```

Añade dependencia al SDK (desde la raíz del monorepo):

```json
"dependencies": {
  "@busymanager/matrix-sdk": "workspace:*"
}
```

Registra el paquete en `pnpm-workspace.yaml` si creas un `package.json` nuevo:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## Probar conexión con La Matriz

Script mínimo (o copia `apps/module-web-uptime`):

```typescript
import { createMatrixClient } from '@busymanager/matrix-sdk';

const matrix = createMatrixClient({
  baseUrl: process.env.MATRIX_API_URL!,
  moduleKey: process.env.MODULE_API_KEY!,
});

const ctx = await matrix.auth.check();
console.log(ctx);
await matrix.subscriptions.check('tu-slug');
```

## Provider Connections (integraciones)

Antes de usar APIs externas (Google, Meta, WordPress), el `org_admin` debe configurar la conexión en **Dashboard → Integraciones**. Tu módulo las lee con `matrix.connections.get('gemini')` (u otro provider). Ver [appendices/provider-connections.md](appendices/provider-connections.md).

## Siguiente paso

[02 — Anatomía de un módulo](02-anatomia-de-un-modulo.md)
