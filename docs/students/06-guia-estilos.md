# 06 — Guía de estilos (paneles de módulos)

Usa esta guía cuando desarrolles un **panel web** o una **cola de aprobación** para tu módulo. No es obligatorio clonar `matrix-web`, pero sí mantener coherencia visual con La Matriz para que el producto se sienta unificado.

Referencia de implementación: [`apps/matrix-web/src/app/globals.css`](../../apps/matrix-web/src/app/globals.css).

## Tokens de diseño

| Token | Valor | Uso |
|-------|--------|-----|
| `--bg` | `#f4f6f9` | Fondo de página |
| `--surface` | `#ffffff` | Cards, paneles |
| `--border` | `#e2e8f0` | Bordes |
| `--text` | `#0f172a` | Texto principal |
| `--muted` | `#64748b` | Texto secundario, labels |
| `--accent` | `#ea580c` | Acción primaria (naranja BusyManager) |
| `--accent-soft` | `#fff7ed` | Fondos de aviso suave |

### Tipografía

- Familia: `system-ui`, `Segoe UI`, `Roboto`, sans-serif`.
- Títulos de página: `text-2xl font-semibold text-slate-900`.
- Subtítulos: `text-sm text-slate-500`.
- Cuerpo: `text-sm text-slate-700`.

### Espaciado y radios

- Cards: `rounded-xl`, padding `p-6`.
- Inputs y botones: `rounded-lg`.
- Separación entre secciones: `space-y-6` o `gap-6` en grid.

## Componentes base

### Variables CSS (copiar al inicio de tu CSS)

```css
:root {
  --bg: #f4f6f9;
  --surface: #ffffff;
  --border: #e2e8f0;
  --text: #0f172a;
  --muted: #64748b;
  --accent: #ea580c;
  --accent-soft: #fff7ed;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

### Con Tailwind CSS

Si usas Tailwind en tu módulo, replica estas utilidades (como en matrix-web):

| Clase | Uso |
|-------|-----|
| `.card` | Contenedor blanco con borde y sombra suave |
| `.label` | Etiqueta de campo en mayúsculas pequeñas |
| `button.btn` | Botón primario naranja |
| `button.btn-ghost` | Botón secundario con borde |
| `button.btn-sm` | Botón compacto en tablas |

Definición de referencia en `globals.css` de matrix-web (`.card`, `.btn`, `.btn-ghost`, inputs con `focus:border-orange-400`).

### Botones

| Tipo | Cuándo | Estilo |
|------|--------|--------|
| Primario | Aprobar, guardar, publicar (tras validación) | Fondo `orange-600`, texto blanco |
| Secundario | Cancelar, volver | Borde slate, fondo blanco |
| Peligro | Rechazar, eliminar borrador | `red-600` o `btn-ghost` + texto rojo |
| Deshabilitado | Acción bloqueada por regla de negocio | `opacity-50`, `cursor-not-allowed` |

**Importante:** en módulos con aprobación humana, el botón «Publicar» debe estar **deshabilitado** hasta cumplir las reglas (p. ej. reseña ≤3★ sin `approved_by`).

### Estados y badges

| Estado | Color sugerido | Ejemplo |
|--------|----------------|---------|
| Pendiente | `amber` / amarillo suave | «Pendiente de aprobación» |
| Aprobado | `green` | «Aprobado» |
| Publicado | `blue` | «Publicado en GMB / WordPress» |
| Rechazado | `red` | «Rechazado» |
| Error | `red` + icono | Falta conexión, sin tokens IA |

```html
<span class="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
  Pendiente
</span>
```

### Formularios

- Label encima del campo (`.label`).
- Mensaje de error debajo: `text-xs text-red-600`.
- Ayuda contextual: `text-xs text-slate-500`.
- No pidas datos que ya existen en **Configuración** del dashboard (nombre comercial, email público, URL web).

## Layout del panel admin

Estructura recomendada:

```
┌─────────────────────────────────────────────┐
│  [Logo/nombre módulo]     Negocio · Usuario │
├─────────────────────────────────────────────┤
│  Título página          [Acción principal]  │
│  Subtítulo / última sync                    │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐          │
│  │   Card KPI  │  │   Card KPI  │          │
│  └─────────────┘  └─────────────┘          │
│  ┌───────────────────────────────────────┐  │
│  │  Tabla / cola de aprobación           │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

- Ancho máximo del contenido: `max-w-5xl` o `max-w-6xl` centrado.
- Tablas: filas alternas `bg-slate-50/50`, hover `bg-orange-50/30`.

## Patrones por tipo de módulo

### Cola de aprobación (reseñas, artículos SEO)

1. Lista con filtro: «Pendientes» / «Publicados» / «Rechazados».
2. Detalle en panel lateral o modal: texto generado por IA editable solo antes de aprobar (opcional en MVP).
3. Acciones: **Aprobar** (primario), **Rechazar** (secundario/peligro).
4. Mostrar regla de negocio visible: *«Las reseñas de 1–3★ requieren aprobación manual»*.

### Dashboard de estado (workers)

- «Última sincronización: hace X min».
- Contadores: pendientes, publicados hoy, errores.
- Enlace a Mailpit o logs en desarrollo.

## Accesibilidad y móvil

- Contraste mínimo 4.5:1 en texto sobre fondo.
- Botones táctiles ≥ 44×44 px en vistas que use el encargado en el local.
- Mensajes de error con texto claro, no solo color.

## Qué evitar

- Paletas oscuras distintas al dashboard (salvo players de signage).
- Publicar sin confirmación cuando hay regla de aprobación.
- Modales sin botón de cerrar visible.
- Exponer API keys o tokens en la UI.

## Cards de descubrimiento (La Matriz)

En Configuración → Apps se usa `AppDiscoveryCard`:

- Cabecera con gradiente por categoría e icono
- Badge: Activa | Disponible | Próximamente (sin precio)
- Mini preview visual (p. ej. barras de uptime en monitorización)
- CTA: «Abrir app» / «Descubrir»

## Recursos

- Panel de referencia: http://localhost:3000 (tras `pnpm dev:web`)
- Snippet CSS listo: [assets/panel-base.css](assets/panel-base.css)
- UX general: [05-panel-y-ux.md](05-panel-y-ux.md)

## Siguiente paso

Tu ficha de módulo en [modules/](modules/) y la asignación personal en [asignaciones/](asignaciones/).
