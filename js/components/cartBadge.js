/**
 * cartBadge.js — sincroniza todos los contadores de carrito y favoritos
 * presentes en la página (header desktop, drawer, bottom nav) escuchando
 * los eventos que emiten cartService / favoritesService.
 */
(function () {
  "use strict";

  function paintBadge(el, count, options) {
    if (!el) return;
    const opts = options || {};
    const prev = el.textContent;
    el.textContent = count > 99 ? "99+" : String(count);
    el.hidden = count <= 0;
    if (opts.bump && String(count) !== prev && count > 0) {
      el.classList.remove("is-bumping");
      // Forzar reflow para poder relanzar la animación.
      void el.offsetWidth;
      el.classList.add("is-bumping");
    }
  }

  function syncCartBadges(options) {
    const count = window.cartService.getCartCount();
    document.querySelectorAll("[data-cart-badge]").forEach((el) => paintBadge(el, count, options));
  }

  function syncFavoritesBadges(options) {
    const count = window.favoritesService.getFavoriteCount();
    document.querySelectorAll("[data-favorites-badge]").forEach((el) => paintBadge(el, count, options));
  }

  function initCartBadge() {
    syncCartBadges({ bump: false });
    syncFavoritesBadges({ bump: false });

    window.addEventListener(window.cartService.EVENT_NAME, () => syncCartBadges({ bump: true }));
    window.addEventListener(window.favoritesService.EVENT_NAME, () => syncFavoritesBadges({ bump: true }));

    // Si el carrito cambia en otra pestaña, reflejarlo aquí también.
    window.addEventListener("storage", (e) => {
      if (e.key === "timoteo_cart") syncCartBadges({ bump: false });
      if (e.key === "timoteo_favorites") syncFavoritesBadges({ bump: false });
    });
  }

  window.cartBadgeComponent = { initCartBadge, syncCartBadges, syncFavoritesBadges };
})();
