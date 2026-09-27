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

  /* ===== FORMULARIO DE CONTACTO ===== */
  const CONTACT_FORM_URL = "https://script.google.com/macros/s/AKfycbwiBIlYGXbXgAwJJ5ugdCm70cf4W27_eW_qkEWTFVSREmKnZBbuO6dHFTIXX3NDCMkquA/exec";
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nombre = contactForm.nombre.value.trim();
      const email = contactForm.email.value.trim();
      const mensaje = contactForm.mensaje.value.trim();

      if (!nombre || !email || !mensaje) {
        formNote.textContent = "Por favor, completa todos los campos.";
        formNote.style.color = "#7d6b73";
        return;
      }

      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        formNote.textContent = "Por favor, ingresa un email válido.";
        formNote.style.color = "#7d6b73";
        return;
      }

      console.log("Enviando formulario:", { nombre, email, mensaje });

      fetch(CONTACT_FORM_URL, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre, email: email, mensaje: mensaje })
      })
        .then(function (response) {
          console.log("Status:", response.status, "OK:", response.ok);
          if (!response.ok) {
            throw new Error("Error del servidor: " + response.status + " - " + response.statusText);
          }
          return response.json();
        })
        .then(function (data) {
          console.log("Respuesta:", data);
          if (data.status === "success") {
            formNote.textContent = "¡Gracias por tu mensaje! Nos pondremos en contacto pronto.";
            formNote.style.color = "#3b5e5b";
            contactForm.reset();
          } else {
            formNote.textContent = data.msg || "Error al enviar el mensaje.";
            formNote.style.color = "#7d6b73";
          }
        })
        .catch(function (error) {
          console.error("Error completo:", error);
          formNote.textContent = "Error: " + error.message + ". Ver consola para detalles.";
          formNote.style.color = "#7d6b73";
        });
    });
  }
})();
