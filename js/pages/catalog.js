/**
 * catalog.js — catálogo con filtros (categoría, ocasión, destinatario, precio),
 * búsqueda, orden y "cargar más". Renderiza a la vez la versión desktop y móvil
 * del diseño (ambas viven en catalogo.html).
 * Parámetros de URL soportados: categoria, ocasion, q (o buscar), novedades.
 */
(function () {
  "use strict";

  const PAGE_SIZE_DESKTOP = 8;
  const PAGE_SIZE_MOBILE = 6;
  const SORT_LABELS = {
    popular: "Más populares",
    newest: "Novedades",
    "price-asc": "Precio: menor a mayor",
    "price-desc": "Precio: mayor a menor",
    rating: "Mejor valorados"
  };

  const state = {
    category: "todos",   // slug | "todos" | "especial"
    occasions: [],
    recipients: [],
    minPrice: null,
    maxPrice: null,
    q: "",
    sort: "popular",
    onlyNew: false,
    shown: PAGE_SIZE_DESKTOP
  };

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const isMobile = () => window.matchMedia("(max-width: 767.98px)").matches;
  const pageSize = () => (isMobile() ? PAGE_SIZE_MOBILE : PAGE_SIZE_DESKTOP);

  function toggle(list, value) {
    const i = list.indexOf(value);
    if (i === -1) list.push(value);
    else list.splice(i, 1);
  }

  function getResults() {
    return window.productService.searchProducts({
      category: state.category === "especial" ? null : state.category,
      special: state.category === "especial",
      occasions: state.occasions,
      recipients: state.recipients,
      minPrice: state.minPrice === null ? undefined : state.minPrice,
      maxPrice: state.maxPrice === null ? undefined : state.maxPrice,
      query: state.q,
      sort: state.sort,
      onlyNew: state.onlyNew
    });
  }

  /* ----------------------------------------------------------- pestañas */
  const TAB_ICONS = { todos: null, especial: null };

  function renderTabs() {
    const host = $("#catalog-tabs");
    if (host) {
      const icon = window.timoteoIcons.icon;
      const cats = window.categoryService.getAllCategories();
      const items = [{ slug: "todos", name: "Todas", html: '<i class="bi bi-grid-fill"></i>' }]
        .concat(cats.map((c) => ({ slug: c.slug, name: c.name, html: icon(c.icon, { size: 24, stroke: 1.8 }) })))
        .concat([{ slug: "especial", name: "Especial", html: '<i class="bi bi-gem"></i>' }]);
      host.innerHTML = items
        .map(
          (it) =>
            '<button type="button" role="tab" class="cr__tab" data-category="' + it.slug + '"><span class="cr__tab-icon">' +
            it.html + '</span><span class="cr__tab-label">' + it.name + "</span></button>"
        )
        .join("");
    }
    const rail = $("#catalog-rail");
    if (rail) {
      rail.innerHTML = window.categoryService
        .getAllCategories()
        .map(
          (c) =>
            '<button type="button" class="cm__cat" data-category="' + c.slug + '"><span class="cm__cat-ring"><span><img src="' +
            c.image + '" alt="" loading="lazy"></span></span><span class="cm__cat-label">' + c.name + "</span></button>"
        )
        .join("");
    }
  }

  /* ------------------------------------------------------------ render */
  function syncControls() {
    $$("[data-category]").forEach((b) => b.classList.toggle("is-active", b.dataset.category === state.category));
    $$("[data-occasion]").forEach((b) => b.classList.toggle("is-active", state.occasions.includes(b.dataset.occasion)));
    $$("[data-recipient]").forEach((b) => b.classList.toggle("is-active", state.recipients.includes(b.dataset.recipient)));
    $$("[data-price]").forEach((b) => b.classList.toggle("is-active", state.minPrice !== null));
    $$("[data-maxprice]").forEach((b) => b.classList.toggle("is-active", state.maxPrice !== null));
    $$("[data-category]").forEach((b) => b.setAttribute("aria-selected", String(b.classList.contains("is-active"))));

    const search = $("#catalog-search");
    if (search && search.value !== state.q) search.value = state.q;
    ["#catalog-sort", "#catalog-sort-m"].forEach((s) => { const el = $(s); if (el) el.value = state.sort; });
    const label = $("[data-sort-label]");
    if (label) label.textContent = SORT_LABELS[state.sort];

    const active = state.occasions.length + state.recipients.length + (state.minPrice !== null ? 1 : 0) + (state.maxPrice !== null ? 1 : 0);
    const badge = $("[data-filter-count]");
    if (badge) { badge.textContent = String(active); badge.hidden = active === 0; }
  }

  function render() {
    const results = getResults();
    const total = results.length;
    const cards = window.productCardComponent;

    // Desktop
    const gridD = $("#catalog-grid");
    const shownD = Math.min(state.shown, total);
    if (gridD) cards.renderProductGrid(gridD, results.slice(0, shownD), { variant: "catalog" });
    // Móvil
    const gridM = $("#catalog-grid-m");
    const shownM = Math.min(state.shown, total);
    if (gridM) cards.renderProductGrid(gridM, results.slice(0, shownM), { variant: "catalogm" });

    $$("[data-count]").forEach((el) => { el.textContent = el.closest(".cm") ? total + " regalos" : String(total); });

    const empty = total === 0;
    [["#catalog-empty", gridD], ["#catalog-empty-m", gridM]].forEach(([sel, grid]) => {
      const el = $(sel);
      if (el) el.hidden = !empty;
      if (grid) grid.hidden = empty;
    });

    const moreD = $("#catalog-more");
    if (moreD) {
      moreD.hidden = empty;
      $("[data-seen]", moreD).textContent = "Has visto " + shownD + " de " + total + " detalles diseñados con el corazón";
      $("[data-bar]", moreD).style.width = (total ? (shownD / total) * 100 : 0) + "%";
      $("#load-more-btn").hidden = shownD >= total;
    }
    const moreM = $("#catalog-more-m");
    if (moreM) {
      moreM.hidden = empty;
      $("[data-seen-m]", moreM).textContent = "Viendo " + shownM + " de " + total + " opciones";
      $("#load-more-btn-m").hidden = shownM >= total;
    }

    syncControls();
    window.timoteoApp.initScrollReveal(document);
  }

  function resetPaging() {
    state.shown = pageSize();
  }

  function clearFilters() {
    state.category = "todos";
    state.occasions = [];
    state.recipients = [];
    state.minPrice = null;
    state.maxPrice = null;
    state.q = "";
    state.onlyNew = false;
    resetPaging();
    window.timoteoUtils.setQueryParams({ categoria: null, ocasion: null, q: null, buscar: null, novedades: null }, { replace: true });
    render();
  }

  /* ------------------------------------------------------------ eventos */
  function bind() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("button, a");
      if (!t) return;
      if (t.dataset.category !== undefined) {
        state.category = state.category === t.dataset.category && t.dataset.category !== "todos" ? "todos" : t.dataset.category;
        resetPaging();
        window.timoteoUtils.setQueryParams({ categoria: state.category === "todos" ? null : state.category }, { replace: true });
        render();
      } else if (t.dataset.occasion !== undefined) {
        toggle(state.occasions, t.dataset.occasion);
        resetPaging(); render();
      } else if (t.dataset.recipient !== undefined) {
        toggle(state.recipients, t.dataset.recipient);
        resetPaging(); render();
      } else if (t.dataset.price !== undefined) {
        state.minPrice = state.minPrice === null ? Number(t.dataset.price) : null;
        resetPaging(); render();
      } else if (t.dataset.maxprice !== undefined) {
        state.maxPrice = state.maxPrice === null ? Number(t.dataset.maxprice) : null;
        resetPaging(); render();
      } else if (t.matches("[data-clear-filters]")) {
        clearFilters();
      } else if (t.matches("[data-clear-search]")) {
        state.q = ""; resetPaging(); render();
      } else if (t.id === "load-more-btn" || t.id === "load-more-btn-m") {
        state.shown += pageSize();
        render();
      } else if (t.id === "cm-filter-toggle") {
        const panel = $("#cm-filter-panel");
        const open = panel.hidden;
        panel.hidden = !open;
        t.setAttribute("aria-expanded", String(open));
      }
    });

    const search = $("#catalog-search");
    if (search) {
      search.addEventListener("input", window.timoteoUtils.debounce(() => {
        state.q = search.value;
        resetPaging();
        render();
      }, 200));
    }
    ["#catalog-sort", "#catalog-sort-m"].forEach((sel) => {
      const el = $(sel);
      if (el) el.addEventListener("change", () => { state.sort = el.value; resetPaging(); render(); });
    });
    window.addEventListener("resize", window.timoteoUtils.debounce(() => {
      const size = pageSize();
      if (state.shown < size) { state.shown = size; render(); }
    }, 200));
  }

  function readUrl() {
    const u = window.timoteoUtils.getQueryParam;
    const cat = u("categoria");
    if (cat && (cat === "especial" || window.categoryService.getCategoryBySlug(cat))) state.category = cat;
    const occ = u("ocasion");
    if (occ) state.occasions = [occ];
    state.q = u("q") || u("buscar") || "";
    state.onlyNew = u("novedades") === "1";
  }

  function init() {
    renderTabs();
    readUrl();
    resetPaging();
    bind();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
