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

r.titulo("La opcion de entrega elegida se marca en pantalla");
const MODOS = ["recogo", "centro", "otra"];
env.crearEntregas(MODOS);
env.setModo("recogo");
C.marcarEntrega();
r.check("con recojo queda marcada la primera", env.elegida(0) && !env.elegida(1) && !env.elegida(2));
env.setModo("centro");
C.marcarEntrega();
r.check("al cambiar a Liberia Centro se mueve la marca",
  !env.elegida(0) && env.elegida(1) && !env.elegida(2));
env.setModo("otra");
C.marcarEntrega();
r.check("al elegir otra direccion se mueve la marca",
  !env.elegida(0) && !env.elegida(1) && env.elegida(2));
r.check("el modo elegido se lee correctamente", C.modoEntrega() === "otra", C.modoEntrega());

r.titulo("El campo de direccion solo se pide cuando de verdad hace falta");
const campoDireccion = env.elementos.carritoDireccionCampo;
const asteriscoDireccion = env.elementos.carritoDireccionRequerido;
const ayudaDireccion = env.elementos.carritoDireccionAyuda;
env.setModo("recogo");
C.sincronizarEntrega();
r.check("con recojo en la libreria no se pide direccion", campoDireccion.hidden === true);
r.check("con recojo no hay ni asterisco", asteriscoDireccion.hidden === true);
env.setModo("centro");
C.sincronizarEntrega();
r.check("con Liberia Centro si se puede especificar donde", campoDireccion.hidden === false);
r.check("en Liberia Centro es opcional, asi que sin asterisco", asteriscoDireccion.hidden === true);
r.check("en Liberia Centro la ayuda dice que es opcional",
  /Opcional/.test(ayudaDireccion.textContent), ayudaDireccion.textContent);
env.setModo("otra");
C.sincronizarEntrega();
r.check("con entrega a otra direccion si se pide", campoDireccion.hidden === false);
r.check("a otra direccion si es obligatorio, con asterisco", asteriscoDireccion.hidden === false);
r.check("a otra direccion la ayuda habla de cotizar",
  /confirmamos quanto cuesta/.test(ayudaDireccion.textContent), ayudaDireccion.textContent);
env.setModo("recogo");
C.sincronizarEntrega();
r.check("al volver a recojo se esconde otra vez", campoDireccion.hidden === true);
r.check("y la ayuda se limpia", ayudaDireccion.textContent === "", ayudaDireccion.textContent);

r.titulo("En Liberia Centro la referencia es un extra, no un requisito");
r.check("con Liberia Centro y sin referencia igual abre WhatsApp",
  intentar("centro", "Ana", "") !== null);
r.check("y no marca error de direccion", env.conError("carritoDireccion") === false);
const conRef = decodificar(intentar("centro", "Ana", "Frente al parque, casa 5"));
r.check("si la deja, la referencia viaja al pedido",
  conRef.includes("Referencias: Frente al parque, casa 5"), conRef);
r.check("y el envio sigue con el precio fijo",
  conRef.includes("Entrega en Liberia Centro"), conRef);
const sinRef = decodificar(intentar("centro", "Ana", ""));
r.check("sin referencia no se manda una linea en blanco",
  sinRef.indexOf("Referencias:") === -1, sinRef);

r.titulo("Los campos obligatorios avisan cuando faltan");
intentar("recogo", "", "");
r.check("sin nombre, el nombre queda marcado con error", env.conError("carritoNombre"));
r.check("sin nombre se lee el aviso del nombre",
  env.aviso("carritoErrorNombre") === "Escribí tu nombre para continuar.",
  env.aviso("carritoErrorNombre"));
r.check("la direccion no se marca con recojo, porque no aplica",
  env.conError("carritoDireccion") === false);
r.check("con recojo tampoco sale el aviso de la direccion",
  env.aviso("carritoErrorDireccion") === "", env.aviso("carritoErrorDireccion"));
r.check("el aviso queda escondido, no solo vacio",
  env.elementos.carritoErrorNombre.hidden === false);

intentar("recogo", "Ana", "");
r.check("con nombre lleno el error se borra", env.conError("carritoNombre") === false);
r.check("y el aviso tambien", env.aviso("carritoErrorNombre") === "");

intentar("otra", "Ana", "  ");
r.check("con otra direccion vacia se marca la direccion", env.conError("carritoDireccion"));
r.check("se lee el aviso de la direccion",
  env.aviso("carritoErrorDireccion") === "Escribí la dirección para que te coticemos el envío.",
  env.aviso("carritoErrorDireccion"));

intentar("otra", "", "");
r.check("si faltan los dos se avisa de los dos",
  env.conError("carritoNombre") && env.conError("carritoDireccion"));
r.check("con los dos vacios se leen los dos avisos",
  env.aviso("carritoErrorNombre") !== "" && env.aviso("carritoErrorDireccion") !== "");

intentar("centro", "", "");
r.check("con Liberia Centro vacio solo se pide el nombre",
  env.conError("carritoNombre") && env.conError("carritoDireccion") === false);

intentar("otra", "Ana", "Barrio México, calle 4");
r.check("con todo lleno no queda ningun error marcado",
  env.conError("carritoNombre") === false && env.conError("carritoDireccion") === false);
r.check("con todo lleno los avisos estan escondidos",
  env.elementos.carritoErrorNombre.hidden === true &&
  env.elementos.carritoErrorDireccion.hidden === true);

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