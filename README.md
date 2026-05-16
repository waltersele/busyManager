# BusyManager — La Matriz

Plataforma multitenant (Agencia → Organización → Negocio) con API central, SDK para módulos de alumnos y dashboard web.

**Repositorio:** [github.com/waltersele/busyManager](https://github.com/waltersele/busyManager)

## Contexto para Cursor

Al clonar en otro PC, abre el proyecto en Cursor: la regla en `.cursor/rules/` y el resumen en [`docs/cursor/CONTEXTO-PROYECTO.md`](docs/cursor/CONTEXTO-PROYECTO.md) recuperan decisiones de arquitectura y producto. El chat completo está en [`docs/cursor/chat/`](docs/cursor/chat/).

## Stack

| Capa | Tecnología |
|------|------------|
| API / Matriz | Laravel 11, PHP 8.3 |
| Dashboard | Next.js 15, TypeScript |
| Módulos alumno | Laravel / workers + `@busymanager/matrix-sdk` |
| BD | MySQL 8 |
| Colas | Redis + Laravel Queues |
| Email dev | Mailpit |

## Estructura

```
apps/matrix-api/        — API REST La Matriz
apps/matrix-web/        — Dashboard org_admin
apps/module-web-uptime/ — Módulo referencia (monitor web)
packages/matrix-sdk/    — SDK TypeScript
packages/api-contracts/
docker/                 — MySQL, Redis, Mailpit, API
docs/                   — Arquitectura, guía módulos, contexto Cursor
.cursor/rules/          — Reglas persistentes para el agente
```

## Clonar en otro equipo

```powershell
git clone https://github.com/waltersele/busyManager.git
cd busyManager
pnpm install
```

### 1. Variables de entorno

```powershell
copy apps\matrix-api\.env.example apps\matrix-api\.env
copy apps\matrix-web\.env.local.example apps\matrix-web\.env.local
```

Ajusta en `apps/matrix-api/.env` si no usas Docker (host `127.0.0.1`, puerto `3306`).

### 2. Docker (recomendado en dev)

Requiere [Docker Desktop](https://www.docker.com/products/docker-desktop/) en ejecución.

```powershell
cd docker
docker compose up -d
```

| Servicio | URL / puerto |
|----------|----------------|
| API | http://localhost:8080 |
| Mailpit | http://localhost:8025 |
| MySQL | `localhost:3307` — usuario `busymanager`, contraseña `secret` |

La primera vez, dentro del contenedor API o con PHP local:

```powershell
cd apps\matrix-api
composer install
php artisan migrate --seed
```

### 3. Frontend

Desde la raíz del monorepo:

```powershell
pnpm dev:web
```

Dashboard: http://localhost:3000

### Credenciales demo

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| orgadmin@karting.demo | password | org_admin |
| superadmin@busymanager.local | password | superadmin |

## Sin Docker

Instala PHP 8.3+, Composer, MySQL y Redis. Configura `apps/matrix-api/.env` y:

```powershell
cd apps\matrix-api
composer install
php artisan migrate --seed
php artisan serve --port=8080
```

En otra terminal, desde la raíz: `pnpm dev:web`.

## Módulo web-uptime

Ver [docs/module-guide.md](docs/module-guide.md).

## Validación manual

Checklist en [scripts/e2e-validation.md](scripts/e2e-validation.md).

## Scripts

```powershell
.\scripts\setup.ps1   # ayuda inicial (si está configurado)
```
