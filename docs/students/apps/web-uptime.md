# App: Monitor web y SSL (`web-uptime`)

## Para qué sirve en el curso

Esta app **ya está implementada** en `apps/module-web-uptime/`. No es una entrega típica: es la referencia de cómo encajar un worker con La Matriz (ping, incidencias, `runtime.publish`, alertas, SSL).

Léela antes de montar la tuya.

## Qué hace

- Comprueba la URL del negocio cada X minutos.
- Abre/cierra incidencias si la web cae (dos fallos seguidos para no dar falsas alarmas).
- Revisa caducidad del certificado SSL.
- Manda emails vía `notify` y eventos `site.down` / `site.up`.

## Cómo probarla

```powershell
cd apps\module-web-uptime
copy .env.example .env
# MODULE_API_KEY de web-uptime activo en Karting Valencia
pnpm check
```

Doc técnica: [modules/web-uptime.md](../modules/web-uptime.md).

Si tu app también muestra KPIs en el dashboard de La Matriz, mira cómo publica el runtime este módulo.
