/**
 * Categorías y ocasiones (datos de demostración tomados de Stitch).
 * Se consumen solo a través de categoryService.
 * `icon` es la clave de un icono en js/components/icons.js.
 */
(function () {
  "use strict";

  const IMG = "assets/images/catalog/";

  const categories = [
    { slug: "peluches", name: "Peluches", icon: "bear", image: IMG + "peluches-repisa.jpg", description: "Ositos y peluches suaves para abrazar." },
    { slug: "flores", name: "Flores", icon: "flower", image: IMG + "bouquet-jarron.jpg", description: "Bouquets, ramos y arreglos." },
    { slug: "chocolates", name: "Chocolates", icon: "chocolates", image: IMG + "bombones-tabla.jpg", description: "Bombones, trufas y dulces artesanales." },
    { slug: "regalos", name: "Regalos", icon: "gift", image: IMG + "regalos-navidad.jpg", description: "Cajas, cestas y sets listos para regalar." },
    { slug: "juguetes", name: "Juguetes", icon: "toy", image: IMG + "tienda-juguetes.jpg", description: "Juguetes de colección y didácticos." },
    { slug: "relojes", name: "Relojes", icon: "watch", image: IMG + "relojes-vitrina.jpg", description: "Relojes elegantes para cada estilo." }
  ];

  const occasions = [
    { slug: "cumpleanos", name: "Cumpleaños" },
    { slug: "amor-amistad", name: "Amor y amistad" },
    { slug: "aniversario", name: "Aniversario" },
    { slug: "para-mama", name: "Para mamá" },
    { slug: "para-amigo", name: "Para un amigo" },
    { slug: "ocasiones-especiales", name: "Ocasiones especiales" }
  ];

  window.TIMOTEO_DATA = window.TIMOTEO_DATA || {};
  window.TIMOTEO_DATA.categories = categories;
  window.TIMOTEO_DATA.occasions = occasions;
})();
