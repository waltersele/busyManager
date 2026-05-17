# Módulo Reseñas GMB (`resenas-gmb`)

**Alumno:** Nicolás  
**Asignación:** [docs/students/asignaciones/nicolas-resenas-gmb.md](../../docs/students/asignaciones/nicolas-resenas-gmb.md)

Respuestas automáticas a reseñas de Google Business con aprobación humana para reseñas ≤3★.

## Arranque

```powershell
copy .env.example .env
# Editar MODULE_API_KEY desde el dashboard (Tienda → Reseñas GMB)

pnpm install
pnpm ping
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm ping` | Verifica API key y contexto Matriz |
| `pnpm worker` | Job de sincronización (por implementar) |
| `pnpm panel` | Panel de aprobación (por implementar) |

## Documentación

- Ficha técnica: [docs/students/modules/resenas-gmb.md](../../docs/students/modules/resenas-gmb.md)
- Guía de estilos: [docs/students/06-guia-estilos.md](../../docs/students/06-guia-estilos.md)
- CSS base: [docs/students/assets/panel-base.css](../../docs/students/assets/panel-base.css)

## Regla crítica

No publiques respuestas a reseñas de **1–3 estrellas** sin `approved_by` y `approved_at` en tu base de datos.
