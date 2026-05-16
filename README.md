# BusyManager — La Matriz

Plataforma multitenant (Agencia → Organización → Negocio) con API central, SDK para módulos de alumnos y dashboard web.

## Stack

| Capa | Tecnología |
|------|------------|
| API / Matriz | Laravel 11, PHP 8.3 |
| Dashboard | Next.js 15, TypeScript |
| Módulos alumno | Laravel + `@busymanager/matrix-sdk` |
| BD | MySQL 8 |
| Colas | Redis + Laravel Queues |
| Email dev | Mailpit |

## Estructura

```
apps/matrix-api/       — API REST La Matriz
apps/matrix-web/       — Dashboard org_admin
apps/module-web-uptime/ — Módulo referencia (monitor web)
packages/matrix-sdk/   — SDK TypeScript
packages/api-contracts/
docker/                — MySQL, Redis, Mailpit, API
docs/                  — Arquitectura y guía módulos
```

## Inicio rápido (Docker)

```bash
cd docker
docker compose up -d
```

- API: http://localhost:8080
- Mailpit UI: http://localhost:8025
- MySQL: `localhost:3307` (user `busymanager` / `secret`) — puerto 3307 si ya tienes MySQL en 3306

### Credenciales demo

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| orgadmin@karting.demo | password | org_admin |
| superadmin@busymanager.local | password | superadmin |

## Desarrollo frontend

```bash
pnpm install
cp .env.example apps/matrix-web/.env.local
pnpm dev:web
```

Dashboard: http://localhost:3000

## Módulo web-uptime

Ver [docs/module-guide.md](docs/module-guide.md).

## Sin Docker

Instala PHP 8.3+, Composer, MySQL y Redis. Copia `.env.example` a `apps/matrix-api/.env`, ajusta `DB_*` y:

```bash
cd apps/matrix-api
composer install
php artisan migrate --seed
php artisan serve --port=8080
```
