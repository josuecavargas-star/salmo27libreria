(function () {
  "use strict";

  const CLAVE = "salmo27_carrito";
  const WHATSAPP = "50661745609";
  const SINPE = "6174-5609";
  const COSTO_CENTRO = 1500;

  const MODOS_ENTREGA = {
    recogo: { etiqueta: "Recojo en la librería (Barrio Condega)", costo: 0 },
    centro: { etiqueta: "Entrega en Liberia Centro", costo: COSTO_CENTRO },
    otra: { etiqueta: "Entrega a otra dirección", costo: 0, cotizar: true },
  };

  /* ---------- Almacenamiento ---------- */

  function leerCarrito() {
    try {
      const crudo = localStorage.getItem(CLAVE);
      const datos = crudo ? JSON.parse(crudo) : [];
      return Array.isArray(datos) ? datos : [];
    } catch (e) {
      return [];
    }
  }

  function guardarCarrito(items) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch (e) {
      /* modo privado o cuota llena: el carrito sigue funcionando en memoria */
    }
    pintarContador();
  }

  function idItem(item) {
    return (item.categoria || "") + "|" + (item.nombre || "");
  }

  function totalUnidades(items) {
    return items.reduce(function (suma, it) {
      return suma + it.cantidad;
    }, 0);
  }

  function totalSubtotal(items) {
    return items.reduce(function (suma, it) {
      return suma + it.precio * it.cantidad;
    }, 0);
  }

  function formatearColones(numero) {
    return "₡" + Math.round(numero).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function escapar(texto) {
    return String(texto == null ? "" : texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ---------- Operaciones ---------- */

  function agregarItem(producto) {
    const items = leerCarrito();
    const id = idItem(producto);
    const existente = items.find(function (it) {
      return it.id === id;
    });
    const stock = Number(producto.cantidad) || 0;

    if (existente) {
      if (existente.cantidad >= stock) {
        avisar("Solo quedan " + stock + " unidad(es) de \"" + producto.nombre + "\".");
        return;
      }
      existente.cantidad += 1;
    } else {
      if (stock < 1) {
        avisar("Ese producto está agotado.");
        return;
      }
      items.push({
        id: id,
        nombre: producto.nombre,
        precio: Number(producto.precio) || 0,
        imagen: producto.imagen || "",
        stock: stock,
        cantidad: 1,
      });
    }

    guardarCarrito(items);
    pintarCarrito();
    avisar("Agregado: " + producto.nombre);
  }

  function cambiarCantidad(id, delta) {
    const items = leerCarrito();
    const item = items.find(function (it) {
      return it.id === id;
    });
    if (!item) return;

    item.cantidad += delta;

    if (item.cantidad > item.stock) {
      avisar("No hay más unidades disponibles de ese producto.");
      item.cantidad = item.stock;
    }

    guardarCarrito(items.filter(function (it) {
      return it.cantidad > 0;
    }));
    pintarCarrito();
  }

  function vaciarCarrito() {
    guardarCarrito([]);
    pintarCarrito();
  }

  /* ---------- Interfaz ---------- */

  function markupBase() {
    return (
      '<button class="carrito-fab" id="carritoFab" aria-label="Abrir el carrito">' +
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>' +
          '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>' +
        "</svg>" +
        '<span class="carrito-fab__contador" id="carritoContador" hidden>0</span>' +
      "</button>" +
      '<div class="carrito-overlay" id="carritoOverlay" hidden></div>' +
      '<aside class="carrito-panel" id="carritoPanel" aria-label="Carrito de compras" hidden>' +
        '<header class="carrito-panel__head">' +
          "<h2>Tu carrito</h2>" +
          '<button class="carrito-cerrar" id="carritoCerrar" aria-label="Cerrar el carrito">&times;</button>' +
        "</header>" +
        '<div class="carrito-panel__body" id="carritoBody"></div>' +
        '<footer class="carrito-panel__foot" id="carritoFoot"></footer>' +
      "</aside>"
    );
  }

  function opcionesEntrega() {
    return Object.keys(MODOS_ENTREGA)
      .map(function (clave) {
        const modo = MODOS_ENTREGA[clave];
        const costo = modo.cotizar
          ? "se cotiza"
          : modo.costo > 0
            ? formatearColones(modo.costo)
            : "gratis";
        return (
          '<label class="carrito-entrega">' +
            '<input type="radio" name="carritoEntrega" value="' + clave + '"' +
              (clave === "recogo" ? " checked" : "") + " />" +
            "<span>" + escapar(modo.etiqueta) + " — " + costo + "</span>" +
          "</label>"
        );
      })
      .join("");
  }

  function pintarCarrito() {
    const body = document.getElementById("carritoBody");
    const foot = document.getElementById("carritoFoot");
    if (!body || !foot) return;

    const items = leerCarrito();

    if (items.length === 0) {
      body.innerHTML =
        '<div class="carrito-vacio">' +
          "<p>Tu carrito está vacío.</p>" +
          '<p class="carrito-vacio__hint">Agrega libros desde el catálogo para empezar.</p>' +
        "</div>";
      foot.innerHTML = "";
      return;
    }

    body.innerHTML =
      '<ul class="carrito-items">' +
        items
          .map(function (it) {
            const tope = it.cantidad >= it.stock;
            return (
              "<li class=\"carrito-item\">" +
                '<div class="carrito-item__img">' +
                  (it.imagen
                    ? '<img src="' + escapar(it.imagen) + '" alt="" loading="lazy">'
                    : '<span>Sin portada</span>') +
                "</div>" +
                '<div class="carrito-item__datos">' +
                  '<p class="carrito-item__nombre">' + escapar(it.nombre) + "</p>" +
                  '<p class="carrito-item__precio">' + formatearColones(it.precio) + " c/u</p>" +
                  '<div class="carrito-item__controles">' +
                    '<button type="button" data-accion="menos" data-id="' + escapar(it.id) + '" aria-label="Quitar una unidad">&minus;</button>' +
                    '<span>' + it.cantidad + "</span>" +
                    '<button type="button" data-accion="mas" data-id="' + escapar(it.id) + '"' +
                      (tope ? " disabled" : "") +
                      ' aria-label="Agregar una unidad">+</button>' +
                    '<button type="button" class="carrito-item__quitar" data-accion="quitar" data-id="' + escapar(it.id) + '">Quitar</button>' +
                  "</div>" +
                  (tope
                    ? '<p class="carrito-item__tope">Máximo ' + it.stock + " en stock</p>"
                    : "") +
                "</div>" +
                '<div class="carrito-item__subtotal">' + formatearColones(it.precio * it.cantidad) + "</div>" +
              "</li>"
            );
          })
          .join("") +
      "</ul>";

    const datosGuardados = leerDatosCliente();
    const nombreGuardado = datosGuardados.nombre;
    const direccionGuardada = datosGuardados.direccion;

    foot.innerHTML =
      '<div class="carrito-datos">' +
        '<label class="carrito-campo">' +
          "<span>Tu nombre</span>" +
          '<input type="text" id="carritoNombre" placeholder="Nombre de quien recibe" value="' +
            escapar(nombreGuardado) + '" />' +
        "</label>" +
        '<div class="carrito-campo">' +
          "<span>Cómo lo querés recibir</span>" +
          '<div class="carrito-entregas">' + opcionesEntrega() + "</div>" +
        "</div>" +
        '<label class="carrito-campo" id="carritoDireccionCampo" hidden>' +
          "<span>Dirección para la entrega</span>" +
          '<textarea id="carritoDireccion" rows="3" placeholder="Barrio, calle, referencia">' +
            escapar(direccionGuardada) +
          "</textarea>" +
          '<small>Nos mandás la dirección y te confirmamos quanto cuesta el envío.</small>' +
        "</label>" +
      "</div>" +
      '<dl class="carrito-totales">' +
        '<div><dt>Subtotal</dt><dd id="carritoSubtotal">₡0</dd></div>' +
        '<div><dt id="carritoEnvioLabel">Entrega</dt><dd id="carritoEnvio">—</dd></div>' +
        '<div class="carrito-totales__final"><dt>Total</dt><dd id="carritoTotal">₡0</dd></div>' +
      "</dl>" +
      '<button type="button" class="btn btn--primary btn--block" id="carritoFinalizar">' +
        "Finalizar compra por WhatsApp" +
      "</button>" +
      '<button type="button" class="carrito-vaciar" id="carritoVaciar">Vaciar el carrito</button>';

    actualizarTotales();
    marcarEntregaElegida();
  }

  function leerCamposFormulario() {
    return {
      nombre: (document.getElementById("carritoNombre") || {}).value || "",
      direccion: (document.getElementById("carritoDireccion") || {}).value || "",
    };
  }

  function modoEntregaSeleccionado() {
    const marcado = document.querySelector('input[name="carritoEntrega"]:checked');
    return marcado ? marcado.value : "recogo";
  }

  /* Marca visualmente la opcion elegida. Se hace con una clase y no con :has()
     porque :has() no funciona en navegadores mas viejos de Android. */
  function marcarEntregaElegida() {
    const etiquetas = document.querySelectorAll(".carrito-entrega");
    const valor = modoEntregaSeleccionado();
    etiquetas.forEach(function (etiqueta) {
      const input = etiqueta.querySelector("input");
      if (input && input.value === valor) {
        etiqueta.classList.add("carrito-entrega--elegida");
      } else {
        etiqueta.classList.remove("carrito-entrega--elegida");
      }
    });
  }

  function actualizarTotales() {
    const subtotalEl = document.getElementById("carritoSubtotal");
    if (!subtotalEl) return;

    const items = leerCarrito();
    const subtotal = totalSubtotal(items);
    const modo = MODOS_ENTREGA[modoEntregaSeleccionado()];

    subtotalEl.textContent = formatearColones(subtotal);
    document.getElementById("carritoTotal").textContent = formatearColones(subtotal + modo.costo);

    const envioEl = document.getElementById("carritoEnvio");
    const envioLabel = document.getElementById("carritoEnvioLabel");
    if (modo.cotizar) {
      envioEl.textContent = "a cotizar";
      envioLabel.textContent = "Envío";
    } else if (modo.costo > 0) {
      envioEl.textContent = formatearColones(modo.costo);
      envioLabel.textContent = modo.etiqueta;
    } else {
      envioEl.textContent = "gratis";
      envioLabel.textContent = modo.etiqueta;
    }
  }

  function pintarContador() {
    const contador = document.getElementById("carritoContador");
    if (!contador) return;
    const unidades = totalUnidades(leerCarrito());
    contador.textContent = unidades;
    contador.hidden = unidades === 0;
  }

  function avisar(texto) {
    const fab = document.getElementById("carritoFab");
    if (!fab) return;
    fab.setAttribute("data-aviso", texto);
    fab.classList.remove("carrito-fab--aviso");
    void fab.offsetWidth;
    fab.classList.add("carrito-fab--aviso");
    setTimeout(function () {
      fab.classList.remove("carrito-fab--aviso");
      delete fab.getAttribute("data-aviso");
    }, 2600);
  }

  function abrirPanel() {
    document.getElementById("carritoPanel").hidden = false;
    document.getElementById("carritoOverlay").hidden = false;
    document.body.classList.add("carrito-abierto");
    pintarCarrito();
  }

  function cerrarPanel() {
    document.getElementById("carritoPanel").hidden = true;
    document.getElementById("carritoOverlay").hidden = true;
    document.body.classList.remove("carrito-abierto");
  }

  /* ---------- Checkout por WhatsApp ---------- */

  function finalizarCompra() {
    const items = leerCarrito();
    if (items.length === 0) return;

    const campos = leerCamposFormulario();
    const nombre = campos.nombre.trim();
    const modo = modoEntregaSeleccionado();
    const entrega = MODOS_ENTREGA[modo];
    const direccion = campos.direccion.trim();

    if (!nombre) {
      avisar("Escribí tu nombre para continuar.");
      document.getElementById("carritoNombre").focus();
      return;
    }

    if (entrega.cotizar && !direccion) {
      avisar("Escribí la dirección para que te coticemos el envío.");
      document.getElementById("carritoDireccion").focus();
      return;
    }

    const subtotal = totalSubtotal(items);
    const lineas = items
      .map(function (it) {
        return "• " + it.nombre + " (x" + it.cantidad + ") — " + formatearColones(it.precio * it.cantidad);
      })
      .join("\n");

    const partes = [
      "Hola, quiero confirmar este pedido en Salmo 27:",
      "",
      lineas,
      "",
      "Subtotal: " + formatearColones(subtotal),
    ];

    if (entrega.cotizar) {
      partes.push("Envío: " + entrega.etiqueta + " (a cotizar)");
      partes.push("Dirección: " + direccion);
    } else {
      partes.push(entrega.etiqueta + ": " + (entrega.costo > 0 ? formatearColones(entrega.costo) : "gratis"));
    }

    partes.push("");
    partes.push("Quien recibe: " + nombre);
    partes.push("");
    partes.push(
      entrega.cotizar
        ? "Avisame cuánto queda el envío total y te paso la transferencia SINPE."
        : "Total a pagar: " + formatearColones(subtotal + entrega.costo)
    );
    partes.push("Pagá con SINPE Móvil al " + SINPE + " y adjuntame el comprobante, por favor.");

    const url = new URL("https://wa.me/" + WHATSAPP);
    url.searchParams.set("text", partes.join("\n"));

    const ventana = window.open(url.toString(), "_blank");
    if (ventana) {
      ventana.opener = null;
    } else {
      window.location.href = url.toString();
    }

    guardarDatosCliente({ nombre: nombre, direccion: direccion });
    vaciarCarrito();
    cerrarPanel();
  }

  function guardarDatosCliente(datos) {
    try {
      localStorage.setItem(CLAVE + "_cliente", JSON.stringify(datos));
    } catch (e) {
      /* sin persistencia: no es crítico */
    }
  }

  function leerDatosCliente() {
    try {
      const crudo = localStorage.getItem(CLAVE + "_cliente");
      const datos = crudo ? JSON.parse(crudo) : {};
      return {
        nombre: datos.nombre || "",
        direccion: datos.direccion || "",
      };
    } catch (e) {
      return { nombre: "", direccion: "" };
    }
  }

  /* ---------- Arranque ---------- */

  function iniciar() {
    if (!document.body) return;

    document.body.insertAdjacentHTML("beforeend", markupBase());
    pintarContador();
    pintarCarrito();

    document.getElementById("carritoFab").addEventListener("click", function () {
      const panel = document.getElementById("carritoPanel");
      panel.hidden ? abrirPanel() : cerrarPanel();
    });
    document.getElementById("carritoCerrar").addEventListener("click", cerrarPanel);
    document.getElementById("carritoOverlay").addEventListener("click", cerrarPanel);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") cerrarPanel();
    });

    document.body.addEventListener("click", function (e) {
      const boton = e.target.closest("[data-accion]");
      if (boton && boton.dataset.id) {
        const id = boton.dataset.id;
        const accion = boton.dataset.accion;
        if (accion === "mas") cambiarCantidad(id, 1);
        else if (accion === "menos") cambiarCantidad(id, -1);
        else if (accion === "quitar") {
          guardarCarrito(
            leerCarrito().filter(function (it) {
              return it.id !== id;
            })
          );
          pintarCarrito();
        }
        return;
      }

      if (e.target.id === "carritoFinalizar") {
        finalizarCompra();
        return;
      }

      if (e.target.id === "carritoVaciar") {
        if (confirm("¿Vaciar el carrito?")) vaciarCarrito();
        return;
      }

      const agregar = e.target.closest("[data-agregar]");
      if (agregar) {
        agregarItem({
          nombre: agregar.dataset.nombre,
          precio: agregar.dataset.precio,
          imagen: agregar.dataset.imagen,
          cantidad: agregar.dataset.cantidad,
        });
      }
    });

    document.body.addEventListener("change", function (e) {
      if (e.target.name === "carritoEntrega") {
        const campo = document.getElementById("carritoDireccionCampo");
        if (campo) campo.hidden = modoEntregaSeleccionado() !== "otra";
        marcarEntregaElegida();
        actualizarTotales();
      }
    });
  }

  window.Salmo27Carrito = {
    agregar: agregarItem,
    abrir: abrirPanel,
    vaciar: vaciarCarrito,
    finalizar: finalizarCompra,
    formatoColones: formatearColones,
    modoEntrega: modoEntregaSeleccionado,
    marcarEntrega: marcarEntregaElegida,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();