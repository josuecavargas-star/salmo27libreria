# Guía para Agentes de IA — Salmo 27 Librería

## Objetivo del Proyecto

Sitio web estático para **Salmo 27 Librería Cristiana** (librería en Liberia, Guanacaste), desplegado gratuitamente con:
- **GitHub** — repositorio fuente con los archivos
- **Cloudflare Workers** — hosting y publicación automática
- **wrangler.jsonc** — configuración de despliegue

URL: `https://salmo27libreria.josuecavargas.workers.dev`
Catálogo libros: `https://salmo27libreria.josuecavargas.workers.dev/catalogo.html`
JSON inventario: `/data/biblias.json`, `/data/literatura.json`, `/data/regalos.json`

## Estado Actual

- ✅ Repo de GitHub activo: `josuecavargas-star/salmo27libreria`
- ⚠️ Repo viejo y huérfano: `josuecavargas-star/salmo27` (parado en septiembre de 2026, se puede borrar)
- ✅ Cloudflare Workers configurado y deployado (sitio en vivo)
- ✅ Landing page (`index.html`) desplegada y funcionando (HTTP 200)
- ✅ Catálogo dinámico (`catalogo.html`) conectado desde el menú "Catálogo" de la landing
- ✅ Catálogo de libros (`catalogo.html`) desplegado y funcionando (HTTP 200)
- ✅ JSON de inventario accesibles (los 3, HTTP 200)
- ✅ Pages CMS configurado (`.pages.yml` con 3 colecciones: Biblias, Literatura Cristiana, Regalos)
- ✅ Sistema de inventario (cantidad) activo: muestra Agotado / Últimas unidades / En stock
- ✅ Formulario de contacto abre WhatsApp con el mensaje armado (nombre + categoría + descripción)
- ✅ Hero usa `img/hero-portada.jpg` (la portada anterior quedó sin uso en `img/salmo 27 logos/`)

## Arquitectura

```
TÚ (editas archivos)
  │
  ▼
git commit + git push  ──▶  GitHub (repositorio, respaldo del código)
  │
  ▼
npx.cmd wrangler deploy  ──▶  Cloudflare Workers
  │
  ▼
Visitantes ven tu página
```

**El deploy NO es automático.** Ver "Workflow de Deploy".

## Estructura del Repositorio

```
salmo27libreria/
├── AGENTS.md              ← esta guía
├── wrangler.jsonc         ← config de Cloudflare Workers
├── .pages.yml             ← config de Pages CMS (catálogo de libros)
├── .gitignore             ← ignora *.psd, archivos del sistema y material/
├── material/              ← FUERA de public/: no se publica ni se sube al repo
│   ├── logos/             ← logos y .psd del dueño
│   └── portadas-pendientes/  ← portadas de libros aún no cargadas al catálogo
├── guia/                  ← FUERA de public/: documentación interna, no se publica
│   └── README.md            ← guía del proyecto
└── public/                ← archivos del sitio web
 ├── index.html           ← landing page principal
 ├── catalogo.html          ← página de catálogo de libros (dinámica)
 ├── css/styles.css       ← estilos
 ├── js/main.js           ← scripts
 ├── data/
 │   ├── biblias.json      ← inventario de Biblias (editado vía Pages CMS)
 │   ├── literatura.json   ← inventario de Literatura (editado vía Pages CMS)
 │   └── regalos.json      ← inventario de Regalos (editado vía Pages CMS)
 ├── img/                 ← imágenes y logos del sitio
 │   ├── hero-portada.jpg  ← fondo del hero (la usa styles.css)
 │   ├── logoprincipal.png
 │   ├── iconos/           ← facebook.svg, instagram.svg, whatsapp.svg
 │   └── salmo 27 logos/   ← solo la portada anterior, ya sin uso
 ├── images/libros/        ← portadas de libros (subidas vía Pages CMS)
 │   └── .gitkeep
```

`guia/` está **fuera** de `public/`, en la raíz del repo, para que la
documentación no se publique en el sitio web.

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

**El deploy se hace con Wrangler desde la máquina, NO con el push a GitHub.** La
integración de Cloudflare con el repo no siempre lanza el build, y ya se quedó
sin publicar un commit completo.

1. Editas archivos en `public/` (o `.pages.yml`, `wrangler.jsonc` en raíz)
2. Verificas en local (ver "Vista previa local")
3. `git add .` y `git commit` — mensaje en **lenguaje natural** en español
4. **Preguntar al usuario antes de push**
5. `git push origin main`
6. `npx.cmd wrangler deploy` — desde la raíz del repo, sube `public/` al Worker

### Trampas de Windows

- Usar **`npx.cmd`**, nunca `npx`: la política de ejecución de PowerShell bloquea
  el shim `npx.ps1` y el comando falla con "running scripts is disabled".
- Si la terminal se abrió **antes** de instalar Node, `npx` no está en el PATH.
  Abrir una terminal nueva, o prependear:
  `$env:Path += ";C:\Program Files\nodejs"`
- Requiere sesión iniciada: `npx.cmd wrangler login` (abre el navegador).

### Ojo: el deploy sube el disco, no el commit

`wrangler deploy` publica **lo que hay en `public/` en ese momento**, esté
committeado o no. Si se despliega con cambios sin commitear, el sitio los muestra
pero GitHub no los tiene. Commitear **antes** de desplegar.

## Vista previa local

Desde la carpeta `public/`:

```
python -m http.server 8000
```

Abrir `http://localhost:8000`. Ctrl+C para detener.

## Pages CMS (Catálogo de Productos)

Permite al dueño agregar/editar productos sin tocar código. Hay **3 colecciones separadas** por categoría:

1. Ir a https://app.pagescms.org y hacer login con GitHub
2. Seleccionar el repo `salmo27libreria`, rama `main`
3. En el menú lateral verás **3 secciones**: "Biblias", "Literatura Cristiana", "Regalos"
4. Cada sección tiene su propio formulario para agregar/editar/quitar productos
5. Al guardar, Pages CMS escribe en `public/data/{categoria}.json` y sube portadas a `public/images/libros/`
6. Cada cambio queda en un commit de Pages CMS. **El deploy hay que hacerlo a mano** con `npx.cmd wrangler deploy`

## Formulario de Contacto

No hay backend. El formulario de `index.html` pide nombre, categoría y
descripción, y arma un enlace a `https://wa.me/50661745609` con esos datos. El
código está al final de `public/js/main.js`.

- La persona tiene que pulsar **Enviar** dentro de WhatsApp; el sitio no envía nada.
- Para envío automático haría falta WhatsApp Business Platform con un backend.
- La validación es solo frontend.

## Notas Importantes

- **No usar Cloudflare Pages**: este proyecto usa **Cloudflare Workers** con `wrangler.jsonc`. Los archivos deben estar en `public/` y el `wrangler.jsonc` en la raíz.
- **El push no despliega**: no confiar en que Cloudflare reaccione al push. Desplegar con `npx.cmd wrangler deploy`.
- **No hacer push sin permiso**: después de cada commit, **preguntar al usuario antes de ejecutar `git push`**.
- **Commit antes de deploy**: `wrangler deploy` publica lo que hay en disco. Si se despliega sin commitear, el sitio y GitHub quedan distintos.
- **Commit después de cada cambio**: usar `git add .` y `git commit` para registrar cada cambio antes de push. `material/` está en `.gitignore`, así que `git add .` es seguro.
- **Mensaje de commit en lenguaje natural**: usar frases descriptivas en español (ej. "Agregué las instrucciones de deploy al documento de guía") en lugar de formatos técnicos como `docs: algo`. El mensaje debe explicar claramente qué se cambió y por qué.
- **El push debe ser a `main`**: es la rama que está conectada a Cloudflare.
- **Catálogo dinámico**: la página `catalogo.html` hace `fetch` de 3 archivos JSON (`biblias.json`, `literatura.json`, `regalos.json`) en paralelo, agrega la categoría a cada producto y dibuja las tarjetas. El link "Catálogo" en la landing page (`index.html`) y el botón "Ver catálogo" del hero apuntan a `catalogo.html`.
- **La carpeta `public/` es invisible en la URL**: en GitHub el repo tiene `public/` como subcarpeta, pero Cloudflare Workers sirve su contenido como raíz. Así `/data/biblias.json` mapea a `public/data/biblias.json`.
- **`guia/` NO se publica**: la documentación vive fuera de `public/`, así que no es accesible por URL. No moverla adentro.
- **Los .psd y logos sin uso están en `material/`**: fuera de `public/` (no se publican) y en `.gitignore` (no van al repo). Si el sitio necesita un logo, copiarlo a `public/img/` y referenciarlo.

## Próximos Pasos (para el owner)

1. Ir a https://app.pagescms.org
2. Sign in with GitHub → autorizar la app → seleccionar repo `salmo27libreria`
3. En el menú lateral → "Biblias", "Literatura Cristiana", "Regalos" → agregar/editar productos
4. Cada cambio guardado genera un commit; hay que correr `npx.cmd wrangler deploy` para publicarlo
5. Avisar que las consultas del formulario llegan por **WhatsApp**, ya no por correo

## Pendiente

- Revisar en el dashboard de Cloudflare por qué la integración con GitHub no lanza los builds.
- Borrar el repo huérfano `josuecavargas-star/salmo27`.
