# Guía para Agentes de IA — Salmo 27 Librería

## Objetivo del Proyecto

Sitio web estático para **Salmo 27 Librería Cristiana** (librería en Liberia, Guanacaste), desplegado gratuitamente con:
- **GitHub** — repositorio fuente con los archivos
- **Cloudflare Workers** — hosting y publicación automática
- **wrangler.jsonc** — configuración de despliegue

URL: `https://salmo27libreria.josuecavargas.workers.dev`
Catálogo libros: `https://salmo27libreria.josuecavargas.workers.dev/libros.html`
JSON inventario: `https://salmo27libreria.josuecavargas.workers.dev/data/libros.json`

## Estado Actual

- ✅ Repo de GitHub creado: `josuecavargas-star/salmo27libreria` (push completado)
- ✅ Cloudflare Workers configurado y deployado (sitio en vivo)
- ✅ Landing page (`index.html`) desplegada y funcionando (HTTP 200)
- ✅ Catálogo dinámico (`libros.html`) conectado desde el menú "Catálogo" de la landing
- ✅ Catálogo de libros (`libros.html`) desplegado y funcionando (HTTP 200)
- ✅ JSON de inventario accesible (`/data/libros.json`, HTTP 200)
- ✅ Pages CMS configurado (`.pages.yml`) — listo para conectar en app.pagescms.org
- ✅ Página de libros conectada desde el menú de navegación de `index.html`

## Arquitectura

```
TÚ (editas archivos)
 │
 ▼
GitHub (repositorio) ── cada push a main
 │
 ▼
Cloudflare Workers (npx wrangler deploy)
 │
 ▼
Visitantes ven tu página
```

## Estructura del Repositorio

```
salmo27libreria/
├── AGENTS.md              ← esta guía
├── wrangler.jsonc         ← config de Cloudflare Workers
├── .pages.yml             ← config de Pages CMS (catálogo de libros)
└── public/                ← archivos del sitio web
 ├── index.html           ← landing page principal
 ├── libros.html          ← página de catálogo de libros (dinámica)
 ├── css/styles.css       ← estilos
 ├── js/main.js           ← scripts
 ├── data/libros.json     ← inventario de libros (editado vía Pages CMS)
 ├── img/                 ← imágenes y logos del sitio
 ├── images/libros/        ← portadas de libros (subidas vía Pages CMS)
 │   └── .gitkeep
 └── guia/                ← documentación del proyecto
```

## Configuración Clave

### wrangler.jsonc
```json
{
  "name": "salmo27libreria",
  "compatibility_date": "2026-09-01",
  "assets": {
    "directory": "./public"
  }
}
```

- `"name"`: nombre del Worker en Cloudflare (también forma parte de la URL)
- `"directory": "./public"`: le dice a Cloudflare que los archivos estáticos están en `public/`

### Cloudflare Dashboard
- Project name: `salmo27libreria` (debe coincidir con el `name` de wrangler.jsonc)
- Build command: vacío (HTML puro, no necesita compilación)
- Deploy command: `npx wrangler deploy`
- Root directory path: `/`

## Workflow de Deploy

1. Editas archivos en `public/` (o `.pages.yml`, `wrangler.jsonc` en raíz)
2. `git add .`
3. `git commit` — mensaje en **lenguaje natural** en español, explicando qué se cambió
4. **Preguntar al usuario antes de push**
5. `git push origin main`
6. Cloudflare detecta el push y redeploya en 1-2 minutos (Workers con `npx wrangler deploy`)

## Pages CMS (Catálogo de Libros)

Permite al dueño agregar/editar libros sin tocar código:

1. Ir a https://app.pagescms.org y hacer login con GitHub
2. Seleccionar el repo `salmo27libreria`, rama `main`
3. En el menú lateral → **"Inventario de libros"**
4. Allí puedes agregar, editar o quitar libros con un formulario
5. Al guardar, Pages CMS escribe directamente en `public/data/libros.json` y sube las portadas a `public/images/libros/`
6. Cada cambio dispara un deploy automático en Cloudflare (1-2 min)

## Sistema de Categorías

Los libros se organizan por categoría. El admin las selecciona desde un dropdown en Pages CMS:

- **Biblias** (`biblias`)
- **Literatura cristiana** (`literatura`)
- **Regalos** (`regalos`)

La página `libros.html` tiene botones de filtro ("Todos", "Biblias", "Literatura cristiana", "Regalos") para ver solo libros de una categoría. Cada tarjeta muestra un badge con la categoría.

## Notas Importantes

- **No usar Cloudflare Pages**: este proyecto usa **Cloudflare Workers** con `wrangler.jsonc`. Los archivos deben estar en `public/` y el `wrangler.jsonc` en la raíz.
- **No hacer push sin permiso**: después de cada commit, **preguntar al usuario antes de ejecutar `git push`**. El push activa un deploy automático en Cloudflare.
- **Commit después de cada cambio**: usar `git add .` y `git commit` para registrar cada cambio antes de push.
- **Mensaje de commit en lenguaje natural**: usar frases descriptivas en español (ej. "Agregué las instrucciones de deploy al documento de guía") en lugar de formatos técnicos como `docs: algo`. El mensaje debe explicar claramente qué se cambió y por qué.
- **El push debe ser a `main`**: es la rama que está conectada a Cloudflare.
- **Catálogo dinámico**: la página `libros.html` hace `fetch('/data/libros.json')` y dibuja las tarjetas automáticamente. El link "Catálogo" en la landing page (`index.html`) y el botón "Ver catálogo" del hero apuntan a `libros.html`. Para agregar libros, edita el JSON o usa Pages CMS.
- **La carpeta `public/` es invisible en la URL**: en GitHub el repo tiene `public/` como subcarpeta, pero Cloudflare Workers sirve su contenido como raíz. Así `/data/libros.json` mapea a `public/data/libros.json`.

## Próximos Pasos (para el owner)

1. Ir a https://app.pagescms.org
2. Sign in with GitHub → autorizar la app → seleccionar repo `salmo27libreria`
3. En el menú lateral → "Inventario de libros" → agregar/editar libros
4. Cada cambio guardado se refleja en la web en 1-2 minutos
