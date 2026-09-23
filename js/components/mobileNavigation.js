/**
 * mobileNavigation.js — barra de navegación inferior (solo visible en móvil vía CSS).
 * Stitch define dos variantes:
 *   - Home:   Inicio · Buscar · Categorías · Carrito
 *   - Resto:  Inicio · Buscar · Categorías · Favoritos · Carrito
 * Se omite en confirmacion.html (pantalla sin distracciones tras comprar).
 */
(function () {
  "use strict";

  function initMobileNavigation() {
    const host = document.getElementById("bottom-nav");
    if (!host) return;
    const page = document.body.dataset.page || "";
    if (page === "producto") return; // tiene su propia barra de compra fija
    if (page === "confirmacion") return; // pantalla sin distracciones tras comprar
    const isHome = page === "home";
    const heroicon = (n) => window.timoteoIcons.icon(n, { size: 20, stroke: 2 });

    const homeItems = [
      { key: "home", href: "index.html", svg: "home", label: "Inicio" },
      { key: "busqueda", href: "busqueda.html?foco=1", svg: "search-m", label: "Buscar" },
      { key: "categorias", href: "categorias.html", svg: "grid", label: "Categorías", also: ["catalogo"] },
      { key: "carrito", href: "carrito.html", svg: "bag", label: "Carrito", badge: "cart" }
    ];
    const appItems = [
      { key: "home", href: "index.html", bi: "house-door", label: "Inicio" },
      { key: "busqueda", href: "busqueda.html?foco=1", bi: "search", label: "Buscar" },
      { key: "categorias", href: "categorias.html", bi: "grid", label: "Categorías", also: ["catalogo", "producto"] },
      { key: "favoritos", href: "favoritos.html", bi: "heart", label: "Favoritos" },
      { key: "carrito", href: "carrito.html", bi: "bag", label: "Carrito", badge: "cart", also: ["checkout"] }
    ];
    const items = isHome ? homeItems : appItems;

    const nav = document.createElement("nav");
    nav.className = "bottom-nav" + (isHome ? "" : " bottom-nav--app");
    nav.setAttribute("aria-label", "Navegación principal de la aplicación");
    nav.innerHTML =
      '<div class="bottom-nav__grid">' +
      items
        .map((it) => {
          const active = it.key === page || (it.also && it.also.indexOf(page) !== -1);
          const badge = it.badge
            ? '<span class="bottom-nav__badge" ' + (it.badge === "cart" ? "data-cart-badge" : "data-favorites-badge") + " hidden>0</span>"
            : "";
          const glyph = it.svg ? heroicon(it.svg) : '<i class="bi bi-' + it.bi + (active ? "-fill" : "") + '"></i>';
          return (
            '<a href="' + it.href + '" class="bottom-nav__item' + (active ? " is-active" : "") + '"' + (active ? ' aria-current="page"' : "") + ">" +
            '<span class="bottom-nav__icon">' + glyph + badge + "</span>" +
            "<span>" + it.label + "</span></a>"
          );
        })
        .join("") +
      "</div>";

    host.appendChild(nav);
    document.body.classList.add("has-bottom-nav");
  }

  window.mobileNavigationComponent = { initMobileNavigation };
})();
