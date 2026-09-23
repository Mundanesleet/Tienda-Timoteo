/**
 * icons.js — iconografía SVG exacta del diseño de Stitch.
 *  - Trazo tipo "Feather" (2px) en las pantallas desktop (header, categorías…).
 *  - Trazo tipo "Heroicons outline" (1.8px) en las pantallas móviles.
 * La iconografía de interfaz secundaria usa Bootstrap Icons (bi bi-*) en el HTML.
 */
(function () {
  "use strict";

  const paths = {
    /* Feather */
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    truck: '<rect height="13" width="15" x="1" y="3"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    "arrow-right": '<line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    /* Categorías */
    bear: '<circle cx="12" cy="13" r="7"/><circle cx="7" cy="6" r="3"/><circle cx="17" cy="6" r="3"/><circle cx="9" cy="12" fill="currentColor" r="1"/><circle cx="15" cy="12" fill="currentColor" r="1"/><path d="M12 14c-.5.5-1 .5-1.5 0"/>',
    flower: '<path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V17m0 0l-3 4m3-4l3 4"/><circle cx="12" cy="7.5" r="2.5"/>',
    chocolates: '<rect height="18" rx="2" width="18" x="3" y="3"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/><line x1="9" x2="9" y1="3" y2="21"/><line x1="15" x2="15" y1="3" y2="21"/>',
    gift: '<polyline points="20 12 20 22 4 22 4 12"/><rect height="5" width="20" x="2" y="7"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
    toy: '<path d="M5 16h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2z"/><circle cx="7.5" cy="18.5" r="2.5"/><circle cx="16.5" cy="18.5" r="2.5"/>',
    watch: '<circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.02-10.7l.35-3.83A2 2 0 0 1 9.84 1h4.33a2 2 0 0 1 2 1.82l.35 3.83"/>',
    blossom: '<circle cx="12" cy="12" r="3"/><path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5"/><path d="M12 7.5V9M7.5 12H9M16.5 12H15M12 16.5V15M8 8l1.88 1.88M14.12 9.88 16 8M8 16l1.88-1.88M14.12 14.12 16 16"/>',
    leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    rabbit: '<path d="M13 16a3 3 0 0 1 2.24 5"/><path d="M18 12h.01"/><path d="M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3"/><path d="M20 8.54V4a2 2 0 1 0-4 0v3"/><path d="M7.612 12.524a3 3 0 1 0-1.6 4.3"/>',
    paw:'<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10z"/>',
    /* Heroicons outline (móvil) */
    menu: '<path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round"/>',
    bag: '<path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" stroke-linecap="round" stroke-linejoin="round"/>',
    home: '<path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" stroke-linecap="round" stroke-linejoin="round"/>',
    "search-m": '<path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke-linecap="round" stroke-linejoin="round"/>',
    grid: '<path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" stroke-linecap="round" stroke-linejoin="round"/>',
    "heart-m": '<path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" stroke-linecap="round" stroke-linejoin="round"/>',
    "truck-m": '<path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375A1.125 1.125 0 012.25 17.625V6.375c0-.621.504-1.125 1.125-1.125h11.25c.621 0 1.125.504 1.125 1.125v1.875m-13.5 10.5h1.5m12 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h3.375A1.125 1.125 0 0021 17.625v-4.125c0-.3-.12-.588-.33-.8l-3.045-3.045A1.125 1.125 0 0018.83 9H16.5" stroke-linecap="round" stroke-linejoin="round"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" stroke-linecap="round"/>',
    "check-circle": '<path d="M9 12.75L11.25 15 15 9.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke-linecap="round" stroke-linejoin="round"/>',
    "arrow-m": '<path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke-linecap="round" stroke-linejoin="round"/>',
    close: '<path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>'
  };

  function icon(name, opts) {
    const o = opts || {};
    const d = paths[name];
    if (!d) return "";
    const size = o.size ? ' width="' + o.size + '" height="' + o.size + '"' : "";
    const cls = o.className ? ' class="' + o.className + '"' : "";
    const stroke = o.stroke || 2;
    return (
      "<svg" + cls + size + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + stroke +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + d + "</svg>"
    );
  }

  /** Sello circular con texto sobre trazado ("MÁS QUE REGALOS • ES EMOCIÓN"). */
  let sealCount = 0;
  function seal(text, opts) {
    const o = opts || {};
    const id = "sealPath" + ++sealCount;
    const size = o.fontSize || 9.5;
    const spacing = o.letterSpacing || 2.8;
    return (
      '<svg class="' + (o.className || "") + '" viewBox="0 0 100 100" aria-hidden="true">' +
      '<path id="' + id + '" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none"/>' +
      '<text font-family="Plus Jakarta Sans, sans-serif" font-size="' + size + '" font-weight="700" letter-spacing="' + spacing +
      '" fill="' + (o.fill || "#713E48") + '" style="text-transform:uppercase"><textPath href="#' + id + '" startOffset="0%">' +
      text + "</textPath></text></svg>"
    );
  }

  /** Sustituye <i data-icon="paw" data-size="18" class="x"> por el SVG del set (clase y tamaño se conservan). */
  function hydrate(root) {
    (root || document).querySelectorAll("[data-icon]").forEach((el) => {
      const svg = icon(el.dataset.icon, { size: el.dataset.size || 18, className: el.className || "" });
      if (svg) el.outerHTML = svg;
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => hydrate());
  else hydrate();

  window.timoteoIcons = { icon, seal, hydrate };
})();
