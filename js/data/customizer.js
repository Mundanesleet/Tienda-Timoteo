/**
 * Asistente "Crea tu regalo único" (datos de demostración tomados de Stitch).
 * 6 pasos: base, peluche, flores, dulces, dedicatoria y resumen.
 * Cada opción suma su precio al total del regalo personalizado.
 */
(function () {
  "use strict";

  const C = "assets/images/catalog/";
  const E = "assets/images/editorial/";

  const customizer = {
    steps: [
      { key: "base", label: "Base & Caja", short: "Base", eyebrow: "Paso 1 de 6", title: "Elige la base de tu detalle", badge: "Empaque artesanal hecho a mano",
        hint: "Cada base se arma a mano en nuestro taller, con papeles, cintas y sellos de la casa.", filters: ["Todas las bases", "Cajas", "Cestas"] },
      { key: "plush", label: "Peluche", short: "Peluche", eyebrow: "Paso 2 de 6", title: "Elige el peluche que abrazará tu detalle", badge: "Fibras hipoalergénicas",
        hint: "Compañeros de tacto suave que acompañan tu regalo y perduran en la memoria.", filters: [] },
      { key: "flowers", label: "Flores & Bouquets", short: "Flores", eyebrow: "Paso 3 de 6", title: "Elige las flores que vestirán tu detalle", badge: "Flores frescas de corte diario",
        hint: "Nuestros floristas preparan ramilletes a la medida para acoplarse armónicamente en el costado de tu caja sombrerera.",
        filters: ["Todos los estilos", "Rosas eternas", "Bouquet silvestre", "Mini orquídea", "Clavelinas románticas"] },
      { key: "sweets", label: "Dulces & Chocolates", short: "Dulces", eyebrow: "Paso 4 de 6", title: "Endulza tu sorpresa", badge: "Chocolatería fina artesanal",
        hint: "Bombones y trufas de cacao seleccionado, presentados en cajas listas para regalar.", filters: [] },
      { key: "message", label: "Dedicatoria & Tarjeta", short: "Dedicatoria", eyebrow: "Paso 5 de 6", title: "Escribe las palabras que tocarán su corazón", badge: "Escrita a mano, cortesía Timoteo",
        hint: "Imprimiremos o caligrafiaremos tu mensaje en una tarjeta de lino blanco con sello lacrado.", filters: [] },
      { key: "summary", label: "Resumen & Sorpresa", short: "Resumen", eyebrow: "Paso 6 de 6", title: "Tu regalo está listo para nacer", badge: "Fotografía previa por WhatsApp",
        hint: "Revisa el desglose de tu diseño. Antes del despacho te enviaremos una foto de tu regalo real.", filters: [] }
    ],

    base: [
      { id: "sombrerera", name: "Caja Sombrerera Terciopelo", description: "Sombrerera rígida forrada en terciopelo borgoña con cinta de satén.", price: 25000, image: C + "caja-sombrerera-osito.jpg", badge: "Más elegido", tag: "Cajas", short: "Caja Sombrerera" },
      { id: "sombrerera-blanca", name: "Caja Sombrerera Perla", description: "Sombrerera blanca con tapa dorada y lazo de seda.", price: 22000, image: C + "caja-sombrerera-blanca.jpg", tag: "Cajas", short: "Sombrerera Perla" },
      { id: "kraft", name: "Caja Rígida con Lazo", description: "Caja crema con lazo borgoña y sello de cera artesanal.", price: 18000, image: C + "caja-lazo.jpg", tag: "Cajas", short: "Caja con Lazo" },
      { id: "cesta", name: "Cesta Artesanal de Mimbre", description: "Canasta tejida a mano con papel de seda y cinta rosada.", price: 32000, image: C + "cesta-celebracion.jpg", badge: "Edición Lujo", tag: "Cestas", short: "Cesta de Mimbre" }
    ],

    plush: [
      { id: "osito-miel", name: "Osito Miel Clásico 25cm", description: "Felpa suave antialérgica con lazo de satén borgoña.", price: 40000, image: C + "osito-caramelo.jpg", badge: "Más elegido", short: "Osito Miel" },
      { id: "osito-lazo", name: "Osito Teddy con Lazo Azul", description: "Osito color miel con lazo azul marino.", price: 46000, image: C + "osito-lazo-azul.jpg", short: "Osito Teddy" },
      { id: "conejo", name: "Conejito Cloud Ultra Suave", description: "Fibra hipoalergénica con tacto de nube.", price: 38000, image: C + "conejo-cloud.jpg", short: "Conejito Cloud" },
      { id: "sin-peluche", name: "Continuar sin peluche", description: "Pasa directamente al siguiente paso sin recargo adicional.", price: 0, none: true, noneTitle: "Prefiero sin peluche", noneText: "Dedicaremos más espacio a las flores y los dulces finos", icon: "bi-slash-circle" }
    ],

    flowers: [
      { id: "rosa-pastel", name: "Ramillete de Rosas Rosa Pastel", description: "6 rosas importadas acompañadas de eucalipto baby blue.", price: 35000, image: E + "bouquet-crea-1.jpg", badge: "Más elegido", tag: "Rosas eternas", short: "Rosas Rosa Pastel" },
      { id: "silvestre", name: "Bouquet Silvestre Eucalipto & Gypsophila", description: "Texturas orgánicas y silvestres que duran semanas intactas.", price: 28000, image: E + "bouquet-crea-2.jpg", tag: "Bouquet silvestre", short: "Bouquet Silvestre" },
      { id: "borgona", name: "Rosas Borgoña Imperial", description: "Rosas tono vino profundo aterciopelado de exportación.", price: 42000, image: C + "bouquet-rosas-premium.jpg", badge: "Edición Lujo", tag: "Rosas eternas", short: "Rosas Borgoña" },
      { id: "sin-flores", name: "Continuar sin arreglo floral", description: "Pasa directamente al siguiente paso sin recargo adicional.", price: 0, none: true, noneTitle: "Prefiero sin flores", noneText: "Dedicaremos más espacio interior a los dulces finos", icon: "bi-slash-circle" }
    ],

    sweets: [
      { id: "bombones-rosa", name: "Caja Dulce Tentación — 9 Bombones", description: "Bombones belgas rellenos de avellana y maracuyá.", price: 28000, image: C + "bombones-rosa.jpg", badge: "Más elegido", short: "9 Bombones Belgas" },
      { id: "trufas", name: "Trufas de Autor x8", description: "Trufas de cacao puro con polvo de oro comestible.", price: 18000, image: C + "cofre-gran-reserva.jpg", short: "Trufas de Autor" },
      { id: "bombones-navy", name: "Estuche Premium 16 Bombones", description: "Selección surtida en estuche azul noche.", price: 45000, image: C + "bombones-navy.jpg", badge: "Edición Lujo", short: "Estuche 16 Bombones" },
      { id: "sin-dulces", name: "Continuar sin dulces", description: "Pasa directamente al siguiente paso sin recargo adicional.", price: 0, none: true, noneTitle: "Prefiero sin dulces", noneText: "Tu regalo se centrará en las flores y el peluche", icon: "bi-slash-circle" }
    ],

    phrases: ["Con todo mi amor", "Feliz cumpleaños", "Gracias por todo", "Felices por siempre"],
    signatures: [
      { id: "nombre", label: "Firmar con mi nombre" },
      { id: "secreto", label: "Enviar como admirador/a secreto" }
    ],
    messageMaxLength: 200,
    preview: C + "caja-sombrerera-osito.jpg"
  };

  window.TIMOTEO_DATA = window.TIMOTEO_DATA || {};
  window.TIMOTEO_DATA.customizer = customizer;
})();
