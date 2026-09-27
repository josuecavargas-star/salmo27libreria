# Guía para Agentes de IA — Salvo27 Librería

## Objetivo del Proyecto

Sitio web estático para **Salmo 27 Librería Cristiana** (librería en Liberia, Guanacaste), desplegado gratuitamente con:
- **GitHub** — repositorio fuente con los archivos
- **Cloudflare Workers** — hosting y publicación automática
- **wrangler.jsonc** — configuración de despliegue

URL: `https://salmo27libreria.josuecavargas.workers.dev`

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
└── public/                ← archivos del sitio web
 ├── index.html           ← página principal
 ├── css/styles.css       ← estilos
 ├── js/main.js           ← scripts
 ├── img/                 ← imágenes y logos
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

1. Editas archivos en `public/`
2. `git add .`
3. `git commit -m "descripción del cambio"`
4. `git push origin main`
5. Cloudflare detecta el push y redeploya en 1-2 minutos

## Notas Importantes

- **No usar Cloudflare Pages**: este proyecto usa **Cloudflare Workers** con `wrangler.jsonc`. Los archivos deben estar en `public/` y el `wrangler.jsonc` en la raíz.
- **No hacer push sin permiso**: después de cada commit, **preguntar al usuario antes de ejecutar `git push`**. El push activa un deploy automático en Cloudflare.
- **Commit después de cada cambio**: usar `git add .` y `git commit` para registrar cada cambio antes de push.
- **Mensaje de commit en lenguaje natural**: usar frases descriptivas en español (ej. "Agregué las instrucciones de deploy al documento de guía") en lugar de formatos técnicos como `docs: algo`. El mensaje debe explicar claramente qué se cambió y por qué.
- **El push debe ser a `main`**: es la rama que está conectada a Cloudflare.
- **El push debe ser a `main`**: es la rama que está conectada a Cloudflare.
- **Imágenes**: se suben como assets estáticos, no requieren configuración especial.
