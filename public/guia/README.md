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
salmo27/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos con la paleta de colores
├── js/
│   └── main.js         # Funcionalidades (menú móvil, formulario, año dinámico)
├── img/
│   ├── logoprincipal.png          # Logo principal
│   ├── paleta.jpg                 # Paleta de colores de referencia
│   ├── iconos/                    # Íconos de redes sociales
│   │   ├── facebook.svg
│   │   ├── instagram.svg
│   │   └── whatsapp.svg
│   └── salmo 27 logos/            # Logos varios
│       ├── Portada Facebook - Color sólido.png
│       ├── Portada facebook.psd
│       ├── Portada-facebook.jpg   # Imagen de portada de Facebook
│       ├── Salmo 27 - A color - Sin Fondo.png
│       ├── ... (más logos en PNG, PSD, varios colores)
│       └── Salmo27- Presentación Elegante 2.png
└── guia/
    └── README.md       # Esta guía
```

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
- **JavaScript (vanilla)** — `main.js` con IIFE, toggle de menú móvil, año automático en footer, envío de formulario vía fetch a Google Apps Script, validación de formulario.

## Conexión Formulario → Google Sheets (Google Apps Script)

El formulario de contacto envía datos a un **Google Apps Script web app** que escribe en una hoja de cálculo.

### URL del Web App
```
https://script.google.com/macros/s/AKfycbwiBIlYGXbXgAwJJ5ugdCm70cf4W27_eW_qkEWTFVSREmKnZBbuO6dHFTIXX3NDCMkquA/exec
```

### Script de Apps Script (configurado en Google)
```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  if (!data.nombre || !data.email || !data.mensaje) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', msg: 'Datos incompletos' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', msg: 'Email inválido' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([new Date(), data.nombre, data.email, data.mensaje]);
  
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Qué hace
1. Recibe datos via POST desde el formulario (nombre, email, mensaje)
2. Valida que los campos no estén vacíos y el email tenga formato válido
3. Escribe una nueva fila en la hoja de cálculo con fecha/hora, nombre, email y mensaje
4. Responde con JSON `{ status: 'success' }` o `{ status: 'error', msg: '...' }`

### Seguridad
- ✅ Solo escribe a la hoja (no lee ni elimina)
- ✅ Valida inputs (email, campos requeridos)
- ⚠️ Sin protección contra bots (se recomienda CAPTCHA futuro)
- ⚠️ Sin límite de velocidad
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
- La validación de formulario incluye frontend + backend (Google Apps Script)
- Favicon configurado con `logoprincipal.png` y `apple-touch-icon`.
