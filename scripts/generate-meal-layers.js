/**
 * Capa semántica white-hat: Ciudad × momento del día
 * Genera páginas útiles (desayuno/almuerzo/merienda/cena) con FAQ + schema.
 * NO genera barrios masivos ni refresco de anuncios.
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const SITE = 'https://www.ruletadecomida.es';

const CITIES = [
  { slug: 'madrid', name: 'Madrid' },
  { slug: 'barcelona', name: 'Barcelona' },
  { slug: 'valencia', name: 'Valencia' },
  { slug: 'sevilla', name: 'Sevilla' },
  { slug: 'zaragoza', name: 'Zaragoza' },
  { slug: 'malaga', name: 'Málaga' },
  { slug: 'murcia', name: 'Murcia' },
  { slug: 'palma', name: 'Palma' },
  { slug: 'las-palmas', name: 'Las Palmas' },
  { slug: 'bilbao', name: 'Bilbao' },
  { slug: 'alicante', name: 'Alicante' },
  { slug: 'cordoba', name: 'Córdoba' },
  { slug: 'valladolid', name: 'Valladolid' },
  { slug: 'vigo', name: 'Vigo' },
  { slug: 'gijon', name: 'Gijón' },
  { slug: 'granada', name: 'Granada' },
  { slug: 'oviedo', name: 'Oviedo' },
  { slug: 'santander', name: 'Santander' },
  { slug: 'pamplona', name: 'Pamplona' },
  { slug: 'salamanca', name: 'Salamanca' },
  { slug: 'burgos', name: 'Burgos' },
  { slug: 'leon', name: 'León' },
  { slug: 'cadiz', name: 'Cádiz' },
  { slug: 'huelva', name: 'Huelva' },
  { slug: 'almeria', name: 'Almería' },
  { slug: 'tarragona', name: 'Tarragona' },
  { slug: 'girona', name: 'Girona' },
  { slug: 'lleida', name: 'Lleida' },
  { slug: 'logrono', name: 'Logroño' },
  { slug: 'badajoz', name: 'Badajoz' },
  { slug: 'ourense', name: 'Ourense' },
  { slug: 'marbella', name: 'Marbella' },
  { slug: 'getafe', name: 'Getafe' },
  { slug: 'mostoles', name: 'Móstoles' },
  { slug: 'legames', name: 'Leganés' },
  { slug: 'leganes', name: 'Leganés' },
  { slug: 'alcorcon', name: 'Alcorcón' },
  { slug: 'fuenlabrada', name: 'Fuenlabrada' },
  { slug: 'badalona', name: 'Badalona' },
  { slug: 'cartagena', name: 'Cartagena' },
  { slug: 'jerez', name: 'Jerez' },
  { slug: 'elche', name: 'Elche' },
  { slug: 'ceuta', name: 'Ceuta' },
  { slug: 'melilla', name: 'Melilla' }
];

// dedupe by slug
const cityMap = new Map();
for (const c of CITIES) cityMap.set(c.slug, c);
const CITIES_U = [...cityMap.values()];

const MEALS = [
  {
    slug: 'desayuno',
    name: 'desayuno',
    label: 'Desayuno',
    verb: 'desayunar',
    ideas: ['Tostadas con tomate', 'Café con bollería', 'Huevos revueltos', 'Yogur con fruta', 'Porras o churros', 'Avena con frutos secos', 'Bocadillo de jamón', 'Zumo y tostada integral'],
    time: 'por la mañana',
    budget: '1–4 €'
  },
  {
    slug: 'almuerzo',
    name: 'almuerzo',
    label: 'Almuerzo',
    verb: 'almorzar',
    ideas: ['Menú del día', 'Ensalada completa', 'Pasta rápida', 'Bocadillo contundente', 'Arroz con verduras', 'Tortilla de patata', 'Pollo a la plancha', 'Legumbres de bote'],
    time: 'al mediodía',
    budget: '3–8 €'
  },
  {
    slug: 'merienda',
    name: 'merienda',
    label: 'Merienda',
    verb: 'merendar',
    ideas: ['Pieza de fruta', 'Yogur', 'Tostada dulce', 'Café y galleta', 'Batido casero', 'Puñado de frutos secos', 'Sándwich ligero', 'Chocolate a la taza'],
    time: 'por la tarde',
    budget: '1–3 €'
  },
  {
    slug: 'cena',
    name: 'cena',
    label: 'Cena',
    verb: 'cenar',
    ideas: ['Tortilla francesa', 'Wrap de pollo', 'Ensalada', 'Sopa o crema', 'Pasta al pesto', 'Pescado a la plancha', 'Revuelto de verduras', 'Pizza casera rápida'],
    time: 'por la noche',
    budget: '2–7 €'
  }
];

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function faqFor(city, meal) {
  return [
    {
      q: `¿Qué ${meal.verb} rápido en ${city.name}?`,
      a: `En ${city.name} puedes ${meal.verb} en pocos minutos con opciones como ${meal.ideas.slice(0, 3).join(', ')}. La ruleta te da una idea concreta en 3 segundos sin listas interminables.`
    },
    {
      q: `¿Cuánto cuesta un ${meal.name} barato en ${city.name}?`,
      a: `Un ${meal.name} sencillo en ${city.name} suele estar en torno a ${meal.budget} si cocinas en casa o eliges opciones básicas. Prioriza ingredientes de despensa y evita el delivery si quieres ahorrar.`
    },
    {
      q: `¿Cómo decidir qué ${meal.verb} hoy en ${city.name} sin perder tiempo?`,
      a: `Limita opciones o usa la ruleta de comida filtrada por ${meal.label.toLowerCase()}. En ${city.name}, girar una vez suele bastar: eliges, preparas o pides, y listo.`
    }
  ];
}

function pageHtml(city, meal) {
  const faqs = faqFor(city, meal);
  const title = `¿Qué ${meal.verb} hoy en ${city.name}? Ruleta de ${meal.label.toLowerCase()} 🎯`;
  const description = `¿No sabes qué ${meal.verb} en ${city.name}? Gira la ruleta de ${meal.label.toLowerCase()} y decide en 3 segundos. Ideas realistas ${meal.time}, presupuesto ${meal.budget}.`;
  const url = `${SITE}/${city.slug}/${meal.slug}/`;
  const ideasList = meal.ideas.map((i) => `<li>${esc(i)}</li>`).join('');
  const faqHtml = faqs
    .map(
      (f) =>
        `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`
    )
    .join('\n');
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
  const webLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    isPartOf: { '@type': 'WebSite', name: 'Ruleta de Comida', url: SITE + '/' }
  };

  const otherMeals = MEALS.filter((m) => m.slug !== meal.slug)
    .map(
      (m) =>
        `<a class="rf-meal-chip" href="${SITE}/${city.slug}/${m.slug}/">${esc(m.label)} en ${esc(city.name)}</a>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<script type="application/ld+json">${JSON.stringify(webLd)}</script>
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
<style>
body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#fffbf7;color:#1a1210;line-height:1.65}
.wrap{max-width:720px;margin:0 auto;padding:24px 18px 48px}
header{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
header a{color:#c2410c;font-weight:700;text-decoration:none}
h1{font-size:clamp(1.6rem,5vw,2.2rem);line-height:1.15;letter-spacing:-.03em;margin:0 0 12px}
.lead{color:#5c4a40;margin:0 0 24px}
.ideas{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:16px;padding:18px 20px;margin:0 0 24px}
.ideas h2{margin:0 0 10px;font-size:1.1rem}
.ideas ul{margin:0;padding-left:1.2em}
.cta{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 22px;border-radius:999px;background:linear-gradient(135deg,#ff9a3c,#ff6b1a);color:#fff;font-weight:800;text-decoration:none;box-shadow:0 10px 24px rgba(255,80,0,.25)}
.cta:hover{filter:brightness(1.05)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:28px 0}
.rf-meal-chip{display:inline-flex;padding:8px 14px;border-radius:999px;border:1px solid rgba(0,0,0,.1);background:#fff;color:#3d2e28;text-decoration:none;font-size:.85rem;font-weight:650}
.rf-meal-chip:hover{border-color:#ff6b1a;color:#c2410c}
details{margin:10px 0;border:1px solid rgba(0,0,0,.08);border-radius:14px;background:#fff;padding:0}
summary{padding:14px 16px;font-weight:750;cursor:pointer}
details p{margin:0;padding:0 16px 14px;color:#5c4a40}
footer{margin-top:36px;padding-top:18px;border-top:1px solid rgba(0,0,0,.08);font-size:.9rem;color:#7a6358}
footer a{color:#c2410c;font-weight:700}
</style>
</head>
<body>
<div class="wrap">
<header>
  <a href="${SITE}/">Ruleta de Comida</a>
  <a href="${SITE}/#ruleta">Girar ruleta</a>
</header>
<main>
  <h1>¿Qué ${esc(meal.verb)} hoy en ${esc(city.name)}?</h1>
  <p class="lead">Decide tu <strong>${esc(meal.label.toLowerCase())}</strong> en ${esc(city.name)} en 3 segundos. Ideas realistas ${esc(meal.time)}, sin registro y sin listas interminables.</p>
  <p><a class="cta" href="${SITE}/#ruleta">Girar ruleta de ${esc(meal.label.toLowerCase())}</a></p>
  <section class="ideas">
    <h2>Ideas de ${esc(meal.label.toLowerCase())} en ${esc(city.name)}</h2>
    <ul>${ideasList}</ul>
    <p style="margin:12px 0 0;color:#5c4a40;font-size:.95rem">Presupuesto orientativo en casa: <strong>${esc(meal.budget)}</strong>.</p>
  </section>
  <section>
    <h2>Otros momentos del día en ${esc(city.name)}</h2>
    <div class="chips">${otherMeals}
      <a class="rf-meal-chip" href="${SITE}/${city.slug}/">Ver ${esc(city.name)}</a>
    </div>
  </section>
  <section>
    <h2>Preguntas frecuentes</h2>
    ${faqHtml}
  </section>
</main>
<footer>
  <a href="${SITE}/">Inicio</a> · <a href="${SITE}/#ruleta">Ruleta</a> · <a href="${SITE}/${city.slug}/">${esc(city.name)}</a>
</footer>
</div>
</body>
</html>`;
}

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function run() {
  if (!fs.existsSync(DIST)) {
    console.warn('[meal-layers] dist/ no existe');
    return { pages: 0 };
  }

  let pages = 0;
  const urls = [];

  for (const city of CITIES_U) {
    // solo si existe la página de ciudad (evita crear islas huérfanas)
    const cityIndex = path.join(DIST, city.slug, 'index.html');
    const cityHtml = path.join(DIST, city.slug + '.html');
    if (!fs.existsSync(cityIndex) && !fs.existsSync(cityHtml)) continue;

    for (const meal of MEALS) {
      const dir = path.join(DIST, city.slug, meal.slug);
      ensureDir(dir);
      fs.writeFileSync(path.join(dir, 'index.html'), pageHtml(city, meal), 'utf8');
      pages++;
      urls.push(`${SITE}/${city.slug}/${meal.slug}/`);
    }
  }

  // Añadir URLs al sitemap si existe
  const smPath = path.join(DIST, 'sitemap.xml');
  if (fs.existsSync(smPath) && urls.length) {
    let sm = fs.readFileSync(smPath, 'utf8');
    const today = new Date().toISOString().slice(0, 10);
    const extra = urls
      .filter((u) => !sm.includes(`<loc>${u}</loc>`))
      .map(
        (u) =>
          `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
      )
      .join('\n');
    if (extra) {
      sm = sm.replace('</urlset>', extra + '\n</urlset>');
      fs.writeFileSync(smPath, sm, 'utf8');
    }
  }

  console.log(`[meal-layers] Generadas ${pages} páginas ciudad×comida`);
  return { pages };
}

if (require.main === module) run();
module.exports = { run };
