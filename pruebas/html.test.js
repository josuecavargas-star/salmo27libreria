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
r.check("catalogo.html pide el índice de categorías",
  /data\/index\.json/.test(catalogo));
r.check("el catálogo carga los archivos que lista el índice",
  /entrada\.archivo/.test(catalogo) && /Promise\.all/.test(catalogo));
r.check("catalogo.html no trae categorias codificadas a mano",
  !/data-filtro="(biblias|literatura|regalos)"/.test(catalogo));
r.check("el catalogo arma los filtros desde las categorias del JSON",
  /function renderFiltros/.test(catalogo) && /normalizarCategoria/.test(catalogo));
r.check("el catalogo filtra por grupos generales",
  /libro\.grupo/.test(catalogo));
r.check("el catalogo preselecciona el grupo de la URL",
  /URLSearchParams/.test(catalogo) && /aplicarGrupoDeLaUrl/.test(catalogo));

r.titulo("El CSS del carrito respeta hidden");
const carritoCss = fs.readFileSync(path.join(PUBLIC, "css", "carrito.css"), "utf8");
r.check("el panel se oculta cuando tiene el atributo hidden",
  /\.carrito-panel\[hidden\]/.test(carritoCss));
r.check("el overlay se oculta cuando tiene el atributo hidden",
  /\.carrito-overlay\[hidden\]/.test(carritoCss));

r.titulo("Iconos de categorias");
const inicio = leer("index.html");
r.check("las cuatro tarjetas de categoria tienen un SVG",
  (inicio.match(/class="card__icon"[\s\S]*?<svg/g) || []).length === 4,
  "hay " + (inicio.match(/class="card__icon"[\s\S]*?<svg/g) || []).length);
r.check("ya no quedan emojis en las tarjetas",
  !/class="card__icon">[^<]*\p{Extended_Pictographic}/u.test(inicio));
r.check("las tarjetas son enlaces al catálogo",
  (inicio.match(/class="card__link"/g) || []).length === 4);
r.check("cada tarjeta enlaza con su grupo",
  (inicio.match(/catalogo\.html\?grupo=/g) || []).length === 4);
const estilos = fs.readFileSync(path.join(PUBLIC, "css", "styles.css"), "utf8");
r.check("el CSS dimensiona el SVG del icono",
  /\.card__icon svg/.test(estilos));

r.titulo("El formulario de contacto usa las categorias del catalogo");
const mainJs = fs.readFileSync(path.join(PUBLIC, "js", "main.js"), "utf8");
r.check("index.html no codifica las categorias en el desplegable",
  !/<option value="Biblias">/.test(inicio) &&
  !/<option value="Literatura cristiana">/.test(inicio) &&
  !/<option value="Regalos">/.test(inicio));
r.check("main.js llena el desplegable desde el índice de categorías",
  /busquedaSelect/.test(mainJs) && /data\/index\.json/.test(mainJs));

r.titulo("El menú de Catálogo en el header");
r.check("el header ya no enlaza a la sección de categorías",
  !/href="#categorias"/.test(inicio));
r.check("Catálogo del header es el padre del desplegable",
  /nav__item--dropdown/.test(inicio) && /id="navDropdown"/.test(inicio));
r.check("el menú del header no trae categorías codificadas a mano",
  !/class="nav__dropdown-grupo"/.test(inicio));
r.check("main.js llena el menú del header desde el índice",
  /navDropdown/.test(mainJs) &&
  /nav__dropdown-grupo/.test(mainJs) &&
  /nav__dropdown-sub/.test(mainJs));
r.check("el menú agrupa subcategorías bajo su grupo",
  /grupos\.set\(claveGrupo/.test(mainJs) && /subs\.set\(claveCategoria/.test(mainJs));
r.check("el catálogo filtra por subcategoría",
  /libro\.categoria/.test(catalogo) && /params\.get\('categoria'\)/.test(catalogo));
r.check("el CSS despliega el menú al pasar el mouse",
  /\.nav__dropdown\s*\{/.test(estilos) &&
  /\.nav__item--dropdown:hover \.nav__dropdown/.test(estilos));
r.check("el CSS anima la apertura del menú",
  /\.nav__dropdown\s*\{[^}]*opacity:\s*0/.test(estilos) &&
  /\.nav__dropdown\s*\{[^}]*transition/.test(estilos));
r.check("los items del menú se resaltan al pasar el mouse",
  /\.nav__dropdown-sub:hover\s*\{[^}]*box-shadow/.test(estilos) &&
  /\.nav__dropdown-grupo:hover\s*\{[^}]*box-shadow/.test(estilos));
r.check("el menú móvil de Catálogo tiene flecha para abrir",
  /id="navDropdownArrow"/.test(inicio));
r.check("la flecha abre el menú en el celular",
  /navDropdownArrow/.test(mainJs) && /classList\.toggle\("open"\)/.test(mainJs));
r.check("en el celular el desplegable arranca cerrado",
  /@media\s*\(max-width:\s*767px\)[\s\S]*\.nav \.nav__dropdown\s*\{[^}]*max-height:\s*0/.test(estilos));
r.check("en el celular el desplegable se abre con animación",
  /\.nav__item--dropdown\.open \.nav__dropdown\s*\{[^}]*max-height/.test(estilos));
r.check("en el celular las letras del desplegable son blancas",
  /@media\s*\(max-width:\s*767px\)[\s\S]*\.nav \.nav__dropdown-grupo,\s*\.nav \.nav__dropdown-sub\s*\{[^}]*color:\s*var\(--color-white\)/.test(estilos));
r.check("catalogo.html también tiene el menú del header",
  /nav__item--dropdown/.test(catalogo) &&
  /id="navDropdown"/.test(catalogo) &&
  /id="navDropdownArrow"/.test(catalogo));
r.check("catalogo.html carga main.js para el menú",
  /<script[^>]*src="js\/main\.js"/.test(catalogo));
r.check("en el celular la palabra Catálogo queda centrada",
  /@media\s*\(max-width:\s*767px\)[\s\S]*\.nav__item--dropdown \.nav__dropdown-toggle\s*\{[^}]*text-align:\s*center/.test(estilos));

r.titulo("El índice de categorías apunta a archivos que existen");
const indice = JSON.parse(fs.readFileSync(path.join(PUBLIC, "data", "index.json"), "utf8"));
r.check("el índice es una lista", Array.isArray(indice));
for (const entrada of indice) {
  r.check("existe " + entrada.archivo,
    fs.existsSync(path.join(PUBLIC, "data", entrada.archivo)));
  r.check("la entrada tiene categoría",
    String(entrada.categoria || "").trim().length > 0);
}

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

r.titulo("Los campos obligatorios se senalan");
r.check("el nombre lleva asterisco",
  /Tu nombre <span class="carrito-requerido">\*<\/span>/.test(carritoJs));
r.check("la direccion lleva un asterisco que se puede esconder",
  /id="carritoDireccionRequerido"[^>]*hidden>\*</.test(carritoJs));
r.check("ese asterisco solo sale cuando hay que cotizar",
  /asterisco\.hidden = !entrega\.cotizar/.test(carritoJs));
r.check("la ayuda de la direccion cambia segun el modo",
  /AYUDA_ENTREGA\[modo\]/.test(carritoJs) && /id="carritoDireccionAyuda"/.test(carritoJs));
r.check("el asterisco tiene su propio estilo",
  /\.carrito-requerido\s*\{[^}]*color:/.test(carritoCss));
r.check("la direccion arranca escondida",
  /id="carritoDireccionCampo" hidden/.test(carritoJs));
r.check("el nombre se marca obligatorio para lectores de pantalla",
  /id="carritoNombre"[^>]*aria-required="true"/.test(carritoJs));
r.check("Liberia Centro y otra direccion admiten dejar un lugar; recojo no",
  /recogo: \{ etiqueta: [^}]*costo: 0 \}/.test(carritoJs) &&
  /centro: \{[^}]*pideLugar: true/.test(carritoJs) &&
  /otra: \{[^}]*cotizar: true, pideLugar: true/.test(carritoJs));
r.check("el campo se esconde cuando el modo no pide lugar",
  /campo\.hidden = !visible/.test(carritoJs));
r.check("la referencia de Liberia Centro viaja al pedido",
  /if \(direccion\) partes\.push\("Referencias: " \+ direccion\)/.test(carritoJs));
r.check("pintarCarrito deja el campo como corresponde al modo guardado",
  /actualizarTotales\(\);\s*actualizarCampoDireccion\(\);\s*marcarEntregaElegida\(\);/.test(carritoJs));

r.titulo("El campo de direccion se esconde de verdad, no solo en el JS");
r.check("el CSS respeta hidden en el campo de direccion",
  /#carritoDireccionCampo\[hidden\][^{]*\{[^}]*display:\s*none/.test(carritoCss));
r.check("display:grid de .carrito-campo no lo deja asomar",
  /\.carrito-campo\s*\{[^}]*display:\s*grid/.test(carritoCss) &&
  /#carritoDireccionCampo\[hidden\][^{]*\{[^}]*display:\s*none/.test(carritoCss));
const bloquesHidden = carritoCss.match(/\[hidden\][^{]*\{[^}]*\}/g) || [];
r.check("toda regla hidden del carrito pide display:none",
  bloquesHidden.length > 0 &&
  bloquesHidden.every((bloque) => /display:\s*none/.test(bloque)) &&
  bloquesHidden.join("").split("[hidden]").length - 1 ===
    (carritoCss.match(/\[hidden\]/g) || []).length,
  "hay " + (carritoCss.match(/\[hidden\]/g) || []).length + " selectores hidden repartidos en " +
    bloquesHidden.length + " regla(s)");
r.check("el aviso de error tambien respeta hidden",
  /\.carrito-error\[hidden\][^{]*\{[^}]*display:\s*none/.test(carritoCss));
r.check("hidden gana contra cualquier display del autor",
  /\[hidden\]\s*\{[^}]*display:\s*none\s*!important/.test(carritoCss));
r.check("la red de seguridad se declara antes que los display del autor",
  carritoCss.indexOf("[hidden] {\n  display: none !important;") <
    carritoCss.indexOf(".carrito-campo .carrito-error"));

r.titulo("Los campos obligatorios avisan cuando faltan");
r.check("hay un aviso de error por campo",
  /id="carritoErrorNombre"/.test(carritoJs) && /id="carritoErrorDireccion"/.test(carritoJs));
r.check("el aviso de error tiene su estilo",
  /\.carrito-campo \.carrito-error\s*\{[^}]*color:/.test(carritoCss));
r.check("el campo marcado se pinta de rojo",
  /\.carrito-campo input\.es-error/.test(carritoCss));
r.check("la direccion solo es obligatoria cuando se cotiza el envio",
  /MODOS_ENTREGA\[modo\]\.cotizar && !direccion/.test(carritoJs));
r.check("el aviso se anuncia con aria-describedby",
  /aria-describedby="carritoErrorNombre"/.test(carritoJs) &&
  /aria-describedby="carritoErrorDireccion"/.test(carritoJs));

r.resumen();