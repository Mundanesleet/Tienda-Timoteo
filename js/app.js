/**
 * app.js — arranque compartido por todas las páginas.
 *
 * Construye el chrome de marca (header, footer, bottom nav), sincroniza
 * contadores, activa el reveal en scroll y las transiciones entre páginas,
 * y centraliza los manejadores delegados de "agregar al carrito" y
 * "favorito" que usan las tarjetas de producto en cualquier página.
 */
(function () {
  "use strict";

  let revealObserver = null;

  function initScrollReveal(root) {
    const scope = root || document;
    const targets = scope.querySelectorAll("[data-reveal]:not(.is-visible)");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
    }
    targets.forEach((el) => revealObserver.observe(el));
  }

  function initPageTransitions() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[href]");
      if (!link) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return; // ancla en la misma página

      e.preventDefault();
      document.body.classList.add("is-leaving");
      window.setTimeout(() => {
        window.location.href = link.href;
      }, 150);
    });

    window.addEventListener("pageshow", (e) => {
      if (e.persisted) document.body.classList.remove("is-leaving");
    });
  }

  function navigateWithFade(href, delay) {
    document.body.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.href = href;
    }, delay || 150);
  }

  function flashButtonAdded(button) {
    if (!button) return;
    const label = button.querySelector("[data-add-label]");
    const original = label ? label.textContent : "";
    button.classList.add("is-added");
    if (label) label.textContent = button.dataset.addedLabel || "Agregado";
    window.setTimeout(() => {
      button.classList.remove("is-added");
      if (label) label.textContent = original;
    }, 1100);
  }

  function handleAddToCartClick(button) {
    const id = Number(button.dataset.productId);
    const product = window.productService.getProductById(id);
    if (!product) return;

    window.cartService.addToCart(product, { quantity: 1 });
    flashButtonAdded(button);
    window.toastComponent.showToast({
      title: "Producto agregado al carrito",
      message: product.name,
      image: product.image,
      actionLabel: "Ver carrito",
      actionHref: "carrito.html"
    });
  }

  /** Aplica el estado visual (icono/texto/aria) a un botón de favorito. */
  function applyFavState(button, isFav) {
    button.classList.toggle("is-active", isFav);
    button.setAttribute("aria-pressed", String(isFav));
    const icon = button.querySelector("[data-fav-icon]");
    if (icon) icon.className = "bi " + (isFav ? "bi-heart-fill" : "bi-heart");
    const text = button.querySelector("[data-fav-text]");
    if (text && button.dataset.favLabelOn) {
      text.textContent = isFav ? button.dataset.favLabelOn : button.dataset.favLabelOff;
    }
  }

  function handleFavToggleClick(button) {
    const id = Number(button.dataset.productId);
    const isFav = window.favoritesService.toggleFavorite(id);

    // Puede haber más de un control de favorito para el mismo producto en
    // la página (el corazón de la tarjeta y el botón de texto del detalle):
    // se sincronizan todos para que nunca queden en estados distintos.
    document.querySelectorAll('[data-fav-toggle][data-product-id="' + id + '"]').forEach((btn) => {
      applyFavState(btn, isFav);
      btn.classList.remove("is-popping");
      void btn.offsetWidth;
      btn.classList.add("is-popping");
    });

    if (isFav) {
      const product = window.productService.getProductById(id);
      window.toastComponent.showToast({
        title: "Guardado en favoritos",
        message: product ? product.name : "",
        icon: "bi-heart-fill"
      });
    }
  }

  function initGlobalDelegation() {
    document.addEventListener("click", (e) => {
      const addBtn = e.target.closest("[data-add-to-cart]");
      if (addBtn) {
        e.preventDefault();
        handleAddToCartClick(addBtn);
        return;
      }
      const favBtn = e.target.closest("[data-fav-toggle]");
      if (favBtn) {
        e.preventDefault();
        handleFavToggleClick(favBtn);
      }
    });
  }

  function bootstrapChrome() {
    if (window.navbarComponent) window.navbarComponent.initNavbar();
    if (window.footerComponent) window.footerComponent.initFooter();
    if (window.mobileNavigationComponent) window.mobileNavigationComponent.initMobileNavigation();
    if (window.cartBadgeComponent) window.cartBadgeComponent.initCartBadge();
    document.documentElement.classList.add("js");
    initGlobalDelegation();
    initPageTransitions();
    initScrollReveal(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrapChrome);
  } else {
    bootstrapChrome();
  }

  window.timoteoApp = { initScrollReveal, flashButtonAdded, applyFavState, navigateWithFade };
})();
