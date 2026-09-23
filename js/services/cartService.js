/**
 * cartService — única puerta de entrada al carrito.
 *
 * Persiste en localStorage bajo la clave "timoteo_cart" y emite el evento
 * "timeoteo:cart-changed" (ver EVENT_NAME) en window cada vez que cambia,
 * para que navbar / badges / páginas se mantengan sincronizados sin
 * acoplarse entre sí.
 *
 * Preparado para backend: cuando exista Django, este servicio pasaría a
 * hacer fetch()/POST a /api/cart/ y seguiría exponiendo la misma API.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "timoteo_cart";
  const EVENT_NAME = "timoteo:cart-changed";
  const SHIPPING_FLAT = 5000;

  function readRaw() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn("[cartService] localStorage no disponible o dato corrupto:", err);
      return [];
    }
  }

  function writeRaw(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn("[cartService] no se pudo guardar el carrito:", err);
    }
    emitChange(items);
  }

  function emitChange(items) {
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, {
        detail: { items: items.slice(), count: getCartCount(items), total: getCartTotal(items) }
      })
    );
  }

  function lineKey(productId, variant) {
    return productId + "::" + (variant || "default");
  }

  function getCart() {
    return readRaw();
  }

  /**
   * options: { quantity, variant (presentación), unitPrice (incluye extras),
   *            detail (texto de la presentación), addons: [{name, price}],
   *            note (dedicatoria), occasion }
   * Las líneas con distinta presentación/extras/dedicatoria no se fusionan.
   */
  function addToCart(product, options) {
    const opts = options || {};
    const quantity = Math.max(1, opts.quantity || 1);
    const variant = opts.color ? opts.color.name || opts.color : opts.variant || null;
    const addons = (opts.addons || []).map((a) => a.name);
    const keyVariant = [variant || "", addons.join("+"), opts.note || ""].join("|");

    const items = readRaw();
    const key = lineKey(product.id, keyVariant);
    const existing = items.find((it) => lineKey(it.productId, it.lineKey || it.variant) === key);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        price: typeof opts.unitPrice === "number" ? opts.unitPrice : product.price,
        oldPrice: product.oldPrice || null,
        image: product.image,
        collection: product.collection || "",
        variant: variant,
        detail: opts.detail || product.shortDescription || "",
        addons: opts.addons || [],
        note: opts.note || "",
        occasion: opts.occasion || "",
        lineKey: keyVariant,
        quantity: quantity,
        addedAt: Date.now()
      });
    }

    writeRaw(items);
    return items;
  }

  const idOf = (it) => lineKey(it.productId, it.lineKey !== undefined ? it.lineKey : it.variant);

  /** `variantKey` es el `lineKey` de la línea (ver addToCart). */
  function removeFromCart(productId, variantKey) {
    const items = readRaw();
    const key = lineKey(productId, variantKey);
    const next = items.filter((it) => idOf(it) !== key);
    writeRaw(next);
    return next;
  }

  function updateQuantity(productId, variantKey, quantity) {
    const items = readRaw();
    const key = lineKey(productId, variantKey);
    const line = items.find((it) => idOf(it) === key);
    if (!line) return items;

    if (quantity <= 0) {
      return removeFromCart(productId, variantKey);
    }
    line.quantity = Math.min(quantity, 20);
    writeRaw(items);
    return items;
  }

  /** Cambia la dedicatoria de una línea; si queda igual a otra línea, las fusiona. */
  function updateNote(productId, variantKey, note) {
    const items = readRaw();
    const key = lineKey(productId, variantKey);
    const line = items.find((it) => idOf(it) === key);
    if (!line) return items;

    line.note = String(note || "").trim().slice(0, 280);
    line.lineKey = [line.variant || "", (line.addons || []).map((a) => a.name).join("+"), line.note].join("|");
    const twin = items.find((it) => it !== line && idOf(it) === idOf(line));
    if (twin) {
      twin.quantity = Math.min(twin.quantity + line.quantity, 20);
      items.splice(items.indexOf(line), 1);
    }
    writeRaw(items);
    return items;
  }

  function clearCart() {
    writeRaw([]);
    return [];
  }

  function getCartTotal(itemsArg) {
    const items = itemsArg || readRaw();
    return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  }

  function getCartCount(itemsArg) {
    const items = itemsArg || readRaw();
    return items.reduce((sum, it) => sum + it.quantity, 0);
  }

  /* --- Entrega programada (franja + sorpresa), persistida en localStorage --- */
  const DELIVERY_KEY = "timoteo_delivery";
  const SLOTS = {
    manana: { key: "manana", label: "Mañana", range: "09:00 - 13:00", tag: "Estándar", extra: 0 },
    tarde: { key: "tarde", label: "Tarde", range: "14:00 - 18:00", tag: "Estándar", extra: 0 },
    express: { key: "express", label: "Express", range: "En 3 Horas", tag: "Rápido", extra: 5000 }
  };

  function getDelivery() {
    try {
      const raw = JSON.parse(localStorage.getItem(DELIVERY_KEY) || "null");
      if (raw && SLOTS[raw.slot]) return raw;
    } catch (err) { /* sin persistencia */ }
    return { slot: "manana", date: null, surprise: true };
  }

  function setDelivery(patch) {
    const next = Object.assign(getDelivery(), patch || {});
    try { localStorage.setItem(DELIVERY_KEY, JSON.stringify(next)); } catch (err) { /* sin persistencia */ }
    emitChange(readRaw());
    return next;
  }

  /**
   * Agenda de entrega normalizada: fecha ISO vigente (mañana por defecto; hoy si es
   * Express), etiqueta legible ("Mañana, 24 de Octubre") y franja horaria.
   */
  const DOW = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const MONTH = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const isoOf = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

  function getSchedule() {
    const d = getDelivery();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    let date = d.date;
    if (!date || date < isoOf(today)) date = isoOf(tomorrow);
    if (d.slot === "express") date = isoOf(today);
    const parts = date.split("-").map(Number);
    const dt = new Date(parts[0], parts[1] - 1, parts[2]);
    const off = Math.round((dt - today) / 86400000);
    const lead = off === 0 ? "Hoy" : off === 1 ? "Mañana" : DOW[dt.getDay()];
    const slot = SLOTS[d.slot];
    return {
      slot: d.slot,
      slotLabel: slot.label,
      range: slot.range,
      date: date,
      label: lead + ", " + dt.getDate() + " de " + MONTH[dt.getMonth()],
      surprise: d.surprise !== false
    };
  }

  const COUPONS = { TIMOTEOAMOR: { label: "TIMOTEOAMOR", percent: 10 } };
  const COUPON_KEY = "timoteo_coupon";

  function getCoupon() {
    try {
      const code = localStorage.getItem(COUPON_KEY);
      return code && COUPONS[code] ? COUPONS[code] : null;
    } catch (err) { return null; }
  }

  function applyCoupon(code) {
    const clean = String(code || "").trim().toUpperCase();
    if (!COUPONS[clean]) return null;
    try { localStorage.setItem(COUPON_KEY, clean); } catch (err) { /* sin persistencia */ }
    emitChange(readRaw());
    return COUPONS[clean];
  }

  function clearCoupon() {
    try { localStorage.removeItem(COUPON_KEY); } catch (err) { /* sin persistencia */ }
    emitChange(readRaw());
  }

  function getDiscount(itemsArg) {
    const coupon = getCoupon();
    if (!coupon) return 0;
    return Math.round((getCartTotal(itemsArg) * coupon.percent) / 100);
  }

  /** Envío programado: $5.000 en franjas estándar; Express suma $5.000. */
  function getShippingCost(itemsArg) {
    const items = itemsArg || readRaw();
    if (items.length === 0) return 0;
    return SHIPPING_FLAT + SLOTS[getDelivery().slot].extra;
  }

  function getOrderTotal(itemsArg) {
    const items = itemsArg || readRaw();
    return getCartTotal(items) - getDiscount(items) + getShippingCost(items);
  }

  window.cartService = {
    EVENT_NAME,
    SLOTS,
    getDelivery,
    getSchedule,
    setDelivery,
    getCoupon,
    applyCoupon,
    clearCoupon,
    getDiscount,
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateNote,
    clearCart,
    getCartTotal,
    getCartCount,
    getShippingCost,
    getOrderTotal
  };
})();
