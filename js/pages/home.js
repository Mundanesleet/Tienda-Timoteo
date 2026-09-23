/**
 * home.js — lógica específica de index.html.
 * Render de categorías, favoritos y ocasiones para las versiones
 * desktop y móvil del diseño (ambas viven en el mismo HTML).
 */
(function () {
  "use strict";

  function renderCategories() {
    const categories = window.categoryService.getAllCategories();

    const bar = document.getElementById("home-categories-bar");
    if (bar) {
      const frag = document.createDocumentFragment();
      categories.forEach((cat) => frag.appendChild(window.categoryCardComponent.createCategoryPill(cat)));
      const all = document.createElement("a");
      all.className = "cat-pill cat-pill--all";
      all.href = "categorias.html";
      all.innerHTML =
        '<span class="cat-pill__icon">' + window.timoteoIcons.icon("arrow-right", { size: 20, stroke: 2.2 }) + "</span>" +
        '<span class="cat-pill__label">Ver todas las categorías</span>';
      frag.appendChild(all);
      bar.appendChild(frag);
    }

    const circles = document.getElementById("home-categories-mobile");
    if (circles) {
      const frag = document.createDocumentFragment();
      categories.forEach((cat) => frag.appendChild(window.categoryCardComponent.createCategoryCircle(cat)));
      circles.appendChild(frag);
    }
  }

  function renderFavorites() {
    const desktop = document.getElementById("home-favorites-desktop");
    if (desktop) {
      window.productCardComponent.renderProductGrid(desktop, window.productService.getFeaturedProducts(4), { variant: "home" });
    }
    const mobile = document.getElementById("home-favorites-mobile");
    if (mobile) {
      window.productCardComponent.renderProductGrid(mobile, window.productService.getFeaturedProducts(2), { variant: "mobile" });
    }
  }

  function renderOccasions() {
    const occasions = window.categoryService.getAllOccasions();
    const desktop = document.getElementById("home-occasions-desktop");
    if (desktop) {
      desktop.innerHTML = occasions
        .map((o) => {
          const label = o.slug === "ocasiones-especiales" ? "Para una ocasión especial" : o.name;
          return (
            '<li><a href="catalogo.html?ocasion=' + o.slug + '"><span>' +
            window.timoteoUtils.escapeHtml(label) + '</span><span aria-hidden="true">→</span></a></li>'
          );
        })
        .join("");
    }
    const mobile = document.getElementById("home-occasions-mobile");
    if (mobile) {
      mobile.innerHTML = occasions
        .map(
          (o) =>
            '<a href="catalogo.html?ocasion=' + o.slug + '"><span>' + window.timoteoUtils.escapeHtml(o.name) +
            '</span><span aria-hidden="true">→</span></a>'
        )
        .join("");
    }
  }

  function init() {
    renderCategories();
    renderFavorites();
    renderOccasions();
    window.timoteoApp.initScrollReveal(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
