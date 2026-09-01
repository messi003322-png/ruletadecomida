/**
 * Reescritura de calidad: cuerpos únicos por ciudad + comida + momento + modificador.
 * Reduce thin content y solapamiento entre páginas programáticas.
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const SITE = 'https://www.ruletadecomida.es';

const MOMENTS = {
  desayuno: { label: 'desayuno', verb: 'desayunar', when: 'por la mañana', energy: 'empezar el día' },
  almuerzo: { label: 'almuerzo', verb: 'almorzar', when: 'al mediodía', energy: 'recuperar energías' },
  merienda: { label: 'merienda', verb: 'merendar', when: 'por la tarde', energy: 'un pico entre horas' },
  cena: { label: 'cena', verb: 'cenar', when: 'por la noche', energy: 'cerrar el día' },
  brunch: { label: 'brunch', verb: 'hacer brunch', when: 'a media mañana o mediodía de finde', energy: 'un plan más tranquilo' },
  'media-manana': { label: 'media mañana', verb: 'tomar algo a media mañana', when: 'entre desayuno y almuerzo', energy: 'mantener el ritmo' },
  noche: { label: 'noche', verb: 'comer de noche', when: 'a última hora', energy: 'algo ligero o reconfortante' }
};

const MODS = {
  barato: {
    label: 'barato',
    focus: 'gastar poco sin quedarte con hambre',
    tips: [
      'Compara el precio final con la ración real, no solo el precio de carta.',
      'Evita extras que disparan la cuenta (bebidas, salsas, suplementos).',
      'Si el mínimo de pedido + envío es alto, a veces sale mejor una opción casera.'
    ]
  },
  cerca: {
    label: 'cerca',
    focus: 'priorizar distancia y tiempo de llegada',
    tips: [
      'Mide el tiempo total: desplazamiento + espera + comer.',
      'Si tienes poco margen, cercanía gana a la “mejor nota” del mapa.',
      'Revisa horario real de apertura en el momento que vas a ir o pedir.'
    ]
  },
  'calidad-precio': {
    label: 'calidad-precio',
    focus: 'equilibrar sabor, cantidad y coste',
    tips: [
      'Una nota alta no basta: mira comentarios sobre cantidad y repetición.',
      'Compara qué incluye el plato (guarnición, pan, bebida).',
      'Si pagas un poco más pero evitas pedir un segundo plato, puede salir a cuenta.'
    ]
  },
  rapido: {
    label: 'rápido',
    focus: 'minimizar minutos hasta sentarte a comer',
    tips: [
      'Elige preparaciones simples o sitios con rotación alta.',
      'Evita horarios punta si puedes; el mismo plato tarda el doble.',
      'Ten un plan B de 10 minutos por si el primero falla.'
    ]
  },
  delivery: {
    label: 'a domicilio',
    focus: 'pedir sin salir y controlar tiempos de reparto',
    tips: [
      'Revisa mínimo de pedido, envío y tiempo estimado real.',
      'En días de lluvia o finde, suma margen al tiempo que pone la app.',
      'Si el envío es caro, valora recoger o cocinar algo sencillo.'
    ]
  },
  saludable: {
    label: 'saludable',
    focus: 'equilibrar el plato sin complicarte',
    tips: [
      'Prioriza proteína + vegetal + hidrato en proporción razonable.',
      'Pide salsas aparte si sueles pasarte con el aliño.',
      'Una versión “ligera” no tiene que ser aburrida: cambia el método, no solo quita ingredientes.'
    ]
  },
  para-llevar: {
    label: 'para llevar',
    focus: 'que viaje bien y se pueda comer fuera',
    tips: [
      'Evita platos que se desmontan o se enfrían mal.',
      'Elige envases que no empapen el pan o la base.',
      'Si comes en el trabajo, prioriza algo que no necesite cubiertos especiales.'
    ]
  }
};

const CITY = {
  madrid: {
    name: 'Madrid',
    vibe: 'oferta enorme y horarios largos',
    tip: 'En hora punta el delivery se retrasa: si tienes prisa, prioriza cercanía o cocina rápida.',
    zones: 'Malasaña, Lavapiés, Chamberí y centros bien comunicados concentran mucha oferta.'
  },
  barcelona: {
    name: 'Barcelona',
    vibe: 'cocina mediterránea y propuestas internacionales',
    tip: 'El centro y Eixample tienen de todo; si buscas precio, mira un poco más afuera del turístico.',
    zones: 'Gràcia, Poblenou y alrededores del Eixample suelen equilibrar ambiente y opciones.'
  },
  valencia: {
    name: 'Valencia',
    vibe: 'arroz, producto fresco y ritmo mediterráneo',
    tip: 'En verano apetece más lo frío y ligero; en invierno gana lo reconfortante.',
    zones: 'Centro, Ruzafa y zonas universitarias tienen mucha rotación de locales.'
  },
  sevilla: {
    name: 'Sevilla',
    vibe: 'cocina andaluza, tapas y calor que marca el ritmo',
    tip: 'Con calor, prioriza sitios con sombra/AC o platos menos pesados al mediodía.',
    zones: 'Centro y Triana concentran opciones; en barrios residenciales gana el delivery cercano.'
  },
  bilbao: {
    name: 'Bilbao',
    vibe: 'cocina vasca y tradición de pintxos',
    tip: 'Si sales, mira horarios reales: algunos sitios cierran entre servicios.',
    zones: 'Casco Viejo e Indautxu suelen tener buena densidad de opciones.'
  },
  malaga: {
    name: 'Málaga',
    vibe: 'pescado, fritura y cocina de sol',
    tip: 'En temporada alta el centro se llena: reserva o elige barrios contiguos.',
    zones: 'Centro histórico y zonas de playa cambian mucho el tipo de oferta.'
  },
  zaragoza: {
    name: 'Zaragoza',
    vibe: 'cocina aragonesa y opciones prácticas de día a día',
    tip: 'Para comer rápido en laborable, prioriza cercanía al trabajo o casa.',
    zones: 'Centro y Delicias concentran buena parte de la oferta cotidiana.'
  },
  murcia: {
    name: 'Murcia',
    vibe: 'producto de huerta y cocina local',
    tip: 'Aprovecha temporada de verdura si buscas platos frescos y razonables.',
    zones: 'Centro y ensanches con buena densidad de locales de diario.'
  },
  granada: {
    name: 'Granada',
    vibe: 'tapas y ambiente universitario',
    tip: 'En zonas muy turísticas compara precio y ración antes de sentarte.',
    zones: 'Centro y Realejo tienen mucho movimiento; en barrios gana lo de diario.'
  },
  alicante: {
    name: 'Alicante',
    vibe: 'mediterráneo, arroz y opciones de costa',
    tip: 'En verano el timing cambia: evita picos de terraza si vas justo de tiempo.',
    zones: 'Centro y zona de playa ofrecen perfiles muy distintos de carta.'
  }
};

const FOOD = {
  'pizza-de-sarten': {
    name: 'Pizza de sartén',
    kind: 'masa rápida hecha en sartén',
    look: 'base bien hecha, queso fundido y toppings sin pasarse de grasa',
    time: '15–25 min en casa; delivery según zona',
    budget: '€–€€',
    tip: 'Si la haces en casa, no sobrecargues de salsa: la base se empapa.'
  },
  pizza: {
    name: 'Pizza',
    kind: 'plato compartible o individual muy versátil',
    look: 'horno correcto, masa con punto y queso de verdad',
    time: '20–35 min típico en local o delivery',
    budget: '€–€€',
    tip: 'Compara tamaño real de la base: el precio engaña si la pizza es mini.'
  },
  'tortilla-de-patatas': {
    name: 'Tortilla de patatas',
    kind: 'clásico de huevo y patata',
    look: 'punto jugoso o cuajado según gusto; aceite de calidad',
    time: '30–45 min casera; más rápida si ya está hecha',
    budget: '€',
    tip: 'Pregunta el punto: jugosa vs cuajada cambia por completo el plato.'
  },
  'yogur-con-fruta': {
    name: 'Yogur con fruta',
    kind: 'opción ligera y rápida',
    look: 'yogur natural o griego + fruta de verdad (no solo sirope)',
    time: '5–10 min',
    budget: '€',
    tip: 'Si quieres más saciedad, añade frutos secos o avena.'
  },
  'pollo-a-la-plancha': {
    name: 'Pollo a la plancha',
    kind: 'proteína simple y adaptable',
    look: 'no reseco, bien sazonado, con guarnición real',
    time: '15–25 min',
    budget: '€€',
    tip: 'La diferencia está en el acompañamiento: ensalada o arroz cambian el resultado.'
  },
  sushi: {
    name: 'Sushi',
    kind: 'pescado/arroz en formato rolls o nigiri',
    look: 'arroz en su punto, pescado fresco, wasabi y soja con sentido',
    time: '25–40 min delivery frecuente',
    budget: '€€–€€€',
    tip: 'Mira reseñas recientes de frescura; el sushi antiguo se nota enseguida.'
  },
  hamburguesa: {
    name: 'Hamburguesa',
    kind: 'carne (o alternativa) en pan',
    look: 'punto de la carne, pan que aguante, no solo salsa',
    time: '15–25 min',
    budget: '€–€€',
    tip: 'Si es “barata”, confirma tamaño del burger y si incluye patatas.'
  },
  'crema-de-calabaza': {
    name: 'Crema de calabaza',
    kind: 'sopa/crema reconfortante',
    look: 'textura fina, sabor a calabaza de verdad, no solo nata',
    time: '25–40 min',
    budget: '€',
    tip: 'Pide o prepara un topping (semillas, croutons) si la quieres más completa.'
  },
  'batido-de-platano': {
    name: 'Batido de plátano',
    kind: 'bebida-merienda saciante',
    look: 'plátano real, densidad buena, sin exceso de azúcar añadido',
    time: '5–10 min',
    budget: '€',
    tip: 'Si lo usas como merienda, suma proteína (yogur o leche) para que aguante más.'
  },
  'pasta-al-pesto': {
    name: 'Pasta al pesto',
    kind: 'pasta rápida con salsa de albahaca',
    look: 'pesto aromático, pasta al dente, queso al gusto',
    time: '15–20 min',
    budget: '€–€€',
    tip: 'Reserva un poco de agua de cocción: ayuda a ligar la salsa.'
  },
  ramen: {
    name: 'Ramen',
    kind: 'caldo + fideos + toppings',
    look: 'caldo con cuerpo, huevo y toppings que aporten',
    time: '20–35 min',
    budget: '€€',
    tip: 'En delivery el huevo y las verduras marcan si llega en buen estado.'
  }
};

function pretty(slug) {
  return String(slug || '')
    .split('-')
    .filter(Boolean)
    .map((x) => (x[0] ? x[0].toUpperCase() + x.slice(1) : x))
    .join(' ');
}
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
function pick(arr, seed) {
  return arr[seed % arr.length];
}
function cityInfo(slug) {
  if (CITY[slug]) return CITY[slug];
  return {
    name: pretty(slug),
    vibe: 'oferta local de diario y opciones de pedir a domicilio',
    tip: 'Prioriza tiempo total (llegar + esperar) y reseñas recientes, no solo la nota media.',
    zones: 'Revisa zonas cercanas a ti: la mejor opción suele ser la que llega a tiempo.'
  };
}
function foodInfo(slug) {
  if (FOOD[slug]) return FOOD[slug];
  const name = pretty(slug);
  return {
    name,
    kind: `opción de ${name.toLowerCase()} adaptable al momento del día`,
    look: 'ingredientes claros, ración suficiente y preparación cuidada',
    time: '15–30 min orientativos',
    budget: '€–€€',
    tip: `Adapta ${name.toLowerCase()} a tu hambre: ración simple si vas justo, más completa si es comida principal.`
  };
}

function parseFile(file) {
  const rel = path.relative(DIST, file).replace(/\\/g, '/');
  const p = rel.split('/');
  // comer/city/moment/food/mod/index.html
  if (p[0] === 'comer' && p.length >= 6 && p[p.length - 1] === 'index.html') {
    return {
      type: 'modifier',
      city: p[1],
      moment: p[2],
      food: p[3],
      mod: p[4],
      rel
    };
  }
  // city/moment/food/index.html
  if (p.length === 4 && p[3] === 'index.html' && MOMENTS[p[1]]) {
    return { type: 'guide', city: p[0], moment: p[1], food: p[2], rel };
  }
  // city/moment/index.html
  if (p.length === 3 && p[2] === 'index.html' && MOMENTS[p[1]]) {
    return { type: 'moment', city: p[0], moment: p[1], rel };
  }
  // city/index.html
  if (p.length === 2 && p[1] === 'index.html') {
    return { type: 'city', city: p[0], rel };
  }
  return null;
}

function blockGuide(ctx) {
  const c = cityInfo(ctx.city);
  const f = foodInfo(ctx.food);
  const m = MOMENTS[ctx.moment] || { label: ctx.moment, verb: 'comer', when: 'hoy', energy: 'decidir sin rodeos' };
  const seed = hash(ctx.city + '|' + ctx.moment + '|' + ctx.food);
  const angles = [
    `Si ${m.verb} en ${c.name} y te apetece ${f.name.toLowerCase()}, empieza por el resultado que quieres: ligero, completo o solo “quitar el hambre”.`,
    `En ${c.name}, ${f.name.toLowerCase()} para ${m.label} funciona cuando encaja con tu tiempo real, no con el tiempo ideal de una receta.`,
    `Para ${m.verb} con ${f.name.toLowerCase()} en ${c.name}, el criterio útil es tiempo total + ración + precio final.`
  ];
  const decisions = [
    `Define en 20 segundos: ¿cuántos minutos tienes y cuánto quieres gastar?`,
    `Elige solo dos alternativas (esta y un plan B). Más opciones suelen empeorar la decisión.`,
    `Si dudas entre local, delivery o casa, gana la opción que llega antes sin estropearse.`
  ];
  const local = [
    `${c.name} ${c.vibe}. ${c.tip}`,
    `${c.zones}`,
    `Para ${m.label}, en ${c.name} suele pesar más el horario y la distancia que una carta interminable.`
  ];

  return `
<section class="rf-q" id="rf-quality-content" data-rf-quality="guide">
  <h2>Cómo elegir ${esc(f.name)} para ${esc(m.verb)} en ${esc(c.name)}</h2>
  <p>${esc(pick(angles, seed))}</p>
  <p><strong>Qué es:</strong> ${esc(f.kind)}. <strong>Qué mirar:</strong> ${esc(f.look)}.</p>
  <p><strong>Tiempo orientativo:</strong> ${esc(f.time)}. <strong>Presupuesto:</strong> ${esc(f.budget)}.</p>
  <h3>${esc(c.name)} y el momento (${esc(m.label)})</h3>
  <p>${esc(pick(local, seed + 1))}</p>
  <p>${esc(m.when.charAt(0).toUpperCase() + m.when.slice(1))} conviene pensar en ${esc(m.energy)}: ${esc(f.tip)}</p>
  <h3>Checklist rápido antes de decidir</h3>
  <ol>
    <li>${esc(pick(decisions, seed))}</li>
    <li>${esc(pick(decisions, seed + 1))}</li>
    <li>${esc(pick(decisions, seed + 2))}</li>
  </ol>
  <h3>Si esta no encaja</h3>
  <p>Vuelve a la guía de <a href="${SITE}/${ctx.city}/${ctx.moment}/">${esc(m.label)} en ${esc(c.name)}</a> o <a href="${SITE}/#ruleta">gira la ruleta</a> y quédate con la primera opción razonable.</p>
</section>`;
}

function blockModifier(ctx) {
  const c = cityInfo(ctx.city);
  const f = foodInfo(ctx.food);
  const m = MOMENTS[ctx.moment] || { label: ctx.moment, verb: 'comer', when: 'hoy', energy: 'decidir' };
  const mod = MODS[ctx.mod] || {
    label: pretty(ctx.mod),
    focus: 'acotar la búsqueda a un criterio concreto',
    tips: [
      'Aplica un solo filtro principal para no bloquearte.',
      'Compara dos opciones como máximo.',
      'Revisa horario y tiempo total antes de confirmar.'
    ]
  };
  const seed = hash(ctx.city + ctx.moment + ctx.food + ctx.mod);

  return `
<section class="rf-q" id="rf-quality-content" data-rf-quality="modifier">
  <h2>${esc(f.name)} ${esc(mod.label)} para ${esc(m.verb)} en ${esc(c.name)}</h2>
  <p>Esta página no es una lista genérica: está enfocada a <strong>${esc(mod.focus)}</strong> cuando quieres ${esc(f.name.toLowerCase())} en ${esc(c.name)} ${esc(m.when)}.</p>
  <h3>Criterio principal: ${esc(mod.label)}</h3>
  <ul>
    ${mod.tips.map((t) => `<li>${esc(t)}</li>`).join('\n    ')}
  </ul>
  <h3>Aplicado a ${esc(f.name)}</h3>
  <p>${esc(f.kind)}. En la práctica, mira ${esc(f.look)}. Tiempo orientativo: ${esc(f.time)}. Presupuesto habitual: ${esc(f.budget)}.</p>
  <p>${esc(f.tip)}</p>
  <h3>Contexto en ${esc(c.name)}</h3>
  <p>${esc(c.name)} ${esc(c.vibe)}. ${esc(c.tip)}</p>
  <p>${esc(c.zones)}</p>
  <h3>Cómo cerrar la decisión en 2 minutos</h3>
  <ol>
    <li>Confirma que ${esc(f.name.toLowerCase())} te encaja para ${esc(m.label)}.</li>
    <li>Aplica el filtro “${esc(mod.label)}” y descarta lo que no lo cumpla.</li>
    <li>Elige entre dos finales o <a href="${SITE}/#ruleta">usa la ruleta</a>.</li>
  </ol>
  <p>Más opciones: <a href="${SITE}/${ctx.city}/${ctx.moment}/${ctx.food}/">guía de ${esc(f.name)} en ${esc(c.name)}</a> · <a href="${SITE}/${ctx.city}/${ctx.moment}/">${esc(m.label)} en ${esc(c.name)}</a></p>
</section>`;
}

function blockMoment(ctx) {
  const c = cityInfo(ctx.city);
  const m = MOMENTS[ctx.moment] || { label: ctx.moment, verb: 'comer', when: 'hoy', energy: 'decidir' };
  return `
<section class="rf-q" id="rf-quality-content" data-rf-quality="moment">
  <h2>Ideas para ${esc(m.verb)} en ${esc(c.name)}</h2>
  <p>${esc(c.name)} ${esc(c.vibe)}. Para ${esc(m.label)} ${esc(m.when)}, lo útil es acotar: tiempo, hambre y presupuesto.</p>
  <p>${esc(c.tip)}</p>
  <h3>Cómo usar esta guía</h3>
  <ol>
    <li>Elige un plato de la lista según tu hambre real.</li>
    <li>Abre la ficha individual para ver criterios concretos.</li>
    <li>Si sigues dudando, <a href="${SITE}/#ruleta">gira la ruleta</a> y acepta la primera opción decente.</li>
  </ol>
  <p>${esc(c.zones)}</p>
</section>`;
}

function blockCity(ctx) {
  const c = cityInfo(ctx.city);
  return `
<section class="rf-q" id="rf-quality-content" data-rf-quality="city">
  <h2>Qué comer en ${esc(c.name)} según el momento</h2>
  <p>${esc(c.name)} ${esc(c.vibe)}. En lugar de revisar apps sin fin, elige primero el momento del día y después el tipo de plato.</p>
  <p>${esc(c.tip)}</p>
  <p>${esc(c.zones)}</p>
  <ul>
    <li><a href="${SITE}/${ctx.city}/desayuno/">Desayuno en ${esc(c.name)}</a></li>
    <li><a href="${SITE}/${ctx.city}/almuerzo/">Almuerzo en ${esc(c.name)}</a></li>
    <li><a href="${SITE}/${ctx.city}/merienda/">Merienda en ${esc(c.name)}</a></li>
    <li><a href="${SITE}/${ctx.city}/cena/">Cena en ${esc(c.name)}</a></li>
  </ul>
</section>`;
}

const CSS = `<style id="rf-quality-css">
.rf-q{max-width:800px;margin:24px auto;padding:8px 16px 28px;color:#1c1917;line-height:1.65}
.rf-q h2{font-size:1.35rem;margin:0 0 12px}
.rf-q h3{font-size:1.05rem;margin:18px 0 8px}
.rf-q p,.rf-q li{font-size:1rem;color:#292524}
.rf-q a{color:#c2410c;font-weight:700;text-decoration:none}
.rf-q ol,.rf-q ul{padding-left:1.2rem}
</style>`;

function strip(html) {
  html = html.replace(/<section class="rf-q"[\s\S]*?<\/section>/gi, '');
  html = html.replace(/<style id="rf-quality-css">[\s\S]*?<\/style>/gi, '');
  return html;
}

function inject(html, block) {
  if (!html.includes('rf-quality-css')) {
    html = html.replace(/<\/head>/i, CSS + '</head>');
  }
  if (/<section class="rf-ctr-faq"/i.test(html)) {
    return html.replace(/<section class="rf-ctr-faq"/i, block + '\n<section class="rf-ctr-faq"');
  }
  if (/<footer/i.test(html)) {
    return html.replace(/<footer/i, block + '\n<footer');
  }
  return html.replace(/<\/body>/i, block + '\n</body>');
}

function run() {
  if (!fs.existsSync(DIST)) {
    console.warn('[quality-content-rewrite] sin dist');
    return { changed: 0 };
  }
  let changed = 0;
  const counts = { guide: 0, modifier: 0, moment: 0, city: 0 };

  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name.startsWith('.')) continue;
        walk(full);
      } else if (e.name === 'index.html') {
        const ctx = parseFile(full);
        if (!ctx) continue;
        let block = '';
        if (ctx.type === 'guide') block = blockGuide(ctx);
        else if (ctx.type === 'modifier') block = blockModifier(ctx);
        else if (ctx.type === 'moment') block = blockMoment(ctx);
        else if (ctx.type === 'city') block = blockCity(ctx);
        else continue;

        let html = fs.readFileSync(full, 'utf8');
        html = strip(html);
        html = inject(html, block);
        fs.writeFileSync(full, html, 'utf8');
        changed++;
        counts[ctx.type]++;
      }
    }
  }

  walk(DIST);
  console.log(
    `[quality-content-rewrite] ${changed} páginas | guide=${counts.guide} modifier=${counts.modifier} moment=${counts.moment} city=${counts.city}`
  );
  return { changed, counts };
}

if (require.main === module) run();
module.exports = { run };
