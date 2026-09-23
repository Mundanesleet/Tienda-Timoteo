# Tienda Timoteo

**Tienda Timoteo** es el frontend de una tienda de regalos (flores, peluches,
chocolates, relojes, cajas de autor y regalos personalizados). La marca dice:
*"Detalles que hacen la vida más linda."*

El diseño visual sale del proyecto **"Identidad Visual Tienda Timoteo"** de
Google Stitch, que es la fuente de verdad: 13 pantallas de escritorio y las
versiones móviles de Home, Catálogo, Detalle de producto y Carrito. Los
tokens (color, tipografía, radios, espaciado) están en `css/variables.css` y
salen del design system de ese proyecto.

Este proyecto es **100% frontend estático**: no requiere Node, npm, backend
ni base de datos. Funciona con cualquier servidor estático (o GitHub Pages).

## Cómo verlo

```bash
python -m http.server 8000     # y abrir http://localhost:8000
```

También sirve la extensión "Live Server" de VS Code. Abrir los `.html` con
doble clic (`file://`) suele funcionar, pero algunos navegadores restringen
`localStorage` en ese modo; para probar carrito, favoritos y pedidos con
fidelidad conviene un servidor.

## Páginas

| Página | Qué hace |
|---|---|
| `index.html` | Home: hero editorial, categorías, "Crea tu regalo único", favoritos, ocasiones, envíos |
| `catalogo.html` | Catálogo con colecciones, chips de ocasión/precio/destinatario, búsqueda, orden y "cargar más" (`categorias.html` redirige a `#colecciones`) |
| `producto.html?id=N` | Detalle: galería, presentación, complementos, cantidad, dedicatoria, "Completa tu sorpresa" |
| `personalizar.html` | Asistente de 6 pasos (base, peluche, flores, dulces, mensaje, vista previa) con precio en vivo |
| `novedades.html` | Ediciones de temporada: filtros, bouquets de autor, Caja Memoria, lookbook, Timoteo Club |
| `nosotros.html` | Historia de la marca, pilares, atelier y manifiesto |
| `contacto.html` | WhatsApp, horarios, formulario validado y preguntas frecuentes |
| `busqueda.html?q=…` | Resultados en vivo, sugeridos, orden y "cargar más" |
| `favoritos.html` | Productos guardados (mover a la cesta, quitar) |
| `carrito.html` | Cesta editable, fecha y franja de entrega, regalo sorpresa, complementos, cupón y resumen |
| `checkout.html` | Remitente, destinatario, dedicatoria, método de pago y resumen, con validación |
| `confirmacion.html` | Pedido confirmado, línea de tiempo, comprobante descargable |

### Responsive

Breakpoints de Tailwind (los de Stitch): `sm 640 · md 768 · lg 1024 · xl 1280`.
Stitch solo trae móvil para Home, Catálogo, Producto y Carrito; el resto se
adapta con los tokens móviles del design system (`display-mobile`,
`headline-lg-mobile`). Hay tres cromados de escritorio, elegidos con
`<body data-chrome="boutique|atelier|appbar">` (cada grupo de pantallas de
Stitch usa una cabecera distinta), y una cabecera móvil compacta con barra
inferior de 5 pestañas.

## Arquitectura

```
data → services → components → pages
```

- **`js/data/`** — catálogo, categorías y opciones del personalizador
  (`products.js`, `categories.js`, `customizer.js`).
- **`js/services/`** — única puerta de entrada a datos y estado persistido:
  `productService`, `categoryService`, `cartService` (líneas, franja de
  entrega, cupón, envío), `orderService` (pedidos) y `favoritesService`.
  Ninguna página lee `products.js` ni `localStorage` directamente.
- **`js/components/`** — navbar (tres cabeceras), footer, navegación
  inferior, tarjeta de producto por *variantes*, badge del carrito, toasts e
  iconos SVG (`icons.js`, que además sustituye `<i data-icon="…">`).
- **`js/pages/`** — lógica de cada página.
- **`js/app.js`** — arranque compartido y clics globales de
  "agregar al carrito" y "favorito".

Si se agrega un backend (Django), solo `js/services/*.js` pasa de leer
arreglos y `localStorage` a `fetch()` contra la API; páginas y componentes no
cambian.

## Datos que persisten en el navegador

| Qué | Clave (`localStorage`) |
|---|---|
| Carrito | `timoteo_cart` |
| Entrega (franja, fecha, sorpresa) | `timoteo_delivery` |
| Cupón (`TIMOTEOAMOR`, 10%) | `timoteo_coupon` |
| Favoritos | `timoteo_favorites` |
| Diseño del asistente | `timoteo_craft` |
| Último pedido / historial | `timoteo_last_order` / `timoteo_orders` |
| Datos del remitente (para el siguiente pedido) | `timoteo_profile` |
| Mensajes de contacto / Timoteo Club | `timoteo_contact_messages` / `timoteo_club` |

Los datos de tarjeta del checkout **nunca se guardan**: el cobro es simulado.
Si se abre `confirmacion.html` sin haber comprado, muestra un pedido de
ejemplo marcado como "Vista de ejemplo".

## Contenido de demostración

Productos, precios (COP), calificaciones y cifras como "+18.000 historias" o
"18 nuevas piezas" vienen del contenido de Stitch y son datos ficticios: no
representan inventario ni métricas reales. `productService.js` es el único
archivo que debe apuntar a datos reales.

## Fotografía e iconos

Las fotos viven en `assets/images/{catalog,editorial,brand}`; varias se
recortaron de las capturas de Stitch (que traían franjas de interfaz). Los
iconos son Bootstrap Icons más un set SVG propio (`icons.js`). No se usan
emojis como imagen de producto ni de interfaz.

## Estructura

```
├── *.html                 12 páginas
├── css/
│   ├── variables.css      tokens del design system
│   ├── reset.css · base.css
│   ├── layout.css         cabeceras, footers, navegación, cajón, barra inferior
│   ├── components.css     botones, tarjetas, sellos
│   ├── pages.css          Home
│   ├── pages-catalog.css · pages-product.css · pages-craft.css
│   ├── pages-atelier.css  Favoritos, Búsqueda, Novedades, Nosotros, Contacto
│   ├── pages-cart.css     Carrito, Checkout, Confirmación
│   ├── animations.css · responsive.css
├── js/                    app · utils · data · services · components · pages
└── assets/{images,icons}
```

## Accesibilidad

Enlace "saltar al contenido", `alt` en imágenes, `aria-label` en botones de
solo icono, formularios con etiquetas y mensajes de error por campo, foco
visible, `prefers-reduced-motion` respetado, HTML semántico y
`title`/`description` por página.
