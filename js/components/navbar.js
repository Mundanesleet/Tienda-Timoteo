/**
 * navbar.js — construye el header dentro de <header id="site-header">.
 *
 * El diseño de Stitch define tres variantes de cabecera, elegidas con
 * <body data-chrome="boutique|atelier|appbar">:
 *   - boutique: Home, Catálogo, Crea tu regalo, Producto (logo centrado + nav en 2ª fila)
 *   - atelier:  Favoritos, Búsqueda, Novedades, Nosotros, Contacto (barra superior + logo centrado)
 *   - appbar:   Carrito, Checkout, Confirmación (barra superior + una sola fila con buscador)
 * En pantallas pequeñas todas comparten la cabecera móvil (menú + logo + carrito).
 * La página activa se declara en <body data-nav="..."> (o data-page).
 */
(function () {
  "use strict";

  const NAV_LINKS = [
    { key: "home", href: "index.html", label: "Inicio" },
    { key: "categorias", href: "categorias.html", label: "Categorías" },
    { key: "personalizar", href: "personalizar.html", label: "Crea tu regalo" },
    { key: "novedades", href: "novedades.html", label: "Novedades" },
    { key: "nosotros", href: "nosotros.html", label: "Nosotros" },
    { key: "contacto", href: "contacto.html", label: "Contacto" }
  ];

  const ICON = (name, opts) => window.timoteoIcons.icon(name, opts);

  function navItems(current, className) {
    return NAV_LINKS.map((l) => {
      const active = l.key === current;
      return (
        '<li><a href="' + l.href + '" class="' + className + (active ? " is-active" : "") + '"' +
        (active ? ' aria-current="page"' : "") + ">" + l.label + "</a></li>"
      );
    }).join("");
  }

  function badge(kind, cls) {
    const attr = kind === "cart" ? "data-cart-badge" : "data-favorites-badge";
    return '<span class="' + (cls || "hdr-badge") + '" ' + attr + " hidden>0</span>";
  }

  /* ---------------------------------------------------------------- boutique */
  function boutiqueHeader(current) {
    return (
      '<div class="hb">' +
      '<div class="hb__top">' +
      '<div class="hb__tagline"><p>Detalles que hacen<br><span>la vida más linda.</span></p></div>' +
      '<div class="hb__logo"><a href="index.html" aria-label="Timoteo, ir al inicio">' + window.timoteoUtils.brandLogoSvg("hb__logo-svg") + "</a></div>" +
      '<div class="hb__actions">' +
      '<button type="button" class="hb__icon" data-search-toggle aria-expanded="false" aria-controls="searchPanel" aria-label="Buscar productos">' + ICON("search", { size: 20 }) + "</button>" +
      '<button type="button" class="hb__icon" data-account-toggle aria-expanded="false" aria-label="Mi cuenta">' + ICON("user", { size: 20 }) + "</button>" +
      '<a href="favoritos.html" class="hb__icon" aria-label="Favoritos">' + ICON("heart", { size: 20 }) + badge("fav") + "</a>" +
      '<a href="carrito.html" class="hb__icon" aria-label="Carrito de compras">' + ICON("cart", { size: 20 }) + badge("cart") + "</a>" +
      "</div>" +
      "</div>" +
      '<nav class="hb__nav" aria-label="Menú principal"><ul>' + navItems(current, "hb__link") + "</ul></nav>" +
      "</div>"
    );
  }

  /* ---------------------------------------------------------------- atelier */
  function atelierHeader(current) {
    return (
      '<div class="ha__bar">DETALLES QUE HACEN LA VIDA MÁS LINDA • ENVÍOS A TODO EL PAÍS</div>' +
      '<div class="ha__inner">' +
      '<div class="ha__row">' +
      '<div class="ha__tagline"><span>Detalles que cuentan historias</span></div>' +
      '<a class="ha__brand" href="index.html" aria-label="Timoteo, ir al inicio">' +
      '<img src="assets/images/brand/logo.png" alt="" width="32" height="32">' +
      '<span class="ha__brand-text"><span class="ha__brand-name">Timoteo</span><span class="ha__brand-sub">Tienda de Regalos</span></span></a>' +
      '<div class="ha__actions">' +
      '<button type="button" class="ha__icon" data-search-toggle aria-expanded="false" aria-controls="searchPanel" aria-label="Buscar regalos"><i class="bi bi-search"></i></button>' +
      '<a href="favoritos.html" class="ha__icon" aria-label="Favoritos"><i class="bi bi-heart"></i>' + badge("fav", "ha__badge ha__badge--soft") + "</a>" +
      '<a href="carrito.html" class="ha__icon" aria-label="Carrito de compras"><i class="bi bi-bag"></i>' + badge("cart", "ha__badge") + "</a>" +
      '<button type="button" class="ha__avatar" data-account-toggle aria-expanded="false" aria-label="Mi cuenta"><i class="bi bi-person-fill"></i></button>' +
      "</div>" +
      "</div>" +
      '<nav class="ha__nav" aria-label="Menú principal"><ul>' + navItems(current, "ha__link") + "</ul></nav>" +
      "</div>"
    );
  }

  /* ----------------------------------------------------------------- appbar */
  function appbarHeader(current) {
    return (
      '<div class="hp__bar">Detalles que hacen la vida más linda • Envíos a todo el país</div>' +
      '<div class="hp__inner">' +
      '<a class="hp__brand" href="index.html" aria-label="Timoteo, ir al inicio">' +
      '<img src="assets/images/brand/logo.png" alt="" width="36" height="36"><span class="hp__brand-name">Timoteo</span></a>' +
      '<nav class="hp__nav" aria-label="Menú principal"><ul>' + navItems(current, "hp__link") + "</ul></nav>" +
      '<div class="hp__actions">' +
      '<form class="hp__search" role="search" action="busqueda.html" method="get">' +
      '<i class="bi bi-search" aria-hidden="true"></i>' +
      '<label class="visually-hidden" for="hpSearch">Buscar detalles</label>' +
      '<input id="hpSearch" type="search" name="q" placeholder="Buscar detalles..." autocomplete="off"></form>' +
      '<a href="favoritos.html" class="hp__icon" aria-label="Favoritos"><i class="bi bi-heart"></i>' + badge("fav", "hp__badge hp__badge--soft") + "</a>" +
      '<a href="carrito.html" class="hp__icon" aria-label="Carrito de compras"><i class="bi bi-bag"></i>' + badge("cart", "hp__badge") + "</a>" +
      '<button type="button" class="hp__avatar" data-account-toggle aria-expanded="false" aria-label="Mi cuenta"><i class="bi bi-person-fill"></i></button>' +
      "</div>" +
      "</div>"
    );
  }

  /* ------------------------------------------------------------------ móvil */
  /** Cabecera móvil "app" (Catálogo, Carrito, Producto…): menú + logo + bolsa + avatar. */
  function materialMobileHeader() {
    if (document.body.dataset.page === "producto") {
      return (
        '<div class="mm">' +
        '<div class="mm__left">' +
        '<button type="button" class="mm__btn" onclick="history.length > 1 ? history.back() : (location.href=\'catalogo.html\')" aria-label="Volver atrás"><i class="bi bi-arrow-left" style="font-size:24px;line-height:1"></i></button>' +
        '<a class="mm__logo" href="index.html" aria-label="Timoteo, ir al inicio">' + window.timoteoUtils.brandLogoSvg("mm__logo-svg mm__logo-svg--sm") + "</a>" +
        '<h1 class="mm__title">Detalle Del Regalo</h1>' +
        "</div>" +
        '<div class="mm__right"><button type="button" class="mm__avatar" data-account-toggle aria-expanded="false" aria-label="Mi cuenta"><i class="bi bi-person-fill"></i></button></div>' +
        "</div>"
      );
    }
    return (
      '<div class="mm">' +
      '<div class="mm__left">' +
      '<button type="button" class="mm__btn" data-open-drawer aria-controls="menuDrawer" aria-label="Menú lateral">' + ICON("menu", { size: 24, stroke: 1.8 }) + "</button>" +
      '<a class="mm__logo" href="index.html" aria-label="Timoteo, ir al inicio">' + window.timoteoUtils.brandLogoSvg("mm__logo-svg") + "</a>" +
      "</div>" +
      '<div class="mm__right">' +
      '<a class="mm__btn mm__cart" href="carrito.html" aria-label="Carrito de compras">' + ICON("bag", { size: 24, stroke: 1.8 }) + badge("cart", "mm__badge") + "</a>" +
      '<button type="button" class="mm__avatar" data-account-toggle aria-expanded="false" aria-label="Mi cuenta"><i class="bi bi-person-fill"></i></button>' +
      "</div></div>"
    );
  }

  function mobileHeader(isHome) {
    if (!isHome) return materialMobileHeader();
    return (
      '<div class="hm">' +
      '<button type="button" class="hm__btn" data-open-drawer aria-controls="menuDrawer" aria-label="Abrir menú de navegación">' + ICON("menu", { size: 24, stroke: 1.8 }) + "</button>" +
      '<a class="hm__logo" href="index.html" aria-label="Timoteo, ir al inicio">' + window.timoteoUtils.brandLogoSvg("hm__logo-svg") + "</a>" +
      '<a class="hm__btn hm__cart" href="carrito.html" aria-label="Carrito de compras">' + ICON("bag", { size: 24, stroke: 1.8 }) + badge("cart", "hm__badge") + "</a>" +
      "</div>"
    );
  }

  function searchPanel() {
    return (
      '<div class="search-panel" id="searchPanel" data-search-panel hidden>' +
      '<form role="search" action="busqueda.html" method="get" class="search-panel__form">' +
      '<div class="search-panel__field"><i class="bi bi-search" aria-hidden="true"></i>' +
      '<label for="headerSearchInput" class="visually-hidden">Buscar productos</label>' +
      '<input id="headerSearchInput" type="search" name="q" placeholder="Buscar peluches, flores, chocolates…" autocomplete="off"></div>' +
      '<button type="submit" class="search-panel__submit">Buscar <span aria-hidden="true">→</span></button>' +
      "</form></div>" +
      '<div class="account-pop" data-account-pop hidden>' +
      "<p>Las cuentas de cliente llegan pronto. Por ahora puedes comprar como invitado.</p>" +
      '<a href="favoritos.html">Ver mis favoritos</a><a href="carrito.html">Ver mi carrito</a></div>'
    );
  }

  function drawerTemplate(current) {
    return (
      '<div class="drawer" id="menuDrawer" data-drawer aria-hidden="true">' +
      '<div class="drawer__backdrop" data-close-drawer></div>' +
      '<aside class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menú de navegación">' +
      '<div class="drawer__head">' + window.timoteoUtils.brandLogoSvg("drawer__logo") +
      '<button type="button" class="drawer__close" data-close-drawer aria-label="Cerrar menú">' + ICON("close", { size: 20, stroke: 2 }) + "</button></div>" +
      '<ul class="drawer__links">' +
      NAV_LINKS.map((l) =>
        '<li><a href="' + l.href + '"' + (l.key === current ? ' aria-current="page"' : "") + ">" + l.label + "<span aria-hidden=\"true\">→</span></a></li>"
      ).join("") +
      '<li><a href="favoritos.html">Favoritos<span aria-hidden="true">→</span></a></li>' +
      "</ul>" +
      '<p class="drawer__note">Detalles que hacen la vida más linda.</p>' +
      "</aside></div>"
    );
  }

  function initNavbar() {
    const header = document.getElementById("site-header");
    if (!header) return;
    const chrome = document.body.dataset.chrome || "boutique";
    const current = document.body.dataset.nav || document.body.dataset.page || "";

    header.className = "site-header site-header--" + chrome;
    const desktop = chrome === "atelier" ? atelierHeader(current) : chrome === "appbar" ? appbarHeader(current) : boutiqueHeader(current);
    header.innerHTML =
      '<div class="site-header__desktop">' + desktop + "</div>" +
      '<div class="site-header__mobile' + (document.body.dataset.page === "home" ? "" : " site-header__mobile--app") + '">' + mobileHeader(document.body.dataset.page === "home") + "</div>" +
      searchPanel();

    let host = document.getElementById("menu-drawer-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "menu-drawer-host";
      document.body.appendChild(host);
    }
    host.innerHTML = drawerTemplate(current);

    const drawer = host.querySelector("[data-drawer]");
    const openDrawer = () => {
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
    };
    const closeDrawer = () => {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
    };
    header.querySelectorAll("[data-open-drawer]").forEach((b) => b.addEventListener("click", openDrawer));
    drawer.querySelectorAll("[data-close-drawer]").forEach((b) => b.addEventListener("click", closeDrawer));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

    // Panel de búsqueda
    const panel = header.querySelector("[data-search-panel]");
    const searchToggles = header.querySelectorAll("[data-search-toggle]");
    searchToggles.forEach((toggle) =>
      toggle.addEventListener("click", () => {
        const open = panel.hidden;
        panel.hidden = !open;
        searchToggles.forEach((t) => t.setAttribute("aria-expanded", String(open)));
        if (open) window.requestAnimationFrame(() => panel.querySelector("input").focus());
      })
    );

    // Popover de cuenta
    const pop = header.querySelector("[data-account-pop]");
    header.querySelectorAll("[data-account-toggle]").forEach((t) =>
      t.addEventListener("click", (e) => {
        e.stopPropagation();
        pop.hidden = !pop.hidden;
      })
    );
    document.addEventListener("click", (e) => { if (!pop.hidden && !pop.contains(e.target)) pop.hidden = true; });

    if (window.timoteoUtils.getQueryParam("foco") === "buscar") {
      panel.hidden = false;
      panel.querySelector("input").focus();
    }
  }

  window.navbarComponent = { initNavbar, NAV_LINKS };
})();
