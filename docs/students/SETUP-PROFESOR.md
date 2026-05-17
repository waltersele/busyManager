# Publicar el repo en GitHub (profesor)

Los alumnos deben clonar: **https://github.com/walperezdev/busymanager**

## Si el push falla con «Repository not found»

La máquina de desarrollo puede estar autenticada en otra cuenta de GitHub (p. ej. `waltersele`). El repo debe existir en la cuenta **`walperezdev`** y tu usuario debe tener permiso de escritura.

### 1. Crear el repositorio (cuenta walperezdev)

En https://github.com/new:

- Owner: **walperezdev**
- Name: **busymanager**
- Visibility: Public o Private (si es privado, invita a cada alumno como *Collaborator*)
- **No** marques «Add a README» (dejamos el del proyecto)

### 2. Publicar desde tu PC

Inicia sesión en GitHub CLI con la cuenta correcta:

```powershell
gh auth login
gh auth status
```

Desde la carpeta del proyecto:

```powershell
cd c:\webProject\busyManager\busyManager
git remote -v
# origin debe apuntar a https://github.com/walperezdev/busymanager.git
git push -u origin main
```

Si `origin` no existe:

```powershell
git remote add origin https://github.com/walperezdev/busymanager.git
git push -u origin main
```

### 3. Invitar alumnos (repo privado)

GitHub → **Settings** → **Collaborators** → añadir el usuario de cada alumno.

### 4. Opcional: proteger `main`

**Settings** → **Branches** → rule en `main`: requerir Pull Request antes de merge.

## Remoto de respaldo

En este clon, `legacy` apunta al repo anterior (`waltersele/busyManager`) por si necesitas sincronizar:

```powershell
git push legacy main
```

## Enviar emails

Plantillas listas en [asignaciones/plantilla-email.md](asignaciones/plantilla-email.md).

Cada alumno debe leer primero **[00-inicio-rapido.md](00-inicio-rapido.md)**.
