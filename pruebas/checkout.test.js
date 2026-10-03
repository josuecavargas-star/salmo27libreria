/**
 * Pruebas del cierre de compra: mensaje que llega por WhatsApp, las tres formas
 * de entrega y las validaciones que impiden enviar un pedido incompleto.
 *
 *   node pruebas/checkout.test.js
 */

const { crearEntorno, crearReporter, decodificar } = require("./entorno");

const env = crearEntorno();
const r = crearReporter();
const C = env.carrito;

function preparar(modo, direccion) {
  C.vaciar();
  env.ventanas.length = 0;
  env.setModo(modo);
  env.elementos.carritoNombre.value = "María";
  env.elementos.carritoDireccion.value = direccion || "";
  C.agregar({ nombre: "Biblia Reina Valera", precio: 2500, imagen: "", cantidad: 10 });
  C.agregar({ nombre: "Biblia Reina Valera", precio: 2500, imagen: "", cantidad: 10 });
  C.agregar({ nombre: "Devocional", precio: 1200, imagen: "", cantidad: 4 });
  C.finalizar();
  return decodificar(env.ultimaVentana());
}

r.titulo("Recojo en la libreria");
const m1 = preparar("recogo");
r.check("abre el numero de WhatsApp de la libreria",
  /^https:\/\/wa\.me\/50661745609\?text=/.test(env.ultimaVentana() || ""), env.ultimaVentana());
r.check("menciona el nombre de quien recibe", m1.includes("María"), m1);
r.check("lista el libro con su cantidad y subtotal", m1.includes("Biblia Reina Valera (x2) — ₡5.000"), m1);
r.check("lista el segundo articulo", m1.includes("Devocional (x1) — ₡1.200"), m1);
r.check("el subtotal es ₡6.200", m1.includes("Subtotal: ₡6.200"), m1);
r.check("el recojo aparece como gratis",
  m1.includes("Recojo en la librería (Barrio Condega): gratis"), m1);
r.check("el total no suma envio", m1.includes("Total a pagar: ₡6.200"), m1);
r.check("incluye el numero de SINPE", m1.includes("6174-5609"), m1);
r.check("pide adjuntar el comprobante", m1.includes("adjuntame el comprobante"), m1);
r.check("el carrito queda vacio al finalizar", env.leerCarrito().length === 0);

r.titulo("Entrega en Liberia Centro");
const m2 = preparar("centro");
r.check("suma ₡1.500 de envio", m2.includes("Entrega en Liberia Centro: ₡1.500"), m2);
r.check("el total sube a ₡7.700", m2.includes("Total a pagar: ₡7.700"), m2);

r.titulo("Entrega a otra direccion");
const m3 = preparar("otra", "Barrio México, calle 4, casa 12");
r.check("marca el envio como a cotizar", m3.includes("a cotizar"), m3);
r.check("incluye la direccion del cliente", m3.includes("Barrio México, calle 4, casa 12"), m3);
r.check("no inventa un total cerrado", m3.indexOf("Total a pagar") === -1, m3);
r.check("le pide a la libreria que cotice", m3.includes("Avisame cuánto queda el envío total"), m3);

r.titulo("Pedidos incompletos");
function intentar(modo, nombre, direccion) {
  C.vaciar();
  env.ventanas.length = 0;
  env.setModo(modo);
  env.elementos.carritoNombre.value = nombre;
  env.elementos.carritoDireccion.value = direccion;
  C.agregar({ nombre: "Articulo", precio: 100, imagen: "", cantidad: 5 });
  C.finalizar();
  return env.ultimaVentana();
}
r.check("no abre WhatsApp sin nombre", intentar("recogo", "   ", "") === null);
r.check("no abre WhatsApp sin direccion cuando hay que cotizar", intentar("otra", "Ana", "  ") === null);
r.check("si abre con nombre y direccion completos",
  intentar("otra", "Ana", "Barrio Condega, frente a la iglesia") !== null);

r.titulo("Acentos y caracteres especiales");
C.vaciar();
env.ventanas.length = 0;
env.setModo("recogo");
env.elementos.carritoNombre.value = "José Ñuño";
env.elementos.carritoDireccion.value = "";
C.agregar({ nombre: 'Libro con "comillas" & símbolos <>', precio: 999, imagen: "", cantidad: 2 });
C.finalizar();
const m4 = decodificar(env.ultimaVentana());
r.check("la ñ y los acentos viajan bien", m4.includes("José Ñuño"), m4);
r.check("las comillas y el signo & se conservan",
  m4.includes('Libro con "comillas" & símbolos <>'), m4);
r.check("la URL sigue siendo valida", (function () {
  try { new URL(env.ultimaVentana()); return true; } catch (e) { return false; }
})());

r.resumen();