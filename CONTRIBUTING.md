# Cómo colaborar en BusyManager (curso)

Repositorio del curso: **https://github.com/walperezdev/busymanager**

## Reglas de oro

1. **No conectes tu módulo a la base de datos de La Matriz** — solo usa `@busymanager/matrix-sdk`.
2. **No subas secretos** — `.env`, API keys, tokens de Google/WordPress, etc.
3. **Trabaja en tu carpeta** `apps/module-{tu-slug}/` salvo acuerdo con el profesor.
4. **No modifiques** `apps/matrix-api`, `apps/matrix-web` ni `docker/` sin PR revisado.

## Flujo de trabajo (Git)

```powershell
git clone https://github.com/walperezdev/busymanager.git
cd busymanager
git checkout -b feature/tu-nombre-descripcion-corta
# ... desarrollas y commiteas ...
git push -u origin feature/tu-nombre-descripcion-corta
```

Abre un **Pull Request** hacia `main` en GitHub. El profesor revisará antes de fusionar.

### Mensajes de commit

Usa mensajes claros en español o inglés, por ejemplo:

- `feat(resenas-gmb): borrador de respuesta con Gemini`
- `fix(seo-pipeline): validar hash antes de publicar en WP`

## Qué puedes tocar

| Ruta | Quién |
|------|--------|
| `apps/module-{tu-asignación}/` | Tú |
| `docs/students/` (tu asignación, notas) | Tú, con sentido |
| `packages/matrix-sdk/` | Solo si el profesor lo pide (contrato compartido) |
| `apps/matrix-api`, `apps/matrix-web` | Profesor / PR acordado |

## Entorno local

Sigue **[docs/students/00-inicio-rapido.md](docs/students/00-inicio-rapido.md)** el primer día.

## Entrega

Checklist: [docs/students/appendices/checklist-entrega.md](docs/students/appendices/checklist-entrega.md)

## Dudas

Consulta primero la documentación en `docs/students/`. Si sigues bloqueado, abre un **Issue** en GitHub o contacta al profesor por el canal del curso.
