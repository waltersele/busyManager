# Mensajes para enviar (copiar y pegar)

Repo del curso: **https://github.com/walperezdev/busymanager** (privado: invita antes de que clonen).

Todos arrancan con **[00-inicio-rapido.md](00-inicio-rapido.md)**. Cada app tiene su hoja en **[apps/](apps/)**.

Sustituye `[nombre]` y el canal de dudas. No hace falta mandar todos los emails: solo el de la app que toque.

---

## Mensaje común (primer día)

**Asunto:** BusyManager — repo y entorno para mañana

Hola [nombre],

Mañana trabajamos con **BusyManager**: una API central (La Matriz) y apps que cada uno desarrolla en su carpeta, sin tocar la base de datos del servidor.

**Repo:** https://github.com/walperezdev/busymanager  
(Acepta la invitación de GitHub si el repo es privado.)

**Antes de clase**, si puedes:

1. Instala Git, Node 20+, pnpm y Docker Desktop.
2. Clona el repo y sigue `docs/students/00-inicio-rapido.md`.
3. Comprueba que ves el dashboard en http://localhost:3000 con `orgadmin@karting.demo` / `password`.

El día de la práctica te diré **qué app** te toca. Las instrucciones por app están en `docs/students/apps/`.

Dudas: [canal].

---

## Reseñas Google — `resenas-gmb`

**Asunto:** Tu app en BusyManager — Reseñas Google

Hola [nombre],

Te toca la app **Reseñas Google** (`resenas-gmb`).

**Qué harás:** leer reseñas del negocio, generar respuestas con IA y publicar solo cuando las reglas lo permitan. Las de 1 a 3 estrellas **no** se publican sin aprobación en tu panel.

**Instrucciones:** `docs/students/apps/resenas-gmb.md`  
**Carpeta:** `apps/module-resenas-gmb/` (ya hay esqueleto; prueba `pnpm ping` tras activar la app).

**Cómo crear apps en general:** `docs/students/crear-una-app.md`

Entrega según `docs/students/appendices/checklist-entrega.md`.

---

## SEO Pipeline — `seo-pipeline`

**Asunto:** Tu app en BusyManager — SEO Pipeline

Hola [nombre],

Te toca **SEO Pipeline** (`seo-pipeline`): artículos con IA, borrador en WordPress (o simulado) y **publicar solo tras aprobación** con registro y hash del contenido.

**Instrucciones:** `docs/students/apps/seo-pipeline.md`  
**Carpeta:** `apps/module-seo-pipeline/`

Necesitarás integraciones `gemini` y, si puedes, `wordpress` en el dashboard (Configuración → Integraciones).

---

## WhatsApp Guardia — `whatsapp-guardia`

**Asunto:** Tu app en BusyManager — WhatsApp Guardia

Hola [nombre],

Te toca **WhatsApp Guardia**: respuestas fuera de horario usando los documentos del negocio, sin prometer de más.

**Instrucciones:** `docs/students/apps/whatsapp-guardia.md`  
**Carpeta:** créala como `apps/module-whatsapp-guardia/` siguiendo `docs/students/crear-una-app.md`.

---

## Detector de enlaces rotos — `enlaces-rotos`

**Asunto:** Tu app en BusyManager — Enlaces rotos

Hola [nombre],

Te toca **Detector de enlaces rotos** (app gratis en el catálogo): rastrear la web del cliente, listar enlaces rotos y, si llegas, alertas de keywords que bajan.

**Instrucciones:** `docs/students/apps/enlaces-rotos.md`

---

## Voz a gestión — `voz-gestion`

**Asunto:** Tu app en BusyManager — Voz a gestión

Hola [nombre],

Te toca **Voz a gestión**: audios de WhatsApp → transcripción → tareas para el equipo.

**Instrucciones:** `docs/students/apps/voz-gestion.md`

---

## Monitor de menciones — `monitor-menciones`

**Asunto:** Tu app en BusyManager — Monitor de menciones

Hola [nombre],

Te toca **Monitor de menciones** (gratis): avisar cuando el nombre del negocio aparece donde toque vigilar.

**Instrucciones:** `docs/students/apps/monitor-menciones.md`

---

## Reputación multicanal — `reputacion-multicanal`

**Asunto:** Tu app en BusyManager — Reputación multicanal

Hola [nombre],

Te toca **Reputación multicanal**: varios canales en una bandeja, priorizar lo urgente.

**Instrucciones:** `docs/students/apps/reputacion-multicanal.md`

---

## Solo estudiar (referencia) — `web-uptime`

**Asunto:** BusyManager — lee el módulo de referencia

Hola [nombre],

Antes de tu app, echa un ojo a **Monitor web y SSL** en `apps/module-web-uptime/` y a `docs/students/apps/web-uptime.md`. Es el ejemplo de worker + SDK que usamos en clase.

No es tu entrega; es la referencia.
