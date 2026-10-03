const fs = require("fs");
const vm = require("vm");

const almacen = {};
let urlAbierta = null;

const elementos = {};
function crear(id, valor) {
  if (valor && typeof valor === "object") {
    elementos[id] = Object.assign(
      { value: "", hidden: false, textContent: "", offsetWidth: 0, focus() {} },
      valor
    );
  } else {
    elementos[id] = { value: valor, hidden: false, textContent: "", focus() {} };
  }
}

crear("carritoNombre", "");
crear("carritoDireccion", "");
crear("carritoFab", { setAttribute() {}, getAttribute() { return null; }, classList: { remove() {}, add() {} } });
crear("carritoBody", null);
crear("carritoFoot", null);
crear("carritoPanel", null);
crear("carritoOverlay", null);
crear("carritoSubtotal", null);
crear("carritoEnvio", null);
crear("carritoEnvioLabel", null);
crear("carritoTotal", null);
crear("carritoDireccionCampo", null);

let modoMarcado = { value: "recogo" };

const sandbox = {
  console,
  URL,
  setTimeout: () => {},
  confirm: () => true,
  window: {
    open: (u) => { urlAbierta = u; return { opener: null }; },
    location: { href: "" },
  },
  localStorage: {
    getItem: (k) => (k in almacen ? almacen[k] : null),
    setItem: (k, v) => { almacen[k] = String(v); },
    removeItem: (k) => { delete almacen[k]; },
  },
  document: {
    readyState: "loading",
    getElementById: (id) => elementos[id] || null,
    querySelector: (sel) => (sel.includes("carritoEntrega") ? modoMarcado : null),
    querySelectorAll: () => [],
    addEventListener: () => {},
    body: { classList: { add() {}, remove() {} }, addEventListener: () => {}, insertAdjacentHTML: () => {} },
  },
};
sandbox.window.localStorage = sandbox.localStorage;
sandbox.globalThis = sandbox;

vm.createContext(sandbox);
vm.runInContext(fs.readFileSync("public/js/carrito.js", "utf8"), sandbox);

const C = sandbox.window.Salmo27Carrito;
let fallos = 0;

function check(nombre, condicion, detalle) {
  if (condicion) console.log("  OK   " + nombre);
  else { fallos++; console.log("  FALLA " + nombre + (detalle ? "\n         -> " + detalle : "")); }
}

function mensaje() {
  return decodeURIComponent(new URL(urlAbierta).searchParams.get("text"));
}

function preparar(modo, direccion) {
  C.vaciar();
  urlAbierta = null;
  modoMarcado = { value: modo };
  elementos.carritoNombre.value = "María";
  elementos.carritoDireccion.value = direccion || "";
  C.agregar({ nombre: "Biblia Reina Valera", precio: 2500, imagen: "", cantidad: 10 });
  C.agregar({ nombre: "Biblia Reina Valera", precio: 2500, imagen: "", cantidad: 10 });
  C.agregar({ nombre: " devotional", precio: 1200, imagen: "", cantidad: 4 });
  C.finalizar();
}

console.log("\n--- Mensaje con recojo en la libreria ---");
preparar("recogo");
check("abre el numero correcto", /^https:\/\/wa\.me\/50661745609\?text=/.test(urlAbierta), urlAbierta);
const m1 = mensaje();
check("menciona el nombre", m1.includes("María"), m1);
check("lista el libro con cantidad 2", m1.includes("Biblia Reina Valera (x2) — ₡5.000"), m1);
check("lista el segundo con cantidad 1", m1.includes("devotional (x1) — ₡1.200"), m1);
check("subtotal ₡6.200", m1.includes("Subtotal: ₡6.200"), m1);
check("recogo sale gratis", m1.includes("Recojo en la librería (Barrio Condega): gratis"), m1);
check("total sin envío ₡6.200", m1.includes("Total a pagar: ₡6.200"), m1);
check("incluye el SINPE", m1.includes("6174-5609"), m1);
check("pide adjuntar el comprobante", m1.includes("adjuntame el comprobante"), m1);
check("el carrito queda vacío tras finalizar", JSON.parse(almacen.salmo27_carrito).length === 0);

console.log("\n--- Entrega en Liberia Centro ---");
preparar("centro");
const m2 = mensaje();
check("cobra ₡1.500 de envío", m2.includes("Entrega en Liberia Centro: ₡1.500"), m2);
check("total ₡7.700", m2.includes("Total a pagar: ₡7.700"), m2);

console.log("\n--- Entrega a otra direccion ---");
preparar("otra", "Barrio México, calle 4, casa 12");
const m3 = mensaje();
check("marca el envio a cotizar", m3.includes("a cotizar"), m3);
check("incluye la direccion", m3.includes("Barrio México, calle 4, casa 12"), m3);
check("no inventa un total cerrado", !m3.includes("Total a pagar"), m3);
check("pide que le avisen el envío", m3.includes("Avisame cuánto queda el envío total"), m3);

console.log("\n--- Validaciones ---");
C.vaciar();
urlAbierta = null;
modoMarcado = { value: "recogo" };
elementos.carritoNombre.value = "   ";
elementos.carritoDireccion.value = "";
C.agregar({ nombre: "X", precio: 100, imagen: "", cantidad: 5 });
C.finalizar();
check("no avanza sin nombre", urlAbierta === null);

C.vaciar();
urlAbierta = null;
modoMarcado = { value: "otra" };
elementos.carritoNombre.value = "Ana";
elementos.carritoDireccion.value = "  ";
C.agregar({ nombre: "Y", precio: 100, imagen: "", cantidad: 5 });
C.finalizar();
check("no avanza sin direccion cuando toca cotizar", urlAbierta === null);

console.log("\n--- Caracteres especiales ---");
C.vaciar();
urlAbierta = null;
modoMarcado = { value: "recogo" };
elementos.carritoNombre.value = "José Ñuño";
elementos.carritoDireccion.value = "";
C.agregar({ nombre: "Libro con \"comillas\" & símbolos <>", precio: 999, imagen: "", cantidad: 2 });
C.finalizar();
const m4 = mensaje();
check("acentos y ñ viajan bien", m4.includes("José Ñuño"), m4);
check("caracteres especiales intactos", m4.includes('Libro con "comillas" & símbolos <>'), m4);
check("la URL sigue siendo valida", (() => { try { new URL(urlAbierta); return true; } catch { return false; } })());

console.log(fallos === 0 ? "\nTODO OK\n" : "\n" + fallos + " FALLAS\n");
process.exit(fallos === 0 ? 0 : 1);