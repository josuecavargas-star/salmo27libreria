/**
 * Comprobaciones estructurales del HTML y de los archivos que las paginas
 * necesitan. Una etiqueta mal cerrada rompe la pagina entera sin que ninguna
 * otra prueba lo note: esto lo detecta.
 *
 *   node pruebas/html.test.js
 */

const fs = require("fs");
const path = require("path");
const { crearReporter } = require("./entorno");

const r = crearReporter();
const PUBLIC = path.join(__dirname, "..", "public");

const PAGINAS = ["index.html", "catalogo.html"];

function leer(nombre) {
  return fs.readFileSync(path.join(PUBLIC, nombre), "utf8");
}

function contar(texto, patron) {
  return (texto.match(patron) || []).length;
}

r.titulo("Etiquetas de script balanceadas");
for (const pagina of PAGINAS) {
  const html = leer(pagina);
  const abiertos = contar(html, /<script\b/g);
  const cerrados = contar(html, /<\/script>/g);
  r.check(
    pagina + " cierra todos los <script>",
    abiertos === cerrados,
    "abiertos " + abiertos + ", cerrados " + cerrados
  );
}

r.titulo("Archivos que las paginas necesitan");
for (const pagina of PAGINAS) {
  const html = leer(pagina);
  const scripts = html.match(/<script[^>]*\bsrc="([^"]+)"/g) || [];
  const hojas = html.match(/<link[^>]*rel="stylesheet"[^>]*\bhref="([^"]+)"/g) || [];

  const rutas = [];
  for (const m of scripts) rutas.push(m.match(/src="([^"]+)"/)[1]);
  for (const m of hojas) rutas.push(m.match(/href="([^"]+)"/)[1]);

  for (const ruta of rutas) {
    if (/^(https?:)?\/\//.test(ruta)) continue;
    r.check(
      pagina + " -> " + ruta + " existe",
      fs.existsSync(path.join(PUBLIC, ruta)),
      "falta public/" + ruta
    );
  }
}

r.titulo("El catalogo carga el carrito");
const catalogo = leer("catalogo.html");
r.check("catalogo.html incluye js/carrito.js", /<script[^>]*src="js\/carrito\.js"/.test(catalogo));
r.check("catalogo.html cierra el script antes de cargar carrito.js",
  catalogo.indexOf("</script>") < catalogo.indexOf("js/carrito.js"));
r.check("catalogo.html pide los tres JSON del inventario",
  /data\/biblias\.json/.test(catalogo) &&
  /data\/literatura\.json/.test(catalogo) &&
  /data\/regalos\.json/.test(catalogo));

r.titulo("El CSS del carrito respeta hidden");
const carritoCss = fs.readFileSync(path.join(PUBLIC, "css", "carrito.css"), "utf8");
r.check("el panel se oculta cuando tiene el atributo hidden",
  /\.carrito-panel\[hidden\]/.test(carritoCss));
r.check("el overlay se oculta cuando tiene el atributo hidden",
  /\.carrito-overlay\[hidden\]/.test(carritoCss));

r.resumen();