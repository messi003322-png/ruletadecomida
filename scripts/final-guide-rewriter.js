/**
 * Reescribe CADA guía ciudad/momento/comida con contenido específico.
 * No deja plantillas genéricas "Dónde comer X".
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');

const MOMENTS = {
  desayuno: { label: 'desayuno', verb: 'desayunar', when: 'por la mañana', pace: 'empezar el día con energía' },
  almuerzo: { label: 'almuerzo', verb: 'almorzar', when: 'al mediodía', pace: 'hacer una comida completa' },
  merienda: { label: 'merienda', verb: 'merendar', when: 'por la tarde', pace: 'picar algo a media tarde' },
  cena: { label: 'cena', verb: 'cenar', when: 'por la noche', pace: 'cerrar el día sin complicaciones' }
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
}
function norm(s) {
  return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
function human(s) {
  return String(s)
    .split('-')
    .filter(Boolean)
    .map((x) => (x[0] ? x[0].toUpperCase() + x.slice(1) : x))
    .join(' ');
}
function hash(s) {
  let h = 2166136261;
  for (const c of String(s)) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
// Los desplazamientos >> convierten el hash a entero con signo. Normalizamos
// el índice para que nunca pueda acceder a arr[-1] y renderizar "undefined".
function pick(arr, n) {
  if (!arr.length) return '';
  return arr[((Number(n) % arr.length) + arr.length) % arr.length];
}

const FOOD_FOCUS = [
  { re: /pizza/, focus: 'la masa, el horno y el equilibrio de la cobertura', tip: 'Una pizza sencilla (tomate, mozzarella) sirve para juzgar la base antes de pedir combinaciones cargadas.' },
  { re: /sushi/, focus: 'el arroz, la temperatura y la proporción de cada pieza', tip: 'Empieza por nigiri o una selección corta para valorar producto y técnica.' },
  { re: /hamburg|burger/, focus: 'la carne, el pan y el punto de cocción', tip: 'El pan debe aguantar los jugos sin deshacerse; la carne debe tener sabor propio, no solo salsa.' },
  { re: /pasta|espagu|macarr|lasa|raviol|gnoc|ñoqui/, focus: 'el punto de cocción y cómo se integra la salsa', tip: 'La pasta debe tener textura; si está pasada, ni la mejor salsa lo arregla.' },
  { re: /paella|arroz/, focus: 'el punto del grano y la profundidad del fondo', tip: 'Pregunta el tiempo de elaboración: un arroz al momento no se improvisa en cinco minutos.' },
  { re: /taco|burrito|quesadilla|nacho/, focus: 'tortilla, relleno y contraste de salsas', tip: 'Maíz o trigo cambian la textura; pide la salsa aparte si no conoces el picante de la casa.' },
  { re: /pollo/, focus: 'el método de cocción y la jugosidad', tip: 'Brasa, plancha, horno o guiso dan resultados muy distintos: elige la técnica, no solo el tamaño.' },
  { re: /ensalada/, focus: 'frescura, texturas y si incluye proteína', tip: 'Si es plato principal, comprueba que lleve huevo, legumbres, pollo o pescado.' },
  { re: /bocadillo|sandwich|tostada/, focus: 'el pan, el relleno y el contraste', tip: 'Pan fresco y relleno bien repartido importan más que el tamaño de la pieza.' },
  { re: /kebab|doner|shawarma|falafel/, focus: 'proteína, pan, vegetales y salsas', tip: 'Menos salsa de la que te ofrecen suele dejar apreciar mejor el relleno.' },
  { re: /tortilla|huevo/, focus: 'el punto de cocción y la sencillez de ingredientes', tip: 'Pregunta si la tortilla es jugosa o cuajada; ese detalle cambia el plato.' },
  { re: /ramen|sopa|caldo/, focus: 'la base del caldo y las texturas', tip: 'Temperatura e intensidad del caldo definen más el plato que los toppings.' },
  { re: /crepe|waffle|helado|postre|tarta|chocolate/, focus: 'textura y equilibrio de dulzor', tip: 'Un buen postre no tiene por qué ser empalagoso: busca contraste (fruta, cacao, café).' },
  { re: /kebab|pizza|burger|sushi/, focus: 'preparación y servicio', tip: 'Compara dos opciones cercanas antes de desplazarte lejos por una diferencia mínima.' }
];

function focusFor(food) {
  const n = norm(food);
  for (const f of FOOD_FOCUS) {
    if (f.re.test(n)) return f;
  }
  return {
    focus: 'ingredientes, preparación, cantidad y relación calidad-precio',
    tip: 'Una descripción clara en la carta suele decir más que una lista interminable de nombres.'
  };
}

function buildGuide(foodSlug, citySlug, momentKey) {
  const food = human(foodSlug);
  const city = human(citySlug);
  const mo = MOMENTS[momentKey];
  const seed = hash(`${citySlug}|${momentKey}|${foodSlug}`);
  const ff = focusFor(foodSlug);

  const openers = [
    `Si quieres ${mo.verb} ${food} en ${city} ${mo.when}, lo útil no es una lista interminable: es saber qué detalle del plato te importa hoy.`,
    `Para ${mo.verb} ${food} en ${city}, empieza por el resultado que buscas y después compara locales o preparaciones.`,
    `${food} ${mo.when} en ${city} puede ser una elección rápida o una comida más cuidada: el criterio cambia según tu plan.`,
    `Elegir ${food} para ${mo.label} en ${city} se simplifica cuando miras ${ff.focus}.`
  ];

  const body1 = [
    `En este caso, fíjate sobre todo en ${ff.focus}. ${ff.tip}`,
    `El punto clave de ${food} suele ser ${ff.focus}. ${ff.tip}`,
    `Más que la popularidad del local, observa ${ff.focus}. ${ff.tip}`
  ];

  const body2 = [
    `En ${city}, la distancia y el horario ${mo.when} pueden pesar tanto como el plato. Si tienes poco margen, prioriza cercanía y un servicio ágil.`,
    `Para ${mo.label} en ${city}, comprueba si el establecimiento abre en ese tramo y si hay opción para llevar si no quieres quedarte.`,
    `Las reseñas recientes de ${city} ayudan más que una nota media antigua: busca comentarios sobre sabor, cantidad y tiempos de ${food}.`,
    `Si comparas dos sitios de ${city}, ordena así: preparación de ${food}, precio final y luego opiniones recientes.`
  ];

  const body3 = [
    `Piensa también en el hambre real: ${food} puede ser un plato único o algo más ligero según lo que hayas comido antes.`,
    `Si es la primera vez que pides ${food} en ${city}, una versión sencilla permite comparar mejor el producto.`,
    `Si ya conoces ${food}, busca el detalle que diferencie a este sitio: una salsa propia, un punto de cocción o un acompañamiento distinto.`,
    `Para ${mo.pace}, evita pedir por inercia. Dos alternativas claras bastan para decidir sin perder media hora.`
  ];

  const closing = [
    `Resumen para ${city}: elige ${food} mirando ${ff.focus}, el tiempo que tienes ${mo.when} y el precio con extras incluidos.`,
    `Antes de confirmar en ${city}, revisa carta, horario y una pareja de reseñas recientes centradas en ${food}.`,
    `La mejor opción de ${food} para ${mo.label} en ${city} es la que combina preparación cuidada, cantidad razonable y que realmente te apetezca hoy.`
  ];

  const h2 = `Cómo elegir ${food} para ${mo.verb} en ${city}`;
  const kicker = `${city} · ${mo.label} · ${food}`;

  return `<section class="rf-specific-guide" data-city="${esc(citySlug)}" data-moment="${esc(momentKey)}" data-food="${esc(foodSlug)}">
  <div class="rf-specific-kicker">${esc(kicker)}</div>
  <h2>${esc(h2)}</h2>
  <p>${esc(pick(openers, seed))}</p>
  <h3>Qué mirar en ${esc(food)}</h3>
  <p>${esc(pick(body1, seed >> 3))}</p>
  <h3>${esc(city)} y el momento del día</h3>
  <p>${esc(pick(body2, seed >> 7))}</p>
  <h3>Cómo decidir sin dar vueltas</h3>
  <p>${esc(pick(body3, seed >> 11))}</p>
  <h3>Antes de pedir</h3>
  <p>${esc(pick(closing, seed >> 15))}</p>
</section>`;
}

const GUIDE_CSS = `<style id="rf-specific-guide-css">
.rf-specific-guide{max-width:720px;margin:20px auto 28px;padding:20px 18px;border:1px solid #e7e5e4;border-radius:18px;background:#fff}
.rf-specific-kicker{font-size:.78rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#c2410c;margin:0 0 8px}
.rf-specific-guide h2{margin:0 0 12px;font-size:1.25rem;line-height:1.25;color:#1c1917}
.rf-specific-guide h3{margin:18px 0 6px;font-size:1.02rem;color:#292524}
.rf-specific-guide p{margin:0 0 8px;color:#44403c;line-height:1.65}
</style>`;

function stripOldGuides(html) {
  html = html.replace(/<section class="rf-food-guide"[\s\S]*?<\/section>/gi, '');
  html = html.replace(/<section class="food-guide[^"]*"[\s\S]*?<\/section>/gi, '');
  html = html.replace(/<section class="rf-specific-guide"[\s\S]*?<\/section>/gi, '');
  html = html.replace(/<section class="final-guide"[\s\S]*?<\/section>/gi, '');
  return html;
}

function inject(html, section) {
  if (/<h1[^>]*>[\s\S]*?<\/h1>/i.test(html)) {
    return html.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/i, `$1\n${section}`);
  }
  if (/<main[^>]*>/i.test(html)) {
    return html.replace(/<main([^>]*)>/i, `<main$1>\n${section}`);
  }
  return html.replace(/<\/body>/i, section + '</body>');
}

function run() {
  if (!fs.existsSync(DIST)) throw new Error('dist no existe');
  let changed = 0;

  for (const rel of fs.readdirSync(DIST, { recursive: true })) {
    if (!String(rel).endsWith('.html')) continue;
    const parts = String(rel).split(path.sep);
    if (parts.length !== 4 || parts[3] !== 'index.html') continue;
    const [city, moment, food] = parts;
    if (!MOMENTS[moment]) continue;

    const file = path.join(DIST, rel);
    let html = fs.readFileSync(file, 'utf8');
    html = stripOldGuides(html);

    const section = buildGuide(food, city, moment);
    html = inject(html, section);

    if (!html.includes('rf-specific-guide-css')) {
      html = html.replace(/<\/head>/i, GUIDE_CSS + '</head>');
    }

    const title = `${human(food)} para ${MOMENTS[moment].verb} en ${human(city)} | Ruleta de Comida`;
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);

    fs.writeFileSync(file, html, 'utf8');
    changed++;
  }

  console.log(`[final-guide-rewriter] ${changed} guías reescritas con contenido específico (comida + ciudad + momento).`);
}

if (require.main === module) run();
module.exports = { run };