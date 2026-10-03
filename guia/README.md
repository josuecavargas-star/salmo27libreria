# Guía del Proyecto — Salmo 27 Web

## Información del Proyecto

| Campo | Detalle |
|---|---|
| **Nombre** | Salmo 27 |
| **Tipo** | Librería cristiana |
| **Servicios** | Venta de Biblias, literatura cristiana, artículos cristianos para regalo |
| **Ubicación** | Barrio Condega, iglesia Vida Abundante, Liberia, Guanacaste, Costa Rica |
| **Email** | libreriasalmo27@gmail.com |
| **Teléfono** | +506 6174-5609 |
| **Horario** | Online 24/7 |
| **Logo** | `img/logoprincipal.png` |
| **Paleta de colores** | Verde oscuro, verde azulado, beige, verde musgo, malva, gris azulado claro |

## Paleta de Colores

| Nombre | Hex | Uso |
|---|---|---|
| Verde oscuro / azul noche | `#273A39` | Primary (header, footer, texto principal, fondo hero) |
| Verde azulado / petróleo medio | `#3B5E5B` | Accent, botones, enlaces hover |
| Beige / crema | `#EAE7D4` | Background de la página |
| Verde musgo suave | `#818A7D` | Background de secciones alternas |
| Verde oliva / grisáceo | `#838C7D` | Texto secundario |
| Malva / rosa viejo | `#7D6B73` | Highlights, notas de formulario |
| Gris azulado claro | `#C9D2D0` | Bordes, separadores |

## Estructura de Archivos

```
salmo27libreria/
├── index.html          # Página principal (landing)
├── catalogo.html       # Catálogo de libros (dinámico, carga los JSON)
├── css/
│   └── styles.css      # Estilos con la paleta de colores
├── js/
│   └── main.js         # Funcionalidades (menú móvil, formulario, año dinámico)
├── data/               # Inventario (editado vía Pages CMS)
│   ├── biblias.json
│   ├── literatura.json
│   └── regalos.json
├── images/libros/      # Portadas de libros (subidas vía Pages CMS)
├── img/
│   ├── hero-portada.jpg           # Fondo del hero (usada en styles.css)
│   ├── logoprincipal.png          # Logo principal
│   ├── paleta.jpg                 # Paleta de colores de referencia
│   ├── iconos/                    # Íconos de redes sociales
│   │   ├── facebook.svg
│   │   ├── instagram.svg
│   │   └── whatsapp.svg
│   └── salmo 27 logos/
│       └── Portada-facebook.jpg   # Portada anterior (ya no se usa)
├── material/           # Fuera de public/: NO se publica ni se sube al repo
│   ├── logos/          # Logos y archivos .psd del dueño
│   └── portadas-pendientes/  # Portadas de libros aún no cargadas al catálogo
└── guia/               # Esta guía. Fuera de public/: NO se publica
    └── README.md
```

> Esta guía está **fuera de `public/`** a propósito. `wrangler deploy` sube todo
> lo que hay en `public/`, así que si la documentación viviera adentro quedaría
> accesible por URL para cualquiera que visitara el sitio.

### Sobre `material/`

Los archivos de diseño (.psd) y los logos que el sitio no usa vivían dentro de
`public/`, lo que hacía que cada deploy subiera ~85 MB de archivos que el navegador
nunca carga. Se movieron a `material/`, en la raíz del repositorio:

- **Fuera de `public/`** → Cloudflare no los publica.
- **En `.gitignore`** → no ocupan espacio en el repo de GitHub.

Si alguna vez se necesita un logo en la página, se copia de `material/logos/` a
`public/img/` y se referencia desde el HTML o el CSS.

## Secciones de la Página Web (`index.html`)

1. **Header** — Logo (64px) + navegación (Inicio, Catálogo, Categorías, Nosotros, Contacto). Menú responsive con toggle para móviles. Redes sociales (Facebook, Instagram, WhatsApp) con íconos SVG en `img/iconos/`. Fondo verde sólido `#273A39`.
2. **Hero** — Banner principal con `img/hero-portada.jpg` como fondo + overlay verde semitransparente (`rgba(39,58,57,0.3)` arriba → `rgba(59,94,91,0.9)` abajo). Texto centrado: "Librería Cristiana", "Biblias, literatura y artículos para tu espíritu". Botones de acción centrados. El fondo usa `background-size: cover` y `background-position: center top`, así que en pantallas anchas se recorta por los lados.
3. **Catálogo de Facebook** — Imagen de portada destacada que enlaza a la página de Facebook.
4. **Categorías** — Grid de 3 tarjetas centradas: Biblias, Literatura cristiana, Regalos cristianos.
5. **Sobre nosotros** — Texto institucional sobre la librería en Liberia + estadísticas.
6. **Contacto** — Información de contacto (dirección, teléfono, email, horario) + formulario.
7. **Footer** — Logo agrandado (80px), íconos de redes sociales SVG, año dinámico y texto institucional.

## Tecnologías

- **HTML5** — Estructura semántica, responsive con `viewport`.
- **CSS3** — Variables CSS personalizadas, Grid, Flexbox, media queries (mobile-first + tablet).
- **JavaScript (vanilla)** — `main.js` con IIFE, toggle de menú móvil, año automático en footer, formulario que arma el enlace de WhatsApp, validación de formulario.

## Carrito de compras

El catálogo tiene un carrito que se arma en el navegador y cierra por WhatsApp.
No hay backend ni base de datos: el carrito vive en `localStorage` del cliente.

### Archivos

- `public/js/carrito.js` — toda la lógica: carrito, totales, entrega y checkout.
- `public/css/carrito.css` — estilos del panel deslizante (carga después de `styles.css`).
- `public/catalogo.html` — cada tarjeta tiene un botón "Agregar al carrito".
- `public/index.html` y `public/catalogo.html` cargan `carrito.js`.

El botón flotante y el panel se inyectan desde JS, así que no hay markup que
duplicar entre las dos páginas.

### Entrega

| Opción | Costo |
|---|---|
| Recojo en la librería (Barrio Condega) | ₡0 |
| Entrega en Liberia Centro | ₡1.500 |
| Entrega a otra dirección | a cotizar |

Si se elige la tercera, el panel pide la dirección y **no** calcula un total
cerrado: el mensaje a WhatsApp dice "se cotiza" para que la librería responda
con el monto.

### Cierre de la compra

El botón "Finalizar compra por WhatsApp" abre `https://wa.me/50661745609` con el
pedido formateado: líneas con libro, cantidad y subtotal, total, forma de entrega,
y el número de SINPE (`6174-5609`) indicando que se adjunte el comprobante.

El cliente **tiene que pulsar Enviar y adjuntar la foto del SINPE** — el sitio no
envía nada por sí solo. El carrito se vacía al finalizar.

### Límites conocidos

- El stock se toma del JSON del catálogo al agregar, y **no se descuenta**: dos
  clientes pueden agregar el mismo último ejemplar. Por eso el botón "+" se
  bloquea al llegar al stock guardado.
- El carrito se guarda por navegador. Si el cliente limpia datos del sitio, se
  pierde.
- El precio se muestra en colones con el formato `₡1.500`.

### Pruebas

La carpeta `pruebas/` corre con Node, **sin dependencias externas** (no hay
`node_modules`) ni navegador headless. `pruebas/entorno.js` arma un DOM mínimo
para poder ejercitar `carrito.js` tal cual se usa en el sitio.

```
npm test
```

O por separado:

```
node pruebas/carrito.test.js    # lógica del carrito, stock y formato
node pruebas/checkout.test.js   # mensaje de WhatsApp y validaciones
```

Cubren, entre otras cosas: acentos y ñ, comillas y caracteres especiales, límite
de stock, productos agotados, los tres tipos de entrega, `localStorage` corrupto,
y que no se abra WhatsApp si falta el nombre o la dirección.

**Hay que correrlas después de tocar `carrito.js` o `catalogo.html`.** Es la
única forma de comprobar que el carrito no se rompió.

## Formulario de contacto → WhatsApp

El formulario de la sección Contacto pide tres datos y abre WhatsApp con el
mensaje ya escrito:

1. **Nombre** — campo de texto.
2. **Elige lo que buscas** — desplegable con las categorías del catálogo
   (Biblias, Literatura cristiana, Regalos) más **De todo un poco**.
3. **Descripción del producto** — área de texto.

Al pulsar **Continuar en WhatsApp** se genera un enlace a
`https://wa.me/50661745609` con este mensaje:

```
Hola, quiero consultar por productos de Salmo 27.
Nombre: {nombre}
Busco: {categoría}
Descripción del producto: {descripción}
```

- El texto se codifica con `URLSearchParams`, así que los acentos y la ñ viajan
  bien.
- Si el navegador bloquea la pestaña nueva, se abre en la pestaña actual.
- Los valores se quedan en el formulario para que la persona pueda revisarlos.
- **El mensaje no se envía solo**: la persona tiene que pulsar *Enviar* dentro de
  WhatsApp. Para envío automático haría falta WhatsApp Business Platform con un
  backend.

Ya no se usa Google Apps Script ni la hoja de cálculo. El código del formulario
está en `public/js/main.js`, al final del archivo.

## Publicar (deploy)

El deploy ya **no se hace desde GitHub**. La integración de Cloudflare con el
repo no siempre ha ejecutado los builds de forma confiable, así que el flujo real
es desplegar desde la máquina con Wrangler.

**Requisitos (ya instalados en esta máquina)**
- Node.js v24.19.0 — `winget install OpenJS.NodeJS.LTS`
- Wrangler 4.147.0, vía `npx`, con sesión OAuth iniciada

**Comando**

```
npx.cmd wrangler deploy
```

Se ejecuta desde la raíz del repo. Toma los archivos de `public/` y los publica
en `https://salmo27libreria.josuecavargas.workers.dev`.

**Notas de Windows**
- En PowerShell hay que usar **`npx.cmd`**, no `npx`: la política de ejecución de
  scripts del sistema bloquea el shim `npx.ps1` y el comando falla.
- En una terminal abierta **antes** de instalar Node, `node` y `npx` no están en
  el PATH. Abrir una terminal nueva.
- El login es `npx.cmd wrangler login` (abre el navegador). La sesión queda
  guardada en `C:\Users\josue\AppData\Roaming\xdg.config\.wrangler\`.

**Verificar el deploy** — `wrangler` avisa al final, pero conviene comprobar en
el sitio que los cambios se vean.

## Problemas conocidos

- **El deploy automático desde GitHub no es confiable.** El push a `main` llega
  a GitHub, pero Cloudflare a veces no lanza el build. Por eso el deploy se hace
  con Wrangler. Conviene revisar la integración en el dashboard de Cloudflare.
- **Hay dos repos en GitHub.** `josuecavargas-star/salmo27libreria` es el
  activo. `josuecavargas-star/salmo27` quedó huérfano en septiembre de 2026 y se
  puede borrar para evitar confusiones.
- **La carpeta `guia/` está en la raíz del repo**, fuera de `public/`, para que
  esta documentación no aparezca en el sitio web.

## Estado del Repositorio Git

- **Rama principal**: `main`
- **Remote configurado**: `https://github.com/josuecavargas-star/salmo27libreria.git`
- **Commits recientes**:
  ```
  1e417f4 Agrega al formulario un campo para describir el producto
  51d7910 Simplifica el formulario: nombre + categoría, y abre WhatsApp
  3ac8cf4 Cambia la imagen del hero por la portada Presentación Elegante 2
  180e11c Actualiza la guía: material/ y árbol de archivos corregido
  407e523 Saca del sitio los .psd y logos que no usa (85 MB menos por deploy)
  1512bd8 Actualiza AGENTS.md con las 3 colecciones de Pages CMS
  ed552c4 Separa el inventario en biblias/literatura/regalos.json
  ```

## Contacto

| Campo | Valor |
|---|---|
| **Dirección** | Barrio Condega, iglesia Vida Abundante, Liberia, Guanacaste |
| **Teléfono** | +506 6174-5609 |
| **Email** | libreriasalmo27@gmail.com |
| **Horario** | Online 24/7 |

## Redes Sociales

| Plataforma | URL |
|---|---|
| Facebook | https://www.facebook.com/salmo27libreria |
| Instagram | https://www.instagram.com/salmo27_libreriacristiana |
| WhatsApp | https://api.whatsapp.com/send?phone=%2B50661745609 |

Los enlaces están actualizados en header, catálogo y footer.

## Notas

- No se usan librerías externas (ni Bootstrap, ni jQuery, ni Tailwind).
- El logo `logoprincipal.png` se muestra con colores originales.
- Los íconos SVG usan `filter: brightness(0) invert(1)` para aparecer blancos sobre fondo oscuro.
- La validación del formulario es solo frontend: exige nombre, categoría y descripción antes de abrir WhatsApp.
- Favicon configurado con `logoprincipal.png` y `apple-touch-icon`.
