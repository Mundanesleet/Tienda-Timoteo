/**
 * favorites.js — lista de favoritos (Stitch: "Tus Detalles Guardados").
 * Lee favoritesService (localStorage), permite filtrar por grupo, quitar,
 * mover todo al carrito y compartir la lista.
 */
(function () {
  "use strict";

  const GROUPS = [
    { key: "flores", label: "Flores & Bouquets", cats: ["flores"] },
    { key: "chocolates", label: "Chocolatería", cats: ["chocolates"] },
    { key: "peluches", label: "Peluches & Cajas", cats: ["peluches", "regalos"] },
    { key: "otros", label: "Accesorios & Más", cats: ["relojes", "juguetes"] }
  ];
  let filter = "todos";

  const $ = (s) => document.querySelector(s);

  function groupOf(product) {
    return GROUPS.find((g) => g.cats.includes(product.category));
  }

  function renderFilters(all) {
    const chips = ['<button type="button" class="fv-chip' + (filter === "todos" ? " is-active" : "") + '" data-filter="todos">Todos (' + all.length + ")</button>"];
    GROUPS.forEach((g) => {
      const n = all.filter((p) => groupOf(p) === g).length;
      if (n) chips.push('<button type="button" class="fv-chip' + (filter === g.key ? " is-active" : "") + '" data-filter="' + g.key + '">' + g.label + "</button>");
    });
    $("#fv-filters").innerHTML = chips.join("");
    $("#fv-filters-wrap").hidden = all.length === 0;
  }

  function render() {
    const all = window.favoritesService.getFavoriteProducts().reverse();
    const visible = filter === "todos" ? all : all.filter((p) => (groupOf(p) || {}).key === filter);
    if (filter !== "todos" && visible.length === 0 && all.length) { filter = "todos"; return render(); }

    $("#savedCountLabel").textContent = all.length + (all.length === 1 ? " artículo" : " artículos");
    renderFilters(all);
    const grid = $("#favoritesGrid");
    window.productCardComponent.renderProductGrid(grid, visible, { variant: "favorite" });
    grid.hidden = all.length === 0;
    $("#emptyWishlistState").hidden = all.length !== 0;
    $("#btnMoveAllToCart").disabled = all.length === 0;
    $("#btnShareWishlist").disabled = all.length === 0;
    window.timoteoApp.initScrollReveal(document);
  }

  function init() {
    render();

    // Quitar de favoritos (el corazón de la tarjeta usa la delegación global de app.js)
    window.addEventListener(window.favoritesService.EVENT_NAME, () => window.setTimeout(render, 260));

    document.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-filter]");
      if (chip) { filter = chip.dataset.filter; render(); }
    });

    $("#btnMoveAllToCart").addEventListener("click", () => {
      const list = window.favoritesService.getFavoriteProducts();
      list.forEach((p) => window.cartService.addToCart(p, { quantity: 1 }));
      window.toastComponent.showToast({
        title: "Moviste " + list.length + (list.length === 1 ? " detalle" : " detalles") + " a la cesta",
        icon: "bi-bag-check",
        actionLabel: "Ver carrito",
        actionHref: "carrito.html"
      });
    });

    $("#btnShareWishlist").addEventListener("click", () => {
      const names = window.favoritesService.getFavoriteProducts().map((p) => p.name).join(", ");
      const text = "Mi lista de detalles en Timoteo: " + names;
      if (navigator.share) navigator.share({ title: "Mis favoritos en Timoteo", text: text, url: window.location.href }).catch(() => {});
      else if (navigator.clipboard) navigator.clipboard.writeText(text + " " + window.location.href).then(() => window.toastComponent.showToast({ title: "Lista copiada", message: "Pégala donde quieras compartirla", icon: "bi-link-45deg" }));
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
