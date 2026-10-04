const fs = require("fs");
const vm = require("vm");
const path = require("path");

/**
 * Monta un entorno de navegador mínimo para poder ejercitar carrito.js en Node,
 * sin dependencias externas ni navegador headless.
 */

function crearEntorno() {
  const almacen = {};
  const elementos = {};
  const ventanas = [];
  let modoEntrega = { value: "recogo" };
  let etiquetasEntrega = [];

  function crear(id, extra) {
    elementos[id] = Object.assign(
      { value: "", hidden: false, textContent: "", offsetWidth: 0, focus() {} },
      extra || {}
    );
  }

  /* Simula las filas de entrega para poder comprobar el marcado de la elegida */
  function crearEntregas(valores) {
    etiquetasEntrega = valores.map(function (valor) {
      const etiqueta = {
        valor: valor,
        clases: new Set(),
        querySelector: function () { return { value: valor }; },
      };
      etiqueta.classList = {
        add: function (c) { etiqueta.clases.add(c); },
        remove: function (c) { etiqueta.clases.delete(c); },
        contains: function (c) { return etiqueta.clases.has(c); },
      };
      return etiqueta;
    });
  }

  crear("carritoFab", {
    setAttribute() {},
    getAttribute() { return null; },
    classList: { remove() {}, add() {} },
  });

  [
    "carritoBody", "carritoFoot", "carritoPanel", "carritoOverlay",
    "carritoSubtotal", "carritoEnvio", "carritoEnvioLabel", "carritoTotal",
    "carritoDireccionCampo", "carritoNombre", "carritoDireccion",
  ].forEach(function (id) { crear(id); });

  const sandbox = {
    console: console,
    URL: URL,
    setTimeout: function () {},
    confirm: function () { return true; },
    window: {
      open: function (u) { ventanas.push(u); return { opener: null }; },
      location: { href: "" },
    },
    localStorage: {
      getItem: function (k) { return k in almacen ? almacen[k] : null; },
      setItem: function (k, v) { almacen[k] = String(v); },
      removeItem: function (k) { delete almacen[k]; },
    },
    document: {
      readyState: "loading",
      getElementById: function (id) { return elementos[id] || null; },
      querySelector: function (sel) {
        return sel.indexOf("carritoEntrega") !== -1 ? modoEntrega : null;
      },
      querySelectorAll: function (sel) {
        return sel === ".carrito-entrega" ? etiquetasEntrega : [];
      },
      addEventListener: function () {},
      body: {
        classList: { add() {}, remove() {} },
        addEventListener() {},
        insertAdjacentHTML() {},
      },
    },
  };
  sandbox.window.localStorage = sandbox.localStorage;
  sandbox.globalThis = sandbox;

  vm.createContext(sandbox);
  vm.runInContext(
    fs.readFileSync(path.join(__dirname, "..", "public", "js", "carrito.js"), "utf8"),
    sandbox
  );

  return {
    carrito: sandbox.window.Salmo27Carrito,
    almacen: almacen,
    elementos: elementos,
    ventanas: ventanas,
    ultimaVentana: function () { return ventanas[ventanas.length - 1] || null; },
    setModo: function (v) { modoEntrega = { value: v }; },
    crearEntregas: crearEntregas,
    elegida: function (indice) {
      return etiquetasEntrega[indice].clases.has("carrito-entrega--elegida");
    },
    leerCarrito: function () { return JSON.parse(almacen.salmo27_carrito || "[]"); },
  };
}

function crearReporter() {
  let fallos = 0;
  return {
    check: function (nombre, condicion, detalle) {
      if (condicion) {
        console.log("  OK    " + nombre);
      } else {
        fallos++;
        console.log("  FALLA " + nombre + (detalle ? "\n          " + detalle : ""));
      }
    },
    titulo: function (t) { console.log("\n--- " + t + " ---"); },
    resumen: function () {
      console.log(fallos === 0 ? "\nTODO OK\n" : "\n" + fallos + " FALLA(S)\n");
      process.exit(fallos === 0 ? 0 : 1);
    },
  };
}

function decodificar(url) {
  if (!url) return "";
  return decodeURIComponent(new URL(url).searchParams.get("text") || "");
}

module.exports = { crearEntorno: crearEntorno, crearReporter: crearReporter, decodificar: decodificar };