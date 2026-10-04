---
name: buenas noches
description: Usar al terminar de cambiar el comportamiento del sitio, antes de commitear o desplegar, para actualizar la guia del proyecto. Revisa si guia/README.md y AGENTS.md quedaron describiendo lo que el sitio ahora hace.
---

# Buenas noches — cerrar el cambio actualizando la guía

Una función nueva que funciona no está terminada hasta que la guía dice que
existe. Este es el último paso antes de commitear y desplegar.

## Cuándo disparar esta skill

- Después de cambiar algo que el usuario **ve o hace** en el sitio.
- Antes de cada `git commit` que toque `public/`.
- Antes de un despliegue con `wrangler deploy`.
- Cuando el owner pregunte "¿ya actualizaste la guía?".

No hace falta para cambios que no se ven: refactors internos, comentarios,
formato, o pruebas. Sí hace falta en cuanto cambia una regla de negocio, un
precio, un texto de la interfaz, un archivo nuevo, un puerto, o un comando.

## Los dos documentos y quién manda en cada uno

| Documento | Responde a | Ejemplos de qué va ahí |
|---|---|---|
| `AGENTS.md` | ¿Cómo se trabaja en este repo? | Puertos, comandos, reglas de deploy, trampas técnicas, cuándo correr pruebas |
| `guia/README.md` | ¿Qué es y qué hace el sitio? | Estructura de páginas, cómo funciona el carrito, modos de entrega, precios, límites conocidos |

**No mezcles responsabilidades.** Si la duda es "¿qué hace el carrito?", va en
`guia/README.md`. Si es "¿cuándo corro las pruebas?", va en `AGENTS.md`.

`guia/README.md` **no se publica**: vive fuera de `public/`, así que el sitio
nunca la muestra. Editarla no requiere desplegar.

## Procedimiento

1. Listar qué cambió de verdad, en una línea por cambio. Si no se puede
   enumerar, el cambio todavía no está entendido y hay que revisarlo antes.

2. Abrir `guia/README.md` y buscar la sección que describe lo cambiado. Las
   secciones relevantes ya existen: "Carrito de compras", "Entrega", "Cierre de
   la compra", "Límites conocidos". Actualizar en el lugar, no agregar una
   sección paralela que contradiga la vieja.

3. Correr la lista de cotejo de abajo contra lo que cambió.

4. Revisar `AGENTS.md` por si el cambio altera cómo se trabaja en el repo:
   puerto nuevo, comando nuevo, regla nueva, trampa nueva.

5. Si no cambió nada que la guía describa, decirlo explícitamente. "La guía ya
   estaba al día" es una respuesta válida y mejor que inventar texto.

## Lista de cotejo

Preguntarse uno por uno; solo los que apliquen:

- ¿Cambió una **tabla de precios, modos de entrega o reglas de obligatoriedad**?
  Actualizar la tabla y el texto que la acompaña.
- ¿Apareció un campo, botón o mensaje nuevo en la interfaz? Describirlo y decir
  **cuándo aparece y cuándo no**.
- ¿Cambió qué se guarda en `localStorage` o qué datos viajan a WhatsApp?
  Actualizar la sección del checkout.
- ¿Se agregó, movió o renombró un archivo de `public/`? Actualizar el árbol de
  `public/` y la lista de "Archivos".
- ¿Cambió un puerto o un comando de `npm`? Ir a `AGENTS.md`.
- ¿Apareció una trampa técnica que costó tiempo? Ir a `AGENTS.md`, en una sección
  de trampas, para que el próximo no vuelva a tropezar.
- ¿Se yumió el stock, se dejó de descontar, o sigue igual? Solo si cambió.
- ¿Hay pasos de deploy distintos a los documentados? Ir a `AGENTS.md`.

## Reglas para escribir

- Español de Costa Rica, como el resto del proyecto: "vos", "escribí", "agregá".
  Sin tuteo.
- Describir el **comportamiento observable**, no la implementación. "El campo de
  dirección aparece solo cuando hay que cotizar el envío", no "la función
  `actualizarCampoDireccion` hace toggle del `hidden`".
- Poner tablas cuando hay una comparación de opciones. Se leen mejor.
- Si algo es un bug corregido y la corrección fue por una trampa del navegador o
  del CSS, **documentar la trampa**. Es lo que más valor tiene la guía.
- No documentar cosas que no se decidió. Si quedó una duda abierta, dejarla
  marcada como pendiente en vez de inventar la respuesta.

## Antes de editar `guia/README.md` con PowerShell

**No editar este archivo con `Set-Content`, `Out-File` ni `>>`.** Rompe el UTF-8
y "Información" termina guardado como `InformaciÃ³n`. Passos que no funcionan:

1. `git checkout -- guia/README.md`
2. Refacer el cambio con la herramienta `edit`, que respeta UTF-8.

Después de editar, comprobar que el diff no tenga `Ã` ni `Â`:

```bash
git diff guia/README.md | Select-String "^[+-].*(Ã|Â|�)"
```

Si sale algo, está corrupto y hay que rehacerlo.

## Cerrar

- Commitear la guía **en el mismo commit** que el cambio, o en uno de
  seguimiento inmediatamente después. Un cambio de comportamiento sin guía en el
  mismo push deja el repo mintiendo.
- Si ya se hizo deploy, la guía no lo necesita: no se publica. Pero el commit de
  la guía sí tiene que estar pushed.
- Decir al final qué secciones se tocaron, o que la guía ya estaba al día.
