/**
 * Catálogo de productos (datos de demostración tomados del diseño de Stitch).
 *
 * Esta es la única fuente de productos del frontend. Ninguna página ni
 * componente lee este arreglo directamente: todo pasa por productService.
 * Cuando exista el backend Django, este archivo se reemplaza por una
 * llamada a la API (ej. GET /api/products/) sin tocar las páginas.
 *
 * Precios en pesos colombianos (COP), enteros.
 * rating / reviews: valores de ejemplo para la demo; el backend los
 * entregará a partir de reseñas reales.
 */
(function () {
  "use strict";

  const C = "assets/images/catalog/";
  const OLD = "assets/images/products/";

  function p(id, slug, name, category, collection, price, image, extra) {
    return Object.assign(
      {
        id,
        slug,
        name,
        shortName: name,
        category,
        collection,
        price,
        image: C + image + ".jpg",
        images: [C + image + ".jpg"],
        badge: "",
        shortDescription: "",
        description: "",
        rating: 4.9,
        reviews: 24,
        featured: false,
        isNew: false,
        occasions: []
      },
      extra || {}
    );
  }

  const products = [
    p(1, "osito-teddy-con-rosas-rojas", "Osito Teddy con rosas rojas", "peluches", "Peluches & Flores", 85000, "osito-rosas-rojas", {
      shortName: "Osito Teddy con rosas",
      badge: "Más vendido",
      shortDescription: "Incluye tarjeta con caligrafía a mano y empaque de regalo.",
      description:
        "Oso de peluche artesanal hipoalergénico de 35 cm acompañado por 12 rosas seleccionadas en base cilíndrica de cartón rígido. Incluye tarjeta con caligrafía a mano y empaque de regalo.",
      rating: 4.9, reviews: 96, featured: true,
      occasions: ["cumpleanos", "amor-amistad", "aniversario"]
    }),
    p(2, "bouquet-rosas-premium", "Bouquet Rosas Premium", "flores", "Floristería de Autor", 95000, "bouquet-rosas-premium", {
      badge: "Edición limitada",
      shortDescription: "18 tallos frescos seleccionados a mano.",
      description:
        "18 tallos frescos seleccionados a mano, envueltos en papel artesanal con lazo de satín. Un detalle para esa persona importante.",
      rating: 4.8, reviews: 61, featured: true,
      occasions: ["amor-amistad", "aniversario", "para-mama"]
    }),
    p(3, "caja-dulce-tentacion", "Caja Dulce Tentación", "chocolates", "Chocolatería Fina", 45000, "caja-dulce-tentacion", {
      shortName: "Caja de chocolates",
      badge: "Artesanal",
      cart: { name: "Caja Dulce Tentación — 16 Bombones Belgas", mdesc: "16 bombones belgas surtidos", desc: "Rellenos de avellana crocante, maracuyá trufado y ganache de café arábica.", coll: "" },
      shortDescription: "16 bombones belgas rellenos de avellana, maracuyá y café.",
      description:
        "16 bombones belgas artesanales rellenos de avellana crocante, maracuyá trufado y ganache de café arábica. Presentados en caja rígida lista para regalar.",
      rating: 4.9, reviews: 54, featured: true,
      occasions: ["cumpleanos", "amor-amistad", "para-amigo"]
    }),
    p(4, "reloj-minimal-gold", "Reloj Minimal Gold", "relojes", "Accesorios & Joyas", 120000, "reloj-minimal-gold", {
      shortName: "Reloj elegante",
      shortDescription: "Acero inoxidable con correa de cuero crema.",
      description:
        "Reloj minimalista en acero inoxidable dorado con correa de cuero crema. Mecanismo de cuarzo japonés y cristal resistente a rayones.",
      rating: 4.8, reviews: 33, featured: true,
      occasions: ["aniversario", "cumpleanos", "para-amigo"]
    }),
    p(5, "cesta-celebracion-gourmet", "Cesta Celebración Gourmet", "regalos", "Cestas & Experiencias", 145000, "cesta-celebracion", {
      badge: "Más vendido",
      shortDescription: "Vino espumoso, macarons y bombones en canasta tejida.",
      description:
        "Canasta tejida artesanal con osito café claro, 12 trufas belgas de chocolate y media botella de espumante rosado. La celebración perfecta.",
      rating: 4.9, reviews: 47,
      occasions: ["cumpleanos", "aniversario", "ocasiones-especiales"]
    }),
    p(6, "peluche-conejito-cloud", "Peluche Conejito Cloud", "peluches", "Peluches Tiernos", 62000, "conejo-cloud", {
      badge: "Hipoalergénico",
      shortDescription: "Hipoalergénico, textura ultra suave.",
      description:
        "Fibra antialérgica con tacto de nube. Un abrazo reconfortante diseñado para perdurar por años intacto.",
      rating: 4.9, reviews: 28,
      occasions: ["cumpleanos", "para-amigo"]
    }),
    p(7, "vela-aromatica-vainilla-francesa", "Vela Aromática Vainilla Francesa", "regalos", "Hogar & Calma", 38000, "vela-vainilla", {
      badge: "Artesanal",
      shortDescription: "Cera de soja 100% natural, 45 horas de duración.",
      description: "Vela de cera de soja 100% natural con aroma a vainilla y bergamota. 45 horas de combustión limpia.",
      rating: 4.7, reviews: 19,
      occasions: ["para-mama", "para-amigo", "cumpleanos"]
    }),
    p(8, "cupula-rosa-eterna", "Cúpula Rosa Eterna", "flores", "Rosas Preservadas", 110000, "cupula-rosa-eterna", {
      badge: "Edición limitada",
      shortDescription: "Rosa natural tratada, intacta por años.",
      description:
        "Rosa natural liofilizada con base de madera noble, luces micro-led cálidas y estuche de regalo. Dura hasta 3 años.",
      rating: 5.0, reviews: 40,
      occasions: ["amor-amistad", "aniversario", "ocasiones-especiales"]
    }),
    p(9, "bouquet-rosas-premium-osito-teddy", "Bouquet Rosas Premium & Osito Teddy", "flores", "Flores & Peluches", 115000, "bouquet-osito", {
      oldPrice: 135000,
      badge: "Edición Amor",
      cart: { badge: "Top Ventas", mdesc: "12 Rosas naturales + Peluche 25cm", desc: "Rosas importadas seleccionadas, peluche suave al tacto de 22cm y lazo bordado.", coll: "Colección Amor" },
      shortDescription: "18 rosas frescas seleccionadas con floristería artesanal y suave peluche importado de 25 cm.",
      description:
        "Un arreglo artesanal de 24 rosas seleccionadas a mano, acompañado de nuestro suave osito Teddy con pajarita de satén borgoña. Diseñado para decir lo que las palabras no alcanzan.",
      images: [C + "bouquet-osito.jpg", C + "petalos-rocio.jpg", C + "osito-retrato.jpg", C + "rosas-caja.jpg", C + "desayuno-cama.jpg"],
      rating: 4.9, reviews: 128, featured: true,
      occasions: ["amor-amistad", "aniversario", "cumpleanos"],
      presentations: [
        { key: "clasico", name: "Clásico", detail: "12 rosas rojas frescas + Osito 22cm", price: 85000 },
        { key: "premium", name: "Premium", detail: "24 rosas + Osito 30cm con lazo de satén", price: 115000, tag: "Favorito" },
        { key: "imperial", name: "Imperial Deluxe", detail: "36 rosas + Osito 35cm + 6 bombones belgas", price: 158000 }
      ]
    }),
    p(10, "caja-sombrerera-osito-miel-rosas", "Caja Sombrerera con Osito Miel y Rosas", "regalos", "Cajas de Autor", 100000, "caja-sombrerera-osito", {
      badge: "Bespoke",
      cart: { desc: "Empaque rígido en relieve perla, tarjeta personalizada y flores preservadas.", chip: "Creado a mano", coll: "Taller Timoteo", collTone: "warm" },
      shortDescription: "Elegante sombrerera rígida crema con tapa dorada, flores de temporada y osito premium.",
      description:
        "Diseño exclusivo con caja rígida empastada a mano, rosas premium en degradé rubí y osito de tacto ultrasuave. Empaque rígido en relieve perla, tarjeta personalizada y flores preservadas.",
      rating: 4.9, reviews: 35, featured: true,
      occasions: ["amor-amistad", "aniversario", "cumpleanos"]
    }),
    p(11, "oso-teddy-mini-mono-seda", "Oso Teddy Mini & Moño de Seda", "peluches", "Detalles Compactos", 45000, "osito-mini", {
      badge: "Compacto",
      shortDescription: "El complemento perfecto para añadir a cualquier ramo o caja de bombones. Tamaño de 18cm.",
      description: "Osito tejido de 18 cm con moño de seda y etiqueta Timoteo. El complemento perfecto para añadir a cualquier ramo o caja de bombones.",
      rating: 4.8, reviews: 22,
      occasions: ["cumpleanos", "para-amigo", "amor-amistad"]
    }),
    p(12, "globo-metalizado-te-amo", "Globo Metálico 'Te Amo'", "regalos", "Complementos", 12000, "globo-te-amo", {
      shortDescription: "Inflado con helio puro",
      description: "Globo metalizado en corazón oro rosa con cinta de satén, inflado con helio puro.",
      occasions: ["amor-amistad", "aniversario"]
    }),
    p(13, "vela-vainilla-francesa", "Vela Vainilla Francesa", "regalos", "Complementos", 16500, "vela-mini", {
      shortDescription: "Cera de soja 100% natural",
      description: "Vela pequeña de cera de soja natural con aroma a vainilla francesa.",
      occasions: ["para-mama", "para-amigo"]
    }),
    p(14, "tarjeta-lacrada-oro", "Tarjeta Lacrada en Oro", "regalos", "Complementos", 5000, "tarjeta-lacrada", {
      badge: "Popular",
      shortDescription: "Sello de cera vegetal",
      description: "Tarjeta de papel de algodón con sello de cera vegetal dorada, lista para tu dedicatoria.",
      occasions: ["amor-amistad", "aniversario", "cumpleanos"]
    }),
    p(15, "bouquet-velour-borgona", "Bouquet Velour Borgoña", "flores", "Floristería de Autor", 115000, "bouquet-velour", {
      badge: "Nuevo", isNew: true, novTag: ["star", "Exclusivo de Temporada"],
      novDesc: "18 rosas inglesas en tono borgoña profundo, eucalipto plateado y moño de raso satinado doble capa.",
      shortDescription: "18 rosas inglesas en tono borgoña profundo, eucalipto plateado y moño de raso satinado doble cara.",
      description: "18 rosas inglesas en tono borgoña profundo, eucalipto plateado y moño de raso satinado doble cara.",
      occasions: ["amor-amistad", "aniversario"]
    }),
    p(16, "bouquet-peonias-silvestres", "Bouquet Peonías Silvestres", "flores", "Floristería de Autor", 130000, "bouquet-peonias", {
      badge: "Edición limitada", isNew: true, novTag: ["fire", "Lanzamiento Reciente"],
      shortDescription: "Mezcla sutil de peonías importadas en rosa pálido, hortensias secas y follaje aromático de temporada.",
      description: "Mezcla sutil de peonías importadas en rosa pálido, hortensias secas y follaje aromático de temporada.",
      occasions: ["para-mama", "cumpleanos"]
    }),
    p(17, "arreglo-serena-ceramica", "Arreglo Serena en Cerámica", "flores", "Floristería de Autor", 145000, "arreglo-serena", {
      badge: "Nuevo", isNew: true, novTag: ["leaf", "Incluye Jarrón Artesanal"],
      shortDescription: "Lirios orientales, rosas de jardín y toques de lavanda en jarrón esmaltado a mano color arena natural.",
      description: "Lirios orientales, rosas de jardín y toques de lavanda en jarrón esmaltado a mano color arena natural.",
      occasions: ["para-mama", "ocasiones-especiales"]
    }),
    p(18, "oso-oliver-sueter", "Oso Oliver con Suéter", "peluches", "Peluches de Colección", 89000, "oso-oliver", {
      badge: "Nuevo", isNew: true,
      novDesc: "35 cm de suavidad premium hipoalergénica con bufanda tejida a mano.",
      shortDescription: "35 cm de suavidad premium con bufanda tejida a mano.",
      description: "35 cm de suavidad hipoalergénica con suéter de punto y bufanda tejida a mano.",
      occasions: ["cumpleanos", "para-amigo"]
    }),
    p(19, "caja-bombones-deseo", "Caja Bombones 'Deseo'", "chocolates", "Chocolatería de Autor", 48000, "bombones-deseo", {
      badge: "Nuevo", isNew: true,
      shortDescription: "16 piezas artesanales rellenas de ganache de avellana, café y frutos rojos.",
      description: "16 piezas artesanales rellenas de ganache de avellana, café y frutos rojos, en estuche de terciopelo verde.",
      occasions: ["amor-amistad", "aniversario"]
    }),
    p(20, "reloj-rose-minimalist", "Reloj Rose Minimalist", "relojes", "Relojería Fina", 125000, "reloj-rose", {
      badge: "Nuevo", isNew: true,
      shortDescription: "Movimiento de cuarzo japonés, correa de cuero genuino y esfera en oro rosa mate.",
      description: "Movimiento de cuarzo japonés, correa de cuero genuino y esfera en oro rosa mate.",
      occasions: ["aniversario", "cumpleanos"]
    }),
    p(21, "vela-higo-rosa", "Vela 'Higo & Rosa'", "regalos", "Velas Aromáticas", 36000, "vela-higo-rosa", {
      badge: "Nuevo", isNew: true, novName: "Vela Botánica 'Higo & Rosa'",
      novDesc: "Cera de soja 100% natural, pabilo de madera crepitante y 45 horas de combustión limpia.",
      shortDescription: "Cera de soja 100% natural, pabilo de madera y 45 horas de combustión limpia.",
      description: "Cera de soja 100% natural, pabilo de madera crepitante y 45 horas de combustión limpia.",
      occasions: ["para-mama", "para-amigo"]
    }),
    p(22, "caja-bombones-belgas-autor", "Caja Bombones Belgas de Autor", "chocolates", "Chocolatería de Autor", 75000, "bombones-belgas-autor", {
      shortDescription: "16 unidades artesanales de cacao puro",
      description: "16 unidades artesanales de cacao puro en estuche burgundy con lazo de satén.",
      occasions: ["aniversario", "amor-amistad"]
    }),
    p(23, "cofre-bombones-gran-reserva", "Cofre Bombones Gran Reserva", "chocolates", "Dulces Placeres", 24900, "cofre-gran-reserva", {
      shortDescription: "Cofre dorado con bombones de cacao oscuro y leche.",
      description: "Cofre dorado con bombones artesanales de chocolate oscuro y con leche.",
      occasions: ["cumpleanos", "para-amigo"]
    }),
    p(24, "espumante-rose-brut-copas", "Espumante Rosé Brut & Copas", "regalos", "Brindis", 32000, "espumante-rose", {
      shortDescription: "Espumante rosé en cubo de hielo con copas de cristal.",
      description: "Espumante rosé brut servido con cubo de plata y dos copas de cristal.",
      occasions: ["aniversario", "ocasiones-especiales"]
    }),
    p(25, "conejo-vintage-lazo-blush", "Conejo Vintage Lazo Blush", "peluches", "Peluches Exclusivos", 28900, "conejo-vintage", {
      shortDescription: "Conejo de peluche beige con lazo rosa blush.",
      description: "Conejo de peluche beige extra suave con lazo rosa blush.",
      occasions: ["cumpleanos", "para-amigo"]
    }),
    p(26, "reloj-clasico-cuero-beige", "Reloj Clásico Cuero Beige", "relojes", "Accesorios & Joyas", 98000, "reloj-cojin", {
      shortDescription: "Esfera dorada minimalista con correa de cuero beige.",
      description: "Esfera dorada minimalista con correa de cuero beige. Presentado sobre cojín de lino.",
      occasions: ["aniversario", "para-mama"]
    }),
    p(27, "caja-regalo-azul-noche", "Caja de Regalo Azul Noche", "regalos", "Cajas de Autor", 68000, "caja-regalo-azul", {
      shortDescription: "Caja rígida azul con lazo de satén dorado.",
      description: "Caja rígida azul noche con lazo de satén dorado, lista para regalar.",
      occasions: ["cumpleanos", "ocasiones-especiales"]
    }),
    p(28, "osito-teddy-lazo-azul", "Osito Teddy con Lazo Azul", "peluches", "Peluches de Colección", 78000, "osito-lazo-azul", {
      shortDescription: "Osito clásico color miel con lazo azul marino.",
      description: "Osito clásico color miel con lazo azul marino y etiqueta artesanal.",
      occasions: ["cumpleanos", "para-amigo"]
    }),
    p(29, "osito-corazon-rosas", "Osito Corazón de Rosas", "peluches", "Peluches & Flores", 92000, "osito-corazon", {
      shortDescription: "Osito de tacto suave sosteniendo un pequeño ramo de rosas rojas.",
      description: "Osito de tacto suave sosteniendo un pequeño ramo de rosas rojas de terciopelo.",
      occasions: ["amor-amistad", "aniversario"]
    }),
    p(30, "jarron-rosas-rojas-rosadas", "Jarrón Rosas Rojas y Rosadas", "flores", "Floristería de Autor", 135000, "bouquet-jarron", {
      shortDescription: "Jarrón de vidrio con rosas rojas y rosadas y lazo de satén.",
      description: "Jarrón de vidrio con rosas rojas y rosadas, follaje seleccionado y lazo de satén borgoña.",
      occasions: ["para-mama", "aniversario"]
    }),
    p(34, "la-caja-memoria", "La Caja Memoria", "regalos", "Cápsula de Temporada • N° 01", 189000, "caja-memoria", {
      badge: "Edición numerada",
      shortDescription: "Caja forrada en tela aterciopelada con bombones, arreglo preservado y carta sellada a fuego.",
      description: "Diseñada para ocasiones irrepetibles: caja forrada en tela aterciopelada, bombones de maracuyá y pistacho, un arreglo preservado que dura más de un año y una carta sellada a fuego.",
      rating: 5.0, reviews: 18,
      occasions: ["aniversario", "amor-amistad", "ocasiones-especiales"]
    }),
    p(31, "carro-de-coleccion", "Carro de colección", "juguetes", "Juguetes de Colección", 55000, "../products/carro-coleccion", {
      shortDescription: "Modelo a escala en acabado brillante.",
      description: "Modelo a escala en acabado brillante, ideal para coleccionistas.",
      occasions: ["cumpleanos", "para-amigo"]
    }),
    p(32, "set-didactico-de-madera", "Set didáctico de madera", "juguetes", "Juguetes Didácticos", 49000, "../products/juego-didactico", {
      shortDescription: "Juego de madera para estimular la creatividad.",
      description: "Juego de madera natural para estimular la creatividad y la motricidad.",
      occasions: ["cumpleanos"]
    }),
    p(33, "mini-clasico", "Mini clásico", "juguetes", "Juguetes de Colección", 38000, "../products/mini-clasico", {
      shortDescription: "Auto miniatura clásico.",
      description: "Auto miniatura clásico con detalles pintados a mano.",
      occasions: ["cumpleanos", "para-amigo"]
    })
  ];

  // Destinatarios para los filtros rápidos del catálogo
  const RECIPIENTS = {
    peluches: ["ella", "ninos"],
    flores: ["ella"],
    chocolates: ["ella", "el"],
    regalos: ["ella", "el"],
    relojes: ["el", "ella"],
    juguetes: ["ninos"]
  };
  products.forEach((prod) => {
    prod.recipients = RECIPIENTS[prod.category] || [];
  });

  // Los tres productos de la categoría Juguetes conservan sus fotografías originales.
  products.forEach((prod) => {
    if (prod.image.indexOf("/../products/") !== -1) {
      prod.image = prod.image.replace("assets/images/catalog/../products/", OLD);
      prod.images = [prod.image];
    }
  });

  window.TIMOTEO_DATA = window.TIMOTEO_DATA || {};
  window.TIMOTEO_DATA.products = products;

  // Complementos opcionales del detalle de producto ("Complementos para una sorpresa inolvidable")
  window.TIMOTEO_DATA.addons = [
    { key: "globo", name: "Globo metálico helio personalizado (“Te Amo”)", price: 12000 },
    { key: "trufas", name: "Caja de 8 trufas belgas artesanales", price: 18000 },
    { key: "luces", name: "Guirnalda de micro luces LED cálidas", price: 8000 }
  ];
})();
