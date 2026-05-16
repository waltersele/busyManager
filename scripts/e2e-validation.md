# Validación E2E — BusyManager MVP

Requisitos: Docker Desktop en ejecución.

## 1. Arrancar stack

```powershell
cd c:\webproject\BusyManager\docker
docker compose up -d --build
```

Espera ~60s a que `matrix-api` ejecute migrate + seed.

## 2. Verificar API

```powershell
curl http://localhost:8080/
curl -X POST http://localhost:8080/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"orgadmin@karting.demo","password":"password"}'
```

## 3. Dashboard

```powershell
cd c:\webproject\BusyManager
copy apps\matrix-web\.env.local.example apps\matrix-web\.env.local
pnpm dev:web
```

Login: `orgadmin@karting.demo` / `password`

- [ ] Ver 2 negocios (Valencia, Alicante)
- [ ] Activar `web-uptime` y copiar API key
- [ ] Connection Gemini visible en connections

## 4. Módulo web-uptime

Tras activar, en `apps/module-web-uptime/.env`:

```
MATRIX_API_URL=http://localhost:8080
MODULE_API_KEY=bm_...
```

```powershell
pnpm --filter @busymanager/module-web-uptime check
```

Valencia (`monitor_url` → httpstat.us/200) debe salir OK.
Alicante (503) debe disparar alerta y webhook.

## 5. Mailpit

Abre http://localhost:8025 — debe aparecer email de alerta tras check en Alicante.

## Criterios del plan

- [x] Schema multitenant org → negocio
- [x] SDK con errores tipados
- [x] Dashboard org_admin
- [x] Módulo referencia web-uptime
- [ ] Ejecutar checks anteriores con Docker activo
