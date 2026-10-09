# Guía del Proyecto — Salmo 27 Web

> **Qué es esta guía y cuál no.** Este documento explica **qué es el proyecto y
> cómo funciona por dentro**: la paleta de colores, las secciones de la página, el
> carrito, el formulario, los datos de contacto.
>
> Lo otro —desplegar, correr pruebas, reglas de git, estructura del repositorio—
> está en **`AGENTS.md`**, en la raíz del repo. Ninguna de las dos se publica en el
> sitio web.

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
│   ├── index.json      # Índice de categorías (el catálogo lo lee primero)
│   ├── biblias-reina-valera-1960.json
│   ├── biblias-ntv.json
│   ├── biblias-nvi.json
│   ├── biblias-nbla.json
│   ├── libros-hombres.json
│   ├── libros-mujeres.json
│   ├── libros-jovenes.json
│   ├── libros-familia.json
│   ├── libros-ninos.json
│   ├── devocionales.json
│   ├── articulos-2027.json
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

1. **Header** — Logo (64px) + navegación (Inicio, Catálogo con desplegable de categorías — al pasar el mouse en pantalla grande; en el celular la palabra queda centrada y se abre con la flecha ▾ del borde derecho —, Nosotros, Contacto). El menú está en todas las páginas. Menú responsive con toggle para móviles. Redes sociales (Facebook, Instagram, WhatsApp) con íconos SVG en `img/iconos/`. Fondo verde sólido `#273A39`.
2. **Hero** — Banner principal con `img/hero-portada.jpg` como fondo + overlay verde semitransparente (`rgba(39,58,57,0.3)` arriba → `rgba(59,94,91,0.9)` abajo). Texto centrado: "Librería Cristiana", "Biblias, literatura y artículos para tu espíritu". Botones de acción centrados. El fondo usa `background-size: cover` y `background-position: center top`, así que en pantallas anchas se recorta por los lados.
3. **Catálogo de Facebook** — Imagen de portada destacada que enlaza a la página de Facebook.
4. **Categorías** — Grid de 4 tarjetas enlazadas al catálogo por grupo: Biblias, Literatura cristiana, Regalos, Artículos 2027. Cada una con icono SVG.
5. **Sobre nosotros** — Texto institucional sobre la librería en Liberia + estadísticas.
6. **Contacto** — Información de contacto (dirección, teléfono, email, horario) + formulario.
7. **Footer** — Logo agrandado (80px), íconos de redes sociales SVG, año dinámico y texto institucional.

## Tecnologías

- **HTML5** — Estructura semántica, responsive con `viewport`.
- **CSS3** — Variables CSS personalizadas, Grid, Flexbox, media queries (mobile-first + tablet).
- **JavaScript (vanilla)** — `main.js` con IIFE, toggle de menú móvil, año automático en footer, formulario que arma el enlace de WhatsApp, validación de formulario.

## Categorías

Las categorías son **secciones del CMS**: hay una
colección por categoría en `.pages.yml`, y cada una
escribe su propio JSON en `public/data/`. El
colaborador ve cada categoría en el menú lateral de
Pages CMS y agrega el producto en la sección correcta.

El catálogo (`catalogo.html`) lee `data/index.json`
— una lista que dice qué archivos existen, cómo se
llaman y a qué grupo general pertenecen — y de ahí
carga todos los productos, genera los botones de
filtro y arma el menú de categorías del header: al
pasar el mouse por **Catálogo** se despliegan las
categorías principales con sus subcategorías, y cada
una enlaza al catálogo filtrado (por grupo o por
subcategoría). En el celular el desplegable arranca
cerrado: la palabra "Catálogo" queda centrada en la
fila (sin flechita junto a ella) y la única flecha
es la ▾ del borde derecho, que el usuario toca para
abrir las categorías con animación de desliz. Las
letras del menú son blancas. El formulario de
contacto llena su desplegable desde el mismo índice.

**Para agregar una categoría nueva** (configuración,
no código):

1. Crear una colección en `.pages.yml` (copiar un
   bloque y cambiar `name`, `label` y `path`).
2. Agregar una línea a `data/index.json`:
   `{ "archivo": "nueva.json", "categoria": "Nombre", "grupo": "Grupo" }`.
   El `grupo` es la categoría principal que agrupa
   en el menú y los filtros (ej. "Biblias"); si el
   producto es categoría única, `grupo` lleva el
   mismo nombre que `categoria`.
3. El catálogo la muestra sola.

**Lo que NO hay que hacer** (así se trabó todo antes):

- No crear archivos JSON que no estén listados en
  `index.json`: no se ven en la página nunca.
- No agregar categorías "a mano" en el HTML del
  catálogo: los filtros se generan solos desde el
  índice.
- `index.json` **no** lo edita Pages CMS: hay que
  mantenerlo a mano cuando se crea una colección.

## Carrito de compras

El catálogo tiene un carrito que se arma en el navegador y cierra por WhatsApp.
No hay backend ni base de datos: el carrito vive en `localStorage` del cliente.

### Archivos

- `public/js/carrito.js` — toda la lógica: carrito, totales, entrega y checkout.
- `public/css/carrito.css` — estilos del panel deslizante (carga después de `styles.css`).
- `public/catalogo.html` — cada tarjeta tiene un botón "Agregar al carrito".
- `public/index.html` y `public/catalogo.html` cargan `carrito.js`.
- **Todas las páginas comparten el mismo header** (logo, redes, menú con
  Inicio, Catálogo con el desplegable de categorías, Nosotros, Contacto).
  En `catalogo.html` los enlaces a secciones apuntan a `index.html#...`
  porque esas secciones viven en la página principal.

El botón flotante y el panel se inyectan desde JS, así que no hay markup que
duplicar entre las dos páginas.

### Entrega

| Opción | Costo | ¿Pide lugar? | ¿Obligatorio? |
|---|---|---|---|
| Recojo en la librería (Barrio Condega) | ₡0 | No | — |
| Entrega en Liberia Centro | ₡1.500 | Sí, opcional | No |
| Entrega a otra dirección | a cotizar | Sí | **Sí** |

El campo de dirección **solo aparece en Liberia Centro y en otra dirección**, y su
regla depende del modo, no del precio:

- **Recojo en la librería**: no se muestra. Ya sabemos dónde queda.
- **Liberia Centro**: se muestra pero es **opcional**, sin asterisco, con un texto
  que lo dice. El precio ya está fijo, así que la referencia no hace falta para
  cotizar; es solo una ayuda para que la librería llegue. Si el cliente la
  escribe, viaja al pedido como `Referencias: …`.
- **Entrega a otra dirección**: se muestra y es **obligatoria**, con asterisco.
  El panel **no** calcula un total cerrado: el mensaje a WhatsApp dice "se cotiza"
  para que la librería responda con el monto.

El texto de ayuda bajo el campo también cambia según el modo.

La opción elegida se guarda en una variable aparte (`modoElegido`), no solo en el
radio marcado. Si viviera solo en el DOM, `pintarCarrito()` la perdería cada vez
que el carrito se redibuja — al cambiar una cantidad, quitar un libro, o cerrar y
reabrir el panel.

### Campos obligatorios y avisos

- **Tu nombre** siempre es obligatorio. Lleva asterisco.
- **Dirección** solo es obligatoria cuando la entrega se cotiza (ver tabla).

Si al pulsar "Finalizar compra" faltan campos obligatorios, el panel **no** abre
WhatsApp: marca en rojo cada campo vacío y escribe debajo el aviso
("Escribí tu nombre para continuar." / "Escribí la dirección para que te
coticemos el envío."). Si faltan varios, aparecen todos a la vez.

El aviso se borra solo cuando el cliente empieza a escribir, y también cuando
cambia a un modo donde el campo ya no aplica.

### El atributo `hidden` y `display` del autor

El navegador solo esconde un elemento con `hidden` si el CSS del autor **no**
declara `display` para él: cualquier `display` del autor le gana. Como
`.carrito-campo` usa `display: grid`, `#carritoDireccionCampo` se seguía viendo
aunque el JavaScript lo marcara como oculto.

Por eso `carrito.css` refuerza los `[hidden]` que necesita y además trae una red
de seguridad:

```css
[hidden] {
  display: none !important;
}
```

**Al agregar cualquier elemento nuevo que se oculte con `hidden`, no hay que hacer
nada más: esa regla lo cubre.** Al agregar un `display` a un elemento que ya usa
`hidden`, esa regla sigue ganándole.

### Cierre de la compra

El botón "Finalizar compra por WhatsApp" abre `https://wa.me/50661745609` con el
pedido formateado: líneas con libro, cantidad y subtotal, total, forma de entrega,
y el número de SINPE (`6174-5609`) indicando que se adjunte el comprobante.

Según el modo, el mensaje lleva una línea de lugar distinta:

| Modo | Línea en el mensaje |
|---|---|
| Recojo en la librería | Ninguna: ya se sabe dónde queda |
| Liberia Centro, sin referencia | Ninguna |
| Liberia Centro, con referencia | `Referencias: …` |
| Otra dirección | `Dirección: …` (siempre, porque es obligatoria) |

El cliente **tiene que pulsar Enviar y adjuntar la foto del SINPE** — el sitio no
envía nada por sí solo. El carrito se vacía al finalizar.

### Límites conocidos

- El stock se toma del JSON del catálogo al agregar, y **no se descuenta**: dos
  clientes pueden agregar el mismo último ejemplar. Por eso el botón "+" se
  bloquea al llegar al stock guardado.
- El carrito se guarda por navegador. Si el cliente limpia datos del sitio, se
  pierde.
- El precio se muestra en colones con el formato `₡1.500`.

## Formulario de contacto → WhatsApp

El formulario de la sección Contacto pide tres datos y abre WhatsApp con el
mensaje ya escrito:

1. **Nombre** — campo de texto.
2. **Elige lo que buscas** — desplegable que se llena solo con las
   categorías del índice (`data/index.json`) más **De todo un poco**.
3. **Descripción del producto** — área de texto.

Al pulsar **Enviar información al WhatsApp** se genera un enlace a
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

## Servir el Sitio Localmente

Desde la carpeta `public/`:

```
python -m http.server 8002
```

Abrir `http://localhost:8002`. Ctrl+C para detener.

**Salmo 27 usa el puerto 8002** (el 8000 y el 8001 los ocupan los
sanitarios). Todas las páginas del proyecto comparten el mismo servidor,
cambiando la ruta: Inicio en `http://localhost:8002`, catálogo en
`http://localhost:8002/catalogo.html`.

## Notas

- No se usan librerías externas (ni Bootstrap, ni jQuery, ni Tailwind).
- El logo `logoprincipal.png` se muestra con colores originales.
- Los íconos SVG usan `filter: brightness(0) invert(1)` para aparecer blancos sobre fondo oscuro.
- La validación del formulario es solo frontend: exige nombre, categoría y descripción antes de abrir WhatsApp.
- Favicon configurado con `logoprincipal.png` y `apple-touch-icon`.
