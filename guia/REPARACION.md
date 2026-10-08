# Reparación de Categorías — Salmo 27

## Qué pasó

El catálogo tenía las categorías codificadas a mano:
`.pages.yml` declaraba 3 colecciones (Biblias, Literatura
Cristiana, Regalos), cada una escribiendo su propio JSON, y
`catalogo.html` hacía fetch hardcodeado de esos 3 archivos,
con los botones de filtro y las etiquetas fijas en el código.

Al intentar agregar categorías nuevas (creando archivos JSON
por categoría, como `biblias-nvi.json`), los productos nuevos
**nunca se veían en la página**, porque el catálogo solo leía
los 3 archivos originales.

## Qué se hizo (2026-10-08)

- **Un solo inventario**: `public/data/libros.json`, donde cada
  producto lleva su campo `categoria` de **texto libre**.
  `.pages.yml` tiene ahora 1 colección: "Inventario de libros".
- **Filtros automáticos**: `catalogo.html` lee ese único JSON
  y genera los botones de filtro solo con las categorías que
  encuentra (normaliza mayúsculas y espacios para agrupar).
- **Formulario de contacto**: el desplegable "Elige lo que
  buscas" (`index.html` + `js/main.js`) se llena solo desde
  el mismo JSON, antes de la opción "De todo un poco".
- **Migración**: los 3 productos que existían pasaron a
  `libros.json` con su categoría (test → Biblias RV1960,
  El Principito → Libros para hombres, Taza Salmo 27 →
  Regalos). Se corrigió el campo `descripcion` de la taza,
  que tenía un espacio al inicio y por eso no se mostraba.
- **Limpieza**: se borraron los JSON por categoría que quedaron
  sin uso. Todo el historial quedó en git.
- **Pruebas y guías**: `pruebas/html.test.js` ahora verifica
  que el catálogo pida `libros.json` y genere los filtros
  dinámicamente; `AGENTS.md` y `guia/README.md` dicen cómo
  funciona todo ahora.

## Cómo se agrega una categoría nueva

Escribirla en el campo **Categoría** de un producto en
Pages CMS (app.pagescms.org → repo `salmo27libreria` →
"Inventario de libros"). Aparece sola en el catálogo y en el
formulario de contacto. Después: `git pull` + `npx.cmd
wrangler deploy` para que se vea en vivo.
