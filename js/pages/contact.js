/**
 * contact.js — formulario de contacto (contacto.html).
 * Validación en cliente y guardado local del mensaje; el envío real
 * quedará a cargo del backend Django (POST del mismo formulario).
 */
(function () {
  "use strict";

  const STORE_KEY = "timoteo_contact_messages";
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const MESSAGES = {
    fullName: "Escribe tu nombre y apellido.",
    userEmail: "Escribe un correo válido, por ejemplo tu@correo.com.",
    userPhone: "Escribe un teléfono o WhatsApp de al menos 7 dígitos.",
    inquiryType: "Selecciona el motivo de tu contacto.",
    messageText: "Cuéntanos brevemente qué tienes en mente (mínimo 10 caracteres).",
    termsCheck: "Necesitamos tu autorización para contactarte."
  };

  const $ = (s, r) => (r || document).querySelector(s);

  function isValid(id, el) {
    const value = (el.type === "checkbox" ? el.checked : el.value.trim());
    switch (id) {
      case "fullName": return value.length >= 3;
      case "userEmail": return EMAIL_RE.test(value);
      case "userPhone": return value.replace(/\D/g, "").length >= 7;
      case "inquiryType": return !!value;
      case "messageText": return value.length >= 10;
      case "termsCheck": return value === true;
      default: return true;
    }
  }

  function setError(id, on) {
    const el = document.getElementById(id);
    const msg = $('[data-err="' + id + '"]');
    if (!el || !msg) return;
    msg.textContent = on ? MESSAGES[id] : "";
    if (on) el.setAttribute("aria-invalid", "true");
    else el.removeAttribute("aria-invalid");
  }

  function readMessages() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); } catch (e) { return []; }
  }

  function init() {
    const form = $("#contactForm");
    if (!form) return;
    const ids = Object.keys(MESSAGES);
    const success = $("#formSuccess");

    const motivo = window.timoteoUtils.getQueryParam("motivo");
    if (motivo && form.inquiryType.querySelector('option[value="' + motivo + '"]')) form.inquiryType.value = motivo;

    ids.forEach((id) => {
      const el = document.getElementById(id);
      const ev = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(ev, () => { if (el.getAttribute("aria-invalid")) setError(id, !isValid(id, el)); });
      el.addEventListener("blur", () => { if (el.value || el.type === "checkbox") setError(id, !isValid(id, el)); });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let firstBad = null;
      ids.forEach((id) => {
        const el = document.getElementById(id);
        const bad = !isValid(id, el);
        setError(id, bad);
        if (bad && !firstBad) firstBad = el;
      });
      if (firstBad) { success.hidden = true; firstBad.focus(); return; }

      const list = readMessages();
      list.push({
        nombre: form.fullName.value.trim(),
        correo: form.userEmail.value.trim(),
        telefono: form.userPhone.value.trim(),
        motivo: form.inquiryType.value,
        mensaje: form.messageText.value.trim(),
        fecha: new Date().toISOString()
      });
      try { localStorage.setItem(STORE_KEY, JSON.stringify(list.slice(-20))); } catch (err) { /* sin persistencia */ }

      form.reset();
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
