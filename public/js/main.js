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

  /* ===== CATEGORÍAS DEL FORMULARIO (se llenan solas del catálogo) ===== */
  const busquedaSelect = document.getElementById("busqueda");
  if (busquedaSelect) {
    fetch("/data/libros.json")
      .then(function (respuesta) {
        if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
        return respuesta.json();
      })
      .then(function (data) {
        const vistos = new Set();
        const opciones = [];
        (Array.isArray(data) ? data : []).forEach(function (item) {
          const categoria = String(item.categoria || "").trim();
          const clave = categoria.toLowerCase();
          if (categoria && !vistos.has(clave)) {
            vistos.add(clave);
            const opcion = document.createElement("option");
            opcion.value = categoria;
            opcion.textContent = categoria;
            opciones.push(opcion);
          }
        });
        const deTodo = busquedaSelect.querySelector('option[value="De todo un poco"]');
        opciones.forEach(function (opcion) {
          busquedaSelect.insertBefore(opcion, deTodo);
        });
      })
      .catch(function () {
        /* sin catálogo: el desplegable queda solo con "De todo un poco" */
      });
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
