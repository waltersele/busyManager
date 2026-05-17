# Plantillas de email para enviar a alumnos

Repositorio del curso: **https://github.com/walperezdev/busymanager**

Copia y envía un email por alumno (invítalos como colaboradores en GitHub si el repo es privado).

---

## Email — Nicolás (Reseñas GMB)

**Asunto:** Asignación BusyManager — Módulo Reseñas Google (respuestas automáticas)

Hola Nicolás,

Te asigno el módulo **Reseñas GMB** del proyecto BusyManager / La Matriz. Debes desarrollar una app que lea reseñas del negocio, genere respuestas con IA y las publique respetando reglas estrictas: **las reseñas de 1 a 3 estrellas nunca se publican sin aprobación humana**.

**Documentación principal (léela en este orden):**

1. Asignación personal: `docs/students/asignaciones/nicolas-resenas-gmb.md`
2. Guía general alumnos: `docs/students/README.md`
3. Guía de estilos (para tu panel): `docs/students/06-guia-estilos.md`

**Tu carpeta en el repo:** `apps/module-resenas-gmb/` (ya incluye esqueleto y script `pnpm ping`).

**Arranque del entorno:**

```text
git clone https://github.com/walperezdev/busymanager.git
cd busymanager
pnpm install
cd docker && docker compose up -d
pnpm dev:web
```

Guía completa: `docs/students/00-inicio-rapido.md`

Dashboard: http://localhost:3000 — usuario `orgadmin@karting.demo` / `password`

Activa **Reseñas GMB** en Configuración → Apps, copia la API key a tu `.env` y ejecuta `pnpm ping` en `apps/module-resenas-gmb`.

**Entrega:** MVP según la asignación + checklist en `docs/students/appendices/checklist-entrega.md`.

Cualquier duda, escríbeme por [canal].

Saludos,  
[Tu nombre]

---

## Email — Julio (SEO Pipeline / WordPress)

**Asunto:** Asignación BusyManager — Módulo SEO Pipeline (WordPress con aprobación)

Hola Julio,

Te asigno el módulo **SEO Pipeline**: generar artículos SEO con IA, guardarlos como **borrador en WordPress** y publicarlos **solo después de aprobación humana**, con registro de auditoría (hash SHA-256 del contenido). **Nunca** publiques en WordPress sin pasar por el flujo de aprobación.

**Documentación principal:**

1. Asignación personal: `docs/students/asignaciones/julio-seo-pipeline-wordpress.md`
2. Guía general: `docs/students/README.md`
3. Guía de estilos: `docs/students/06-guia-estilos.md`

**Tu carpeta:** `apps/module-seo-pipeline/`

**Entorno:**

```text
git clone https://github.com/walperezdev/busymanager.git
cd busymanager
pnpm install
cd docker && docker compose up -d
pnpm dev:web
```

Guía: `docs/students/00-inicio-rapido.md`. WordPress de prueba o simular en MVP; credenciales vía **Configuración → Integraciones** (`wordpress`, `gemini`).

**Entrega:** MVP según la asignación + checklist de entrega.

Dudas por [canal].

Saludos,  
[Tu nombre]

---

## Archivos clave a mencionar

| Alumno | Slug | Asignación | App |
|--------|------|------------|-----|
| Nicolás | `resenas-gmb` | `docs/students/asignaciones/nicolas-resenas-gmb.md` | `apps/module-resenas-gmb/` |
| Julio | `seo-pipeline` | `docs/students/asignaciones/julio-seo-pipeline-wordpress.md` | `apps/module-seo-pipeline/` |
