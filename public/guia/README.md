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
├── guia/
│   └── README.md       # Esta guía
└── material/           # Fuera de public/: NO se publica ni se sube al repo
    ├── logos/          # Logos y archivos .psd del dueño
    └── portadas-pendientes/  # Portadas de libros aún no cargadas al catálogo
```

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
2. **Hero** — Banner principal con imagen de portada de Facebook como fondo + overlay verde semitransparente. Texto centrado: "Librería Cristiana", "Biblias, literatura y artículos para tu espíritu". Botones de acción centrados.
3. **Catálogo de Facebook** — Imagen de portada destacada que enlaza a la página de Facebook.
4. **Categorías** — Grid de 3 tarjetas centradas: Biblias, Literatura cristiana, Regalos cristianos.
5. **Sobre nosotros** — Texto institucional sobre la librería en Liberia + estadísticas.
6. **Contacto** — Información de contacto (dirección, teléfono, email, horario) + formulario.
7. **Footer** — Logo agrandado (80px), íconos de redes sociales SVG, año dinámico y texto institucional.

## Tecnologías

- **HTML5** — Estructura semántica, responsive con `viewport`.
- **CSS3** — Variables CSS personalizadas, Grid, Flexbox, media queries (mobile-first + tablet).
- **JavaScript (vanilla)** — `main.js` con IIFE, toggle de menú móvil, año automático en footer, formulario que arma el enlace de WhatsApp, validación de formulario.

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
- **SVGs** — Íconos de redes sociales en `img/iconos/` (facebook.svg, instagram.svg, whatsapp.svg).

## Estado del Repositorio Git

- **Rama principal**: `main`
- **Remote configurado**: `https://github.com/josuecavargas-star/salmo27.git`
- **Commits recientes**:
  ```
  fe5caa4 feat: bajar imagen hero y actualizar datos de contacto
  1db8c3b feat: centrar texto hero, bajar imagen de fondo, centrar cards y agrandar logo footer
  c36e0db feat: header verde sólido y hero con imagen de fondo y texto arriba
  86abc1b refactor: header con imagen de portada full-height y quitar tarjetas del hero
  0a2b5ac feat: hero con imagen de portada y texto centrado
  c4d3f31 fix: corregir logo en header y footer (remover filtro de inversión)
  511398e feat: crear sitio web de Salmo 27 librería cristiana
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
