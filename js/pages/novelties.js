/**
 * novelties.js — Novedades y ediciones de temporada (novedades.html).
 * Pinta bouquets y accesorios desde productService, filtra por chips
 * y gestiona la suscripción al Timoteo Club (localStorage).
 */
(function () {
  "use strict";

  const BOUQUET_IDS = [15, 16, 17];
  const ACCESSORY_IDS = [18, 19, 20, 21];
  const CAPSULE_ID = 34;
  const CLUB_KEY = "timoteo_club";

  /* Qué muestra cada chip: bloques visibles y ids por bloque. */
  const FILTERS = {
    todos: { bouquets: BOUQUET_IDS, cajas: true, accesorios: ACCESSORY_IDS },
    bouquets: { bouquets: BOUQUET_IDS, cajas: false, accesorios: [] },
    cajas: { bouquets: [], cajas: true, accesorios: [19] },
    peluches: { bouquets: [], cajas: false, accesorios: [18] },
    chocolates: { bouquets: [], cajas: false, accesorios: [19] },
    accesorios: { bouquets: [], cajas: false, accesorios: [20, 21] }
  };

  const $ = (s) => document.querySelector(s);
  const svc = () => window.productService;
  const products = (ids) => ids.map((id) => svc().getProductById(id)).filter(Boolean);

  function fill(sel, ids, variant) {
    const box = $(sel);
    const list = products(ids);
    window.productCardComponent.renderProductGrid(box, list, { variant });
    window.timoteoApp.initScrollReveal(box);
  }

  function applyFilter(key) {
    const f = FILTERS[key] || FILTERS.todos;
    fill("#nv-bouquets", f.bouquets, "novelty");
    fill("#nv-acc", f.accesorios, "nvacc");
    document.querySelector('[data-block="bouquets"]').hidden = f.bouquets.length === 0;
    document.querySelector('[data-block="accesorios"]').hidden = f.accesorios.length === 0;
    document.querySelector('[data-block="cajas"]').hidden = !f.cajas;

    document.querySelectorAll(".nv-fchip").forEach((chip) => {
      const on = chip.dataset.filter === key;
      chip.classList.toggle("is-active", on);
      chip.setAttribute("aria-pressed", String(on));
    });
  }

  function initClub() {
    const form = $("#nv-club-form");
    const input = $("#nv-club-email");
    const error = $("#nv-club-error");
    const ok = $("#nv-club-ok");

    function showOk() {
      form.hidden = true;
      error.hidden = true;
      ok.hidden = false;
    }

    try {
      if (localStorage.getItem(CLUB_KEY)) showOk();
    } catch (e) { /* almacenamiento no disponible */ }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        error.hidden = false;
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      try { localStorage.setItem(CLUB_KEY, value); } catch (err) { /* sin persistencia */ }
      showOk();
    });
    input.addEventListener("input", () => { error.hidden = true; input.removeAttribute("aria-invalid"); });
  }

  function init() {
    const capsule = svc().getProductById(CAPSULE_ID);
    if (capsule) $("#nv-cap-price").textContent = svc().formatCOPSpaced(capsule.price);

    applyFilter("todos");

    $("#nv-filters").addEventListener("click", (e) => {
      const chip = e.target.closest(".nv-fchip");
      if (chip) applyFilter(chip.dataset.filter);
    });

    initClub();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
