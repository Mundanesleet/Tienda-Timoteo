/**
 * confirmation.js — pedido confirmado (confirmacion.html).
 * Muestra el último pedido guardado por orderService; si el navegador aún no
 * tiene ninguno, enseña un pedido de ejemplo (marcado como tal).
 */
(function () {
  "use strict";

  const esc = (s) => window.timoteoUtils.escapeHtml(s);
  const money = (v) => window.productService.formatCOPSpaced(v);
  const $ = (s) => document.querySelector(s);

  function sampleOrder() {
    const C = "assets/images/catalog/";
    return {
      id: "TM-84920",
      isSample: true,
      createdAt: new Date().toISOString(),
      items: [
        { name: "Bouquet Rosas Premium Eternas", detail: "24 rosas rosadas y follaje fino", price: 145000, quantity: 1, image: C + "bouquet-rosas-premium.jpg" },
        { name: "Caja Bombones Belgas de Autor", detail: "16 unidades surtidas artesanales", price: 75000, quantity: 1, image: C + "bombones-belgas-autor.jpg" },
        { name: "Oso Teddy Mini & Moño Seda", detail: "Edición Colección Timoteo", price: 45000, quantity: 1, image: C + "osito-mini.jpg" }
      ],
      subtotal: 265000,
      discount: 0,
      coupon: "",
      shipping: 0,
      total: 265000,
      delivery: { label: "Mañana", range: "14:00 - 18:00", slot: "express", surprise: true },
      sender: { name: "Mateo Herrera", email: "", phone: "" },
      recipient: { name: "Camila Velásquez", phone: "+57 314 890 2341", address: "Carrera 43A # 18 Sur - 65, Apto 902", apartment: "", city: "El Poblado, Medellín", notes: "" },
      dedication: {
        text: "Para la persona que ilumina cada uno de mis días sin siquiera intentarlo. Que estas flores te recuerden lo mucho que te admiro y lo inmensamente feliz que soy a tu lado. Feliz aniversario mi amor.",
        signature: "public",
        signedName: "Mateo"
      },
      payment: { method: "card", label: "Tarjeta bancaria", last4: "", quotas: 1 }
    };
  }

  function signature(o) {
    if (o.dedication.signature === "anonymous") return "— Un admirador secreto ♡";
    const first = String(o.dedication.signedName || o.sender.name || "").trim().split(/\s+/)[0];
    return "— Con todo mi amor" + (first ? ", " + first : "") + " ♡";
  }

  function timeLabel(iso) {
    try {
      return new Date(iso).toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" }).replace(/\s/g, " ");
    } catch (e) { return ""; }
  }

  function render(o) {
    const units = o.items.reduce((n, it) => n + it.quantity, 0);
    const express = o.delivery.slot === "express";

    $("#oc-code").textContent = "Pedido #" + o.id + " confirmado exitosamente";
    $("#oc-time").textContent = timeLabel(o.createdAt);
    $("#oc-when").textContent = o.delivery.label + " " + o.delivery.range + " hrs";
    $("#oc-surprise").textContent = o.delivery.surprise
      ? "Entrega personalizada sin revelar el remitente hasta abrir la carta."
      : "Entrega programada con aviso por SMS al momento exacto de llegada.";
    $("#oc-sample").hidden = !o.isSample;

    $("#oc-rname").textContent = o.recipient.name;
    $("#oc-raddr").textContent = o.recipient.address + (o.recipient.apartment ? ", " + o.recipient.apartment : "");
    $("#oc-rcity").textContent = o.recipient.city + (o.recipient.phone ? " • Tel: " + o.recipient.phone : "");

    const text = (o.dedication.text || "").trim();
    $("#oc-text").textContent = text ? "“" + text + "”" : "Tu tarjeta llegará con el sello de lacre y espacio para tus propias palabras.";
    $("#oc-sign").textContent = text ? signature(o) : "";

    $("#oc-count").textContent = units + (units === 1 ? " artículo" : " artículos");
    $("#oc-items").innerHTML = o.items
      .map(
        (it) =>
          '<div class="oc-item"><img src="' + esc(it.image) + '" alt="' + esc(it.name) + '" loading="lazy">' +
          "<div><h4>" + esc(it.name) + "</h4><p>" + esc(it.detail || "") + (it.quantity > 1 ? " · x" + it.quantity : "") + "</p></div>" +
          "<b>" + money(it.price * it.quantity) + "</b></div>"
      )
      .join("");

    $("#oc-calc").innerHTML =
      "<div><span>Subtotal productos</span><b>" + money(o.subtotal) + "</b></div>" +
      "<div><span>Empaque de lujo y tarjeta personalizada</span><em>Cortesía de la casa</em></div>" +
      (o.discount ? '<div><span>Descuento' + (o.coupon ? " (" + esc(o.coupon) + ")" : "") + "</span><em>-" + money(o.discount) + "</em></div>" : "") +
      "<div><span>" + (express ? "Envío express con chofer exclusivo" : "Envío programado") + "</span>" + (o.shipping ? "<b>" + money(o.shipping) + "</b>" : "<em>Gratis</em>") + "</div>" +
      '<div class="oc-basket__total"><span>Total Pagado</span><strong>' + money(o.total) + "</strong></div>";

    const p = o.payment || {};
    $("#oc-secure").textContent =
      p.method === "transfer"
        ? "Pago por transferencia: te enviaremos los datos de la cuenta por WhatsApp"
        : "Transacción segura procesada por Wompi Bancolombia" + (p.last4 ? " • tarjeta ···· " + p.last4 : "");

    const msg = "Hola Timoteo, quiero seguir mi pedido #" + o.id + ".";
    $("#oc-wa").href = "https://wa.me/573000000000?text=" + encodeURIComponent(msg);
    document.title = "Pedido " + o.id + " confirmado | Timoteo";
  }

  function receiptText(o) {
    const line = (a, b) => a + ": " + b;
    const out = [
      "TIMOTEO - Tienda de Regalos",
      "Comprobante de pedido #" + o.id,
      "Fecha: " + new Date(o.createdAt).toLocaleString("es-CO"),
      "",
      "PRODUCTOS"
    ];
    o.items.forEach((it) => out.push("- " + it.name + " x" + it.quantity + "  " + money(it.price * it.quantity)));
    out.push("", line("Subtotal", money(o.subtotal)));
    if (o.discount) out.push(line("Descuento", "-" + money(o.discount)));
    out.push(line("Envio", o.shipping ? money(o.shipping) : "Gratis"), line("TOTAL PAGADO", money(o.total)), "");
    out.push("ENTREGA", line("Destinatario", o.recipient.name), line("Direccion", o.recipient.address + ", " + o.recipient.city), line("Ventana", o.delivery.label + " " + o.delivery.range + " hrs"), "");
    out.push("Gracias por regalar con amor.");
    return out.join("\r\n");
  }

  function download(o) {
    const blob = new Blob([receiptText(o)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "comprobante-" + o.id + ".txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    window.toastComponent.showToast({ title: "Comprobante #" + o.id + " generado", message: "Listo para guardar", icon: "bi-check-circle" });
  }

  function init() {
    const order = window.orderService.getLastOrder() || sampleOrder();
    render(order);
    $("#downloadSummaryBtn").addEventListener("click", () => download(order));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
