/**
 * toast.js — notificaciones ligeras (nunca alert()).
 * showToast({ title, message, image, icon, actionLabel, actionHref })
 */
(function () {
  "use strict";

  let stack;

  function ensureStack() {
    if (stack) return stack;
    stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("aria-live", "polite");
      stack.setAttribute("aria-atomic", "true");
      document.body.appendChild(stack);
    }
    return stack;
  }

  function showToast(options) {
    const opts = options || {};
    const escapeHtml = window.timoteoUtils.escapeHtml;
    const el = document.createElement("div");
    el.className = "toast-brand";
    el.setAttribute("role", "status");

    const media = opts.image
      ? '<img src="' + opts.image + '" alt="" loading="lazy">'
      : '<span class="toast-icon"><i class="bi ' + (opts.icon || "bi-check-lg") + '" aria-hidden="true"></i></span>';

    el.innerHTML =
      media +
      '<span class="toast-body"><strong>' +
      escapeHtml(opts.title || "") +
      "</strong>" +
      (opts.message ? "<span>" + escapeHtml(opts.message) + "</span>" : "") +
      "</span>" +
      (opts.actionLabel
        ? '<a class="toast-action" href="' + (opts.actionHref || "#") + '">' + escapeHtml(opts.actionLabel) + "</a>"
        : "");

    const container = ensureStack();
    container.appendChild(el);

    const remove = () => {
      el.classList.add("is-leaving");
      el.addEventListener("animationend", () => el.remove(), { once: true });
    };

    const timer = setTimeout(remove, opts.duration || 3200);
    el.addEventListener("mouseenter", () => clearTimeout(timer));

    return el;
  }

  window.toastComponent = { showToast };
})();
