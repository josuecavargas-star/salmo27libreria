/**
 * Pruebas de la lógica del carrito: almacenamiento, deduplicación, límites de
 * stock, formato de precios y recuperación ante datos corruptos.
 *
 *   node pruebas/carrito.test.js
 */

const { crearEntorno, crearReporter } = require("./entorno");

const env = crearEntorno();
const r = crearReporter();
const C = env.carrito;

r.titulo("Formato de colones");
r.check("1500 se muestra como ₡1.500", C.formatoColones(1500) === "₡1.500", C.formatoColones(1500));
r.check("0 se muestra como ₡0", C.formatoColones(0) === "₡0", C.formatoColones(0));
r.check("1234567 se muestra como ₡1.234.567", C.formatoColones(1234567) === "₡1.234.567", C.formatoColones(1234567));

r.titulo("Agregar productos");
C.agregar({ nombre: "Biblia", precio: 1500, imagen: "/a.jpg", cantidad: 5 });
r.check("el primer producto queda en el carrito", env.leerCarrito().length === 1);
C.agregar({ nombre: "Biblia", precio: 1500, imagen: "/a.jpg", cantidad: 5 });
r.check("agregar dos veces suma la cantidad (2)", env.leerCarrito()[0].cantidad === 2,
  "quedó " + env.leerCarrito()[0].cantidad);
C.agregar({ nombre: "Otro", precio: 2500, imagen: "", cantidad: 3 });
r.check("un producto distinto se agrega aparte", env.leerCarrito().length === 2);

r.titulo("Mismo nombre en categorias distintas");
C.vaciar();
C.agregar({ nombre: "Promesa", precio: 1000, imagen: "", cantidad: 4, categoria: "biblias" });
C.agregar({ nombre: "Promesa", precio: 1000, imagen: "", cantidad: 4, categoria: "regalos" });
r.check("no confunde dos articulos con el mismo nombre",
  env.leerCarrito().length === 2,
  JSON.stringify(env.leerCarrito().map(function (i) { return i.id; })));

r.titulo("Limite de stock");
C.vaciar();
const ultimo = { nombre: "Ultimo ejemplar", precio: 1000, imagen: "", cantidad: 2 };
C.agregar(ultimo);
C.agregar(ultimo);
C.agregar(ultimo);
r.check("no deja agregar mas de lo que hay (2 de 2)", env.leerCarrito()[0].cantidad === 2,
  "quedó " + env.leerCarrito()[0].cantidad);

r.titulo("Producto agotado");
C.vaciar();
C.agregar({ nombre: "Sin existencias", precio: 1000, imagen: "", cantidad: 0 });
r.check("no agrega un producto agotado", env.leerCarrito().length === 0);
C.agregar({ nombre: "Sin cantidad", precio: 1000, imagen: "", cantidad: undefined });
r.check("tampoco si la cantidad viene vacía", env.leerCarrito().length === 0);

r.titulo("Datos corruptos en el navegador");
env.almacen.salmo27_carrito = "{esto no es json";
C.agregar({ nombre: "Recuperado", precio: 500, imagen: "", cantidad: 1 });
r.check("se recupera si el contenido guardado estaba roto", env.leerCarrito().length === 1);

r.titulo("Vaciar");
C.vaciar();
r.check("vaciar deja el carrito en cero", env.leerCarrito().length === 0);

r.resumen();