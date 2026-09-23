/**
 * productCard.js — tarjetas de producto. Stitch define un diseño distinto por
 * pantalla, por eso cada uno es una "variante" con su propia plantilla:
 *   home      → Home desktop (Nuestros favoritos de siempre)
 *   mobile    → Home móvil (2 columnas compactas)
 *   ...       → se añaden con cada pantalla (catálogo, búsqueda, favoritos, etc.)
 *
 * createProductCard(product, { variant, revealDelay }) -> HTMLElement (<li>)
 * renderProductGrid(container, products, options)
 *
 * Los botones usan atributos delegados por app.js:
 *   [data-add-to-cart][data-product-id]  y  [data-fav-toggle][data-product-id]
 */
(function () {
  "use strict";

  const esc = (s) => window.timoteoUtils.escapeHtml(s);
  const icon = (n, o) => window.timoteoIcons.icon(n, o);
  const fmt = (v) => window.productService.formatCOP(v);
  const fmtSp = (v) => window.productService.formatCOPSpaced(v);
  const href = (p) => "producto.html?id=" + p.id;
  const isFav = (p) => window.favoritesService.isFavorite(p.id);

  function favButton(p, cls, svgSize, stroke) {
    const on = isFav(p);
    return (
      '<button type="button" class="fav-btn ' + cls + (on ? " is-active" : "") + '" aria-pressed="' + on +
      '" aria-label="Guardar ' + esc(p.name) + ' en favoritos" data-fav-toggle data-product-id="' + p.id + '">' +
      icon("heart", { size: svgSize || 16, stroke: stroke || 2 }) + "</button>"
    );
  }

  const templates = {
    home(p) {
      return (
        '<div class="pc__media">' +
        favButton(p, "pc__fav", 16, 2) +
        '<a href="' + href(p) + '" tabindex="-1"><img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy"></a></div>' +
        '<div class="pc__body">' +
        '<h3 class="pc__name"><a href="' + href(p) + '">' + esc(p.shortName) + "</a></h3>" +
        '<p class="pc__price">' + fmtSp(p.price) + "</p>" +
        '<button type="button" class="pc__cta" data-add-to-cart data-product-id="' + p.id + '">' +
        icon("cart", { size: 14, stroke: 2 }) + '<span data-add-label>Agregar al carrito</span></button></div>'
      );
    },

    mobile(p) {
      return (
        favButton(p, "pm__fav", 16, 1.8) +
        '<a class="pm__media" href="' + href(p) + '"><img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
        '<div class="pm__meta"><div class="pm__text"><h3 class="pm__name"><a href="' + href(p) + '">' + esc(p.shortName) + "</a></h3>" +
        '<p class="pm__price">' + fmtSp(p.price) + "</p></div>" +
        '<button type="button" class="pm__add" data-add-to-cart data-product-id="' + p.id + '" aria-label="Agregar ' + esc(p.name) + ' al carrito">' +
        icon("bag", { size: 16, stroke: 2 }) + "</button></div>"
      );
    }
  };

  const CLASS = { home: "pc", mobile: "pm", catalog: "cc", catalogm: "cmc" };

  /* ------------------------------------------------- Catálogo (desktop) */
  const BADGE_TONE_D = { "Más vendido": "primary", "Edición limitada": "secondary" };
  templates.catalog = function (p) {
    const tone = BADGE_TONE_D[p.badge] || "soft";
    return (
      '<div class="cc__media">' +
      '<a href="' + href(p) + '" tabindex="-1"><img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
      (p.badge ? '<span class="cc__badge cc__badge--' + tone + '">' + esc(p.badge) + "</span>" : "") +
      favButton(p, "cc__fav", 18, 2) + "</div>" +
      '<div class="cc__body"><div>' +
      '<span class="cc__coll">' + esc(p.collection) + "</span>" +
      '<h3 class="cc__name"><a href="' + href(p) + '">' + esc(p.shortName) + "</a></h3>" +
      '<p class="cc__desc">' + esc(p.shortDescription) + "</p></div>" +
      '<div class="cc__foot"><div><span class="cc__price-label">Precio</span><p class="cc__price">' + fmt(p.price) + "</p></div>" +
      '<button type="button" class="cc__add" data-add-to-cart data-product-id="' + p.id + '">' +
      '<i class="bi bi-bag" aria-hidden="true"></i><span data-add-label>Agregar</span></button></div></div>'
    );
  };

  /* --------------------------------------------------- Favoritos (atelier) */
  CLASS.favorite = "fc";
  templates.favorite = function (p) {
    return (
      '<div class="fc__media"><a href="' + href(p) + '" tabindex="-1"><img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
      '<button type="button" class="fav-btn is-active fc__remove" aria-pressed="true" aria-label="Quitar ' + esc(p.name) + ' de favoritos" data-fav-toggle data-product-id="' + p.id + '">' +
      '<i class="bi bi-heart"></i><i class="bi bi-heart-fill"></i></button>' +
      (p.badge ? '<span class="fc__badge">' + esc(p.badge) + "</span>" : "") + "</div>" +
      '<div class="fc__body"><span class="fc__coll">' + esc(p.collection) + "</span>" +
      '<h3 class="fc__name"><a href="' + href(p) + '">' + esc(p.name) + "</a></h3>" +
      '<p class="fc__desc">' + esc(p.shortDescription) + "</p>" +
      '<div class="fc__ship"><i class="bi bi-check-circle"></i><span>Envío gratis hoy</span></div>' +
      '<div class="fc__foot"><div><span>Precio</span><b>' + fmt(p.price) + "</b></div>" +
      '<button type="button" class="fc__add" data-add-to-cart data-product-id="' + p.id + '"><i class="bi bi-bag"></i><span data-add-label>Al carrito</span></button></div></div>'
    );
  };

  /* ------------------------------------------- Resultados de búsqueda (atelier) */
  CLASS.search = "sc";
  templates.search = function (p) {
    const on = isFav(p);
    return (
      '<div class="sc__media"><a href="' + href(p) + '" tabindex="-1"><img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
      (p.badge ? '<span class="sc__badge">' + esc(p.badge) + "</span>" : "") +
      '<button type="button" class="fav-btn sc__fav' + (on ? " is-active" : "") + '" aria-pressed="' + on + '" aria-label="Guardar ' + esc(p.name) + ' en favoritos" data-fav-toggle data-product-id="' + p.id + '">' +
      '<i class="bi bi-heart"></i><i class="bi bi-heart-fill"></i></button></div>' +
      '<div class="sc__body"><span class="sc__coll">' + esc(p.collection) + "</span>" +
      '<h2 class="sc__name"><a href="' + href(p) + '">' + esc(p.name) + "</a></h2>" +
      '<p class="sc__desc">' + esc(p.description || p.shortDescription) + "</p></div>" +
      '<div class="sc__foot"><div><span>Precio</span><b>' + fmt(p.price) + "</b></div>" +
      '<button type="button" class="sc__add" data-add-to-cart data-product-id="' + p.id + '"><i class="bi bi-bag"></i><span data-add-label>Agregar al carrito</span></button></div>'
    );
  };

  /* ----------------------------------------- Novedades: bouquet de autor (atelier) */
  CLASS.novelty = "nv-card";
  templates.novelty = function (p) {
    const on = isFav(p);
    const tag = p.novTag || ["star", "Nuevo en el atelier"];
    const limited = p.badge === "Edición limitada";
    return (
      '<div><div class="nv-card__media"><a href="' + href(p) + '" tabindex="-1"><img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
      '<span class="nv-card__badge' + (limited ? " nv-card__badge--soft" : "") + '">' + esc(p.badge || "Nuevo") + "</span>" +
      '<button type="button" class="fav-btn nv-card__fav' + (on ? " is-active" : "") + '" aria-pressed="' + on + '" aria-label="Guardar ' + esc(p.name) + ' en favoritos" data-fav-toggle data-product-id="' + p.id + '">' +
      '<i class="bi bi-heart"></i><i class="bi bi-heart-fill"></i></button></div>' +
      '<div class="nv-card__tag">' + (tag[0] === "leaf" ? icon("leaf", { size: 14 }) : '<i class="bi bi-' + tag[0] + '"></i>') + "<span>" + esc(tag[1]) + "</span></div>" +
      '<h3 class="nv-card__name"><a href="' + href(p) + '">' + esc(p.novName || p.name) + "</a></h3>" +
      '<p class="nv-card__desc">' + esc(p.novDesc || p.shortDescription) + "</p></div>" +
      '<div class="nv-card__foot"><div><span>Precio</span><b>' + fmtSp(p.price) + "</b></div>" +
      '<button type="button" class="nv-card__add" data-add-to-cart data-product-id="' + p.id + '"><i class="bi bi-bag"></i><span data-add-label>Agregar</span></button></div>'
    );
  };

  /* ---------------------------------- Novedades: peluches y accesorios (atelier) */
  CLASS.nvacc = "nv-acc";
  templates.nvacc = function (p) {
    const on = isFav(p);
    return (
      '<div><div class="nv-acc__media"><a href="' + href(p) + '" tabindex="-1"><img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
      '<span class="nv-acc__badge">' + esc(p.badge || "Nuevo") + "</span>" +
      '<button type="button" class="fav-btn nv-acc__fav' + (on ? " is-active" : "") + '" aria-pressed="' + on + '" aria-label="Guardar ' + esc(p.name) + ' en favoritos" data-fav-toggle data-product-id="' + p.id + '">' +
      '<i class="bi bi-heart"></i><i class="bi bi-heart-fill"></i></button></div>' +
      '<span class="nv-acc__coll">' + esc(p.collection) + "</span>" +
      '<h4 class="nv-acc__name"><a href="' + href(p) + '">' + esc(p.novName || p.name) + "</a></h4>" +
      '<p class="nv-acc__desc">' + esc(p.novDesc || p.shortDescription) + "</p></div>" +
      '<div class="nv-acc__foot"><b>' + fmtSp(p.price) + "</b>" +
      '<button type="button" class="nv-acc__add" data-add-to-cart data-product-id="' + p.id + '" aria-label="Agregar ' + esc(p.name) + ' al carrito"><i class="bi bi-cart-plus"></i></button></div>'
    );
  };

  /* ------------------------------ "Completa tu sorpresa" (detalle de producto) */
  CLASS.inspiration = "ip";
  templates.inspiration = function (p) {
    return (
      '<div class="ip__media"><a href="' + href(p) + '" tabindex="-1"><img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
      favButton(p, "ip__fav", 16, 2) + "</div>" +
      '<div class="ip__body"><div><p class="ip__coll">' + esc(p.collection) + "</p>" +
      '<h3 class="ip__name"><a href="' + href(p) + '">' + esc(p.name) + "</a></h3></div>" +
      '<div class="ip__foot"><span class="ip__price">' + fmt(p.price) + "</span>" +
      '<button type="button" class="ip__add" data-add-to-cart data-product-id="' + p.id + '"><span data-add-label>+ Agregar</span></button></div></div>'
    );
  };

  /* --------------------------------------------------- Catálogo (móvil) */
  const BADGE_TONE_M = { "Edición limitada": "primary-fixed", Bespoke: "tertiary-fixed", "Más vendido": "surface" };
  templates.catalogm = function (p) {
    const tone = BADGE_TONE_M[p.badge] || (p.category === "chocolates" ? "secondary-fixed" : "container");
    return (
      '<div class="cmc__media">' +
      '<a href="' + href(p) + '" tabindex="-1"><img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
      (p.badge ? '<span class="cmc__badge cmc__badge--' + tone + '">' + esc(p.badge) + "</span>" : "") +
      favButton(p, "cmc__fav", 18, 2) + "</div>" +
      '<div class="cmc__body"><div>' +
      '<span class="cmc__coll">' + esc(p.collection) + "</span>" +
      '<h3 class="cmc__name"><a href="' + href(p) + '">' + esc(p.name) + "</a></h3></div>" +
      '<div class="cmc__foot"><div><span class="cmc__price-label">Precio</span><span class="cmc__price">' + fmt(p.price) + "</span></div>" +
      '<button type="button" class="cmc__add" data-add-to-cart data-product-id="' + p.id + '" aria-label="Agregar ' + esc(p.name) + ' al carrito">' +
      '<i class="bi bi-bag" aria-hidden="true"></i></button></div></div>'
    );
  };

  function createProductCard(product, options) {
    const opts = options || {};
    const variant = opts.variant || "home";
    const render = templates[variant];
    const li = document.createElement("li");
    li.className = (CLASS[variant] || "pcard") + " pcard--" + variant;
    li.dataset.productId = String(product.id);
    if (opts.revealDelay !== undefined) {
      li.setAttribute("data-reveal", "");
      li.style.setProperty("--reveal-delay", opts.revealDelay + "ms");
    }
    li.innerHTML = render(product);
    return li;
  }

  function renderProductGrid(container, products, options) {
    const opts = options || {};
    container.innerHTML = "";
    const frag = document.createDocumentFragment();
    products.forEach((product, index) => {
      frag.appendChild(createProductCard(product, Object.assign({}, opts, { revealDelay: (index % 8) * 60 })));
    });
    container.appendChild(frag);
  }

  function registerVariant(name, className, renderFn) {
    templates[name] = renderFn;
    CLASS[name] = className;
  }

  window.productCardComponent = { createProductCard, renderProductGrid, registerVariant, helpers: { esc, icon, fmt, fmtSp, href, isFav, favButton } };
})();
