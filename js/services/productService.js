/**
 * productService — única puerta de entrada a los datos de productos.
 *
 * Hoy lee de window.TIMOTEO_DATA.products (js/data/products.js).
 * Cuando exista el backend Django, solo este archivo cambia:
 * las funciones seguirían llamándose igual pero harían fetch() a la API.
 * Ninguna página o componente debe leer products.js directamente.
 */
(function () {
  "use strict";

  function all() {
    return (window.TIMOTEO_DATA && window.TIMOTEO_DATA.products) || [];
  }

  function getAllProducts() {
    return all().slice();
  }

  function getProductById(id) {
    const numId = Number(id);
    return all().find((p) => p.id === numId) || null;
  }

  function getProductBySlug(slug) {
    return all().find((p) => p.slug === slug) || null;
  }

  function getFeaturedProducts(limit) {
    const featured = all().filter((p) => p.featured);
    return typeof limit === "number" ? featured.slice(0, limit) : featured;
  }

  function getNewProducts(limit) {
    const list = all().filter((p) => p.isNew);
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }

  function getProductsByCategory(categorySlug, options) {
    const opts = options || {};
    let list = all();
    if (categorySlug && categorySlug !== "todos") {
      list = list.filter((p) => p.category === categorySlug);
    }
    if (typeof opts.excludeId === "number") {
      list = list.filter((p) => p.id !== opts.excludeId);
    }
    if (typeof opts.limit === "number") {
      list = list.slice(0, opts.limit);
    }
    return list;
  }

  function getProductsByOccasion(occasionSlug, limit) {
    const list = all().filter((p) => (p.occasions || []).includes(occasionSlug));
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }

  function getRelatedProducts(product, limit) {
    if (!product) return [];
    const n = typeof limit === "number" ? limit : 4;
    let related = all().filter((p) => p.id !== product.id && p.category === product.category);
    if (related.length < n) {
      const extra = all().filter(
        (p) => p.id !== product.id && !related.includes(p) && p.category !== product.category
      );
      related = related.concat(extra);
    }
    return related.slice(0, n);
  }

  /**
   * Búsqueda + filtros combinados para el catálogo.
   * options: { query, category, occasion, sort, minPrice, maxPrice, onlyNew }
   */
  function searchProducts(options) {
    const opts = options || {};
    let list = all();

    if (opts.category && opts.category !== "todos") {
      list = list.filter((p) => p.category === opts.category);
    }

    if (opts.occasion) {
      list = list.filter((p) => (p.occasions || []).includes(opts.occasion));
    }

    if (opts.occasions && opts.occasions.length) {
      list = list.filter((p) => opts.occasions.some((o) => (p.occasions || []).includes(o)));
    }

    if (opts.recipients && opts.recipients.length) {
      list = list.filter((p) => opts.recipients.some((r) => (p.recipients || []).includes(r)));
    }

    if (opts.special) {
      list = list.filter((p) => p.badge === "Edición limitada" || p.badge === "Bespoke");
    }

    if (opts.onlyNew) {
      list = list.filter((p) => p.isNew);
    }

    if (typeof opts.minPrice === "number") {
      list = list.filter((p) => p.price >= opts.minPrice);
    }
    if (typeof opts.maxPrice === "number") {
      list = list.filter((p) => p.price <= opts.maxPrice);
    }

    if (opts.query && opts.query.trim()) {
      const q = normalize(opts.query.trim());
      list = list.filter((p) => {
        const haystack = normalize([p.name, p.shortDescription, p.description, p.collection, p.category, p.badge].join(" "));
        return haystack.includes(q);
      });
    }

    switch (opts.sort) {
      case "price-asc":
        list = list.slice().sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = list.slice().sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list = list.slice().sort((a, b) => a.name.localeCompare(b.name, "es"));
        break;
      case "popular":
        list = list.slice().sort((a, b) => b.reviews - a.reviews);
        break;
      case "rating":
        list = list.slice().sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      case "newest":
        list = list.slice().sort((a, b) => (b.isNew === true) - (a.isNew === true));
        break;
      default:
        break;
    }

    return list;
  }

  function normalize(str) {
    return String(str)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }

  /** "$85.000" (formato del catálogo, carrito y checkout). */
  function formatCOP(value) {
    return "$" + Math.round(value).toLocaleString("es-CO");
  }

  /** "$ 85.000" (formato con espacio usado en las tarjetas del Home). */
  function formatCOPSpaced(value) {
    return "$ " + Math.round(value).toLocaleString("es-CO");
  }

  window.productService = {
    getAllProducts,
    getProductById,
    getProductBySlug,
    getFeaturedProducts,
    getNewProducts,
    getProductsByCategory,
    getProductsByOccasion,
    getRelatedProducts,
    searchProducts,
    formatCOP,
    formatCOPSpaced
  };
})();
