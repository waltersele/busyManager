# BusyManager — La Matriz

Plataforma multitenant (Agencia → Organización → Negocio) con API central, SDK para módulos de alumnos y dashboard web.

**Repositorio del curso:** [github.com/walperezdev/busymanager](https://github.com/walperezdev/busymanager)

> **Profesor:** si el repo aún no está en GitHub, sigue [docs/students/SETUP-PROFESOR.md](docs/students/SETUP-PROFESOR.md). El código ya está commiteado; falta `git push` con la cuenta `walperezdev`.

## Para alumnos (empezar mañana)

1. **[Inicio rápido — primer día](docs/students/00-inicio-rapido.md)** ← empieza aquí  
2. [Guía completa alumnos](docs/students/README.md)  
3. [Apps del curso](docs/students/apps/) · [Crear una app](docs/students/crear-una-app.md)  
4. [Mensajes para alumnos](docs/students/mensajes-para-alumnos.md) (profesor)  
5. [Cómo colaborar (Git / PRs)](CONTRIBUTING.md)

## Contexto para Cursor

Al clonar en otro PC, abre el proyecto en Cursor:

- Regla automática: [`.cursor/rules/busymanager-context.mdc`](.cursor/rules/busymanager-context.mdc)
- Resumen del proyecto: [`docs/cursor/CONTEXTO-PROYECTO.md`](docs/cursor/CONTEXTO-PROYECTO.md)
- Historial de chats: [`docs/cursor/chat/`](docs/cursor/chat/)

## Stack

| Capa | Tecnología |
|------|------------|
| API / Matriz | Laravel 11, PHP 8.3 |
| Dashboard | Next.js 15, TypeScript |
| Módulos alumno | Workers + `@busymanager/matrix-sdk` |
| BD | MySQL 8 |
| Colas | Redis + Laravel Queues |
| Email dev | Mailpit |

## Estructura

```
apps/matrix-api/           — API REST La Matriz
apps/matrix-web/           — Dashboard org_admin
apps/module-web-uptime/    — Módulo referencia (monitor web + SSL)
apps/module-resenas-gmb/   — App Reseñas Google (esqueleto)
apps/module-seo-pipeline/  — App SEO Pipeline (esqueleto)
packages/matrix-sdk/       — SDK TypeScript
docker/                    — MySQL, Redis, Mailpit, API
docs/students/             — Documentación del curso
```

## Clonar e instalar

```powershell
git clone https://github.com/walperezdev/busymanager.git
cd busymanager
pnpm install
```

### Variables de entorno

```powershell
copy apps\matrix-api\.env.example apps\matrix-api\.env
copy apps\matrix-web\.env.local.example apps\matrix-web\.env.local
```

### Docker (recomendado)

```powershell
cd docker
docker compose up -d
```

| Servicio | URL / puerto |
|----------|----------------|
| API | http://localhost:8080 |
| Mailpit | http://localhost:8025 |
| MySQL | `localhost:3307` — usuario `busymanager`, contraseña `secret` |

Primera vez (si hace falta):

```powershell
docker compose exec matrix-api php artisan migrate --force
docker compose exec matrix-api php artisan db:seed --force
```

### Dashboard

```powershell
pnpm dev:web
```

http://localhost:3000 — `orgadmin@karting.demo` / `password` — negocio **Karting Valencia**

## Documentación

- Alumnos: [docs/students/README.md](docs/students/README.md)
- Arquitectura: [docs/architecture.md](docs/architecture.md)
- Módulos (resumen): [docs/module-guide.md](docs/module-guide.md)
- Validación: [scripts/e2e-validation.md](scripts/e2e-validation.md)

## Scripts

```powershell
pnpm dev:web      # dashboard
pnpm build:sdk    # compilar SDK
pnpm test:sdk      # tests del SDK
```
