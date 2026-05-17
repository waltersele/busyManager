# 00 — Inicio rápido (primer día)

Guía para arrancar **mañana** en el repositorio del curso.

**Repo:** https://github.com/walperezdev/busymanager

## 1. Requisitos en tu PC

Instala antes de la clase:

| Herramienta | Para qué |
|-------------|----------|
| [Git](https://git-scm.com/) | Clonar y subir tu trabajo |
| [Node.js 20+](https://nodejs.org/) | Dashboard y módulos TypeScript |
| [pnpm 9+](https://pnpm.io/installation) | `npm install -g pnpm` |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | API, MySQL, Redis, Mailpit |

Opcional: [Cursor](https://cursor.com/) o VS Code.

## 2. Clonar e instalar

```powershell
git clone https://github.com/walperezdev/busymanager.git
cd busymanager
pnpm install
```

## 3. Variables de entorno

```powershell
copy apps\matrix-api\.env.example apps\matrix-api\.env
copy apps\matrix-web\.env.local.example apps\matrix-web\.env.local
```

Con Docker, el `.env` de la API ya apunta a `mysql` y `redis` dentro de la red Docker. No cambies hosts salvo que corras la API fuera de Docker.

## 4. Arrancar La Matriz

```powershell
cd docker
docker compose up -d
```

Espera 1–2 minutos la primera vez (migraciones). Comprueba:

| Servicio | URL |
|----------|-----|
| API | http://localhost:8080 |
| Dashboard | http://localhost:3000 (paso 5) |
| Mailpit (emails de prueba) | http://localhost:8025 |

Si la API no responde, revisa logs: `docker compose logs -f matrix-api`

### Base de datos (primera vez)

Si el contenedor no ha hecho seed automático:

```powershell
docker compose exec matrix-api php artisan migrate --force
docker compose exec matrix-api php artisan db:seed --force
```

## 5. Dashboard

En otra terminal, desde la raíz del repo:

```powershell
pnpm dev:web
```

Abre http://localhost:3000

| Campo | Valor demo |
|-------|------------|
| Email | `orgadmin@karting.demo` |
| Contraseña | `password` |
| Negocio | **Karting Valencia** |

## 6. Qué app te toca

Te lo dirá el profesor. Las instrucciones están en **[apps/](apps/)** (por ejemplo `resenas-gmb.md`, `seo-pipeline.md`).

Si empiezas una app sin carpeta aún, sigue **[crear-una-app.md](crear-una-app.md)**.

Índice de todas las apps: [apps/README.md](apps/README.md).

## 7. Activar tu app y obtener la API key

1. En el dashboard: **Configuración → Apps** (o **Mi suite** → tu app).
2. Abre la ficha de tu módulo (ej. **Reseñas Google** o **SEO Pipeline**).
3. Pulsa **Activar app**.
4. Copia la clave `bm_...` — **solo se muestra una vez**.

En la carpeta de tu módulo:

```powershell
cd apps\module-resenas-gmb
copy .env.example .env
```

Edita `.env`:

```env
MATRIX_API_URL=http://localhost:8080
MODULE_API_KEY=bm_pega_aqui_tu_clave
```

## 8. Primer comando de prueba

Cada módulo incluye un script de ping al SDK:

```powershell
cd apps\module-resenas-gmb
pnpm install
pnpm ping
```

Deberías ver confirmación de suscripción activa y contexto del negocio. Si falla:

- ¿Docker y API en marcha?
- ¿API key correcta en `.env`?
- ¿App activada para **Karting Valencia**?

## 9. Módulo de referencia

Antes de inventar arquitectura, mira **`apps/module-web-uptime/`** (monitor web + SSL):

- `src/check.ts` — worker que habla con La Matriz
- `matrix.runtime.publish` — datos en el panel del dashboard

Documentación: [modules/web-uptime.md](modules/web-uptime.md)

## 10. Subir tu trabajo

```powershell
git checkout -b feature/tu-nombre-mi-modulo
git add apps/module-tu-modulo
git commit -m "feat(tu-modulo): descripción breve"
git push -u origin feature/tu-nombre-mi-modulo
```

Abre un **Pull Request** en GitHub. Detalle: [CONTRIBUTING.md](../../CONTRIBUTING.md) en la raíz del repo.

## Orden de lectura recomendado

1. Este documento (00)
2. [01 — Entorno y activación](01-entorno-y-activacion.md)
3. [02 — Anatomía de un módulo](02-anatomia-de-un-modulo.md)
4. [03 — Contrato SDK](03-contrato-matriz.md)
5. Tu asignación en `asignaciones/`
6. [Checklist de entrega](appendices/checklist-entrega.md)

## Problemas frecuentes

**«Aún no hay comprobaciones» en Monitor web**  
El panel solo muestra datos después de que el worker publica resultados (`pnpm check` en `module-web-uptime`). No es un error de la URL en configuración.

**Puerto 3307 ocupado**  
MySQL del proyecto usa el puerto **3307** en el host para no chocar con otro MySQL local.

**pnpm no encontrado**  
`npm install -g pnpm` y cierra/abre la terminal.

---

¡Listo para el primer día! Cualquier bloqueo, Issue en GitHub o mensaje al profesor con captura del error.
