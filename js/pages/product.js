/**
 * product.js — detalle de producto (desktop y móvil de Stitch).
 * producto.html?id=<id>. Estado: presentación, motivo/dedicatoria,
 * complementos, cantidad y galería. Agrega al carrito vía cartService.
 */
(function () {
  "use strict";

  const esc = (s) => window.timoteoUtils.escapeHtml(s);
  const money = (v) => window.productService.formatCOP(v);
  const ADDONS = (window.TIMOTEO_DATA && window.TIMOTEO_DATA.addons) || [];

  const DESKTOP_TAGS = ["Cumpleaños", "Aniversario", "Con todo mi amor", "Felicitaciones"];
  const MOBILE_TAGS = ["Cumpleaños", "Aniversario", "Amor", "Gracias"];

  const CARE = {
    flores: [
      { icon: "droplet", t: "Corte en diagonal", d: "Corta 1 a 2 cm de los tallos en ángulo de 45° con tijera afilada antes de sumergir en agua fresca." },
      { icon: "brightness-high", t: "Luz tamizada", d: "Ubica el bouquet en un espacio fresco, alejado del sol directo, corrientes de aire y radiadores." },
      { icon: "flower2", t: "Nutriente floral", d: "Incluimos un sobre nutritivo floral para agregar al agua del jarrón cada 48 horas." }
    ],
    peluches: [
      { icon: "droplet", t: "Limpieza suave", d: "Limpia con un paño húmedo y jabón neutro. Evita sumergirlo en agua para conservar su suavidad." },
      { icon: "wind", t: "Secado al aire", d: "Déjalo secar a la sombra, sin secadora ni fuentes directas de calor." },
      { icon: "box-seam", t: "Guardado ideal", d: "Almacénalo en un lugar seco y ventilado, lejos de la humedad." }
    ],
    chocolates: [
      { icon: "thermometer-half", t: "Temperatura", d: "Consérvalos entre 15 y 18 °C, lejos del sol y de fuentes de calor." },
      { icon: "wind", t: "Lejos de aromas", d: "Mantén la caja cerrada: el chocolate absorbe con facilidad los olores del ambiente." },
      { icon: "clock", t: "Frescura", d: "Para disfrutar su mejor sabor, consúmelos dentro de los 30 días siguientes a la entrega." }
    ],
    relojes: [
      { icon: "droplet", t: "Resistente a salpicaduras", d: "Evita sumergirlo en agua. Sécalo con un paño suave si se moja." },
      { icon: "brightness-high", t: "Cuidado de la correa", d: "Evita el sol directo prolongado para conservar el color del cuero." },
      { icon: "box-seam", t: "Estuche", d: "Guárdalo en su estuche cuando no lo uses para protegerlo de rayones." }
    ],
    default: [
      { icon: "box-seam", t: "Empaque de regalo", d: "Conserva el empaque original hasta el momento de entregar tu detalle." },
      { icon: "brightness-high", t: "Lejos del sol", d: "Guárdalo en un lugar fresco y seco, protegido de la luz directa." },
      { icon: "shield-check", t: "Garantía Timoteo", d: "Si algo no llega perfecto, lo reponemos sin costo adicional." }
    ]
  };

  const SPECS_BOUQUET = [
    ["Bouquet Floral:", "Altura estimada de 55 cm. Diámetro aproximado de 38 cm en flor abierta. Presentado en envoltura de papel seda perla y lino kraft."],
    ["Osito Teddy:", "30 cm de altura en posición sentado. Tejido de felpa suave antialérgica, relleno de algodón siliconado premium."],
    ["Caja de Regalo:", "Cartón rígido de alta densidad tintado en pulpa crema con acabado mate sedoso y sello en foil oro rosa."],
    ["Origen de las Rosas:", "Rosas ecuatorianas de exportación de botón grande y apertura prolongada."]
  ];
  const SPECS_DEFAULT = [
    ["Presentación:", "Empaque de regalo Timoteo en papel de seda y cinta de satén, listo para entregar."],
    ["Dedicatoria:", "Tarjeta de lino blanco con sello lacrado, escrita a mano con tu mensaje."],
    ["Hecho a mano:", "Cada detalle se arma artesanalmente en nuestro taller, con materiales seleccionados."],
    ["Garantía:", "Si algo no llega perfecto, lo reponemos sin costo adicional."]
  ];

  const REVIEWS = [
    { img: "assets/images/editorial/retrato-mujer.jpg", name: "Camila Valenzuela", sub: "Aniversario de 3 años", text: "Las rosas llegaron con un aroma increíble y el osito es mil veces más suave en persona. Mi novia lloró de la alegría cuando vio la tarjeta escrita con tanta dedicación." },
    { img: "assets/images/editorial/retrato-hombre.jpg", name: "Felipe Soto", sub: "Cumpleaños sorpresa", text: "Tenía miedo con el horario porque era sorpresa en su oficina, pero llegaron puntual a las 11:15 AM como lo pedí. El empaque es puro lujo. Recomendados al 100%." },
    { img: "assets/images/editorial/retrato-madre.jpg", name: "Mariana Cárdenas", sub: "Día de las Madres", text: "Duraron más de 10 días perfectas en el florero. Se nota cuando las flores son frescas de verdad y no guardadas en cámaras frías por semanas." }
  ];

  const state = { product: null, pres: 0, tag: "Cumpleaños", mTag: "Aniversario", note: "", addons: [], qty: 1, img: 0, tab: 0, acc: {} };

  const $ = (s, r) => (r || document).querySelector(s);
  const stars = (n, cls) => '<span class="' + (cls || "pd-stars") + '">' + '<i class="bi bi-star-fill"></i>'.repeat(n) + "</span>";

  function presentation() {
    const p = state.product;
    return p.presentations ? p.presentations[state.pres] : null;
  }
  function unitPrice() {
    const p = state.product;
    const base = presentation() ? presentation().price : p.price;
    return base + state.addons.reduce((s, k) => s + (ADDONS.find((a) => a.key === k) || { price: 0 }).price, 0);
  }
  const total = () => unitPrice() * state.qty;

  /* ----------------------------------------------------------- escritorio */
  function desktopHtml() {
    const p = state.product;
    const pres = presentation();
    const imgs = p.images && p.images.length ? p.images : [p.image];
    const care = CARE[p.category] || CARE.default;
    const specs = p.id === 9 ? SPECS_BOUQUET : SPECS_DEFAULT;
    const catName = (window.categoryService.getCategoryBySlug(p.category) || { name: "Catálogo" }).name;
    const inst = window.productService.getAllProducts().filter((x) => [23, 13, 24, 25].includes(x.id) && x.id !== p.id).slice(0, 4);
    const fav = window.favoritesService.isFavorite(p.id);
    const cuotas = Math.round(unitPrice() / 3);

    const thumbs = imgs.length > 1
      ? '<div class="pd-thumbs">' + imgs.slice(0, 4).map((src, i) =>
          '<button type="button" class="pd-thumb' + (i === state.img ? " is-active" : "") + '" data-thumb="' + i + '" aria-label="Ver imagen ' + (i + 1) + '"><img src="' + src + '" alt=""></button>').join("") + "</div>"
      : "";

    const presHtml = p.presentations
      ? '<div class="pd-block"><div class="pd-block__head"><label>Elige la dimensión de tu detalle:</label><span>' + esc(pres.detail.split(" + ")[0]) + '</span></div><div class="pd-pres">' +
        p.presentations.map((v, i) => {
          const on = i === state.pres;
          return '<button type="button" class="pd-pres__btn' + (on ? " is-active" : "") + '" data-pres="' + i + '"><span class="pd-pres__left"><span class="pd-pres__dot">' +
            (on ? "<i></i>" : "") + '</span><span><span class="pd-pres__name">' + esc(v.name) + (v.tag ? "<em>" + esc(v.tag) + "</em>" : "") + '</span><span class="pd-pres__detail">' + esc(v.detail) + '</span></span></span><span class="pd-pres__price">' + money(v.price) + "</span></button>";
        }).join("") + "</div></div>"
      : "";

    return (
      '<section class="pd-crumb"><div class="container-brand"><nav aria-label="Ruta de exploración"><a href="index.html">Inicio</a><span>/</span><a href="catalogo.html?categoria=' + p.category + '">' + esc(catName) + '</a><span>/</span><b>' + esc(p.name) + "</b></nav></div></section>" +
      '<section class="pd-main"><div class="container-brand"><div class="pd-grid">' +
      // --- galería
      '<div class="pd-gallery"><div class="pd-hero"><img id="pd-main-img" src="' + imgs[state.img] + '" alt="' + esc(p.name) + '">' +
      '<span class="pd-hero__badge"><i class="bi bi-flower1"></i>' + esc(p.id === 9 ? "Edición Hecha a Mano" : (p.badge || "Hecho a mano")) + "</span>" +
      '<div class="pd-hero__seal" aria-hidden="true">' + window.timoteoIcons.seal("• TIMOTEO • CALIDAD ARTESANAL", { className: "animate-spin-slow", fontSize: 9, letterSpacing: 2 }) + '<i class="bi bi-heart-fill"></i></div></div>' +
      thumbs +
      '<div class="pd-charm"><span><i class="bi bi-stars"></i></span><div><p>El encanto de regalar con intención</p><p>Cada detalle se prepara a mano por maestros artesanos locales, con materiales suaves y seleccionados para conservar un recuerdo que late con el tiempo.</p></div></div></div>' +
      // --- información
      '<div class="pd-info">' +
      '<div class="pd-head"><div class="pd-head__tags"><span class="pd-tag">' + esc(p.collection) + '</span><span class="pd-head__pick">• Más Elegido</span></div><h1>' + esc(p.name) + "</h1>" +
      '<div class="pd-rating">' + stars(5) + "<b>" + p.rating.toFixed(1) + "</b><span>(" + p.reviews + " historias y sonrisas)</span></div></div>" +
      '<div class="pd-price"><div class="pd-price__row"><span id="pd-price">' + money(unitPrice()) + "</span><small>IVA incluido</small></div>" +
      '<div class="pd-price__pay"><i class="bi bi-credit-card"></i><span>Hasta 3 cuotas sin interés de ' + money(cuotas) + " con MercadoPago y tarjetas bancarias.</span></div></div>" +
      '<p class="pd-quote">“' + esc(p.description) + "”</p>" +
      presHtml +
      // --- dedicatoria
      '<div class="pd-note"><div class="pd-note__head"><span><i class="bi bi-pen"></i>Personaliza tu dedicatoria</span><em>Cortesía ♡</em></div>' +
      "<p>Imprimiremos o caligrafiaremos tu mensaje en una tarjeta de lino blanco con sello lacrado.</p>" +
      '<div><label class="pd-note__label">Motivo de la tarjeta:</label><div class="pd-chips">' +
      DESKTOP_TAGS.map((t) => '<button type="button" class="pd-chip' + (t === state.tag ? " is-active" : "") + '" data-tag="' + esc(t) + '">' + esc(t) + "</button>").join("") + "</div></div>" +
      '<div><textarea id="gift-note" maxlength="200" rows="3" placeholder="Escribe aquí las palabras que tocarán su corazón..." data-note>' + esc(state.note) + '</textarea><div class="pd-note__count"><span>Máximo 200 caracteres para caligrafía legible</span><span data-note-count>' + state.note.length + " / 200</span></div></div></div>" +
      // --- complementos
      '<div class="pd-block"><label class="pd-block__title">Complementos para una sorpresa inolvidable:</label><div class="pd-addons">' +
      ADDONS.map((a) => '<label class="pd-addon"><span><input type="checkbox" data-addon="' + a.key + '"' + (state.addons.includes(a.key) ? " checked" : "") + "><span>" + esc(a.name) + "</span></span><b>+ " + money(a.price) + "</b></label>").join("") + "</div></div>" +
      // --- acciones
      '<div class="pd-actions"><div class="pd-actions__row"><div class="pd-qty"><button type="button" data-qty="-1" aria-label="Disminuir cantidad">−</button><span id="pd-qty">' + state.qty + '</span><button type="button" data-qty="1" aria-label="Aumentar cantidad">+</button></div>' +
      '<button type="button" class="pd-add" data-action="add"><i class="bi bi-bag"></i><span>Agregar al Carrito — <span id="pd-btn-price">' + money(total()) + '</span></span></button>' +
      '<button type="button" class="pd-favbtn fav-btn' + (fav ? " is-active" : "") + '" data-fav-toggle data-product-id="' + p.id + '" aria-label="Guardar en favoritos" aria-pressed="' + fav + '"><i class="bi bi-heart"></i><i class="bi bi-heart-fill"></i></button></div>' +
      '<button type="button" class="pd-buy" data-action="buy"><i class="bi bi-lightning-charge"></i><span>Comprar de inmediato con 1 clic</span></button></div>' +
      // --- garantías
      '<div class="pd-perks">' +
      '<div><i class="bi bi-clock"></i><div><b>¿Lo necesitas hoy?</b><span>Pide antes de las 2:00 PM para entrega express el mismo día en tu ciudad.</span></div></div>' +
      '<div><i class="bi bi-patch-check"></i><div><b>Garantía Timoteo de Frescura Absoluta</b><span>Conservación floral por 7+ días o reenviamos tu ramo completamente nuevo.</span></div></div>' +
      '<div><i class="bi bi-envelope-check"></i><div><b>Privacidad en la entrega</b><span>Total discreción si es sorpresa; solo compartiremos tu dedicatoria en la tarjeta.</span></div></div></div>' +
      "</div></div></div></section>" +
      // --- cuidado y amor
      '<section class="pd-care"><div class="container-brand"><div class="pd-care__card"><div class="pd-care__inner">' +
      '<div class="pd-care__head"><span>Cuidado y Amor</span><h2>Detalles pensados en cada pétalo</h2><p>Queremos que la emoción perdure. Conoce las instrucciones de nuestros floristas y las medidas exactas de este arreglo.</p></div>' +
      '<div class="pd-tabs" role="tablist">' + ["Cuidados", "Dimensiones & Materiales", "Políticas de Envío"].map((t, i) => '<button type="button" role="tab" class="pd-tab' + (i === state.tab ? " is-active" : "") + '" data-tab="' + i + '">' + esc(t) + "</button>").join("") + "</div>" +
      '<div class="pd-pane" data-pane="0"' + (state.tab === 0 ? "" : " hidden") + '><div class="pd-care3">' + care.map((c) => '<div><span><i class="bi bi-' + c.icon + '"></i></span><p>' + esc(c.t) + "</p><p>" + esc(c.d) + "</p></div>").join("") + "</div></div>" +
      '<div class="pd-pane" data-pane="1"' + (state.tab === 1 ? "" : " hidden") + '><div class="pd-specs">' + specs.map((s) => "<div><p>" + esc(s[0]) + "</p><p>" + esc(s[1]) + "</p></div>").join("") + "</div></div>" +
      '<div class="pd-pane" data-pane="2"' + (state.tab === 2 ? "" : " hidden") + '><div class="pd-ship"><p>Horarios y Franjas de Entrega</p><p>Realizamos entregas de lunes a domingo en dos turnos: Mañana (09:00 - 13:30) y Tarde (14:30 - 19:30). Se te notificará vía SMS y WhatsApp en tiempo real cuando el repartidor esté en camino y una vez recibido.</p><p>¿Y si la persona no está en el domicilio?</p><p>Nos comunicaremos discretamente con el remitente para coordinar la entrega en conserjería o reprogramar la visita sin dañar la integridad del regalo.</p></div></div>' +
      "</div></div></div></section>" +
      // --- completa tu sorpresa
      '<section class="pd-more"><div class="container-brand"><div class="pd-more__head"><div><span>Inspiración Curada</span><h2>Completa tu sorpresa</h2></div><a href="catalogo.html"><span>Ver catálogo completo de detalles</span><i class="bi bi-arrow-right"></i></a></div><ul class="pd-more__grid" id="pd-inspiration" role="list"></ul></div></section>' +
      // --- testimonios
      '<section class="pd-reviews"><div class="container-brand"><div class="pd-reviews__card"><div class="pd-reviews__inner"><div class="pd-care__head"><span>Momentos Inolvidables</span><h2>Historias que florecieron con Timoteo</h2><p>La emoción de recibir un detalle hecho con el alma.</p></div><div class="pd-reviews__grid">' +
      REVIEWS.map((r) => '<figure class="pd-review"><div>' + stars(5, "pd-stars pd-stars--sm") + "<blockquote>“" + esc(r.text) + '”</blockquote></div><figcaption><img src="' + r.img + '" alt=""><div><b>' + esc(r.name) + "</b><span>" + esc(r.sub) + "</span></div></figcaption></figure>").join("") +
      "</div></div></div></div></section>"
    );
  }

  /* ---------------------------------------------------------------- móvil */
  function mobileHtml() {
    const p = state.product;
    const imgs = p.images && p.images.length ? p.images.slice(0, 3) : [p.image];
    const pres = presentation();
    const fav = window.favoritesService.isFavorite(p.id);
    const old = p.oldPrice && p.oldPrice > p.price ? p.oldPrice : null;
    const pct = old ? Math.round((1 - p.price / old) * 100) : 0;
    const cuotas = Math.round(unitPrice() / 3);

    const presHtml = p.presentations
      ? '<div class="pdm-sec"><div class="pdm-sec__head"><b>Selecciona la Presentación</b><span>Incluye tarjeta & moño</span></div><div class="pdm-pres">' +
        p.presentations.map((v, i) => {
          const on = i === state.pres;
          const short = v.detail.match(/(\d+) rosas/i);
          return '<button type="button" class="pdm-pres__btn' + (on ? " is-active" : "") + '" data-pres="' + i + '">' + (v.tag ? "<em>" + esc(v.tag) + "</em>" : "") + "<span><b>" + esc(v.name.split(" ")[0]) + "</b><small>" + (short ? short[1] + " Rosas" : "") + "</small></span><strong>" + money(v.price) + "</strong></button>";
        }).join("") + "</div></div>"
      : "";

    return (
      '<div class="pdm">' +
      '<div class="pdm-top"><div class="pdm-chip"><i class="bi bi-flower1"></i><span>' + esc(p.collection) + '</span></div><div class="pdm-top__btns">' +
      '<button type="button" class="pdm-round" data-action="share" aria-label="Compartir regalo"><i class="bi bi-share"></i></button>' +
      '<button type="button" class="pdm-round fav-btn' + (fav ? " is-active" : "") + '" data-fav-toggle data-product-id="' + p.id + '" aria-label="Guardar en favoritos" aria-pressed="' + fav + '"><i class="bi bi-heart"></i><i class="bi bi-heart-fill"></i></button></div></div>' +
      '<div class="pdm-gallery"><div class="pdm-track" id="pdm-track">' + imgs.map((src) => '<div><img src="' + src + '" alt="' + esc(p.name) + '"></div>').join("") + "</div>" +
      '<span class="pdm-badge"><i class="bi bi-stars"></i>' + esc(p.id === 9 ? "Edición Hecha a Mano" : (p.badge || "Hecho a mano")) + "</span>" +
      '<div class="pdm-seal" aria-hidden="true">' + window.timoteoIcons.seal("• TIMOTEO • CALIDAD ARTESANAL", { className: "pdm-seal__ring", fontSize: 9, letterSpacing: 2 }) + '<i class="bi bi-heart-fill"></i></div>' +
      '<div class="pdm-dots">' + imgs.map((_, i) => '<i class="' + (i === state.img ? "is-active" : "") + '"></i>').join("") + "</div></div>" +
      '<div class="pdm-title"><div class="pdm-rating">' + stars(5, "pdm-stars") + "<b>" + p.rating.toFixed(1) + "</b><span>(" + p.reviews + " reseñas verificadas)</span></div><h2>" + esc(p.name) + "</h2><p>" + esc(p.description) + "</p>" +
      '<div class="pdm-price"><div><strong id="pdm-price">' + money(unitPrice()) + " COP</strong>" + (old ? "<s>" + money(old) + " COP</s><em>-" + pct + "%</em>" : "") + '</div><p><i class="bi bi-credit-card"></i>Hasta 3 cuotas sin interés de <strong>' + money(cuotas) + " COP</strong></p></div></div>" +
      presHtml +
      '<div class="pdm-sec"><div class="pdm-note"><h3><i class="bi bi-pen"></i>Personaliza tu dedicatoria</h3><p>Escribiremos a mano tus palabras en nuestra papelería italiana con sello de cera.</p><label>Ocasión especial</label><div class="pdm-note__chips">' +
      MOBILE_TAGS.map((t) => '<button type="button" class="' + (t === state.mTag ? "is-active" : "") + '" data-mtag="' + esc(t) + '">' + esc(t) + "</button>").join("") + '</div><textarea id="pdm-note" maxlength="220" rows="3" placeholder="Escribe tu mensaje con amor... ej: \'Para la persona que ilumina cada uno de mis días, feliz aniversario.\'" data-note>' + esc(state.note) + '</textarea><div class="pdm-note__foot"><span><i class="bi bi-pen"></i> Escrito a pluma</span><span data-note-count-m>' + state.note.length + " / 220</span></div></div></div>" +
      '<div class="pdm-sec pdm-acc">' +
      [["droplet", "Cuidado y conservación", "Sigue las instrucciones de cuidado incluidas en tu empaque: consérvalo en un lugar fresco, lejos del sol directo y de corrientes de aire para extender su duración."],
       ["truck", "Envío express el mismo día", "Pedidos confirmados antes de las 3:00 PM se entregan hoy mismo en vehículo climatizado. Recibirás un enlace con seguimiento en tiempo real y foto de entrega en puerta."],
       ["patch-check", "Garantía Timoteo de frescura", "Si tu regalo no llega 100% impecable y radiante, te enviamos un reemplazo inmediato sin costo adicional."]]
        .map((a, i) => '<div class="pdm-acc__item' + (state.acc[i] ? " is-open" : "") + '"><button type="button" data-acc="' + i + '"><span><i class="bi bi-' + a[0] + '"></i>' + esc(a[1]) + '</span><i class="bi bi-chevron-down"></i></button><div>' + esc(a[2]) + "</div></div>").join("") + "</div>" +
      '<div class="pdm-sec"><div class="pdm-perks"><div><span><i class="bi bi-lock"></i></span><div><b>Pago 100% Seguro</b><small>Wompi, Nequi y Tarjetas</small></div></div><div><span><i class="bi bi-gift"></i></span><div><b>Hecho con Amor</b><small>Floristas expertas</small></div></div></div></div>' +
      "</div>" +
      '<div class="pdm-bar"><div class="pdm-bar__inner"><div class="pdm-qty"><button type="button" data-qty="-1" aria-label="Disminuir cantidad"><i class="bi bi-dash"></i></button><span id="pdm-qty">' + state.qty + '</span><button type="button" data-qty="1" aria-label="Aumentar cantidad"><i class="bi bi-plus"></i></button></div>' +
      '<button type="button" class="pdm-add" data-action="add"><i class="bi bi-bag-fill"></i><span>Agregar — <span id="pdm-btn-price">' + money(total()) + "</span></span></button></div></div>"
    );
  }

  /* ------------------------------------------------------------ acciones */
  function noteText() {
    return state.note.trim();
  }

  function addCurrent(goCheckout) {
    const p = state.product;
    const pres = presentation();
    const addons = state.addons.map((k) => ADDONS.find((a) => a.key === k)).filter(Boolean);
    window.cartService.addToCart(p, {
      quantity: state.qty,
      variant: pres ? pres.name : null,
      detail: pres ? pres.detail : p.shortDescription,
      unitPrice: unitPrice(),
      addons: addons,
      note: noteText(),
      occasion: isMobile() ? state.mTag : state.tag
    });
    if (goCheckout) {
      window.timoteoApp.navigateWithFade("checkout.html");
      return;
    }
    window.toastComponent.showToast({
      title: "Agregado al carrito con amor",
      message: p.name,
      image: p.image,
      actionLabel: "Ver carrito",
      actionHref: "carrito.html"
    });
    document.querySelectorAll('[data-action="add"]').forEach((b) => {
      b.classList.add("is-added");
      window.setTimeout(() => b.classList.remove("is-added"), 1100);
    });
  }

  const isMobile = () => window.matchMedia("(max-width: 767.98px)").matches;

  function updateDynamic() {
    const set = (sel, txt) => document.querySelectorAll(sel).forEach((e) => (e.textContent = txt));
    set("#pd-price", money(unitPrice()));
    set("#pdm-price", money(unitPrice()) + " COP");
    set("#pd-btn-price", money(total()));
    set("#pdm-btn-price", money(total()));
    set("#pd-qty", state.qty);
    set("#pdm-qty", state.qty);
  }

  function render() {
    $("#product-desktop").innerHTML = desktopHtml();
    $("#product-mobile").innerHTML = mobileHtml();
    const grid = $("#pd-inspiration");
    if (grid) {
      const list = window.productService.getAllProducts().filter((x) => [23, 13, 24, 25].includes(x.id) && x.id !== state.product.id).slice(0, 4);
      window.productCardComponent.renderProductGrid(grid, list, { variant: "inspiration" });
    }
    const track = $("#pdm-track");
    if (track) {
      track.addEventListener("scroll", () => {
        const i = Math.round(track.scrollLeft / track.clientWidth);
        state.img = i;
        document.querySelectorAll(".pdm-dots i").forEach((d, k) => d.classList.toggle("is-active", k === i));
      }, { passive: true });
    }
    window.timoteoApp.initScrollReveal(document);
  }

  function bind() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("button, a");
      if (!t) return;
      if (t.dataset.pres !== undefined) { state.pres = Number(t.dataset.pres); render(); }
      else if (t.dataset.tag !== undefined) { state.tag = t.dataset.tag; render(); }
      else if (t.dataset.mtag !== undefined) { state.mTag = t.dataset.mtag; render(); }
      else if (t.dataset.qty !== undefined) { state.qty = window.timoteoUtils.clamp(state.qty + Number(t.dataset.qty), 1, 20); updateDynamic(); }
      else if (t.dataset.thumb !== undefined) { state.img = Number(t.dataset.thumb); render(); }
      else if (t.dataset.tab !== undefined) { state.tab = Number(t.dataset.tab); render(); }
      else if (t.dataset.acc !== undefined) { const i = t.dataset.acc; state.acc[i] = !state.acc[i]; t.closest(".pdm-acc__item").classList.toggle("is-open", !!state.acc[i]); }
      else if (t.dataset.action === "add") addCurrent(false);
      else if (t.dataset.action === "buy") addCurrent(true);
      else if (t.dataset.action === "share") {
        const url = window.location.href;
        if (navigator.share) navigator.share({ title: state.product.name, url: url }).catch(() => {});
        else if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => window.toastComponent.showToast({ title: "Enlace copiado", message: state.product.name, icon: "bi-link-45deg" }));
      }
    });
    document.addEventListener("change", (e) => {
      const a = e.target.closest("[data-addon]");
      if (!a) return;
      const k = a.dataset.addon;
      const i = state.addons.indexOf(k);
      if (a.checked && i === -1) state.addons.push(k);
      else if (!a.checked && i !== -1) state.addons.splice(i, 1);
      updateDynamic();
    });
    document.addEventListener("input", (e) => {
      const n = e.target.closest("[data-note]");
      if (!n) return;
      state.note = n.value;
      document.querySelectorAll("[data-note]").forEach((o) => { if (o !== n) o.value = state.note; });
      document.querySelectorAll("[data-note-count]").forEach((c) => (c.textContent = state.note.length + " / 200"));
      document.querySelectorAll("[data-note-count-m]").forEach((c) => (c.textContent = state.note.length + " / 220"));
    });
  }

  function init() {
    const id = window.timoteoUtils.getQueryParam("id");
    const product = id ? window.productService.getProductById(id) : window.productService.getProductById(9);
    if (!product) {
      document.getElementById("product-missing").hidden = false;
      return;
    }
    state.product = product;
    state.pres = product.presentations ? Math.max(0, product.presentations.findIndex((v) => v.tag)) : 0;
    document.title = product.name + " | Timoteo";
    render();
    bind();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
