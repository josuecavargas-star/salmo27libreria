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

r.titulo("Iconos de categorias");
const inicio = leer("index.html");
r.check("las tres tarjetas de categoria tienen un SVG",
  (inicio.match(/class="card__icon"[\s\S]*?<svg/g) || []).length === 3,
  "hay " + (inicio.match(/class="card__icon"[\s\S]*?<svg/g) || []).length);
r.check("ya no quedan emojis en las tarjetas",
  !/class="card__icon">[^<]*\p{Extended_Pictographic}/u.test(inicio));
const estilos = fs.readFileSync(path.join(PUBLIC, "css", "styles.css"), "utf8");
r.check("el CSS dimensiona el SVG del icono",
  /\.card__icon svg/.test(estilos));

r.titulo("El panel del carrito se puede desplazar en el celular");
r.check("el cuerpo tiene min-height: 0 para que el scroll funcione",
  /\.carrito-panel__body\s*\{[^}]*min-height:\s*0/.test(carritoCss),
  "falta min-height: 0 en .carrito-panel__body");
r.check("el cuerpo puede desplazarse",
  /\.carrito-panel__body\s*\{[^}]*overflow-y:\s*auto/.test(carritoCss));
r.check("el pie tambien puede desplazarse si no cabe",
  /\.carrito-panel__foot\s*\{[^}]*overflow-y:\s*auto/.test(carritoCss));
r.check("el pie tiene tope de alto para no empujarse fuera de pantalla",
  /\.carrito-panel__foot\s*\{[^}]*max-height/.test(carritoCss));
r.check("la cabecera no se encoge",
  /\.carrito-panel__head\s*\{[^}]*flex:\s*0\s+0\s+auto/.test(carritoCss));
r.check("el boton de finalizar queda fijo al desplazarse",
  /#carritoFinalizar\s*\{[^}]*position:\s*sticky/.test(carritoCss));
r.check("hay reglas para pantallas angostas",
  /@media\s*\(max-width:\s*480px\)/.test(carritoCss));

r.titulo("Las opciones de entrega se ven bien en el celular");
r.check("cada opcion es una fila con borde",
  /\.carrito-entrega\s*\{[^}]*border:/.test(carritoCss));
r.check("cada opcion tiene alto minimo para tocarla facil",
  /\.carrito-entrega\s*\{[^}]*min-height:\s*2\.75rem/.test(carritoCss));
r.check("existe un estado visual para la opcion elegida",
  /\.carrito-entrega--elegida\s*\{/.test(carritoCss));
r.check("el marcado lo hace el JS, no :has()",
  !/\.carrito-entrega:has\(/.test(carritoCss));
const carritoJs = fs.readFileSync(path.join(PUBLIC, "js", "carrito.js"), "utf8");
r.check("el JS agrega y quita la clase de elegida",
  /marcarEntregaElegida/.test(carritoJs) &&
  /classList\.add\("carrito-entrega--elegida"\)/.test(carritoJs) &&
  /classList\.remove\("carrito-entrega--elegida"\)/.test(carritoJs));

r.resumen();