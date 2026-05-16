# BusyManager — setup inicial (requiere Docker Desktop en ejecución)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Instalando dependencias Node..."
pnpm install

Write-Host "Levantando infra (MySQL, Redis, Mailpit, API)..."
Set-Location docker
docker compose up -d --build

Write-Host ""
Write-Host "API: http://localhost:8080"
Write-Host "Mailpit: http://localhost:8025"
Write-Host "Dashboard: pnpm dev:web (http://localhost:3000)"
Write-Host "Demo: orgadmin@karting.demo / password"
