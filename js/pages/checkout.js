/**
 * checkout.js — envío, dedicatoria y pago (checkout.html).
 * Lee el carrito desde cartService, valida el formulario en cliente y, al pagar,
 * crea el pedido con orderService y redirige a confirmacion.html.
 * (El cobro es simulado: los datos de tarjeta nunca se guardan.)
 */
(function () {
  "use strict";

  const cart = () => window.cartService;
  const fmt = (v) => window.productService.formatCOP(v);
  const esc = (s) => window.timoteoUtils.escapeHtml(s);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const TRANSFER_DISCOUNT = 0.05;
  const PHRASES = [
    "Eres mi casualidad más linda y mi motivo favorito de sonreír.",
    "Gracias por ser mi lugar seguro y mi mejor aventura.",
    "Que estas flores te recuerden lo mucho que te quiero, hoy y siempre.",
    "Contigo aprendí que los detalles pequeños son los que más se sienten.",
    "Para quien ilumina mis días sin siquiera intentarlo. Feliz aniversario.",
    "Un abrazo hecho detalle para recordarte cuánto vales."
  ];
  const PAY_LABEL = { card: "Tarjeta bancaria", transfer: "Transferencia", installments: "Cuotas sin interés" };

  const MESSAGES = {
    senderName: "Escribe tu nombre y apellido.",
    senderEmail: "Escribe un correo válido, por ejemplo tu.correo@ejemplo.com.",
    senderPhone: "Escribe un teléfono o WhatsApp de al menos 7 dígitos.",
    recipientName: "Escribe el nombre de quien recibe el regalo.",
    recipientPhone: "Escribe un teléfono de contacto (al menos 7 dígitos).",
    streetAddress: "Escribe la dirección exacta de entrega.",
    cardNumber: "Escribe un número de tarjeta válido (13 a 19 dígitos).",
    cardExp: "Usa el formato MM/AA con una fecha vigente.",
    cardCvv: "Escribe el código de 3 o 4 dígitos."
  };

  let phraseIndex = 0;

  /* ---------------------------------------------------------- estado/totales */
  const method = () => ($('input[name="paymentMethod"]:checked') || {}).value || "card";
  const cityName = () => ($("#cityArea").value || "").replace(/\s*\(.*\)\s*$/, "");

  function totals(items) {
    const c = cart();
    const subtotal = c.getCartTotal(items);
    const coupon = c.getDiscount(items);
    const transfer = method() === "transfer" ? Math.round(subtotal * TRANSFER_DISCOUNT) : 0;
    const shipping = c.getShippingCost(items);
    return {
      count: c.getCartCount(items),
      subtotal: subtotal,
      couponDiscount: coupon,
      transferDiscount: transfer,
      shipping: shipping,
      total: subtotal - coupon - transfer + shipping,
      coupon: c.getCoupon(),
      schedule: c.getSchedule()
    };
  }

  function renderSummary() {
    const items = cart().getCart();
    const t = totals(items);
    const lines = items
      .map(
        (it) =>
          '<div class="ck-line"><div class="ck-line__img"><img src="' + esc(it.image) + '" alt="' + esc(it.name) + '" loading="lazy"></div>' +
          '<div class="ck-line__txt"><h4>' + esc(it.name) + "</h4><p>" + esc(it.collection || it.detail || "") + "</p>" +
          "<div><span>Cant: " + it.quantity + "</span><b>" + fmt(it.price * it.quantity) + "</b></div></div></div>"
      )
      .join("");
    const sched = t.schedule;
    const shipLabel = "Envío " + (sched.slot === "express" ? "Express" : "programado") + " a " + esc(cityName());
    $("#ck-sum").innerHTML =
      '<div class="ck-sum__head"><div><h3>Resumen de tu Regalo</h3><span>' + t.count + '</span></div><a href="carrito.html">Editar</a></div>' +
      lines +
      '<div class="ck-sum__calc">' +
      "<div><span>Subtotal productos</span><b>" + fmt(t.subtotal) + "</b></div>" +
      '<div><span class="ck-sum__inline">Empaque de Lujo Timoteo <i class="bi bi-info-circle" title="Caja rígida, lazo de satén, papel de seda y tarjeta de lino"></i></span><em>Incluido ($0)</em></div>' +
      "<div><span>" + shipLabel + "</span><b>" + fmt(t.shipping) + "</b></div>" +
      (t.coupon ? '<div class="is-discount"><span class="ck-sum__inline"><i class="bi bi-stars"></i>Cupón aplicado (' + esc(t.coupon.label) + ")</span><b>-" + fmt(t.couponDiscount) + "</b></div>" : "") +
      (t.transferDiscount ? '<div class="is-discount"><span class="ck-sum__inline"><i class="bi bi-bank"></i>Descuento por transferencia (5%)</span><b>-' + fmt(t.transferDiscount) + "</b></div>" : "") +
      '<div class="ck-sum__total"><div><b>Total a pagar</b><p>IVA y embalaje especial incluidos</p></div><strong>' + fmt(t.total) + "</strong></div></div>" +
      '<button type="submit" form="checkoutForm" class="ck-pay-btn" id="payBtn"><i class="bi bi-lock"></i><span>Confirmar y Pagar ' + fmt(t.total) + "</span></button>" +
      '<div class="ck-sum__tiles"><div><i data-icon="blossom" data-size="22"></i><b>Flores Frescas</b><small>Cosechadas el mismo día</small></div>' +
      '<div><i class="bi bi-patch-check"></i><b>Garantía Timoteo</b><small>Entrega 100% puntual</small></div></div>';
    window.timoteoIcons.hydrate($("#ck-sum"));
    $("#ck-when").textContent = sched.label + " • " + sched.range + " hrs";
  }

  /* -------------------------------------------------------------- validación */
  const digits = (s) => String(s || "").replace(/\D/g, "");

  function expiryOk(v) {
    const m = String(v || "").match(/^\s*(\d{2})\s*\/?\s*(\d{2})\s*$/);
    if (!m) return false;
    const month = Number(m[1]);
    const year = 2000 + Number(m[2]);
    if (month < 1 || month > 12) return false;
    const now = new Date();
    return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
  }

  function isValid(id) {
    const el = document.getElementById(id);
    const v = el.value.trim();
    switch (id) {
      case "senderName":
      case "recipientName": return v.length >= 3;
      case "senderEmail": return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      case "senderPhone":
      case "recipientPhone": return digits(v).length >= 7;
      case "streetAddress": return v.length >= 6;
      case "cardNumber": return digits(v).length >= 13 && digits(v).length <= 19;
      case "cardExp": return expiryOk(v);
      case "cardCvv": return /^\d{3,4}$/.test(v);
      default: return true;
    }
  }

  function setError(id, on) {
    const el = document.getElementById(id);
    const msg = $('[data-err="' + id + '"]');
    if (!el || !msg) return;
    msg.textContent = on ? MESSAGES[id] : "";
    if (on) el.setAttribute("aria-invalid", "true");
    else el.removeAttribute("aria-invalid");
  }

  function requiredIds() {
    const base = ["senderName", "senderEmail", "senderPhone", "recipientName", "recipientPhone", "streetAddress"];
    return method() === "transfer" ? base : base.concat(["cardNumber", "cardExp", "cardCvv"]);
  }

  /* --------------------------------------------------------------- pago/UI */
  function syncPayment() {
    const m = method();
    $$("#paymentOptions label").forEach((l) => l.classList.toggle("is-active", l.querySelector("input").checked));
    $("#cardFields").hidden = m === "transfer";
    $("#quotasField").hidden = m !== "installments";
    $("#transferInfo").hidden = m !== "transfer";
    renderSummary();
  }

  function maskCard(e) {
    const d = digits(e.target.value).slice(0, 19);
    e.target.value = d.replace(/(.{4})/g, "$1 ").trim();
  }
  function maskExp(e) {
    const d = digits(e.target.value).slice(0, 4);
    e.target.value = d.length > 2 ? d.slice(0, 2) + " / " + d.slice(2) : d;
  }

  function showPhrase(i) {
    phraseIndex = (i + PHRASES.length) % PHRASES.length;
    $("#inspirationQuote").textContent = "“" + PHRASES[phraseIndex] + "”";
  }
  function toggleInspiration(open) {
    const box = $("#inspirationToast");
    box.classList.toggle("is-open", open);
    box.setAttribute("aria-hidden", String(!open));
  }

  /* -------------------------------------------------------------- confirmar */
  function buildOrder(items, t) {
    const f = $("#checkoutForm");
    const val = (n) => (f.elements[n] ? String(f.elements[n].value).trim() : "");
    const m = method();
    const signature = ($('input[name="signatureType"]:checked') || {}).value || "public";
    const cardDigits = digits(val("cardNumber"));
    return {
      items: items.map((it) => ({ productId: it.productId, name: it.name, detail: it.detail || it.collection || "", price: it.price, quantity: it.quantity, image: it.image, note: it.note || "" })),
      subtotal: t.subtotal,
      discount: t.couponDiscount + t.transferDiscount,
      coupon: t.coupon ? t.coupon.label : "",
      shipping: t.shipping,
      total: t.total,
      delivery: { label: t.schedule.label, range: t.schedule.range, slot: t.schedule.slot, slotLabel: t.schedule.slotLabel, surprise: t.schedule.surprise },
      sender: { name: val("senderName"), email: val("senderEmail"), phone: val("senderPhone") },
      recipient: { name: val("recipientName"), phone: val("recipientPhone"), address: val("streetAddress"), apartment: val("apartment"), city: val("cityArea"), notes: val("deliveryNotes") },
      dedication: { text: val("dedication"), signature: signature, signedName: signature === "public" ? val("senderName") : "" },
      payment: { method: m, label: PAY_LABEL[m], last4: m === "transfer" ? "" : cardDigits.slice(-4), quotas: m === "installments" ? Number(val("quotas")) : 1 },
      photoProof: f.elements.photoProof.checked
    };
  }

  function submit(e) {
    e.preventDefault();
    const ids = requiredIds();
    let first = null;
    ["senderName", "senderEmail", "senderPhone", "recipientName", "recipientPhone", "streetAddress", "cardNumber", "cardExp", "cardCvv"].forEach((id) => {
      const need = ids.indexOf(id) !== -1;
      const bad = need && !isValid(id);
      setError(id, bad);
      if (bad && !first) first = document.getElementById(id);
    });
    if (first) {
      first.focus();
      first.scrollIntoView({ behavior: "smooth", block: "center" });
      window.toastComponent.showToast({ title: "Revisa los datos", message: "Hay campos por completar antes de pagar.", icon: "bi-exclamation-circle" });
      return;
    }

    const items = cart().getCart();
    if (!items.length) return;
    const btn = $("#payBtn");
    btn.disabled = true;
    btn.classList.add("is-busy");
    btn.querySelector("span").textContent = "Procesando tu pago…";

    const order = buildOrder(items, totals(items));
    window.setTimeout(() => {
      window.orderService.placeOrder(order);
      window.orderService.rememberProfile(order.sender);
      cart().clearCart();
      cart().clearCoupon();
      cart().setDelivery({ slot: "manana", date: null, surprise: true });
      window.location.href = "confirmacion.html";
    }, 900);
  }

  /* --------------------------------------------------------------------- init */
  function init() {
    const items = cart().getCart();
    if (!items.length) {
      $("#ck-main").hidden = true;
      $("#ck-empty").hidden = false;
      return;
    }

    const profile = window.orderService.getProfile();
    if (profile) {
      $("#senderName").value = profile.name || "";
      $("#senderEmail").value = profile.email || "";
      $("#senderPhone").value = profile.phone || "";
    }
    const withNote = items.find((it) => it.note);
    if (withNote) $("#dedicationText").value = withNote.note;
    $("#charCounter").textContent = $("#dedicationText").value.length + " / 280 caracteres";

    const form = $("#checkoutForm");
    form.addEventListener("submit", submit);
    $$("#paymentOptions input").forEach((r) => r.addEventListener("change", syncPayment));
    $("#cityArea").addEventListener("change", renderSummary);
    $("#dedicationText").addEventListener("input", (e) => { $("#charCounter").textContent = e.target.value.length + " / 280 caracteres"; });
    $("#cardNumber").addEventListener("input", maskCard);
    $("#cardExp").addEventListener("input", maskExp);
    $("#cardCvv").addEventListener("input", (e) => { e.target.value = digits(e.target.value).slice(0, 4); });

    ["senderName", "senderEmail", "senderPhone", "recipientName", "recipientPhone", "streetAddress", "cardNumber", "cardExp", "cardCvv"].forEach((id) => {
      const el = document.getElementById(id);
      el.addEventListener("input", () => { if (el.getAttribute("aria-invalid")) setError(id, !isValid(id)); });
      el.addEventListener("blur", () => { if (el.value) setError(id, !isValid(id)); });
    });

    $("#inspireBtn").addEventListener("click", () => { showPhrase(phraseIndex); toggleInspiration(true); });
    $("#inspirationClose").addEventListener("click", () => toggleInspiration(false));
    $("#inspirationNext").addEventListener("click", () => showPhrase(phraseIndex + 1));
    $("#inspirationUse").addEventListener("click", () => {
      const ta = $("#dedicationText");
      ta.value = PHRASES[phraseIndex].slice(0, 280);
      ta.dispatchEvent(new Event("input"));
      toggleInspiration(false);
      ta.focus();
    });

    window.addEventListener(cart().EVENT_NAME, renderSummary);
    syncPayment();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
