/**
 * categoryCard.js — representaciones de categoría del diseño de Stitch:
 *   createCategoryPill:   tarjeta con icono lineal + nombre (barra del Home desktop)
 *   createCategoryCircle: círculo con fotografía + nombre (Home móvil)
 */
(function () {
  "use strict";

  const esc = (s) => window.timoteoUtils.escapeHtml(s);

  function withReveal(el, opts) {
    if (opts && opts.revealDelay !== undefined) {
      el.setAttribute("data-reveal", "");
      el.style.setProperty("--reveal-delay", opts.revealDelay + "ms");
    }
    return el;
  }

  function createCategoryPill(category, options) {
    const a = document.createElement("a");
    a.className = "cat-pill";
    a.href = "catalogo.html?categoria=" + category.slug;
    a.innerHTML =
      '<span class="cat-pill__icon">' + window.timoteoIcons.icon(category.icon, { size: 20, stroke: 1.8 }) + "</span>" +
      '<span class="cat-pill__label">' + esc(category.name) + "</span>";
    return withReveal(a, options);
  }

  function createCategoryCircle(category, options) {
    const a = document.createElement("a");
    a.className = "cat-circle";
    a.href = "catalogo.html?categoria=" + category.slug;
    a.innerHTML =
      '<span class="cat-circle__ring"><img src="' + category.image + '" alt="' + esc(category.name) + '" loading="lazy"></span>' +
      '<span class="cat-circle__label">' + esc(category.name) + "</span>";
    return withReveal(a, options);
  }

  window.categoryCardComponent = { createCategoryPill, createCategoryCircle };
})();
