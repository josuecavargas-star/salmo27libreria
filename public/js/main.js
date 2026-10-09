(function () {
  "use strict";

  /* ===== MENÚ MÓVIL ===== */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });

    /* Cerrar menú al hacer clic en un enlace */
    const navLinks = nav.querySelectorAll("a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });
  }

  /* ===== AÑO EN EL FOOTER ===== */
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ===== CATEGORÍAS (se llenan solas del índice) ===== */
  const busquedaSelect = document.getElementById("busqueda");
  const navDropdown = document.getElementById("navDropdown");

  if (busquedaSelect || navDropdown) {
    fetch("/data/index.json")
      .then(function (respuesta) {
        if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
        return respuesta.json();
      })
      .then(function (indice) {
        const entradas = Array.isArray(indice) ? indice : [];
        if (busquedaSelect) {
          llenarDesplegableDeContacto(entradas);
        }
        if (navDropdown) {
          llenarMenuDeCategorias(entradas);
        }
      })
      .catch(function () {
        /* sin índice: el desplegable queda solo con "De todo un poco"
           y el menú de Catálogo queda solo con el enlace */
      });
  }

  function llenarDesplegableDeContacto(entradas) {
    const vistos = new Set();
    entradas.forEach(function (entrada) {
      const grupo = String(entrada.grupo || "").trim();
      const clave = grupo.toLowerCase();
      if (grupo && !vistos.has(clave)) {
        vistos.add(clave);
        const opcion = document.createElement("option");
        opcion.value = grupo;
        opcion.textContent = grupo;
        const deTodo = busquedaSelect.querySelector('option[value="De todo un poco"]');
        busquedaSelect.insertBefore(opcion, deTodo);
      }
    });
  }

  /* El menú "Catálogo" del header: una categoría principal
     (grupo) por cada grupo del índice, y debajo sus
     subcategorías. Todo sale de data/index.json. */
  function llenarMenuDeCategorias(entradas) {
    const grupos = new Map();
    entradas.forEach(function (entrada) {
      const grupo = String(entrada.grupo || "").trim();
      if (!grupo) return;
      const claveGrupo = grupo.toLowerCase();
      if (!grupos.has(claveGrupo)) {
        grupos.set(claveGrupo, { etiqueta: grupo, subs: new Map() });
      }
      const categoria = String(entrada.categoria || "").trim();
      const claveCategoria = categoria.toLowerCase();
      if (categoria && claveCategoria !== claveGrupo) {
        grupos.get(claveGrupo).subs.set(claveCategoria, categoria);
      }
    });

    const partes = [];
    grupos.forEach(function (grupo) {
      partes.push(
        '<a class="nav__dropdown-grupo" href="catalogo.html?grupo=' +
          encodeURIComponent(grupo.etiqueta) + '">' +
          escaparHtml(grupo.etiqueta) + '</a>'
      );
      grupo.subs.forEach(function (etiqueta) {
        partes.push(
          '<a class="nav__dropdown-sub" href="catalogo.html?categoria=' +
            encodeURIComponent(etiqueta) + '">' +
            escaparHtml(etiqueta) + '</a>'
        );
      });
    });
    navDropdown.innerHTML = partes.join("");
  }

  function escaparHtml(texto) {
    return String(texto == null ? "" : texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

/* ===== FORMULARIO DE CONTACTO ===== */
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  if (contactForm && formNote) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nombre = contactForm.nombre.value.trim();
      const busqueda = contactForm.busqueda.value.trim();
      const descripcion = contactForm.descripcion.value.trim();

      if (!nombre || !busqueda || !descripcion) {
        formNote.style.color = "#7d6b73";
        formNote.textContent = "Por favor completa todos los campos.";
        return;
      }

      const whatsappText = [
        "Hola, quiero consultar por productos de Salmo 27.",
        `Nombre: ${nombre}`,
        `Busco: ${busqueda}`,
        `Descripción del producto: ${descripcion}`,
      ].join("\n");
      const whatsappUrl = new URL("https://wa.me/50661745609");
      whatsappUrl.searchParams.set("text", whatsappText);

      const whatsappWindow = window.open(whatsappUrl.toString(), "_blank");
      if (whatsappWindow) {
        whatsappWindow.opener = null;
      } else {
        window.location.href = whatsappUrl.toString();
      }

      formNote.style.color = "#3b5e5b";
      formNote.textContent = "Revisa el mensaje en WhatsApp y pulsa Enviar para escribirnos.";
    });
  }
})();
