/**
 * categoryService — puerta de entrada a categorías y ocasiones.
 * Ver nota de arquitectura en productService.js.
 */
(function () {
  "use strict";

  function getAllCategories() {
    return ((window.TIMOTEO_DATA && window.TIMOTEO_DATA.categories) || []).slice();
  }

  function getCategoryBySlug(slug) {
    return getAllCategories().find((c) => c.slug === slug) || null;
  }

  function getAllOccasions() {
    return ((window.TIMOTEO_DATA && window.TIMOTEO_DATA.occasions) || []).slice();
  }

  function getOccasionBySlug(slug) {
    return getAllOccasions().find((o) => o.slug === slug) || null;
  }

  function countProductsInCategory(slug) {
    if (!window.productService) return 0;
    return window.productService.getProductsByCategory(slug).length;
  }

  window.categoryService = {
    getAllCategories,
    getCategoryBySlug,
    getAllOccasions,
    getOccasionBySlug,
    countProductsInCategory
  };
})();
