/**
 * cart.js — carrito (carrito.html).
 * Dos vistas del mismo estado, como en Stitch: escritorio/tablet (.ca-*) y móvil (.cam-*).
 * Todo el estado vive en cartService (localStorage); la página solo pinta y delega eventos.
 */
(function () {
  "use strict";

  const svc = () => window.cartService;
  const fmt = (v) => window.productService.formatCOP(v);
  const esc = (s) => window.timoteoUtils.escapeHtml(s);
  const $ = (s, r) => (r || document).querySelector(s);

  const CATEGORY_LABEL = {
    flores: "Flores & Bouquets",
    peluches: "Peluches de Colección",
    chocolates: "Chocolatería Fina",
    relojes: "Relojería Fina",
    regalos: "Regalos de Autor",
    juguetes: "Juguetería Artesanal"
  };

  /* Complementos: mismos productos (12, 13, 14) con el copy de cada versión. */
  const ADDONS = {
    12: { d: ["Globo Metálico 'Te Amo'", "Inflado con helio puro"], m: ["Globo Metalizado", "Helio de larga duración"] },
    13: { d: ["Vela Vainilla Francesa", "Cera de soja 100% natural"], m: ["Vela Aromática", "Cera de soja & vainilla"] },
    14: { d: ["Tarjeta Lacrada en Oro", "Sello de cera vegetal"], m: ["Tarjeta Lacrada", "Papel artesanal 300g"], popular: true }
  };
  const ADDON_ORDER_D = [12, 13, 14];
  const ADDON_ORDER_M = [12, 14, 13];
  const SLOT_SHORT = { manana: "Franja 9-13h", tarde: "Franja 14-18h", express: "Express 3h" };

  const DOW = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const MONTH = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const ui = { couponMsg: null, editing: null };

  /* --------------------------------------------------------------- fechas */
  function addDays(n) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + n);
    return d;
  }
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  function dayLabel(d, offset, short) {
    const month = short ? MONTH[d.getMonth()].slice(0, 3) : MONTH[d.getMonth()];
    const lead = offset === 0 ? "Hoy" : offset === 1 ? "Mañana" : DOW[d.getDay()];
    return lead + ", " + d.getDate() + " de " + month;
  }
  function delivery() {
    const d = svc().getDelivery();
    let date = d.date;
    if (!date || date < iso(addDays(0))) date = iso(addDays(1));
    if (d.slot === "express") date = iso(addDays(0));
    return { slot: d.slot, date: date, surprise: d.surprise !== false };
  }
  function offsetOf(dateIso) {
    for (let i = 0; i < 10; i++) if (iso(addDays(i)) === dateIso) return i;
    return 1;
  }
  function dateWord(dateIso) {
    const off = offsetOf(dateIso);
    return off === 0 ? "Hoy" : off === 1 ? "Mañana" : DOW[addDays(off).getDay()];
  }

  /* --------------------------------------------------------------- totales */
  function totals(items) {
    const s = svc();
    const d = delivery();
    return {
      count: s.getCartCount(items),
      subtotal: s.getCartTotal(items),
      discount: s.getDiscount(items),
      shipping: s.getShippingCost(items),
      total: s.getOrderTotal(items),
      coupon: s.getCoupon(),
      del: d,
      slot: s.SLOTS[d.slot]
    };
  }

  /* --------------------------------------------------------------- líneas */
  const lineAttrs = (it) => ' data-pid="' + it.productId + '" data-lk="' + esc(it.lineKey !== undefined ? it.lineKey : it.variant || "") + '"';

  /* Textos de la línea: `product.cart` (si existe) trae el copy exacto de Stitch. */
  function lineMeta(it) {
    const p = window.productService.getProductById(it.productId);
    const meta = (p && p.cart) || {};
    const cat = p ? CATEGORY_LABEL[p.category] || "Regalos de Autor" : "Regalos de Autor";
    return {
      p: p,
      name: meta.name || it.name,
      shortName: it.name,
      mdesc: meta.mdesc || it.detail || "",
      desc: it.detail && (!p || it.detail !== p.shortDescription) ? it.detail : meta.desc || it.detail || (p && p.shortDescription) || "",
      chip: it.note ? "Dedicatoria incluida" : it.addons && it.addons.length ? "Con complementos" : meta.chip || cat,
      coll: meta.coll !== undefined ? meta.coll : it.collection,
      warm: meta.collTone === "warm",
      badge: meta.badge || (p && p.badge) || ""
    };
  }

  function badgeFor(m) {
    if (m.badge === "Top Ventas" || m.badge === "Más vendido") return { text: "Top Ventas", cls: "" };
    if (m.badge === "Bespoke") return { text: "Bespoke", cls: " is-bespoke" };
    return null;
  }

  function itemDesktop(it) {
    const m = lineMeta(it);
    const b = badgeFor(m);
    const strike = it.oldPrice && it.oldPrice > it.price ? '<span class="ca-item__old">' + fmt(it.oldPrice * it.quantity) + "</span>" : "";
    return (
      '<article class="ca-item"' + lineAttrs(it) + ">" +
      '<a class="ca-item__img" href="producto.html?id=' + it.productId + '"><img src="' + esc(it.image) + '" alt="' + esc(m.name) + '" loading="lazy">' +
      (b ? '<span class="ca-item__badge' + b.cls + '">' + b.text + "</span>" : "") + "</a>" +
      '<div class="ca-item__body"><div class="ca-item__top"><div>' +
      '<div class="ca-item__tags"><span class="ca-item__chip">' + esc(m.chip) + "</span>" +
      (m.coll ? '<span class="ca-item__coll' + (m.warm ? " is-warm" : "") + '">' + esc(m.coll) + "</span>" : "") + "</div>" +
      '<h3><a href="producto.html?id=' + it.productId + '">' + esc(m.name) + "</a></h3>" +
      (m.desc ? "<p>" + esc(m.desc) + "</p>" : "") + "</div>" +
      '<button type="button" class="ca-item__x" data-remove aria-label="Eliminar ' + esc(it.name) + '"><i class="bi bi-x-lg"></i></button></div>' +
      '<div class="ca-item__bottom">' +
      '<div class="ca-qty"><button type="button" data-qty="-1" aria-label="Disminuir cantidad">-</button><span aria-live="polite">' + it.quantity + '</span><button type="button" data-qty="1" aria-label="Aumentar cantidad">+</button></div>' +
      '<div class="ca-item__price">' + strike + "<b>" + fmt(it.price * it.quantity) + "</b></div></div></div></article>"
    );
  }

  function itemMobile(it) {
    const meta = lineMeta(it);
    const b = badgeFor(meta);
    const editing = ui.editing === (it.productId + "::" + (it.lineKey || ""));
    const desc = meta.mdesc;
    let note = "";
    if (editing) {
      note =
        '<div class="cam-item__edit"><label class="visually-hidden" for="cam-note">Dedicatoria</label>' +
        '<textarea id="cam-note" rows="2" maxlength="280" data-note-input placeholder="Escribe tu dedicatoria...">' + esc(it.note || "") + "</textarea>" +
        '<div><button type="button" data-note-save>Guardar</button><button type="button" data-note-cancel>Cancelar</button></div></div>';
    } else if (it.note) {
      note =
        '<div class="cam-item__note"><div><i class="bi bi-pencil-square"></i><div><span>Dedicatoria personalizada</span><em>“' + esc(it.note) + '”</em></div></div>' +
        '<button type="button" data-note-edit>Editar</button></div>';
    }
    return (
      '<div class="cam-item"' + lineAttrs(it) + '><div class="cam-item__row">' +
      '<a class="cam-item__img" href="producto.html?id=' + it.productId + '"><img src="' + esc(it.image) + '" alt="' + esc(it.name) + '" loading="lazy">' +
      (b ? '<span class="cam-item__badge">' + (b.text === "Top Ventas" ? "Top Venta" : b.text) + "</span>" : "") + "</a>" +
      '<div class="cam-item__body"><div class="cam-item__top"><div><h3>' + esc(it.name) + "</h3>" + (desc ? "<p>" + esc(desc) + "</p>" : "") + "</div>" +
      '<button type="button" data-remove aria-label="Eliminar ' + esc(it.name) + '"><i class="bi bi-x-lg"></i></button></div>' +
      '<div class="cam-item__bottom"><b>' + fmt(it.price * it.quantity) + " COP</b>" +
      '<div class="cam-qty"><button type="button" data-qty="-1" aria-label="Disminuir cantidad">-</button><span>' + it.quantity + '</span><button type="button" data-qty="1" aria-label="Aumentar cantidad">+</button></div></div></div></div>' +
      note + "</div>"
    );
  }

  /* --------------------------------------------------------------- entrega */
  function deliveryDesktop(t) {
    const opts = [];
    for (let i = 0; i < 8; i++) {
      const d = addDays(i);
      if (i === 0 && t.del.slot !== "express") continue;
      opts.push('<option value="' + iso(d) + '"' + (iso(d) === t.del.date ? " selected" : "") + ">" + dayLabel(d, i, false) + "</option>");
    }
    const slots = Object.keys(svc().SLOTS)
      .map((k) => {
        const s = svc().SLOTS[k];
        return (
          '<button type="button" class="ca-slot' + (k === t.del.slot ? " is-active" : "") + '" data-slot="' + k + '" aria-pressed="' + (k === t.del.slot) + '">' +
          (k === "express" ? '<i class="ca-slot__today">Hoy</i>' : "") +
          "<b>" + s.label + "</b><span>" + (k === "express" ? "3 Horas" : s.range.replace(" - ", " - ")) + "</span></button>"
        );
      })
      .join("");
    return (
      '<div class="ca-deliv__top"><div class="ca-deliv__title"><span class="ca-ico"><i class="bi bi-calendar-check"></i></span><div><h3>Programa la Entrega de tu Detalle</h3><p>Aseguramos la llegada exacta en el instante perfecto</p></div></div>' +
      '<span class="ca-deliv__tag"><i class="bi bi-patch-check"></i>Flores frescas del día</span></div>' +
      '<div class="ca-deliv__grid">' +
      '<div class="ca-deliv__col"><label for="ca-date">1. Fecha de Entrega</label>' +
      '<div class="ca-date"><i class="bi bi-calendar3"></i><select id="ca-date" data-fid="date">' + opts.join("") + '</select><i class="bi bi-chevron-down"></i></div>' +
      "<small>Entregamos los 365 días del año de lunes a domingo.</small></div>" +
      '<div class="ca-deliv__col"><span class="ca-deliv__label">2. Franja Horaria</span><div class="ca-slots">' + slots + "</div>" +
      "<small>Notificación por SMS al momento exacto de entrega.</small></div></div>" +
      '<div class="ca-surprise"><label class="ca-switch"><input type="checkbox" data-surprise' + (t.del.surprise ? " checked" : "") + ' data-fid="surprise"><span></span><b class="visually-hidden">Regalo sorpresa</b></label>' +
      '<div><div class="ca-surprise__t"><b>¿Es un regalo sorpresa?</b><i>Recomendado</i></div>' +
      "<p>¡Protegemos la emoción! No incluiremos ningún documento de cobro ni factura física. El repartidor tocará el timbre de manera discreta con tu nota lacrada.</p></div></div>"
    );
  }

  function deliveryMobile(t) {
    const pills = [];
    const first = t.del.slot === "express" ? 0 : 1;
    for (let i = first; i < first + 3; i++) {
      const d = addDays(i);
      const on = iso(d) === t.del.date;
      pills.push('<button type="button" class="cam-pill' + (on ? " is-active" : "") + '" data-date="' + iso(d) + '">' + (on ? '<i class="bi bi-check2"></i>' : "") + "<span>" + dayLabel(d, i, true) + "</span></button>");
    }
    const slots = Object.keys(svc().SLOTS)
      .map((k) => {
        const s = svc().SLOTS[k];
        const on = k === t.del.slot;
        return (
          '<button type="button" class="cam-slot' + (on ? " is-active" : "") + '" data-slot="' + k + '" aria-pressed="' + on + '">' +
          (on ? '<i class="cam-slot__mark"></i>' : "") +
          "<em>" + (k === "express" ? '<i class="bi bi-lightning-charge"></i>' : "") + s.label + "</em>" +
          "<b>" + (k === "express" ? "En 3 Horas" : s.range) + "</b>" +
          "<small>" + (k === "express" ? "+" + fmt(s.extra) : s.tag) + "</small></button>"
        );
      })
      .join("");
    return (
      '<div class="cam-deliv__head"><i class="bi bi-calendar-event"></i><div><h2>Fecha y Franja de Entrega</h2><span>Garantizamos puntualidad impecable</span></div></div>' +
      '<div class="cam-deliv__pills">' + pills.join("") + "</div>" +
      '<div class="cam-deliv__slots">' + slots + "</div>" +
      '<div class="cam-deliv__surprise"><div><span><i class="bi bi-emoji-smile"></i></span><div><b>¿Es un regalo sorpresa?</b><small>Ocultamos recibos y precios al destinatario.</small></div></div>' +
      '<label class="ca-switch"><input type="checkbox" data-surprise' + (t.del.surprise ? " checked" : "") + ' data-fid="msurprise"><span></span><b class="visually-hidden">Regalo sorpresa</b></label></div>'
    );
  }

  /* ------------------------------------------------------------ complementos */
  function addonDesktop(id) {
    const p = window.productService.getProductById(id);
    if (!p) return "";
    const cfg = ADDONS[id];
    const inCart = svc().getCart().some((it) => it.productId === id);
    return (
      '<div class="ca-addon' + (cfg.popular ? " is-popular" : "") + '" data-addon="' + id + '">' +
      (cfg.popular ? '<em class="ca-addon__tag">Popular</em>' : "") +
      '<div class="ca-addon__img"><img src="' + esc(p.image) + '" alt="' + esc(cfg.d[0]) + '" loading="lazy"></div>' +
      '<div class="ca-addon__txt"><h4>' + esc(cfg.d[0]) + "</h4><p>" + esc(cfg.d[1]) + "</p><b>" + fmt(p.price) + "</b></div>" +
      '<button type="button" class="ca-addon__btn' + (inCart ? " is-added" : "") + '" data-addon-toggle aria-pressed="' + inCart + '"><i class="bi bi-' + (inCart ? "check-lg" : "plus-lg") + '"></i>' + (inCart ? "Añadido" : "Añadir") + "</button></div>"
    );
  }

  function addonMobile(id) {
    const p = window.productService.getProductById(id);
    if (!p) return "";
    const cfg = ADDONS[id];
    const inCart = svc().getCart().some((it) => it.productId === id);
    return (
      '<div class="cam-addon" data-addon="' + id + '"><div class="cam-addon__img"><img src="' + esc(p.image) + '" alt="' + esc(cfg.m[0]) + '" loading="lazy"></div>' +
      "<div><p>" + esc(cfg.m[0]) + "</p><small>" + esc(cfg.m[1]) + "</small><b>" + fmt(p.price) + " COP</b></div>" +
      '<button type="button" class="' + (inCart ? "is-added" : "") + '" data-addon-toggle aria-pressed="' + inCart + '"><i class="bi bi-' + (inCart ? "check-lg" : "plus-lg") + '"></i>' + (inCart ? "Añadido" : "Añadir") + "</button></div>"
    );
  }

  /* ---------------------------------------------------------------- resumen */
  function shippingLabel(t) {
    return "Envío " + (t.del.slot === "express" ? "Express " : "") + "programado (" + dateWord(t.del.date) + ")";
  }

  function couponBlock() {
    const c = svc().getCoupon();
    if (c) {
      return (
        '<div class="ca-coupon__ok"><span><i class="bi bi-tag-fill"></i>' + esc(c.label) + " aplicado · -" + c.percent + '%</span><button type="button" data-coupon-clear>Quitar</button></div>'
      );
    }
    return ui.couponMsg ? '<p class="ca-coupon__err" role="alert">' + esc(ui.couponMsg) + "</p>" : "";
  }

  function summaryDesktop(t) {
    const rows =
      "<div><span>Subtotal productos (" + t.count + ')</span><b>' + fmt(t.subtotal) + "</b></div>" +
      '<div><span class="ca-sum__inline">Empaque de regalo de lujo <i class="bi bi-info-circle" title="Caja rígida, papel seda y lazo de satén"></i></span><em>Gratis (Cortesía)</em></div>' +
      "<div><span>Tarjeta dedicatoria caligrafiada</span><em>Gratis</em></div>" +
      '<div><span class="ca-sum__inline">' + shippingLabel(t) + '<i class="ca-sum__chip">' + SLOT_SHORT[t.del.slot] + "</i></span><b>" + fmt(t.shipping) + "</b></div>" +
      (t.discount ? '<div class="is-discount"><span>Cupón ' + esc(t.coupon.label) + " (-" + t.coupon.percent + '%)</span><b>-' + fmt(t.discount) + "</b></div>" : "");
    return (
      '<div class="ca-sum__head"><h2>Resumen de Compra</h2><span>' + t.count + (t.count === 1 ? " Regalo" : " Regalos") + "</span></div>" +
      '<div class="ca-sum__rows">' + rows + "</div>" +
      '<form class="ca-coupon" data-coupon-form novalidate><div class="ca-coupon__row"><label class="visually-hidden" for="ca-coupon">Código de cupón o regalo</label><div><i class="bi bi-tag"></i>' +
      '<input id="ca-coupon" type="text" placeholder="Código de cupón o regalo" autocomplete="off" data-fid="coupon"></div><button type="submit">Aplicar</button></div>' + couponBlock() + "</form>" +
      '<div class="ca-total"><div><b>Total a Pagar</b><p>IVA y logística incluidos</p></div><div><strong>' + fmt(t.total) + "</strong><span>COP</span></div></div>" +
      '<div class="ca-sum__cta"><a class="ca-sum__go" href="checkout.html"><span>Continuar al Checkout</span><i class="bi bi-arrow-right"></i></a>' +
      '<a class="ca-sum__back" href="catalogo.html">← Seguir explorando la tienda</a></div>' +
      '<ul class="ca-trust"><li><span><i class="bi bi-lock"></i></span>Pago seguro con encriptación SSL de 256 bits</li>' +
      '<li><span><i data-icon="blossom" data-size="18"></i></span>Garantía de frescura floral directa de invernadero</li>' +
      '<li><span><i class="bi bi-headset"></i></span>Atención concierge en vivo vía WhatsApp</li></ul>' +
      '<div class="ca-seal" aria-hidden="true"><svg viewBox="0 0 100 100"><path id="caSealPath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none"/><text><textPath href="#caSealPath" startOffset="0%">MÁS QUE REGALOS • ES EMOCIÓN • TIMOTEO •</textPath></text></svg><i class="bi bi-heart-fill"></i></div>'
    );
  }

  function summaryMobile(t) {
    return (
      "<h2>Resumen del Pedido</h2>" +
      "<div><span>Subtotal productos</span><b>" + fmt(t.subtotal) + " COP</b></div>" +
      '<div><span class="cam-sum__inline">Empaque de lujo &amp; lazo <i class="bi bi-patch-check"></i></span><em>Gratis</em></div>' +
      '<div><span class="cam-sum__inline">Envío ' + (t.del.slot === "express" ? "Express " : "") + "programado <small>(" + dateWord(t.del.date) + (t.del.slot === "express" ? " 3h" : "") + ")</small></span><b>" + fmt(t.shipping) + " COP</b></div>" +
      (t.discount ? '<div class="is-discount"><span>Cupón ' + esc(t.coupon.label) + " (-" + t.coupon.percent + "%)</span><b>-" + fmt(t.discount) + " COP</b></div>" : "") +
      '<form class="cam-coupon" data-coupon-form novalidate><div><input type="text" placeholder="Código de cupón" aria-label="Código de cupón" autocomplete="off" data-fid="mcoupon"><button type="submit">Aplicar</button></div>' + couponBlock() + "</form>" +
      "<hr>" +
      '<div class="cam-total"><div><b>Total a Pagar</b><small>Impuestos incluidos</small></div><strong>' + fmt(t.total) + " <small>COP</small></strong></div>"
    );
  }

  function ctaMobile(t) {
    return (
      '<a class="cam-go" href="checkout.html"><span><i class="bi bi-lock"></i>Continuar al Checkout</span><span><b>' + fmt(t.total) + '</b><i class="bi bi-arrow-right"></i></span></a>'
    );
  }

  /* ---------------------------------------------------------------- render */
  function keepFocus(fn) {
    const a = document.activeElement;
    const fid = a && a.dataset ? a.dataset.fid : null;
    const value = a && a.tagName === "INPUT" && a.type === "text" ? a.value : null;
    fn();
    if (fid) {
      const el = document.querySelector('[data-fid="' + fid + '"]');
      if (el) {
        if (value !== null) el.value = value;
        el.focus();
      }
    }
  }

  function render() {
    const items = svc().getCart();
    const empty = items.length === 0;
    const t = totals(items);

    $("#ca-main").hidden = empty;
    $("#ca-empty").hidden = !empty;
    $("#cam-body").hidden = empty;
    $("#cam-empty").hidden = !empty;
    $("#ca-count").textContent = items.length;
    $("#cam-count").textContent = items.length + (items.length === 1 ? " detalle listo" : " detalles listos");
    if (empty) return;

    keepFocus(() => {
      $("#ca-items").innerHTML = items.map(itemDesktop).join("");
      $("#entrega").innerHTML = deliveryDesktop(t);
      $("#ca-addons").innerHTML = ADDON_ORDER_D.map(addonDesktop).join("");
      $("#ca-sum").innerHTML = summaryDesktop(t);

      $("#cam-items").innerHTML = items.map(itemMobile).join("");
      $("#cam-deliv").innerHTML = deliveryMobile(t);
      $("#cam-addons").innerHTML = ADDON_ORDER_M.map(addonMobile).join("");
      $("#cam-sum").innerHTML = summaryMobile(t);
      $("#cam-cta").innerHTML = ctaMobile(t);
    });
    window.timoteoIcons.hydrate($("#ca-sum"));
  }

  /* ---------------------------------------------------------------- eventos */
  function lineOf(el) {
    const host = el.closest("[data-pid]");
    return host ? { pid: Number(host.dataset.pid), lk: host.dataset.lk } : null;
  }
  const findLine = (ln) => svc().getCart().find((it) => it.productId === ln.pid && String(it.lineKey !== undefined ? it.lineKey : it.variant || "") === ln.lk);

  function toggleAddon(id) {
    const items = svc().getCart();
    const existing = items.find((it) => it.productId === id);
    if (existing) {
      svc().removeFromCart(existing.productId, existing.lineKey !== undefined ? existing.lineKey : existing.variant);
      return;
    }
    const p = window.productService.getProductById(id);
    if (p) svc().addToCart(p, { quantity: 1 });
  }

  function setSlot(slot) {
    const patch = { slot: slot };
    const today = iso(addDays(0));
    const cur = svc().getDelivery().date;
    if (slot === "express") patch.date = today;
    else if (!cur || cur <= today) patch.date = iso(addDays(1));
    svc().setDelivery(patch);
  }

  function handleCoupon(form) {
    const input = form.querySelector("input");
    const code = input.value.trim();
    if (!code) { ui.couponMsg = "Escribe un código de cupón."; render(); return; }
    const c = svc().applyCoupon(code);
    if (!c) {
      ui.couponMsg = "Ese cupón no es válido. Prueba con TIMOTEOAMOR.";
      render();
      return;
    }
    ui.couponMsg = null;
    window.toastComponent.showToast({ title: "Cupón aplicado", message: c.label + " · " + c.percent + "% de descuento", icon: "bi-tag-fill" });
  }

  function bind() {
    document.addEventListener("click", (e) => {
      const root = e.target.closest("#ca-d, #cam");
      if (!root) return;

      const qty = e.target.closest("[data-qty]");
      if (qty) {
        const ln = lineOf(qty); const line = ln && findLine(ln);
        if (line) svc().updateQuantity(line.productId, line.lineKey !== undefined ? line.lineKey : line.variant, line.quantity + Number(qty.dataset.qty));
        return;
      }
      if (e.target.closest("[data-remove]")) {
        const ln = lineOf(e.target); const line = ln && findLine(ln);
        if (line) {
          svc().removeFromCart(line.productId, line.lineKey !== undefined ? line.lineKey : line.variant);
          window.toastComponent.showToast({ title: "Producto eliminado", message: line.name, icon: "bi-trash3" });
        }
        return;
      }
      if (e.target.closest("[data-cart-clear]")) {
        svc().clearCart();
        window.toastComponent.showToast({ title: "Cesta vaciada", icon: "bi-trash3" });
        return;
      }
      const addon = e.target.closest("[data-addon-toggle]");
      if (addon) { toggleAddon(Number(addon.closest("[data-addon]").dataset.addon)); return; }
      const slot = e.target.closest("[data-slot]");
      if (slot) { setSlot(slot.dataset.slot); return; }
      const pill = e.target.closest("[data-date]");
      if (pill) { svc().setDelivery({ date: pill.dataset.date }); return; }
      if (e.target.closest("[data-coupon-clear]")) { ui.couponMsg = null; svc().clearCoupon(); return; }

      if (e.target.closest("[data-note-edit]")) {
        const ln = lineOf(e.target);
        ui.editing = ln.pid + "::" + ln.lk;
        render();
        const ta = $("#cam-note");
        if (ta) ta.focus();
        return;
      }
      if (e.target.closest("[data-note-cancel]")) { ui.editing = null; render(); return; }
      if (e.target.closest("[data-note-save]")) {
        const ln = lineOf(e.target); const line = ln && findLine(ln);
        const value = $("#cam-note").value;
        ui.editing = null;
        if (line) svc().updateNote(line.productId, line.lineKey !== undefined ? line.lineKey : line.variant, value);
        else render();
      }
    });

    document.addEventListener("change", (e) => {
      if (e.target.matches("#ca-date")) svc().setDelivery({ date: e.target.value });
      else if (e.target.matches("[data-surprise]")) svc().setDelivery({ surprise: e.target.checked });
    });

    document.addEventListener("submit", (e) => {
      const form = e.target.closest("[data-coupon-form]");
      if (!form) return;
      e.preventDefault();
      handleCoupon(form);
    });

    window.addEventListener(svc().EVENT_NAME, render);
    window.addEventListener("storage", render);
  }

  function init() {
    bind();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
