# Planes con amigas 💌

Calendario estático hecho con HTML, CSS y JavaScript, listo para publicar gratis con GitHub Pages.

## Cómo usarlo

1. Subí estos cuatro archivos principales a un repositorio de GitHub:
   - `index.html`
   - `style.css`
   - `app.js`
   - `events.json`
2. En GitHub, andá a **Settings → Pages**.
3. En **Build and deployment**, elegí **Deploy from a branch**.
4. Seleccioná la rama `main` y carpeta `/root`.
5. Guardá. GitHub te dará una URL pública.

## Cómo agregar actividades

Solo hay que editar `events.json`.

Formato:

```json
{
  "title": "Picnic",
  "emoji": "🧺",
  "date": "2026-09-12",
  "time": "15:00",
  "location": "Palermo, Buenos Aires",
  "notes": "Llevar mate y cartas",
  "status": "confirmed"
}
```

Estados permitidos:
- `confirmed`
- `idea`
- `done`

Cuando tengas un plan nuevo, podés copiarlo al chat y pedir que se agregue al calendario.
