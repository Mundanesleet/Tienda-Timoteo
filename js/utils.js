/**
 * utils.js — helpers pequeños y compartidos, sin estado.
 */
(function () {
  "use strict";

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => {
      switch (ch) {
        case "&": return "&amp;";
        case "<": return "&lt;";
        case ">": return "&gt;";
        case '"': return "&quot;";
        default: return "&#39;";
      }
    });
  }

  function debounce(fn, wait) {
    let t;
    return function debounced(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function setQueryParams(params, options) {
    const opts = options || {};
    const url = new URL(window.location.href);
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value === null || value === undefined || value === "") {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    });
    if (opts.replace) {
      window.history.replaceState({}, "", url);
    } else {
      window.history.pushState({}, "", url);
    }
  }

  const HEART_D =
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  /** Logotipo "Timoteo / TIENDA DE REGALOS" del diseño (SVG vectorial). */
  function brandLogoSvg(className) {
    return (
      '<svg class="' + (className || "brand-logo") + '" viewBox="0 0 420 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Timoteo, tienda de regalos">' +
      '<g transform="translate(10, 65)">' +
      '<path fill="#C98F91" d="' + HEART_D + '" transform="translate(112, -48) scale(0.65)"/>' +
      '<text x="0" y="0" font-family="Playfair Display, Georgia, serif" font-weight="700" font-size="52" fill="#342725" letter-spacing="-0.5">Tim' +
      '<tspan font-weight="600" font-style="italic" fill="#713E48">o</tspan>teo</text>' +
      '<text x="3" y="24" font-family="Plus Jakarta Sans, sans-serif" font-weight="600" font-size="10.5" letter-spacing="5" fill="#713E48">TIENDA DE REGALOS</text>' +
      "</g></svg>"
    );
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  window.timoteoUtils = {
    escapeHtml,
    debounce,
    getQueryParam,
    setQueryParams,
    brandLogoSvg,
    clamp
  };
})();
