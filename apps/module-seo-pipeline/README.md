# Módulo SEO Pipeline (`seo-pipeline`)

**Alumno:** Julio  
**Asignación:** [docs/students/asignaciones/julio-seo-pipeline-wordpress.md](../../docs/students/asignaciones/julio-seo-pipeline-wordpress.md)

Artículos SEO generados con IA → borrador en WordPress → aprobación humana → publicación con auditoría (hash SHA-256).

## Arranque

```powershell
copy .env.example .env
pnpm install
pnpm ping
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm ping` | Verifica API key y settings |
| `pnpm pipeline` | Ejecuta una generación (por implementar) |
| `pnpm panel` | Panel de aprobación (por implementar) |

## Utilidad incluida

`src/lib/hash.ts` — función `contentHashSha256()` para `content_approvals`.

## Documentación

- [modules/seo-pipeline.md](../../docs/students/modules/seo-pipeline.md)
- [06-guia-estilos.md](../../docs/students/06-guia-estilos.md)

## Regla crítica

No llames a WordPress con `status: publish` sin fila en `content_approvals` con `approved_at` definido.
