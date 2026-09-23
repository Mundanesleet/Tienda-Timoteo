/**
 * orderService — pedidos confirmados (checkout → confirmación).
 *
 * Guarda el último pedido y un historial corto en localStorage. Con el backend
 * Django, placeOrder() pasaría a hacer POST /api/orders/ y devolvería el pedido
 * creado; el resto de la API se mantiene.
 */
(function () {
  "use strict";

  const LAST_KEY = "timoteo_last_order";
  const LIST_KEY = "timoteo_orders";
  const PROFILE_KEY = "timoteo_profile";

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) { console.warn("[orderService] no se pudo guardar", key, err); }
  }

  function newId() {
    return "TM-" + String(Math.floor(10000 + Math.random() * 89999));
  }

  /** payload: { items, subtotal, discount, coupon, shipping, total, delivery, sender, recipient, dedication, payment, photoProof } */
  function placeOrder(payload) {
    const order = Object.assign({ id: newId(), createdAt: new Date().toISOString(), status: "workshop" }, payload);
    const list = read(LIST_KEY, []);
    list.unshift(order);
    write(LIST_KEY, list.slice(0, 20));
    write(LAST_KEY, order);
    return order;
  }

  const getLastOrder = () => read(LAST_KEY, null);
  const getOrders = () => read(LIST_KEY, []);

  function rememberProfile(sender) {
    write(PROFILE_KEY, { name: sender.name, email: sender.email, phone: sender.phone });
  }
  const getProfile = () => read(PROFILE_KEY, null);

  window.orderService = { placeOrder, getLastOrder, getOrders, rememberProfile, getProfile };
})();
