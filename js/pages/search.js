/**
 * search.js — resultados de búsqueda (busqueda.html?q=...).
 * Búsqueda en vivo sobre productService, orden, sugeridos y "cargar más".
 */
(function () {
  "use strict";

  const SUGGESTIONS = ["Ositos con flores", "Peluche gigante", "Osos con bombones", "Caja sombrerera con osito"];
  const PAGE = 6;
  const state = { q: "", sort: "popular", shown: PAGE };
  const $ = (s) => document.querySelector(s);
  const esc = (s) => window.timoteoUtils.escapeHtml(s);

  function results() {
    return window.productService.searchProducts({ query: state.q, sort: state.sort });
  }

  function renderSuggest() {
    const chips = [];
    if (state.q) {
      chips.push('<a href="#" class="sr-chip is-active" data-q="' + esc(state.q) + '"><span>Todos con "' + esc(state.q) + '"</span><i class="bi bi-check"></i></a>');
    }
    SUGGESTIONS.forEach((s, i) => {
      if (s.toLowerCase() === state.q.toLowerCase()) return;
      chips.push('<a href="#" class="sr-chip' + (i === 3 ? " sr-chip--sm-only" : "") + '" data-q="' + esc(s) + '">' + esc(s) + "</a>");
    });
    $("#sr-suggest").innerHTML = '<span class="sr-suggest__label"><i class="bi bi-stars"></i> Sugeridos:</span>' + chips.join("");
  }

  function render() {
    const list = results();
    const total = list.length;
    const shown = Math.min(state.shown, total);

    $("#sr-crumb-q").textContent = state.q ? '"' + state.q + '"' : "Todos";
    $("#sr-title").innerHTML = total + (total === 1 ? " resultado" : " resultados") + (state.q ? ' para <span>"' + esc(state.q) + '"</span>' : "");
    $("#sr-form").querySelector("input").value = state.q;

    const grid = $("#sr-grid");
    window.productCardComponent.renderProductGrid(grid, list.slice(0, shown), { variant: "search" });
    grid.hidden = total === 0;
    $("#sr-empty").hidden = total !== 0;
    $("#sr-more").hidden = total === 0;
    $("#sr-seen").textContent = "Mostrando " + shown + " de " + total + " regalos encontrados";
    $("#sr-bar").style.width = (total ? (shown / total) * 100 : 0) + "%";
    const load = $("#sr-load");
    load.hidden = shown >= total;
    load.querySelector("span").textContent = "Cargar " + (total - shown) + (total - shown === 1 ? " resultado restante" : " resultados restantes");

    renderSuggest();
    document.title = (state.q ? '"' + state.q + '" · ' : "") + "Búsqueda | Timoteo";
    window.timoteoApp.initScrollReveal(document);
  }

  function setQuery(q, push) {
    state.q = q.trim();
    state.shown = PAGE;
    window.timoteoUtils.setQueryParams({ q: state.q || null, foco: null }, { replace: !push });
    render();
  }

  function init() {
    state.q = window.timoteoUtils.getQueryParam("q") || window.timoteoUtils.getQueryParam("buscar") || "";
    const input = $("#searchInput");

    $("#sr-form").addEventListener("submit", (e) => { e.preventDefault(); setQuery(input.value, true); });
    input.addEventListener("input", window.timoteoUtils.debounce(() => setQuery(input.value, false), 250));
    $("#clearSearch").addEventListener("click", () => { input.value = ""; setQuery("", true); input.focus(); });
    $("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; state.shown = PAGE; render(); });
    $("#sr-load").addEventListener("click", () => { state.shown += PAGE; render(); });
    $("#sr-suggest").addEventListener("click", (e) => {
      const chip = e.target.closest("[data-q]");
      if (!chip) return;
      e.preventDefault();
      setQuery(chip.dataset.q, true);
    });

    render();
    if (window.timoteoUtils.getQueryParam("foco")) input.focus();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
