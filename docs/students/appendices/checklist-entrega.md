# Checklist de entrega

Usa esta lista antes de entregar tu módulo. El profesor marcará cada ítem.

## Repositorio y estructura

- [ ] Carpeta `apps/module-{slug}/` con README de arranque
- [ ] `.env.example` sin secretos reales
- [ ] Dependencia `@busymanager/matrix-sdk` (workspace)
- [ ] Scripts `pnpm check` / `pnpm start` o equivalente documentados

## Integración Matriz

- [ ] Usa solo el SDK; no accede a BD de matrix-api
- [ ] `matrix.subscriptions.check(slug)` al inicio de cada ejecución
- [ ] `organization_id` y `business_id` tomados de `auth.check()`, no hardcodeados
- [ ] Provider Connections para APIs externas (no keys en `.env` de producción)
- [ ] Tokens IA: `check` antes y `consume` después con `reference` único

## Funcional

- [ ] Cumple requisitos **MVP** de la ficha del módulo
- [ ] Reglas de seguridad/negocio respetadas (bloque destacado en la ficha)
- [ ] Manejo de errores: módulo desactivado, sin settings, sin conexión

## Datos y multitenancy

- [ ] BD propia con `organization_id` + `business_id` en tablas
- [ ] No mezcla datos entre negocios en pruebas con dos businesses demo

## Observabilidad

- [ ] Logs útiles (sin credenciales)
- [ ] Al menos un evento `webhooks.emit` o `notify` demostrable
- [ ] Instrucciones para probar con stack Docker + dashboard demo

## Documentación

- [ ] README del módulo: variables de entorno, comandos, escenario de prueba
- [ ] Enlace a la ficha `docs/students/modules/{slug}.md` actualizada si cambiaste el contrato de settings

## Demo sugerida (5 min)

1. Login `orgadmin@karting.demo` → negocio Valencia.
2. Activar módulo → copiar API key.
3. Configurar Integraciones / Configuración según la ficha.
4. Ejecutar worker una vez y mostrar resultado (alerta, lead, borrador, player…).
5. Mostrar dato persistido en BD del módulo o en Dashboard (Leads / Mailpit).
