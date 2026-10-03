const fs = require("fs");
const vm = require("vm");

/* --- Stubs mínimos del navegador --- */
const almacen = {};
const sandbox = {
  console,
  URL,
  setTimeout: () => {},
  confirm: () => true,
  window: {},
  localStorage: {
    getItem: (k) => (k in almacen ? almacen[k] : null),
    setItem: (k, v) => { almacen[k] = String(v); },
    removeItem: (k) => { delete almacen[k]; },
  },
  document: {
    readyState: "loading",
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
  },
};
sandbox.window.localStorage = sandbox.localStorage;
sandbox.globalThis = sandbox;

vm.createContext(sandbox);
vm.runInContext(fs.readFileSync("public/js/carrito.js", "utf8"), sandbox);

const C = sandbox.window.Salmo27Carrito;
let fallos = 0;

function check(nombre, condicion, detalle) {
  if (condicion) {
    console.log("  OK   " + nombre);
  } else {
    fallos++;
    console.log("  FALLA " + nombre + (detalle ? "  -> " + detalle : ""));
  }
}

console.log("\n--- Formato de colones ---");
check("1500 -> ₡1.500", C.formatoColones(1500) === "₡1.500", C.formatoColones(1500));
check("0 -> ₡0", C.formatoColones(0) === "₡0", C.formatoColones(0));
check("1234567 -> ₡1.234.567", C.formatoColones(1234567) === "₡1.234.567", C.formatoColones(1234567));

console.log("\n--- Agregar productos ---");
C.agregar({ nombre: "Biblia", precio: 1500, imagen: "/a.jpg", cantidad: 5 });
check("1 producto en el carrito", almacen.salmo27_carrito.includes("Biblia"));
C.agregar({ nombre: "Biblia", precio: 1500, imagen: "/a.jpg", cantidad: 5 });
check("repetido suma cantidad (2)", JSON.parse(almacen.salmo27_carrito)[0].cantidad === 2,
  JSON.stringify(JSON.parse(almacen.salmo27_carrito)[0].cantidad));
C.agregar({ nombre: "Otro", precio: 2500, imagen: "", cantidad: 3 });
check("2 productos distintos", JSON.parse(almacen.salmo27_carrito).length === 2);

console.log("\n--- Mismo nombre, distinta categoria ---");
C.vaciar();
C.agregar({ nombre: "Promesa", precio: 1000, imagen: "", cantidad: 4, categoria: "biblias" });
C.agregar({ nombre: "Promesa", precio: 1000, imagen: "", cantidad: 4, categoria: "regalos" });
check("no los confunde (id incluye categoria)", JSON.parse(almacen.salmo27_carrito).length === 2,
  JSON.stringify(JSON.parse(almacen.salmo27_carrito)));

console.log("\n--- Limite de stock ---");
C.vaciar();
const agotado = { nombre: "Ultimo", precio: 1000, imagen: "", cantidad: 2 };
C.agregar(agotado);
C.agregar(agotado);
C.agregar(agotado);
check("no excede el stock (2 de 2)", JSON.parse(almacen.salmo27_carrito)[0].cantidad === 2,
  JSON.stringify(JSON.parse(almacen.salmo27_carrito)[0].cantidad));

console.log("\n--- Producto agotado ---");
C.vaciar();
C.agregar({ nombre: "Vacio", precio: 1000, imagen: "", cantidad: 0 });
check("no agrega agotado", JSON.parse(almacen.salmo27_carrito).length === 0);

console.log("\n--- Carrito vacio inicial ---");
check("arranca sin datos", almacen.salmo27_carrito === undefined ||
  JSON.parse(almacen.salmo27_carrito || "[]").length === 0);

console.log("\n--- Datos corruptos en localStorage ---");
almacen.salmo27_carrito = "{esto no es json";
C.vaciar();
C.agregar({ nombre: "Recuperado", precio: 500, imagen: "", cantidad: 1 });
check("se recupera de un valor roto", JSON.parse(almacen.salmo27_carrito).length === 1);

console.log(fallos === 0 ? "\nTODO OK\n" : "\n" + fallos + " FALLAS\n");
process.exit(fallos === 0 ? 0 : 1);