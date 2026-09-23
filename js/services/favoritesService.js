/**
 * favoritesService — persistencia de favoritos en localStorage.
 * Clave: "timoteo_favorites" (arreglo de IDs de producto).
 * Emite "timoteo:favorites-changed" en window ante cualquier cambio.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "timoteo_favorites";
  const EVENT_NAME = "timoteo:favorites-changed";

  function readRaw() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn("[favoritesService] localStorage no disponible:", err);
      return [];
    }
  }

  function writeRaw(ids) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (err) {
      console.warn("[favoritesService] no se pudo guardar favoritos:", err);
    }
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { ids: ids.slice(), count: ids.length } }));
  }

  function getFavoriteIds() {
    return readRaw();
  }

  function isFavorite(productId) {
    return readRaw().includes(Number(productId));
  }

  function toggleFavorite(productId) {
    const id = Number(productId);
    const ids = readRaw();
    const idx = ids.indexOf(id);
    if (idx === -1) {
      ids.push(id);
    } else {
      ids.splice(idx, 1);
    }
    writeRaw(ids);
    return ids.includes(id);
  }

  function getFavoriteCount() {
    return readRaw().length;
  }

  function getFavoriteProducts() {
    if (!window.productService) return [];
    return readRaw()
      .map((id) => window.productService.getProductById(id))
      .filter(Boolean);
  }

  window.favoritesService = {
    EVENT_NAME,
    getFavoriteIds,
    isFavorite,
    toggleFavorite,
    getFavoriteCount,
    getFavoriteProducts
  };
})();
