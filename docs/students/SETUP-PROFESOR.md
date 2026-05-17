# Publicar y gestionar el repo del curso

**Repo:** https://github.com/walperezdev/busymanager (privado)

## Subir el código desde tu PC

La CLI de GitHub en el portátil puede seguir en `waltersele`. Para empujar al repo del curso:

```powershell
gh auth login
# elige la cuenta walperezdev

cd c:\webProject\busyManager\busyManager
git push -u origin main
```

O invita a **waltersele** como colaborador en el repo (Write) y haz `git push origin main` sin cambiar de cuenta.

## Invitar alumnos

Repo privado → **Settings** → **Collaborators** → añadir cada usuario de GitHub.

Mándales el enlace al repo y **[00-inicio-rapido.md](00-inicio-rapido.md)**.

## Asignar apps

No hay hojas por persona. Elige app en [apps/](apps/) y envía el bloque correspondiente de **[mensajes-para-alumnos.md](mensajes-para-alumnos.md)**.

## Remoto de respaldo

`legacy` → `waltersele/busyManager` por si quieres una copia en la otra cuenta:

```powershell
git push legacy main
```

## Proteger main (opcional)

Branch protection: PR obligatorio antes de merge a `main`.
