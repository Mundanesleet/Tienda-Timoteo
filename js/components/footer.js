/**
 * footer.js — pie de página dentro de <footer id="site-footer">.
 * Variantes de Stitch según <body data-chrome>:
 *   boutique → columnas Comprar / Nosotros / Síguenos (Home, Catálogo, Crea, Producto)
 *   atelier  → Comprar / Nosotros / Conectar (Favoritos, Búsqueda, Novedades, Nosotros, Contacto)
 *   appbar   → variante ampliada con firma final (Carrito, Checkout, Confirmación)
 */
(function () {
  "use strict";

  const YEAR = new Date().getFullYear();

  function categoryLinks() {
    const cats = (window.categoryService && window.categoryService.getAllCategories()) || [];
    return cats
      .map((c) => '<li><a href="catalogo.html?categoria=' + c.slug + '">' + window.timoteoUtils.escapeHtml(c.name) + "</a></li>")
      .join("");
  }

  const SOCIAL_SVG = {
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect height="20" rx="5" ry="5" width="20" x="2" y="2"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>'
  };

  function boutiqueFooter() {
    return (
      '<div class="fb">' +
      '<div class="fb__grid">' +
      '<div class="fb__brand">' +
      '<a href="index.html" aria-label="Timoteo, ir al inicio">' + window.timoteoUtils.brandLogoSvg("fb__logo") + "</a>" +
      "<p>Detalles que hacen la vida más linda. Diseñamos experiencias y regalos con amor en cada detalle.</p></div>" +
      '<div class="fb__col fb__col--sm"><p class="fb__title">Comprar</p><ul>' + categoryLinks() + "</ul></div>" +
      '<div class="fb__col fb__col--sm"><p class="fb__title">Nosotros</p><ul>' +
      '<li><a href="nosotros.html">Nuestra historia</a></li>' +
      '<li><a href="contacto.html#faq">Preguntas frecuentes</a></li>' +
      '<li><a href="contacto.html#envios">Envíos</a></li>' +
      '<li><a href="contacto.html#faq">Cambios y devoluciones</a></li>' +
      '<li><a href="contacto.html">Contacto</a></li></ul></div>' +
      '<div class="fb__col fb__col--follow"><p class="fb__title">Síguenos</p>' +
      '<div class="fb__social">' +
      '<a href="#" aria-label="Facebook">' + SOCIAL_SVG.facebook + "</a>" +
      '<a href="#" aria-label="Twitter">' + SOCIAL_SVG.twitter + "</a>" +
      '<a href="#" aria-label="Instagram">' + SOCIAL_SVG.instagram + "</a></div>" +
      '<div class="fb__wa"><a class="fb__whatsapp" href="https://wa.me/573000000000">Escríbenos por WhatsApp</a></div>' +
      '<div class="fb__sig"><p class="fb__thanks">Gracias <br>por ser parte <br>de Timoteo ♡</p></div></div>' +
      "</div>" +
      '<div class="fb__legal"><p>© ' + YEAR + " Timoteo Tienda de Regalos. Todos los derechos reservados.</p>" +
      '<p><a href="#">Términos y Condiciones</a><span>•</span><a href="#">Política de Privacidad</a></p></div>' +
      "</div>"
    );
  }

  const SHOP_LINKS =
    '<li><a href="catalogo.html">Todos los regalos</a></li>' +
    '<li><a href="personalizar.html">Arma tu caja personalizada</a></li>' +
    '<li><a href="novedades.html">Ediciones de temporada</a></li>' +
    '<li><a href="catalogo.html?categoria=flores">Flores &amp; Bouquets</a></li>';

  const ABOUT_LINKS =
    '<li><a href="nosotros.html">Nuestra historia</a></li>' +
    '<li><a href="nosotros.html#manifiesto">Manifiesto de empaque</a></li>' +
    '<li><a href="contacto.html#faq">Preguntas frecuentes</a></li>' +
    '<li><a href="contacto.html#envios">Guía de envíos</a></li>';

  function atelierFooter() {
    return (
      '<div class="fa">' +
      '<div class="fa__grid">' +
      '<div><div class="fa__brandline"><span class="fa__brand">Timoteo</span><span class="fa__brand-sub">• Regalos</span></div>' +
      '<p class="fa__about">Curaduría de regalos con alma, arreglos florales de autor y empaques artesanales creados para emocionar y perdurar en la memoria.</p>' +
      '<a class="fa__whatsapp" href="https://wa.me/573000000000"><i class="bi bi-chat-left-text"></i><span>Escríbenos por WhatsApp</span></a></div>' +
      '<div><h3 class="fa__title">Comprar</h3><ul class="fa__links">' + SHOP_LINKS + "</ul></div>" +
      '<div><h3 class="fa__title">Nosotros</h3><ul class="fa__links">' + ABOUT_LINKS + "</ul></div>" +
      '<div><h3 class="fa__title">Conectar</h3><div class="fa__social">' +
      '<a href="#" aria-label="Instagram"><i class="bi bi-camera"></i></a>' +
      '<a href="#" aria-label="Pinterest"><i class="bi bi-images"></i></a>' +
      '<a href="#" aria-label="Compartir"><i class="bi bi-share"></i></a></div>' +
      '<p class="fa__thanks">Gracias por ser parte de Timoteo ♥</p></div>' +
      "</div>" +
      '<div class="fa__legal"><p>© ' + YEAR + " Timoteo Tienda de Regalos. Todos los derechos reservados.</p>" +
      '<div><a href="#">Políticas de Privacidad</a><a href="#">Términos y Condiciones</a></div></div>' +
      "</div>"
    );
  }

  function appbarFooter() {
    return (
      '<div class="fp">' +
      '<div class="fp__grid">' +
      '<div class="fp__brandcol"><span class="fp__brand">Timoteo</span>' +
      '<p class="fp__about">Curaduría de regalos con alma. Creamos momentos inolvidables a través de empaques de ensueño, flores frescas y detalles seleccionados a mano.</p>' +
      '<a class="fp__whatsapp" href="https://wa.me/573000000000"><i class="bi bi-chat-left-text"></i>Escríbenos por WhatsApp</a></div>' +
      '<div><h4 class="fp__title">Comprar</h4><ul class="fp__links">' + SHOP_LINKS + "</ul></div>" +
      '<div><h4 class="fp__title">Nosotros</h4><ul class="fp__links">' + ABOUT_LINKS + "</ul></div>" +
      '<div><h4 class="fp__title">Conectar</h4>' +
      '<p class="fp__follow">Síguenos en nuestras redes para inspiración diaria y nuevos lanzamientos.</p>' +
      '<div class="fp__social"><a href="#" aria-label="Instagram"><i class="bi bi-camera"></i></a>' +
      '<a href="#" aria-label="Pinterest"><i class="bi bi-palette"></i></a>' +
      '<a href="#" aria-label="Compartir"><i class="bi bi-share"></i></a></div></div>' +
      "</div>" +
      '<div class="fp__sign"><p class="fp__sign-title">Gracias por ser parte de Timoteo ♡</p>' +
      "<p>© " + YEAR + " Timoteo Tienda de Regalos. Todos los derechos reservados.</p></div>" +
      "</div>"
    );
  }

  function initFooter() {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const chrome = document.body.dataset.chrome || "boutique";
    footer.className = "site-footer site-footer--" + chrome;
    footer.innerHTML = chrome === "atelier" ? atelierFooter() : chrome === "appbar" ? appbarFooter() : boutiqueFooter();
  }

  window.footerComponent = { initFooter };
})();
