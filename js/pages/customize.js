/**
 * customize.js — asistente "Crea tu regalo único" (6 pasos de Stitch).
 * El estado se guarda en localStorage (timoteo_craft) para no perder el diseño al recargar.
 */
(function () {
  "use strict";

  const D = window.TIMOTEO_DATA.customizer;
  const esc = (s) => window.timoteoUtils.escapeHtml(s);
  const money = (v) => window.productService.formatCOP(v);
  const KEY = "timoteo_craft";
  const OPTION_STEPS = ["base", "plush", "flowers", "sweets"];

  const state = { step: 0, sel: {}, filter: {}, message: "", signature: "nombre", lastImage: null };

  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved) Object.assign(state, saved);
  } catch (err) { /* sin persistencia */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (err) { /* sin persistencia */ } };

  const $ = (s, r) => (r || document).querySelector(s);
  const stepKey = () => D.steps[state.step].key;
  const optionOf = (key) => (D[key] || []).find((o) => o.id === state.sel[key]) || null;
  const total = () => OPTION_STEPS.reduce((s, k) => s + (optionOf(k) ? optionOf(k).price : 0), 0);
  const isDone = (i) => {
    const k = D.steps[i].key;
    if (OPTION_STEPS.includes(k)) return !!state.sel[k];
    if (k === "message") return state.message.trim().length > 0;
    return false;
  };

  /* --------------------------------------------------------------- stepper */
  function renderSteps() {
    $("#cf-steps").innerHTML = D.steps.map((s, i) => {
      const current = i === state.step;
      const done = !current && i < state.step;
      const cls = current ? "is-current" : done ? "is-done" : "is-pending";
      const circle = current
        ? '<span class="cf-step__halo"></span><span class="cf-step__dot">' + (i + 1) + "</span>"
        : done ? '<span class="cf-step__dot"><i class="bi bi-check-lg"></i></span>'
        : '<span class="cf-step__dot">' + (i + 1) + "</span>";
      const sub = current ? "Paso Actual" : done ? "Completado" : i === D.steps.length - 1 ? "Final" : "Pendiente";
      return '<li class="cf-step ' + cls + '"><button type="button" data-goto="' + i + '"' + (i > state.step && !isDone(i - 1) && i - 1 !== state.step ? " disabled" : "") +
        '><span class="cf-step__circle">' + circle + '</span><span class="cf-step__label">' + (i + 1) + ". " + esc(s.label) + '</span><span class="cf-step__sub">' + sub + "</span></button></li>";
    }).join("");
    $("#cf-fill").style.width = (state.step / (D.steps.length - 1)) * 100 + "%";
  }

  /* ------------------------------------------------------------ paso: cabecera */
  function headHtml(step) {
    const filters = step.filters && step.filters.length
      ? '<div class="cf-filters">' + step.filters.map((f, i) => {
          const on = (state.filter[step.key] || step.filters[0]) === f;
          return '<button type="button" class="cf-filter' + (on ? " is-active" : "") + '" data-filter="' + esc(f) + '">' + esc(f) + "</button>";
        }).join("") + "</div>"
      : "";
    return (
      '<div class="cf-card cf-card--head"><div class="cf-card__top"><div><span class="cf-eyebrow">Paso ' + (state.step + 1) + " de " + D.steps.length + "</span><h2>" + esc(step.title) + "</h2></div>" +
      '<div class="cf-badge"><i class="bi bi-heart-fill"></i><span>' + esc(step.badge) + "</span></div></div><p>" + esc(step.hint) + "</p>" + filters + "</div>"
    );
  }

  /* ------------------------------------------------------- paso: opciones */
  function optionCard(key, o) {
    const on = state.sel[key] === o.id;
    const status = on ? "Seleccionado" : "Elegir opción";
    const media = o.none
      ? '<div class="cf-opt__media cf-opt__media--none"><span><i class="bi ' + o.icon + '"></i></span><em>' + esc(o.noneTitle) + "</em><small>" + esc(o.noneText) + "</small></div>"
      : '<div class="cf-opt__media"><img src="' + o.image + '" alt="' + esc(o.name) + '" loading="lazy">' +
        (o.badge ? '<span class="cf-opt__badge' + (o.badge === "Edición Lujo" ? " cf-opt__badge--dark" : "") + '">' + esc(o.badge) + "</span>" : "") + "</div>";
    return (
      '<button type="button" class="cf-opt' + (on ? " is-selected" : "") + (o.none ? " cf-opt--none" : "") + '" data-opt="' + o.id + '" aria-pressed="' + on + '">' +
      '<span class="cf-opt__check">' + (on ? '<i class="bi bi-check-lg"></i>' : "<i></i>") + "</span>" + media +
      '<span class="cf-opt__body"><b>' + esc(o.name) + "</b><small>" + esc(o.description) + "</small></span>" +
      '<span class="cf-opt__foot"><strong>' + (o.price ? "+" + money(o.price) + " COP" : "$0 COP") + "</strong><em>" + status + "</em></span></button>"
    );
  }

  function optionsHtml(step) {
    const filter = state.filter[step.key] || (step.filters && step.filters[0]);
    const list = D[step.key].filter((o) => !filter || filter === step.filters[0] || o.none || o.tag === filter);
    return '<div class="cf-options">' + list.map((o) => optionCard(step.key, o)).join("") + "</div>";
  }

  /* ------------------------------------------------------- paso: mensaje */
  function messageHtml() {
    return (
      '<div class="cf-card cf-msg"><div class="cf-msg__top"><h3>Tarjeta Timoteo N° 108</h3><em>Lacre artesanal incluido</em><span data-msg-count>' + state.message.length + " / " + D.messageMaxLength + " caracteres</span></div>" +
      '<textarea id="cf-message" maxlength="' + D.messageMaxLength + '" rows="5" placeholder="Escribe aquí las palabras que tocarán tu corazón. Ejemplo: ‘Gracias por iluminar mis días con tu sonrisa. ¡Feliz aniversario, mi amor!’">' + esc(state.message) + "</textarea>" +
      '<div class="cf-msg__phrases"><span>Frases para inspirarte:</span>' + D.phrases.map((p) => '<button type="button" data-phrase="' + esc(p) + '">' + esc(p) + "</button>").join("") + "</div>" +
      '<div class="cf-msg__sign">' + D.signatures.map((s) => '<label><input type="radio" name="cf-sign" value="' + s.id + '"' + (state.signature === s.id ? " checked" : "") + "><span>" + esc(s.label) + "</span></label>").join("") + "</div></div>"
    );
  }

  /* ------------------------------------------------------ paso: resumen */
  function summaryHtml() {
    const rows = OPTION_STEPS.map((k, i) => {
      const o = optionOf(k);
      const label = D.steps[i].short;
      return "<li><span>" + esc(label) + ":</span><b>" + (o ? esc(o.name) : "Sin seleccionar") + "</b><em>" + (o ? money(o.price) : "$0") + "</em></li>";
    }).join("");
    return (
      '<div class="cf-card cf-summary"><h3>Desglose final de tu regalo</h3><ul>' + rows +
      "<li><span>Tarjeta:</span><b>" + (state.message.trim() ? "“" + esc(state.message.trim().slice(0, 60)) + (state.message.trim().length > 60 ? "…" : "") + "”" : "Tarjeta con sello lacrado (sin mensaje)") + "</b><em>Gratis</em></li></ul>" +
      '<div class="cf-summary__total"><span>Total de tu diseño</span><strong>' + money(total()) + " COP</strong></div>" +
      '<div class="cf-summary__ctas"><button type="button" class="cf-btn cf-btn--ghost" data-finish="cart"><i class="bi bi-bag"></i> Agregar al carrito</button>' +
      '<button type="button" class="cf-btn cf-btn--solid" data-finish="checkout"><span>Agregar y pagar</span><i class="bi bi-arrow-right"></i></button></div></div>'
    );
  }

  /* --------------------------------------------------------- render main */
  function renderMain() {
    const step = D.steps[state.step];
    const k = step.key;
    let body = "";
    if (OPTION_STEPS.includes(k)) body = optionsHtml(step);
    else if (k === "message") body = messageHtml();
    else body = summaryHtml();

    const prev = state.step > 0 ? D.steps[state.step - 1] : null;
    const next = state.step < D.steps.length - 1 ? D.steps[state.step + 1] : null;
    const needs = OPTION_STEPS.includes(k) && !state.sel[k];
    $("#cf-main").innerHTML =
      headHtml(step) + body +
      '<div class="cf-nav"><button type="button" class="cf-btn cf-btn--ghost" data-nav="prev"' + (prev ? "" : " disabled") + '><i class="bi bi-arrow-left"></i><span>' + (prev ? "Paso anterior: " + esc(prev.short) : "Inicio del asistente") + "</span></button>" +
      (next
        ? '<button type="button" class="cf-btn cf-btn--solid" data-nav="next"' + (needs ? " disabled" : "") + "><span>Siguiente: " + esc(next.label) + '</span><i class="bi bi-arrow-right"></i></button>'
        : "") + "</div>" + (needs ? '<p class="cf-hint">Elige una opción para continuar al siguiente paso.</p>' : "");
  }

  /* -------------------------------------------------------------- aside */
  function renderAside() {
    const lines = OPTION_STEPS.map((k, i) => {
      const o = optionOf(k);
      const label = { base: "Base", plush: "Peluche", flowers: "Flores", sweets: "Dulces & Chocolates" }[k];
      const cur = stepKey() === k;
      if (!o) return '<li class="is-empty"><div><i></i><span>' + label + ":</span></div><span>Por seleccionar</span></li>";
      return '<li class="' + (cur ? "is-current" : "") + '"><div><i></i><span>' + label + ": <strong>" + esc(o.name) + '</strong></span></div><b>' + (o.price ? (i >= 2 ? "+" : "") + money(o.price) : "$0") + "</b></li>";
    }).join("") + '<li class="is-empty"><div><i></i><span>Tarjeta con mensaje personalizado:</span></div><span>Incluida (Gratis)</span></li>';
    $("#cf-lines").innerHTML = lines;
    $("#cf-total").textContent = money(total()) + " COP";
    $("#cf-ready").textContent = D.steps.filter((_, i) => isDone(i)).length + " de " + D.steps.length + " listos";

    const img = $("#cf-composite");
    const wanted = state.lastImage || D.preview;
    if (img.getAttribute("src") !== wanted) img.setAttribute("src", wanted);

    const chips = [];
    const base = optionOf("base"), plush = optionOf("plush"), fl = optionOf("flowers"), sw = optionOf("sweets");
    if (base) chips.push('<span class="cf-chip cf-chip--bl"><i></i>' + esc(base.short || base.name) + "</span>");
    if (plush && !plush.none) chips.push('<span class="cf-chip cf-chip--tl"><i></i>' + esc(plush.short || plush.name) + "</span>");
    if (fl && !fl.none) chips.push('<span class="cf-chip cf-chip--mr cf-chip--solid"><i class="bi bi-flower1"></i>' + esc(fl.short || fl.name) + "</span>");
    chips.push(sw && !sw.none
      ? '<span class="cf-chip cf-chip--br cf-chip--soft"><i class="bi bi-plus"></i>' + esc(sw.short || sw.name) + "</span>"
      : '<span class="cf-chip cf-chip--br cf-chip--dash"><i class="bi bi-plus"></i>Dulces (Paso 4)</span>');
    $("#cf-hotspots").innerHTML = chips.join("");
  }

  function render() {
    renderSteps();
    renderMain();
    renderAside();
    save();
  }

  /* ------------------------------------------------------------- acciones */
  function finish(goCheckout) {
    const parts = OPTION_STEPS.map((k) => optionOf(k)).filter((o) => o && !o.none).map((o) => o.short || o.name);
    if (!optionOf("base")) { state.step = 0; render(); window.toastComponent.showToast({ title: "Elige una base para tu regalo", icon: "bi-info-circle" }); return; }
    const id = "custom-" + Date.now().toString(36);
    const image = state.lastImage || (optionOf("base") && optionOf("base").image) || D.preview;
    window.cartService.addToCart(
      { id: id, name: "Regalo personalizado", price: total(), image: image, collection: "Crea tu regalo", shortDescription: parts.join(" · ") },
      { quantity: 1, variant: "A tu medida", detail: parts.join(" · "), unitPrice: total(), note: state.message.trim(), occasion: "" }
    );
    try { localStorage.removeItem(KEY); } catch (err) { /* sin persistencia */ }
    if (goCheckout) { window.timoteoApp.navigateWithFade("checkout.html"); return; }
    window.toastComponent.showToast({ title: "Tu regalo personalizado está en el carrito", message: parts.join(" · "), image: image, actionLabel: "Ver carrito", actionHref: "carrito.html" });
    Object.assign(state, { step: 0, sel: {}, filter: {}, message: "", lastImage: null });
    render();
  }

  function bind() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("button");
      if (!t) return;
      if (t.dataset.goto !== undefined) { state.step = Number(t.dataset.goto); render(); window.scrollTo({ top: $("#gift-assistant").offsetTop, behavior: "smooth" }); }
      else if (t.dataset.opt !== undefined) {
        const k = stepKey();
        state.sel[k] = t.dataset.opt;
        const o = optionOf(k);
        if (o && !o.none) state.lastImage = o.image;
        render();
      } else if (t.dataset.filter !== undefined) { state.filter[stepKey()] = t.dataset.filter; render(); }
      else if (t.dataset.nav === "next") { state.step = Math.min(D.steps.length - 1, state.step + 1); render(); window.scrollTo({ top: $("#gift-assistant").offsetTop, behavior: "smooth" }); }
      else if (t.dataset.nav === "prev") { state.step = Math.max(0, state.step - 1); render(); window.scrollTo({ top: $("#gift-assistant").offsetTop, behavior: "smooth" }); }
      else if (t.dataset.phrase !== undefined) {
        const box = $("#cf-message");
        state.message = (state.message ? state.message.trim() + " " : "") + t.dataset.phrase + ".";
        state.message = state.message.slice(0, D.messageMaxLength);
        box.value = state.message;
        $("[data-msg-count]").textContent = state.message.length + " / " + D.messageMaxLength + " caracteres";
        save(); renderAside();
      } else if (t.dataset.finish) finish(t.dataset.finish === "checkout");
    });
    document.addEventListener("input", (e) => {
      if (e.target.id !== "cf-message") return;
      state.message = e.target.value;
      $("[data-msg-count]").textContent = state.message.length + " / " + D.messageMaxLength + " caracteres";
      renderAside(); save();
    });
    document.addEventListener("change", (e) => {
      if (e.target.name === "cf-sign") { state.signature = e.target.value; save(); }
    });
  }

  function init() {
    render();
    bind();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
